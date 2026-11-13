// HEXA FRONTIER RPG 게임 규칙 (D72~D81).
// - 한 번 움직이거나 기술을 쓰면 한 턴. 그 뒤 스피릿 → 몬스터 순서로 움직인다.
// - 아무것도 안 하면 시간이 멈춘다. 단, 몬스터가 붙어 있으면 화면이 autoAct를 불러 저절로 싸운다.
// - 스피릿은 칸을 차지하고 함께 싸우며, 쓰러지면 야영지에서 되살아난다.
import { createRng, hashSeed } from '../core/rng';
import { fixJosa } from '../core/text';
import {
  BAL,
  beatenBy,
  beats,
  EL_ICON,
  EL_NAME,
  ELEMENTS,
  HEROES,
  MONSTERS,
  SKILLS,
  SPIRIT_BONUS_PER_LV,
  SPIRIT_GUARD_PER_LV,
  SPIRITS,
  TREES,
  typeMul,
  type Element,
  type Item,
  type Rarity,
  type SkillDef,
  type Slot,
} from './data';
import { activate, active, cellAt, dist, isFloor, key, neighbors, STAGES, stageSpawns, step, type Dir } from './world';

export const RPG_VERSION = 3;

export interface Mon {
  id: number;
  def: string;
  level: number;
  c: number;
  r: number;
  hp: number;
  home: { c: number; r: number };
  pack: number;
  boss?: boolean;
  elite?: boolean;
  /** 머뭇거려서 몰려온 몬스터 */
  extra?: boolean;
  dead: boolean;
  deadAt: number;
  aggro: boolean;
  stun: number;
  slow: number;
  poison: number;
  burn: number;
  root: number;
}

/** 칸을 차지하고 함께 싸우는 스피릿 */
export interface Pet {
  element: Element;
  c: number;
  r: number;
  hp: number;
  dead: boolean;
  cd: number; // Lv10 광역기 쿨타임
  heal: number; // 물 Lv3 치유 쿨타임
}

export interface HeroState {
  unlocked: boolean;
  level: number;
  xp: number;
  hp: number;
  gear: Partial<Record<Slot, Item>>;
  skillPts: number;
  nodes: string[];
}

export interface RpgState {
  version: number;
  turn: number;
  heroId: string;
  heroes: Record<string, HeroState>;
  pos: { c: number; r: number };
  camp: { c: number; r: number };
  monsters: Mon[];
  pets: Pet[];
  bossesDown: string[];
  spirits: Partial<Record<Element, number>>;
  spiritXp: number;
  spiritPoints: number;
  spiritEarned: number;
  bag: Item[];
  gold: number;
  cds: Record<string, number>;
  opened: string[];
  seen: string[];
  itemCounter: number;
  kills: number;
  deaths: number;
  /** 튜토리얼 진행 (단계 번호) */
  tut: number;
  // ── 스테이지 (D82) ──
  stage: number; // 지금(또는 마지막) 스테이지
  inStage: boolean;
  cleared: number[];
  stageClear: boolean;
  bossDown: boolean;
  campReady: Record<string, number>; // 야영지 → 다시 쉴 수 있는 턴
  bestRow: number; // 가장 멀리 간 줄
  stall: number; // 앞으로 못 간 턴 수
  potions: { small: number; big: number };
  stat: { skills: number; camps: number; equips: number; autoHits: number };
  tips: string[];
  log: string[];
}

export type Fx =
  | { k: 'dmg'; c: number; r: number; amount: number; eff: 'strong' | 'weak' | null; blocked: boolean; crit: boolean; onHero?: boolean; onPet?: boolean }
  | { k: 'heal'; c: number; r: number; amount: number }
  | { k: 'kill'; c: number; r: number; name: string }
  | { k: 'skill'; c: number; r: number; skill: string; cells: { c: number; r: number }[]; element?: Element | null }
  | { k: 'levelup'; hero: string; level: number }
  | { k: 'drop'; item: Item }
  | { k: 'spirit'; element: Element }
  | { k: 'petDown'; element: Element }
  | { k: 'point' }
  | { k: 'camp' }
  | { k: 'death' }
  | { k: 'boss'; name: string }
  | { k: 'unlock'; hero: string }
  | { k: 'clear'; stage: number; gold: number; item?: Item; first: boolean }
  | { k: 'swarm' }
  | { k: 'msg'; text: string };

const freshMonFields = { aggro: false, stun: 0, slow: 0, poison: 0, burn: 0, root: 0 };

export function newRpg(): RpgState {
  const s: RpgState = {
    version: RPG_VERSION,
    turn: 0,
    heroId: 'knight',
    heroes: { knight: { unlocked: true, level: 1, xp: 0, hp: 0, gear: {}, skillPts: 0, nodes: [] } },
    pos: { c: 4, r: 0 },
    camp: { c: 4, r: 0 },
    monsters: [],
    pets: [],
    bossesDown: [],
    spirits: {},
    spiritXp: 0,
    spiritPoints: 0,
    spiritEarned: 0,
    bag: [],
    gold: 60,
    cds: {},
    opened: [],
    seen: [],
    itemCounter: 0,
    kills: 0,
    deaths: 0,
    tut: 0,
    stage: 1,
    inStage: false,
    cleared: [],
    stageClear: false,
    bossDown: false,
    campReady: {},
    bestRow: 0,
    stall: 0,
    potions: { small: 3, big: 0 },
    stat: { skills: 0, camps: 0, equips: 0, autoHits: 0 },
    tips: [],
    log: [],
  };
  s.heroes.knight.hp = heroStats(s).hp;
  return s;
}

/** 열린 스테이지: 깬 판 + 그다음 판 */
export const unlockedStage = (s: RpgState) => Math.min(STAGES.length, Math.max(0, ...s.cleared) + 1);

/** 스테이지 시작 (다시 하기도 같음) */
export function startStage(s: RpgState, n: number): string | null {
  if (n > unlockedStage(s)) return '앞 스테이지를 먼저 깨야 해요';
  const w = activate(n);
  s.stage = n;
  s.inStage = true;
  s.stageClear = false;
  s.bossDown = false;
  s.turn = 0;
  s.pos = { ...w.start };
  s.camp = { ...w.start };
  s.monsters = stageSpawns(w).map((p, i) => ({ id: i, def: p.id, level: p.level, c: p.c, r: p.r, hp: 0, home: { c: p.c, r: p.r }, pack: p.pack, boss: p.boss, elite: p.elite, dead: false, deadAt: 0, ...freshMonFields }));
  for (const m of s.monsters) m.hp = monStats(m).hp;
  s.opened = [];
  s.seen = [];
  s.cds = {};
  s.campReady = {};
  s.bestRow = 0;
  s.stall = 0;
  s.heroes[s.heroId].hp = heroStats(s).hp;
  s.pets = s.pets.map((p) => ({ ...p, dead: false, cd: 0, heal: 0 }));
  revivePets(s);
  reveal(s);
  return null;
}

export function leaveStage(s: RpgState) {
  s.inStage = false;
  s.stageClear = false;
}

/** 지금 스테이지를 다시 켤 때 (저장 불러오기) */
export function resume(s: RpgState) {
  activate(s.stage);
}

// ───────── 테크트리 효과 ─────────

export function treeMods(s: RpgState, id = s.heroId) {
  const m = { allDmg: 0, lifesteal: 0, crit: 0, petAtk: 0, stunPlus: 0, poisonMul: 1, typeBonus: 0, stat: { hp: 0, atk: 0, def: 0, res: 0 }, skill: {} as Record<string, { dmg: number; cd: number; range: number }> };
  const sk = (k: string) => (m.skill[k] ??= { dmg: 0, cd: 0, range: 0 });
  for (const nid of s.heroes[id].nodes) {
    const node = TREES[id].find((n) => n.id === nid);
    for (const e of node?.effects ?? []) {
      if (e.kind === 'skillDmg') sk(e.skill).dmg += e.pct;
      if (e.kind === 'skillCd') sk(e.skill).cd += e.delta;
      if (e.kind === 'skillRange') sk(e.skill).range += e.delta;
      if (e.kind === 'stat') m.stat[e.stat] += e.pct;
      if (e.kind === 'allDmg') m.allDmg += e.pct;
      if (e.kind === 'lifesteal') m.lifesteal += e.pct;
      if (e.kind === 'crit') m.crit += e.pct;
      if (e.kind === 'petAtk') m.petAtk += e.pct;
      if (e.kind === 'stunPlus') m.stunPlus += e.turns;
      if (e.kind === 'poisonMul') m.poisonMul *= e.mul;
      if (e.kind === 'typeBonus') m.typeBonus += e.pct;
    }
  }
  return m;
}

/** 기술의 실제 사거리·쿨타임 (테크트리 반영) */
export function skillOf(s: RpgState, id: string): SkillDef {
  const base = SKILLS[id];
  const t = treeMods(s).skill[id];
  return t ? { ...base, range: base.range + t.range, cd: Math.max(0, base.cd + t.cd) } : base;
}

export function learnNode(s: RpgState, nodeId: string): string | null {
  const h = s.heroes[s.heroId];
  const node = TREES[s.heroId].find((n) => n.id === nodeId);
  if (!node) return '없는 기술';
  if (h.nodes.includes(nodeId)) return '이미 배웠어요';
  if (h.level < node.level) return `Lv${node.level}부터 배울 수 있어요`;
  if (node.pre && !h.nodes.includes(node.pre)) return fixJosa(`먼저 [${TREES[s.heroId].find((n) => n.id === node.pre)!.name}]을(를) 배워야 해요`);
  if (h.skillPts <= 0) return '기술 포인트가 없어요 (레벨업하면 1개)';
  h.skillPts--;
  h.nodes.push(nodeId);
  h.hp = Math.min(heroStats(s).hp, h.hp);
  return null;
}

// ───────── 능력치 ─────────

const lvOf = (s: RpgState, e: Element) => s.spirits[e] ?? 0;

export function heroStats(s: RpgState, id = s.heroId) {
  const d = HEROES[id];
  const h = s.heroes[id];
  const g = 1 + BAL.heroGrowth * (h.level - 1);
  const gear = Object.values(h.gear).filter((x): x is Item => !!x);
  const sumG = (k: 'atk' | 'def' | 'res' | 'hp') => gear.reduce((a, it) => a + it[k], 0);
  const t = treeMods(s, id).stat;
  // 스피릿 Lv6 오라
  const aura = { atk: lvOf(s, 'fire') >= 6 ? 10 : 0, hp: lvOf(s, 'forest') >= 6 ? 12 : 0, guard: lvOf(s, 'earth') >= 6 ? 12 : 0 };
  return {
    hp: Math.round((d.base.hp * g + sumG('hp')) * (1 + (t.hp + aura.hp) / 100)),
    atk: (d.base.atk * g + sumG('atk')) * (1 + (t.atk + aura.atk) / 100),
    def: (d.base.def * g + sumG('def')) * (1 + (t.def + aura.guard) / 100),
    res: (d.base.res * g + sumG('res')) * (1 + (t.res + aura.guard) / 100),
  };
}

export function monStats(m: Mon) {
  const d = MONSTERS[m.def];
  const g = 1 + BAL.monGrowth * (m.level - 1);
  const e = m.elite ? { hp: 3.5, atk: 1.3 } : { hp: 1, atk: 1 };
  return { hp: Math.round(d.hp * g * e.hp), atk: d.atk * g * e.atk, def: d.def * g, res: d.res * g };
}

/** 몬스터 이름 (대장이면 '대장 …') */
export const monName = (m: Mon) => (m.elite ? `대장 ${MONSTERS[m.def].name}` : MONSTERS[m.def].name);

/** 스피릿 능력치: 스피릿 레벨 + 캐릭터 레벨(함께 성장) */
export function petStats(s: RpgState, e: Element) {
  const lv = lvOf(s, e);
  const hl = s.heroes[s.heroId].level;
  const atkMul = 1 + treeMods(s).petAtk / 100;
  const taunt = e === 'earth' && lv >= 3;
  return {
    hp: Math.round((40 + lv * 16 + hl * 6) * (taunt ? 1.3 : 1)),
    atk: (4 + lv * 1.8 + hl * 0.9) * atkMul,
    def: (3 + lv + hl * 0.5) * (taunt ? 1.5 : 1),
  };
}

export const xpToNext = (lv: number) => Math.round(BAL.xpBase * Math.pow(lv, BAL.xpPow));
export const spiritNeed = (earned: number) => BAL.spiritPointEvery + earned * 25;

export function spiritBonus(s: RpgState, monEl: Element) {
  const lv = lvOf(s, beatenBy(monEl));
  return { atk: 1 + lv * SPIRIT_BONUS_PER_LV, guard: Math.max(0.4, 1 - lv * SPIRIT_GUARD_PER_LV), lv, element: beatenBy(monEl) };
}

export function estimateHit(s: RpgState, sk: SkillDef, m: Mon) {
  const hs = heroStats(s);
  const ms = monStats(m);
  const md = MONSTERS[m.def];
  const tm = treeMods(s);
  const guard = sk.dmg === 'phys' ? ms.def : ms.res;
  const k = BAL.defK / (BAL.defK + guard);
  const t = typeMul(sk.element, md.element);
  const sp = spiritBonus(s, md.element).atk;
  const gear = Object.values(s.heroes[s.heroId].gear).reduce((a, it) => a * (it?.vs && it.vs.element === md.element ? 1 + it.vs.pct / 100 : 1), 1);
  const tree = 1 + ((tm.skill[sk.id]?.dmg ?? 0) + tm.allDmg + (t > 1 ? tm.typeBonus : 0)) / 100;
  return { dmg: hs.atk * sk.coef * k * t * sp * gear * tree * BAL.heroDmg, type: t, blocked: k < 0.62 };
}

// ───────── 위치 ─────────

function reveal(s: RpgState) {
  const set = new Set(s.seen);
  for (let dr = -5; dr <= 5; dr++)
    for (let dc = -5; dc <= 5; dc++) {
      const c = s.pos.c + dc;
      const r = s.pos.r + dr;
      if (cellAt(c, r) && dist(s.pos, { c, r }) <= 4) set.add(key(c, r));
    }
  s.seen = [...set];
}

export const monAt = (s: RpgState, c: number, r: number) => s.monsters.find((m) => !m.dead && m.c === c && m.r === r);
export const petAt = (s: RpgState, c: number, r: number) => s.pets.find((p) => !p.dead && p.c === c && p.r === r);
const heroAt = (s: RpgState, c: number, r: number) => s.pos.c === c && s.pos.r === r;
const freeCell = (s: RpgState, c: number, r: number) => isFloor(c, r) && !monAt(s, c, r) && !petAt(s, c, r) && !heroAt(s, c, r);

function msg(s: RpgState, fx: Fx[], text: string) {
  const t = fixJosa(text);
  s.log.unshift(t);
  s.log = s.log.slice(0, 40);
  fx.push({ k: 'msg', text: t });
}

/** 스피릿을 캐릭터 옆 빈칸에 세운다 */
function placePet(s: RpgState, p: Pet) {
  const ring1 = neighbors(s.pos.c, s.pos.r);
  const spots = [...ring1, ...ring1.flatMap((n) => neighbors(n.c, n.r))];
  const free = spots.find((x) => freeCell(s, x.c, x.r));
  if (free) (p.c = free.c), (p.r = free.r);
  else (p.c = s.pos.c), (p.r = s.pos.r);
}

function revivePets(s: RpgState) {
  for (const p of s.pets) {
    p.dead = false;
    p.c = -99;
    p.r = -99;
  }
  for (const p of s.pets) {
    p.hp = petStats(s, p.element).hp;
    p.cd = 0;
    placePet(s, p);
  }
}

// ───────── 행동 ─────────

/** 방향 이동: 빈칸이면 이동, 몬스터면 공격, 스피릿이면 자리 바꾸기 */
export function move(s: RpgState, d: Dir): Fx[] {
  const fx: Fx[] = [];
  const to = step(s.pos.c, s.pos.r, d);
  const m = monAt(s, to.c, to.r);
  if (m) {
    hit(s, fx, skillOf(s, HEROES[s.heroId].skills[0]), m);
    endTurn(s, fx);
    return fx;
  }
  if (!isFloor(to.c, to.r)) return fx;
  const p = petAt(s, to.c, to.r);
  if (p) (p.c = s.pos.c), (p.r = s.pos.r);
  s.pos = to;
  reveal(s);
  const f = cellAt(to.c, to.r)!.feature;
  if (f?.kind === 'camp') {
    s.camp = { ...to };
    const k = key(to.c, to.r);
    const ready = s.campReady[k] ?? 0;
    if (s.turn >= ready) {
      s.heroes[s.heroId].hp = heroStats(s).hp;
      s.cds = {};
      revivePets(s);
      s.campReady[k] = s.turn + BAL.campCooldown;
      s.stat.camps++;
      fx.push({ k: 'camp' });
      msg(s, fx, `🏕 야영지: 캐릭터와 스피릿이 모두 회복됐다. (${BAL.campCooldown}턴 뒤 다시 쉴 수 있다)`);
    } else msg(s, fx, `🏕 아직 쉴 수 없어요 — ${ready - s.turn}턴 뒤에 다시 회복할 수 있어요. (부활 지점은 여기로 바뀌었어요)`);
  } else if (f?.kind === 'exit') {
    if (s.bossDown) {
      clearStage(s, fx);
      return fx;
    }
    msg(s, fx, '🚪 출구가 닫혀 있어요. 보스를 쓰러뜨려야 열려요!');
  } else if (f?.kind === 'shrine' && !s.opened.includes(key(to.c, to.r)) && !s.spirits[f.element]) {
    s.opened.push(key(to.c, to.r));
    s.spirits[f.element] = Math.max(1, s.spirits[f.element] ?? 0);
    const pet: Pet = { element: f.element, c: 0, r: 0, hp: 0, dead: false, cd: 0, heal: 0 };
    pet.hp = petStats(s, f.element).hp;
    s.pets.push(pet);
    placePet(s, pet);
    fx.push({ k: 'spirit', element: f.element });
    msg(s, fx, `${EL_ICON[f.element]} ${SPIRITS[f.element].name}(${EL_NAME[f.element]} 스피릿)이(가) 동료가 되었다!`);
  } else if (f?.kind === 'chest' && !s.opened.includes(key(to.c, to.r))) {
    s.opened.push(key(to.c, to.r));
    const it = makeItem(s, active().stage.maxLv, 'rare');
    s.bag.push(it);
    fx.push({ k: 'drop', item: it });
    msg(s, fx, `보물 상자: ${it.name}!`);
  }
  endTurn(s, fx);
  return fx;
}

export function useSkill(s: RpgState, i: number): Fx[] {
  const fx: Fx[] = [];
  const sk = skillOf(s, HEROES[s.heroId].skills[i]);
  if ((s.cds[sk.id] ?? 0) > 0) return [{ k: 'msg', text: `${sk.name}: ${s.cds[sk.id]}턴 뒤에 쓸 수 있어요` }];
  if (!castSkill(s, fx, sk)) return [{ k: 'msg', text: sk.shape === 'around' ? '주변에 적이 없어요' : `사거리(${sk.range}칸) 안에 적이 없어요` }];
  if (i > 0) s.stat.skills++;
  endTurn(s, fx);
  return fx;
}

function castSkill(s: RpgState, fx: Fx[], sk: SkillDef): boolean {
  if (sk.shape === 'around') {
    const targets = s.monsters.filter((m) => !m.dead && dist(m, s.pos) === 1);
    if (!targets.length) return false;
    fx.push({ k: 'skill', c: s.pos.c, r: s.pos.r, skill: sk.id, cells: neighbors(s.pos.c, s.pos.r), element: sk.element });
    for (const m of targets) hit(s, fx, sk, m);
  } else {
    const target = nearestTarget(s, sk.range);
    if (!target) return false;
    const cells = sk.shape === 'splash' ? [{ c: target.c, r: target.r }, ...neighbors(target.c, target.r)] : [{ c: target.c, r: target.r }];
    fx.push({ k: 'skill', c: target.c, r: target.r, skill: sk.id, cells, element: sk.element });
    hit(s, fx, sk, target);
    if (sk.shape === 'splash') for (const m of s.monsters.filter((x) => !x.dead && x !== target && dist(x, target) === 1)) hit(s, fx, sk, m, 0.5);
  }
  if (sk.cd) s.cds[sk.id] = sk.cd + 1;
  return true;
}

/** 몬스터와 붙어 있는가 (자동 전투 조건): 바로 옆 적, 또는 쫓아오는 적이 기본 공격 사거리 안 */
export function engaged(s: RpgState): boolean {
  const basic = skillOf(s, HEROES[s.heroId].skills[0]);
  return s.monsters.some((m) => !m.dead && (dist(m, s.pos) === 1 || (m.aggro && dist(m, s.pos) <= basic.range)));
}

/** 자동 전투 한 턴: 쓸 수 있는 기술 → 기본 공격. 붙어 있지 않으면 null (시간이 멈춘다) */
export function autoAct(s: RpgState): Fx[] | null {
  if (!engaged(s)) return null;
  const fx: Fx[] = [];
  const ids = HEROES[s.heroId].skills;
  for (const i of [2, 1, 0]) {
    const sk = skillOf(s, ids[i]);
    if ((s.cds[sk.id] ?? 0) > 0) continue;
    if (sk.shape === 'around' && i !== 0 && s.monsters.filter((m) => !m.dead && dist(m, s.pos) === 1).length < 2) continue;
    if (castSkill(s, fx, sk)) {
      s.stat.autoHits++;
      endTurn(s, fx);
      return fx;
    }
  }
  return null;
}

export function nearestTarget(s: RpgState, range: number): Mon | undefined {
  return s.monsters.filter((m) => !m.dead && dist(m, s.pos) <= range).sort((a, b) => dist(a, s.pos) - dist(b, s.pos) || a.hp - b.hp)[0];
}

export function wait(s: RpgState): Fx[] {
  const fx: Fx[] = [];
  endTurn(s, fx);
  return fx;
}

function rand(s: RpgState, salt: number) {
  return createRng(hashSeed('t', s.turn, salt, s.kills))();
}

function hit(s: RpgState, fx: Fx[], sk: SkillDef, m: Mon, mul = 1) {
  const est = estimateHit(s, sk, m);
  const tm = treeMods(s);
  const critP = 0.08 + (tm.crit + (lvOf(s, 'wind') >= 6 ? 10 : 0)) / 100;
  const crit = rand(s, m.id * 7 + 1) < critP;
  const amount = Math.max(1, Math.round(est.dmg * mul * (crit ? 1.5 : 1) * (0.9 + rand(s, m.id * 7 + 2) * 0.2)));
  m.hp -= amount;
  fx.push({ k: 'dmg', c: m.c, r: m.r, amount, eff: est.type > 1 ? 'strong' : est.type < 1 ? 'weak' : null, blocked: est.blocked, crit });
  for (const x of s.monsters) if (x.pack === m.pack) x.aggro = true;
  if (tm.lifesteal) {
    const h = s.heroes[s.heroId];
    const g = Math.min(heroStats(s).hp - h.hp, Math.round((amount * tm.lifesteal) / 100));
    if (g > 0) (h.hp += g), fx.push({ k: 'heal', c: s.pos.c, r: s.pos.r, amount: g });
  }
  if (sk.effect && m.hp > 0) {
    if (sk.effect.kind === 'stun') m.stun = sk.effect.turns + tm.stunPlus;
    if (sk.effect.kind === 'slow') m.slow = sk.effect.turns * 2;
    if (sk.effect.kind === 'poison') m.poison = sk.effect.turns;
  }
  if (m.hp <= 0) kill(s, fx, m);
}

function kill(s: RpgState, fx: Fx[], m: Mon) {
  const d = MONSTERS[m.def];
  m.dead = true;
  m.deadAt = s.turn;
  m.hp = 0;
  s.kills++;
  fx.push({ k: 'kill', c: m.c, r: m.r, name: d.name });
  const g = 1 + 0.1 * (m.level - 1);
  const xp = Math.round(d.xp * g * (m.elite ? 4 : 1));
  s.gold += Math.round(d.gold * g * BAL.goldMul * (m.extra ? 0.5 : 1));
  gainXp(s, fx, xp);
  if (Object.keys(s.spirits).length) {
    s.spiritXp += xp;
    while (s.spiritXp >= spiritNeed(s.spiritEarned)) {
      s.spiritXp -= spiritNeed(s.spiritEarned);
      s.spiritEarned++;
      s.spiritPoints++;
      fx.push({ k: 'point' });
    }
  }
  if (m.boss) {
    s.bossDown = true;
    if (!s.bossesDown.includes(m.def)) s.bossesDown.push(m.def);
    fx.push({ k: 'boss', name: monName(m) });
    msg(s, fx, `👑 ${monName(m)}을(를) 쓰러뜨렸다! 맨 위 🚪출구가 열렸다.`);
  }
  if (rand(s, m.id * 7 + 3) < (m.boss ? 1 : m.extra ? BAL.dropChance * 0.5 : BAL.dropChance)) {
    const it = makeItem(s, m.level, m.boss ? (rand(s, 99) < 0.4 ? 'epic' : 'rare') : undefined);
    s.bag.push(it);
    fx.push({ k: 'drop', item: it });
  }
}

export const topLevel = (s: RpgState) => Math.max(...Object.values(s.heroes).filter((h) => h.unlocked).map((h) => h.level));

function levelUpHero(h: HeroState) {
  h.xp -= xpToNext(h.level);
  h.level++;
  h.skillPts++;
}

function gainXp(s: RpgState, fx: Fx[], xp: number) {
  for (const [id, o] of Object.entries(s.heroes)) {
    if (id === s.heroId || !o.unlocked) continue;
    o.xp += Math.round(xp * BAL.benchXp);
    while (o.xp >= xpToNext(o.level)) levelUpHero(o);
  }
  const h = s.heroes[s.heroId];
  h.xp += xp;
  while (h.xp >= xpToNext(h.level)) {
    levelUpHero(h);
    h.hp = heroStats(s).hp;
    fx.push({ k: 'levelup', hero: s.heroId, level: h.level });
  }
}

// ───────── 턴 진행 ─────────

function endTurn(s: RpgState, fx: Fx[]) {
  s.turn++;
  const h = s.heroes[s.heroId];
  petsAct(s, fx);
  const tm = treeMods(s);
  for (const m of s.monsters) {
    if (m.dead) continue;
    for (const [k, pct] of [['poison', 0.07 * tm.poisonMul], ['burn', 0.05]] as const) {
      if (m[k] <= 0 || m.dead) continue;
      m[k]--;
      const p = Math.max(1, Math.round(monStats(m).hp * pct));
      m.hp -= p;
      fx.push({ k: 'dmg', c: m.c, r: m.r, amount: p, eff: null, blocked: false, crit: false });
      if (m.hp <= 0) kill(s, fx, m);
    }
    if (m.dead) continue;
    monsterAct(s, fx, m);
    if (h.hp <= 0) break;
  }
  for (const k of Object.keys(s.cds)) s.cds[k] = Math.max(0, s.cds[k] - 1);
  if (h.hp <= 0) return die(s, fx);
  // 근처에 적이 없으면 조금씩 회복 (물 스피릿 Lv6이면 2배) — 스피릿도
  if (!s.monsters.some((m) => !m.dead && dist(m, s.pos) <= 2)) {
    const mul = lvOf(s, 'water') >= 6 ? 2 : 1;
    const hs = heroStats(s);
    if (h.hp < hs.hp) h.hp = Math.min(hs.hp, h.hp + Math.max(1, Math.round(hs.hp * BAL.regenPct * mul)));
    for (const p of s.pets) {
      if (p.dead) continue;
      const max = petStats(s, p.element).hp;
      p.hp = Math.min(max, p.hp + Math.max(1, Math.round(max * BAL.regenPct * mul)));
    }
  }
  pressure(s, fx);
}

/** 앞으로 못 가고 머뭇거리면 몬스터가 몰려온다 (낮은 판에서는 경험치 벌기 장소) */
function pressure(s: RpgState, fx: Fx[]) {
  if (s.pos.r > s.bestRow) {
    s.bestRow = s.pos.r;
    s.stall = 0;
    return;
  }
  s.stall++;
  if (s.stall < BAL.stallStart || (s.stall - BAL.stallStart) % BAL.stallEvery !== 0) return;
  const alive = s.monsters.filter((m) => m.extra && !m.dead).length;
  if (alive >= BAL.extraCap) return;
  const st = active().stage;
  const lvUp = Math.floor((s.stall - BAL.stallStart) / 40);
  const spots = [...active().cells.values()].filter((x) => x.floor && !x.feature && dist(x, s.pos) >= 3 && dist(x, s.pos) <= 5 && freeCell(s, x.c, x.r));
  if (!spots.length) return;
  const rng = createRng(hashSeed('swarm', s.turn, s.stage, s.kills));
  const center = spots[Math.floor(rng() * spots.length)];
  const size = Math.min(BAL.extraCap - alive, 2 + Math.floor(rng() * 2));
  const pack = 1000 + s.turn;
  const cand = [center, ...neighbors(center.c, center.r)].filter((x) => freeCell(s, x.c, x.r));
  for (const p of cand.slice(0, size)) {
    const id = s.monsters.length;
    const m: Mon = { id, def: st.monsters[Math.floor(rng() * st.monsters.length)], level: st.maxLv + lvUp, c: p.c, r: p.r, hp: 0, home: { c: p.c, r: p.r }, pack, dead: false, deadAt: 0, extra: true, ...freshMonFields, aggro: true };
    m.hp = monStats(m).hp;
    s.monsters.push(m);
  }
  fx.push({ k: 'swarm' });
  msg(s, fx, '⚠ 머뭇거리는 사이 몬스터 무리가 몰려온다!');
}

function clearStage(s: RpgState, fx: Fx[]) {
  const first = !s.cleared.includes(s.stage);
  const gold = 20 + s.stage * 15 + (first ? s.stage * 20 : 0);
  s.gold += gold;
  let item: Item | undefined;
  if (first) {
    item = makeItem(s, active().stage.bossLv, s.stage % 3 === 0 ? 'epic' : 'rare');
    s.bag.push(item);
    s.cleared.push(s.stage);
  }
  s.stageClear = true;
  fx.push({ k: 'clear', stage: s.stage, gold, item, first });
}

/** 스피릿: 붙은 적을 공격, 아니면 캐릭터를 따라간다 */
function petsAct(s: RpgState, fx: Fx[]) {
  for (const p of s.pets) {
    if (p.dead) continue;
    const lv = lvOf(s, p.element);
    // 물 Lv3: 3턴마다 치유
    if (p.element === 'water' && lv >= 3) {
      p.heal = Math.max(0, p.heal - 1);
      const h = s.heroes[s.heroId];
      const hurt = h.hp < heroStats(s).hp * 0.9 || s.pets.some((x) => !x.dead && x.hp < petStats(s, x.element).hp * 0.9);
      if (p.heal === 0 && hurt) {
        p.heal = 3;
        const g = Math.round(heroStats(s).hp * 0.08);
        h.hp = Math.min(heroStats(s).hp, h.hp + g);
        fx.push({ k: 'heal', c: s.pos.c, r: s.pos.r, amount: g });
        for (const x of s.pets) if (!x.dead) x.hp = Math.min(petStats(s, x.element).hp, x.hp + Math.round(petStats(s, x.element).hp * 0.1));
      }
    }
    // Lv10: 5턴마다 광역기
    p.cd = Math.max(0, p.cd - 1);
    const near2 = s.monsters.filter((m) => !m.dead && dist(m, p) <= 2);
    if (lv >= 10 && p.cd === 0 && near2.length >= 2) {
      p.cd = 5;
      fx.push({ k: 'skill', c: p.c, r: p.r, skill: `pet_${p.element}`, cells: [{ c: p.c, r: p.r }, ...neighbors(p.c, p.r)], element: p.element });
      for (const m of near2) petHit(s, fx, p, m, 2);
      continue;
    }
    const adj = s.monsters
      .filter((m) => !m.dead && dist(m, p) === 1)
      .sort((a, b) => typeMul(p.element, MONSTERS[b.def].element) - typeMul(p.element, MONSTERS[a.def].element) || a.hp - b.hp);
    if (adj.length) {
      petHit(s, fx, p, adj[0], 1);
      if (p.element === 'wind' && lv >= 3 && !adj[0].dead && rand(s, 400 + adj[0].id) < 0.3) petHit(s, fx, p, adj[0], 1);
      continue;
    }
    // 이동: 캐릭터 근처의 쫓아오는 적에게, 없으면 캐릭터 곁으로
    const foe = s.monsters.filter((m) => !m.dead && m.aggro && dist(m, s.pos) <= 3).sort((a, b) => dist(a, p) - dist(b, p))[0];
    const goal = foe ?? (dist(p, s.pos) > 1 ? s.pos : null);
    if (!goal) continue;
    const opts = neighbors(p.c, p.r).filter((n) => freeCell(s, n.c, n.r) && dist(n, s.pos) <= 3);
    const best = opts.sort((a, b) => dist(a, goal) - dist(b, goal))[0];
    if (best && dist(best, goal) < dist(p, goal)) (p.c = best.c), (p.r = best.r);
    else if (dist(p, s.pos) > 3) placePet(s, p); // 너무 멀어지면 곁으로
  }
}

function petHit(s: RpgState, fx: Fx[], p: Pet, m: Mon, mul: number) {
  const ps = petStats(s, p.element);
  const md = MONSTERS[m.def];
  const ms = monStats(m);
  const t = typeMul(p.element, md.element);
  const roll = 0.9 + rand(s, m.id * 31 + ELEMENTS.indexOf(p.element)) * 0.2;
  const amount = Math.max(1, Math.round(ps.atk * mul * t * (BAL.defK / (BAL.defK + (ms.def + ms.res) / 2)) * BAL.heroDmg * roll));
  m.hp -= amount;
  fx.push({ k: 'dmg', c: m.c, r: m.r, amount, eff: t > 1 ? 'strong' : t < 1 ? 'weak' : null, blocked: false, crit: false });
  for (const x of s.monsters) if (x.pack === m.pack) x.aggro = true;
  const lv = lvOf(s, p.element);
  if (m.hp > 0 && lv >= 3) {
    if (p.element === 'fire') m.burn = 3;
    if (p.element === 'forest' && rand(s, m.id * 37) < 0.3) m.root = 1;
  }
  if (m.hp <= 0) kill(s, fx, m);
}

type Target = { kind: 'hero' } | { kind: 'pet'; pet: Pet };

/** 몬스터가 노릴 대상: 사거리 안 (대지 도발 스피릿 우선) → 가장 가까운 */
function pickTarget(s: RpgState, m: Mon, range: number): Target | null {
  const cands: { t: Target; d: number; taunt: boolean }[] = [];
  const dh = dist(m, s.pos);
  if (dh <= range) cands.push({ t: { kind: 'hero' }, d: dh, taunt: false });
  for (const p of s.pets) if (!p.dead && dist(m, p) <= range) cands.push({ t: { kind: 'pet', pet: p }, d: dist(m, p), taunt: p.element === 'earth' && lvOf(s, 'earth') >= 3 });
  if (!cands.length) return null;
  cands.sort((a, b) => Number(b.taunt) - Number(a.taunt) || a.d - b.d || (a.t.kind === 'hero' ? -1 : 1));
  return cands[0].t;
}

function monsterAct(s: RpgState, fx: Fx[], m: Mon) {
  const d = MONSTERS[m.def];
  if (m.stun > 0) return void m.stun--;
  if (m.slow > 0) {
    m.slow--;
    if (m.slow % 2 === 1) return;
  }
  if (dist(m, s.pos) <= (m.boss ? 2 : BAL.aggro) || s.pets.some((p) => !p.dead && dist(p, m) <= 1)) m.aggro = true;
  if (m.aggro) for (const x of s.monsters) if (x.pack === m.pack && !x.dead) x.aggro = true;
  const t = pickTarget(s, m, d.range);
  if (t) return monAttack(s, fx, m, t);
  if (m.root > 0) return void m.root--;
  if (!m.aggro) {
    if (!m.boss && rand(s, m.id * 13) < 0.25) {
      const opts = neighbors(m.c, m.r).filter((n) => freeCell(s, n.c, n.r) && dist(n, m.home) <= 2 && !cellAt(n.c, n.r)?.feature);
      const n = opts[Math.floor(rand(s, m.id * 13 + 1) * opts.length)];
      if (n) (m.c = n.c), (m.r = n.r);
    }
    return;
  }
  const moves = m.def === 'wolf' && rand(s, m.id * 17) < 0.35 ? 2 : 1;
  for (let k = 0; k < moves; k++) {
    const opts = neighbors(m.c, m.r).filter((n) => freeCell(s, n.c, n.r) && cellAt(n.c, n.r)?.feature?.kind !== 'camp' && (!m.boss || dist(n, m.home) <= 2));
    const best = opts.sort((a, b) => dist(a, s.pos) - dist(b, s.pos))[0];
    if (!best || dist(best, s.pos) >= dist(m, s.pos)) break;
    m.c = best.c;
    m.r = best.r;
    if (k === moves - 1) break;
    const t2 = pickTarget(s, m, d.range);
    if (t2) return monAttack(s, fx, m, t2);
  }
}

/** 몬스터 공격 배율: 앞 판은 순하게, 뒤로 갈수록 세게 (1판 ×1.4 → 10판 ×2.3) */
const monDmgMul = (s: RpgState) => BAL.monDmg * (1 + 0.07 * (s.stage - 1)) * 0.61;

function monAttack(s: RpgState, fx: Fx[], m: Mon, t: Target) {
  const d = MONSTERS[m.def];
  const ms = monStats(m);
  const roll = 0.85 + rand(s, m.id * 19) * 0.3;
  if (t.kind === 'hero') {
    const hs = heroStats(s);
    const guard = d.dmg === 'phys' ? hs.def : hs.res;
    const amount = Math.max(1, Math.round(ms.atk * (BAL.defK / (BAL.defK + guard)) * spiritBonus(s, d.element).guard * roll * monDmgMul(s)));
    const h = s.heroes[s.heroId];
    h.hp = Math.max(0, h.hp - amount);
    fx.push({ k: 'dmg', c: s.pos.c, r: s.pos.r, amount, eff: null, blocked: false, crit: false, onHero: true });
  } else {
    const p = t.pet;
    const ps = petStats(s, p.element);
    const amount = Math.max(1, Math.round(ms.atk * (BAL.defK / (BAL.defK + ps.def)) * typeMul(d.element, p.element) * roll * monDmgMul(s)));
    p.hp -= amount;
    fx.push({ k: 'dmg', c: p.c, r: p.r, amount, eff: null, blocked: false, crit: false, onPet: true });
    if (p.hp <= 0) {
      p.hp = 0;
      p.dead = true;
      fx.push({ k: 'petDown', element: p.element });
      msg(s, fx, `${EL_ICON[p.element]} ${SPIRITS[p.element].name}이(가) 쓰러졌다… 🏕야영지에 가면 되살아난다.`);
    }
  }
}

function die(s: RpgState, fx: Fx[]) {
  s.deaths++;
  const lost = Math.floor(s.gold * BAL.deathGoldLoss);
  s.gold -= lost;
  s.pos = { ...s.camp };
  s.heroes[s.heroId].hp = heroStats(s).hp;
  s.cds = {};
  s.monsters = s.monsters.filter((m) => !m.extra);
  for (const m of s.monsters) if (!m.dead) Object.assign(m, { c: m.home.c, r: m.home.r, hp: monStats(m).hp, ...freshMonFields });
  s.stall = 0;
  s.campReady = {};
  revivePets(s);
  fx.push({ k: 'death' });
  msg(s, fx, `쓰러졌다… 마지막 야영지에서 다시 일어났다. (골드 -${lost})`);
  reveal(s);
}

// ───────── 캐릭터·장비·스피릿 ─────────

export function onCamp(s: RpgState) {
  return cellAt(s.pos.c, s.pos.r)?.feature?.kind === 'camp';
}

// ───────── 물약·상점 (D83) ─────────

export function usePotion(s: RpgState, kind: 'small' | 'big'): string | null {
  if (s.potions[kind] <= 0) return '물약이 없어요 (상점에서 사요)';
  const h = s.heroes[s.heroId];
  const max = heroStats(s).hp;
  if (h.hp >= max) return '체력이 가득해요';
  s.potions[kind]--;
  h.hp = Math.min(max, h.hp + Math.round(max * (kind === 'small' ? 0.4 : 1)));
  return null;
}

export type ShopItem = 'small' | 'big' | 'box';
export function shopPrice(s: RpgState, it: ShopItem): number {
  return it === 'small' ? 30 : it === 'big' ? 90 : 80 + unlockedStage(s) * 25;
}
export function buy(s: RpgState, it: ShopItem): { error: string } | { item?: Item } {
  const price = shopPrice(s, it);
  if (s.gold < price) return { error: `골드가 부족해요 (${price})` };
  s.gold -= price;
  if (it === 'small') s.potions.small++;
  else if (it === 'big') s.potions.big++;
  else {
    const lv = STAGES[unlockedStage(s) - 1].maxLv;
    const roll = createRng(hashSeed('box', s.itemCounter, s.gold))();
    const item = makeItem(s, lv, roll < 0.15 ? 'epic' : roll < 0.6 ? 'rare' : 'common');
    s.bag.push(item);
    return { item };
  }
  return {};
}

export function equip(s: RpgState, uid: string): string | null {
  const i = s.bag.findIndex((x) => x.uid === uid);
  if (i < 0) return '없는 장비';
  const it = s.bag[i];
  const h = s.heroes[s.heroId];
  const before = heroStats(s).hp;
  s.bag.splice(i, 1);
  const old = h.gear[it.slot];
  if (old) s.bag.push(old);
  h.gear[it.slot] = it;
  h.hp = Math.min(heroStats(s).hp, h.hp + Math.max(0, heroStats(s).hp - before));
  s.stat.equips++;
  return null;
}

export function unequip(s: RpgState, slot: Slot) {
  const h = s.heroes[s.heroId];
  const it = h.gear[slot];
  if (!it) return;
  delete h.gear[slot];
  s.bag.push(it);
  h.hp = Math.min(heroStats(s).hp, h.hp);
}

export function itemPrice(it: Item) {
  return Math.round((5 + it.level * 3) * { common: 1, rare: 2.5, epic: 6 }[it.rarity]);
}

export function sellItem(s: RpgState, uid: string): number {
  const i = s.bag.findIndex((x) => x.uid === uid);
  if (i < 0) return 0;
  const price = itemPrice(s.bag[i]);
  s.bag.splice(i, 1);
  s.gold += price;
  return price;
}

export function itemScore(it: Item | undefined): number {
  if (!it) return 0;
  return it.atk * 3 + it.def * 1.5 + it.res * 1.5 + it.hp * 0.3 + (it.vs ? it.vs.pct * 0.6 : 0);
}

export function spendSpiritPoint(s: RpgState, el: Element): string | null {
  if (s.spiritPoints <= 0) return '스피릿 포인트가 없어요';
  if (!s.spirits[el]) return '아직 얻지 못한 스피릿이에요';
  s.spiritPoints--;
  s.spirits[el] = (s.spirits[el] ?? 0) + 1;
  const p = s.pets.find((x) => x.element === el);
  if (p && !p.dead) p.hp = petStats(s, el).hp;
  return null;
}

const NAMES: Record<Slot, string[]> = { weapon: ['검', '지팡이', '활', '도끼'], armor: ['가죽 갑옷', '사슬 갑옷', '로브', '판금 갑옷'], ring: ['반지', '목걸이', '부적'] };
const PREFIX: Record<Rarity, string[]> = { common: ['낡은', '평범한', '튼튼한'], rare: ['날카로운', '단단한', '빛나는'], epic: ['전설의', '고대의', '정령의'] };

export function makeItem(s: RpgState, level: number, force?: Rarity): Item {
  s.itemCounter++;
  const rng = createRng(hashSeed('item', s.itemCounter, s.turn, level));
  const roll = rng();
  const rarity: Rarity = force ?? (roll < 0.06 ? 'epic' : roll < 0.3 ? 'rare' : 'common');
  const mul = { common: 1, rare: 1.45, epic: 2 }[rarity];
  const slot: Slot = (['weapon', 'armor', 'ring'] as Slot[])[Math.floor(rng() * 3)];
  const pick = <T,>(a: T[]) => a[Math.floor(rng() * a.length)];
  const it: Item = { uid: `it${s.itemCounter}`, slot, name: '', rarity, level, atk: 0, def: 0, res: 0, hp: 0 };
  if (slot === 'weapon') it.atk = Math.round((2 + level * 0.9) * mul);
  if (slot === 'armor') {
    it.def = Math.round((1 + level * 0.55) * mul * (0.6 + rng() * 0.8));
    it.res = Math.round((1 + level * 0.55) * mul * (0.6 + rng() * 0.8));
    it.hp = Math.round((6 + level * 4) * mul);
  }
  if (slot === 'ring') {
    it.hp = Math.round((4 + level * 2) * mul);
    it.atk = Math.round(level * 0.3 * mul);
    if (rarity !== 'common') it.vs = { element: pick(ELEMENTS), pct: rarity === 'epic' ? 25 : 15 };
  }
  it.name = `${pick(PREFIX[rarity])} ${it.vs ? `${EL_NAME[it.vs.element]} 사냥꾼의 ` : ''}${pick(NAMES[slot])}`;
  return it;
}

/** 지금 스테이지 진행: 출구까지 남은 줄, 남은 몬스터 */
export function stageInfo(s: RpgState) {
  const w = active();
  return { ...w.stage, rows: w.rows, toExit: Math.max(0, w.exit.r - s.pos.r), left: s.monsters.filter((m) => !m.dead && !m.extra).length, bossDown: s.bossDown, bossRow: w.bossAt.r };
}

export { beats };
