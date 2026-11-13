// 결정론적 자동 전투 시뮬레이터 (기획서 3장, D11~D16).
// 고정 틱마다 행동 게이지가 속도만큼 차고, 가득 차면 스킬 우선순위에 따라 행동한다.
// 우선순위: 필살기(에너지 100 + 조건) > 조건/쿨다운 충족 액티브 > 기본 공격.
import { BALANCE } from '../data/balance';
import { adjacentSlots, elementMultiplier, laneOf, roleMatchesRow, rowName, rowOf, supports } from './board';
import { conditionMultiplier } from './condition';
import { createRng, type Rng } from './rng';
import type { SkillDef, SkillEffect, UnitDef } from './types';

export type Side = 'ally' | 'enemy';

export interface BattleUnitInput {
  uid: string;
  def: UnitDef;
  side: Side;
  slot: number;
  level: number;
  rank?: number;
  /** 진화 단계 (아군만) */
  stage?: number;
  condition?: number;
  injured?: boolean;
  isBoss?: boolean;
  /** 반사실 분석용 배율 */
  mods?: { atk?: number; def?: number; hp?: number };
}

export interface BattleSetup {
  allies: BattleUnitInput[];
  enemies: BattleUnitInput[];
  seed: number;
  encounterId?: string;
}

export interface TargetResult {
  uid: string;
  kind: 'dmg' | 'heal' | 'shield' | 'buff' | 'taunt' | 'debuff';
  amount: number;
  hp: number;
  shield: number;
  ko: boolean;
  elementMul?: number;
  /** 방어(물리/마법)에 많이 막힘 */
  resisted?: boolean;
}

export interface BattleEvent {
  t: number;
  actor: string;
  skillId: string;
  skillName: string;
  skillKind: SkillDef['kind'];
  targets: TargetResult[];
}

export interface UnitSnapshot {
  uid: string;
  defId: string;
  name: string;
  side: Side;
  slot: number;
  element: UnitDef['element'];
  role: UnitDef['role'];
  level: number;
  stage: number;
  isBoss: boolean;
  maxHp: number;
  atk: number;
  def: number;
  res: number;
  dmg: 'phys' | 'magic';
  spd: number;
}

export interface UnitReport {
  uid: string;
  dealt: number;
  taken: number;
  healed: number;
  koTime: number | null;
  minHpRatio: number;
  endHp: number;
  maxHp: number;
}

export interface BattleResult {
  seed: number;
  outcome: 'win' | 'lose' | 'timeout';
  duration: number;
  units: UnitSnapshot[];
  events: BattleEvent[];
  reports: Record<string, UnitReport>;
  enemyHpRatio: number; // 남은 적 HP 비율 (0=전멸)
  bossHpRatio: number | null;
}

interface Timed {
  ratio: number;
  t: number;
}

interface RUnit {
  snap: UnitSnapshot;
  def: UnitDef;
  range: UnitDef['range'];
  hp: number;
  baseAtk: number;
  baseDef: number;
  baseRes: number;
  gauge: number;
  energy: number;
  cds: Record<string, number>;
  shield: number;
  shieldT: number;
  tauntT: number;
  atkBuffs: Timed[];
  defDebuffs: Timed[];
  report: UnitReport;
}

const B = BALANCE.battle;

export function computeStats(input: BattleUnitInput, team: BattleUnitInput[]) {
  const g = BALANCE.growth;
  const lvMul = 1 + (input.side === 'ally' ? g.statPerLevel : BALANCE.enemy.statPerLevel) * (input.level - 1);
  const rankMul = (1 + g.statPerRank * (input.rank ?? 0)) * (input.side === 'ally' ? BALANCE.evolution.statMul[(input.stage ?? 1) - 1] : 1);
  const condMul = input.side === 'ally' ? conditionMultiplier(input.condition ?? 100) : 1;
  const injuryMul = input.injured ? 1 - BALANCE.condition.injuryAtkPenalty : 1;
  const row = rowName(input.slot);
  const match = roleMatchesRow(input.def.role, input.def.range, row);
  const synergy = team.some(
    (o) => o.uid !== input.uid && adjacentSlots(input.slot).includes(o.slot) && supports(o.def.element, input.def.element),
  );
  let atk = input.def.base.atk * lvMul * rankMul * condMul * injuryMul;
  let def = input.def.base.def * lvMul * rankMul * condMul;
  let res = (input.def.base.res ?? input.def.base.def) * lvMul * rankMul * condMul;
  const hp = input.def.base.hp * lvMul * rankMul;
  if (match) {
    if (input.def.role === 'tank') {
      def *= 1 + BALANCE.rows.roleMatchBonus;
      res *= 1 + BALANCE.rows.roleMatchBonus;
    }
    else atk *= 1 + BALANCE.rows.roleMatchBonus;
  }
  if (synergy) atk *= 1 + BALANCE.element.synergyAtk;
  const m = input.mods ?? {};
  return {
    hp: Math.round(hp * (m.hp ?? 1)),
    atk: atk * (m.atk ?? 1),
    def: def * (m.def ?? 1),
    res: res * (m.def ?? 1),
    spd: input.def.base.spd,
    match,
    synergy,
  };
}

/**
 * 실시간 전투 (D69): 한 틱씩 진행할 수 있는 전투 상태.
 * - autoUlt=false면 아군 필살기는 자동으로 쓰지 않고, 플레이어가 castUlt로 직접 터뜨린다 (에너지 100).
 * - 적은 항상 자동. simulateBattle은 autoUlt=true로 끝까지 돌린 것과 같다.
 */
export interface LiveBattle {
  setup: BattleSetup;
  rng: Rng;
  units: RUnit[];
  t: number;
  events: BattleEvent[];
  outcome: BattleResult['outcome'] | null;
  autoUlt: boolean;
}

export function createLive(setup: BattleSetup, autoUlt = true): LiveBattle {
  const rng = createRng(setup.seed);
  const units: RUnit[] = [];
  const build = (input: BattleUnitInput, team: BattleUnitInput[]) => {
    const s = computeStats(input, team);
    const snap: UnitSnapshot = {
      uid: input.uid,
      defId: input.def.id,
      name: input.def.name,
      side: input.side,
      slot: input.slot,
      element: input.def.element,
      role: input.def.role,
      level: input.level,
      stage: input.stage ?? 1,
      isBoss: !!input.isBoss,
      maxHp: s.hp,
      atk: Math.round(s.atk),
      def: Math.round(s.def),
      res: Math.round(s.res),
      dmg: input.def.dmg ?? 'phys',
      spd: s.spd,
    };
    units.push({
      snap,
      def: input.def,
      range: input.def.range,
      hp: s.hp,
      baseAtk: s.atk,
      baseDef: s.def,
      baseRes: s.res,
      gauge: rng() * 30,
      energy: input.side === 'ally' ? BALANCE.battle.allyStartEnergy : 0,
      cds: Object.fromEntries(input.def.skills.map((k) => [k.id, k.kind === 'active' ? k.cooldown * 0.5 : 0])),
      shield: 0,
      shieldT: 0,
      tauntT: 0,
      atkBuffs: [],
      defDebuffs: [],
      report: { uid: input.uid, dealt: 0, taken: 0, healed: 0, koTime: null, minHpRatio: 1, endHp: s.hp, maxHp: s.hp },
    });
  };
  for (const a of setup.allies) build(a, setup.allies);
  for (const e of setup.enemies) build(e, setup.enemies);

  return { setup, rng, units, t: 0, events: [], outcome: null, autoUlt };
}

function liveAlive(b: LiveBattle, side: Side) {
  return b.units.filter((u) => u.snap.side === side && u.hp > 0);
}

function checkEnd(b: LiveBattle) {
  if (liveAlive(b, 'enemy').length === 0) b.outcome = 'win';
  else if (liveAlive(b, 'ally').length === 0) b.outcome = 'lose';
}

/** 한 틱 진행 (B.tick초). 끝나면 outcome이 정해진다. */
export function stepLive(b: LiveBattle): BattleEvent[] {
  const out: BattleEvent[] = [];
  if (b.outcome) return out;
  if (b.t >= B.maxTime - 1e-9) {
    b.outcome = 'timeout';
    return out;
  }
  b.t = Math.round((b.t + B.tick) * 1000) / 1000;
  for (const u of b.units) {
    if (u.hp <= 0) continue;
    tickTimers(u);
    u.gauge += u.snap.spd * B.tick;
    if (u.gauge < B.gaugeMax) continue;
    u.gauge -= B.gaugeMax;
    const manual = u.snap.side === 'ally' && !b.autoUlt;
    const ev = act(u, b.units, b.rng, b.t, manual);
    if (ev) (b.events.push(ev), out.push(ev));
    checkEnd(b);
    if (b.outcome) break;
  }
  if (!b.outcome && b.t >= B.maxTime - 1e-9) b.outcome = 'timeout';
  return out;
}

/** 필살기 준비됨 (에너지 100) */
export function ultReady(b: LiveBattle, uid: string): boolean {
  const u = b.units.find((x) => x.snap.uid === uid);
  return !!u && u.hp > 0 && u.energy >= 100 && !b.outcome && !!u.def.skills.find((s) => s.kind === 'ultimate');
}

export function unitEnergy(b: LiveBattle, uid: string): number {
  return b.units.find((x) => x.snap.uid === uid)?.energy ?? 0;
}

export function unitHp(b: LiveBattle, uid: string): { hp: number; max: number; shield: number } {
  const u = b.units.find((x) => x.snap.uid === uid)!;
  return { hp: Math.max(0, u.hp), max: u.snap.maxHp, shield: u.shield };
}

/** 플레이어가 필살기를 터뜨린다: 게이지와 상관없이 바로 시전 */
export function castUlt(b: LiveBattle, uid: string): BattleEvent | null {
  if (!ultReady(b, uid)) return null;
  const u = b.units.find((x) => x.snap.uid === uid)!;
  const ult = u.def.skills.find((s) => s.kind === 'ultimate')!;
  const ev = perform(u, ult, b.units, b.rng, b.t);
  if (ev) b.events.push(ev);
  checkEnd(b);
  return ev;
}

/** 지금 써 볼 만한 필살기인가 (AUTO·튜토리얼 안내용): 원래 자동 조건과 같다 */
export function ultSensible(b: LiveBattle, uid: string): boolean {
  const u = b.units.find((x) => x.snap.uid === uid);
  if (!u || !ultReady(b, uid)) return false;
  const ult = u.def.skills.find((s) => s.kind === 'ultimate')!;
  return conditionOk(ult, u, b.units);
}

export function finishLive(b: LiveBattle): BattleResult {
  const units = b.units;
  const t = b.t;
  const events = b.events;
  const outcome = b.outcome ?? 'timeout';
  const enemies = units.filter((u) => u.snap.side === 'enemy');
  const enemyHpRatio = sum(enemies.map((u) => Math.max(0, u.hp))) / sum(enemies.map((u) => u.snap.maxHp));
  const boss = enemies.find((u) => u.snap.isBoss);
  const reports: Record<string, UnitReport> = {};
  for (const u of units) {
    u.report.endHp = Math.max(0, u.hp);
    reports[u.snap.uid] = u.report;
  }
  return {
    seed: b.setup.seed,
    outcome,
    duration: t,
    units: units.map((u) => u.snap),
    events,
    reports,
    enemyHpRatio,
    bossHpRatio: boss ? Math.max(0, boss.hp) / boss.snap.maxHp : null,
  };
}


export function simulateBattle(setup: BattleSetup): BattleResult {
  const b = createLive(setup, true);
  while (!b.outcome) stepLive(b);
  return finishLive(b);
}

function tickTimers(u: RUnit) {
  for (const k in u.cds) u.cds[k] = Math.max(0, u.cds[k] - B.tick);
  if (u.shieldT > 0) {
    u.shieldT -= B.tick;
    if (u.shieldT <= 0) u.shield = 0;
  }
  if (u.tauntT > 0) u.tauntT -= B.tick;
  u.atkBuffs = u.atkBuffs.filter((b) => (b.t -= B.tick) > 0);
  u.defDebuffs = u.defDebuffs.filter((b) => (b.t -= B.tick) > 0);
}

function conditionOk(skill: SkillDef, u: RUnit, units: RUnit[]): boolean {
  const c = skill.condition;
  const allies = units.filter((o) => o.snap.side === u.snap.side && o.hp > 0);
  const foes = units.filter((o) => o.snap.side !== u.snap.side && o.hp > 0);
  switch (c.type) {
    case 'none':
      return true;
    case 'allyHpBelow':
      return allies.some((o) => o.hp / o.snap.maxHp < c.ratio);
    case 'enemiesAtLeast':
      return foes.length >= c.count;
    case 'selfHpBelow':
      return u.hp / u.snap.maxHp < c.ratio;
  }
}

function chooseSkill(u: RUnit, units: RUnit[], manualUlt = false): SkillDef {
  const skills = u.def.skills;
  const ult = skills.find((s) => s.kind === 'ultimate');
  if (!manualUlt && ult && u.energy >= 100 && conditionOk(ult, u, units)) return ult;
  for (const s of skills) {
    if (s.kind === 'active' && u.cds[s.id] <= 0 && conditionOk(s, u, units)) return s;
  }
  return skills.find((s) => s.kind === 'basic')!;
}

function resolveTargets(skill: SkillDef, u: RUnit, units: RUnit[]): RUnit[] {
  const allies = units.filter((o) => o.snap.side === u.snap.side && o.hp > 0);
  let foes = units.filter((o) => o.snap.side !== u.snap.side && o.hp > 0);
  if (foes.length === 0 && skill.target.startsWith('enemy')) return [];
  switch (skill.target) {
    case 'self':
      return [u];
    case 'allyAll':
      return allies;
    case 'allyLowestHp':
      return [minBy(allies, (o) => o.hp / o.snap.maxHp)];
    case 'enemyAll':
      return foes;
  }
  // 단일 대상 적 스킬: 도발 우선
  const taunting = foes.filter((f) => f.tauntT > 0);
  if (taunting.length) return [minBy(taunting, (f) => f.snap.slot)];
  // 기본 공격(근접·원거리 모두)과 근접 스킬은 가장 앞 열만 노린다. 후열은 전열이 살아 있는 동안 안전 (D12).
  if (u.range === 'melee' || skill.target === 'enemyDefault') {
    const frontRow = Math.min(...foes.map((f) => rowOf(f.snap.slot)));
    foes = foes.filter((f) => rowOf(f.snap.slot) === frontRow);
  }
  switch (skill.target) {
    case 'enemyLowestHp':
      return [minBy(foes, (f) => f.hp / f.snap.maxHp)];
    case 'enemyHighestAtk':
      return [minBy(foes, (f) => -f.baseAtk)];
    default: {
      const myLane = laneOf(u.snap.slot);
      return [minBy(foes, (f) => Math.abs(laneOf(f.snap.slot) - myLane) * 10 + f.snap.slot)];
    }
  }
}

function act(u: RUnit, units: RUnit[], rng: Rng, t: number, manualUlt = false): BattleEvent | null {
  return perform(u, chooseSkill(u, units, manualUlt), units, rng, t);
}

function perform(u: RUnit, skill: SkillDef, units: RUnit[], rng: Rng, t: number): BattleEvent | null {
  const targets = resolveTargets(skill, u, units);
  if (targets.length === 0) return null;
  if (skill.kind === 'ultimate') u.energy = 0;
  else if (skill.kind === 'active') {
    u.cds[skill.id] = skill.cooldown;
    u.energy = Math.min(100, u.energy + B.energyOnActive);
  } else u.energy = Math.min(100, u.energy + B.energyOnBasic);

  const results: TargetResult[] = [];
  for (const eff of skill.effects) {
    for (const tg of targets) {
      if (tg.hp <= 0) continue;
      results.push(applyEffect(eff, u, tg, rng, t));
    }
  }
  return { t, actor: u.snap.uid, skillId: skill.id, skillName: skill.name, skillKind: skill.kind, targets: results };
}

function supportMul(u: RUnit) {
  return rowName(u.snap.slot) === 'mid' ? 1 + BALANCE.rows.midSupportBonus : 1;
}

function applyEffect(eff: SkillEffect, u: RUnit, tg: RUnit, rng: Rng, t: number): TargetResult {
  const atk = u.baseAtk * (1 + sum(u.atkBuffs.map((b) => b.ratio)));
  const base = { uid: tg.snap.uid };
  switch (eff.type) {
    case 'damage': {
      // 물리 공격은 방어, 마법 공격은 마법 방어로 막는다
      const guard = u.snap.dmg === 'magic' ? tg.baseRes : tg.baseDef;
      const def = guard * Math.max(0, 1 - sum(tg.defDebuffs.map((b) => b.ratio)));
      const elem = elementMultiplier(u.snap.element, tg.snap.element);
      const guardMul = B.defK / (B.defK + def);
      let dmg = atk * eff.coef * guardMul * elem;
      dmg *= 1 + (rng() * 2 - 1) * B.variance;
      if (rowName(tg.snap.slot) === 'front') dmg *= BALANCE.rows.frontDamageTaken;
      if (u.range === 'ranged' && rowName(u.snap.slot) === 'back') dmg *= 1 + BALANCE.rows.backRangedBonus;
      let amount = Math.max(1, Math.round(dmg));
      const absorbed = Math.min(tg.shield, amount);
      tg.shield -= absorbed;
      const hpLoss = Math.min(tg.hp, amount - absorbed);
      tg.hp -= hpLoss;
      u.report.dealt += hpLoss;
      tg.report.taken += hpLoss;
      tg.energy = Math.min(100, tg.energy + B.energyOnHit);
      tg.report.minHpRatio = Math.min(tg.report.minHpRatio, tg.hp / tg.snap.maxHp);
      const ko = tg.hp <= 0;
      if (ko) tg.report.koTime = t;
      return { ...base, kind: 'dmg', amount, hp: tg.hp, shield: tg.shield, ko, elementMul: elem, resisted: guardMul < 0.6 };
    }
    case 'heal': {
      let amt = atk * eff.coef * supportMul(u);
      if (rowName(u.snap.slot) === 'back') amt *= 1 + BALANCE.rows.backRangedBonus;
      const healed = Math.min(tg.snap.maxHp - tg.hp, Math.round(amt));
      tg.hp += healed;
      u.report.healed += healed;
      return { ...base, kind: 'heal', amount: healed, hp: tg.hp, shield: tg.shield, ko: false };
    }
    case 'shield': {
      const amt = Math.round(u.snap.maxHp * eff.maxHpRatio * supportMul(u));
      tg.shield = Math.max(tg.shield, amt);
      tg.shieldT = Math.max(tg.shieldT, eff.duration);
      return { ...base, kind: 'shield', amount: amt, hp: tg.hp, shield: tg.shield, ko: false };
    }
    case 'taunt':
      tg.tauntT = eff.duration;
      return { ...base, kind: 'taunt', amount: 0, hp: tg.hp, shield: tg.shield, ko: false };
    case 'buffAtk':
      tg.atkBuffs.push({ ratio: eff.ratio * supportMul(u), t: eff.duration });
      return { ...base, kind: 'buff', amount: eff.ratio, hp: tg.hp, shield: tg.shield, ko: false };
    case 'debuffDef':
      tg.defDebuffs.push({ ratio: eff.ratio, t: eff.duration });
      return { ...base, kind: 'debuff', amount: eff.ratio, hp: tg.hp, shield: tg.shield, ko: false };
  }
}

function sum(a: number[]) {
  return a.reduce((x, y) => x + y, 0);
}
function minBy<T>(arr: T[], f: (x: T) => number): T {
  let best = arr[0];
  let bv = f(best);
  for (const x of arr) {
    const v = f(x);
    if (v < bv) {
      best = x;
      bv = v;
    }
  }
  return best;
}
