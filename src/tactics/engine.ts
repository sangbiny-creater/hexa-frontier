// 헥사 전술 전투 (D109) 규칙: 캠페인(부대·골드·가방·진행) + 전투(턴·이동·공격·반격·기술·아이템·승패).
import { createRng, hashSeed } from '../core/rng';
import { BAL, elMul, ITEMS, ROLES, SKILLS, TERRAIN, TERRAIN_EL_BONUS, UNITS, type ItemSlot, type SkillDef, type UnitDef } from './data';
import { COLS, ENEMIES, ROWS, START_SPIRITS, STAGES, terrainAt, type StageDef } from './stages';
// 이웃 칸은 최대 크기 안에서 구하고, 지도 밖(판마다 다름)은 terrainAt이 null → 이동·거리 계산에서 빠진다

// ───────── 헥사 좌표 (odd-r: 홀수 줄이 반 칸 오른쪽) ─────────
export type Pos = { c: number; r: number };
export const key = (c: number, r: number) => `${c},${r}`;
export function neighbors(c: number, r: number): Pos[] {
  const d = r & 1 ? [[1, 0], [-1, 0], [1, -1], [0, -1], [1, 1], [0, 1]] : [[1, 0], [-1, 0], [0, -1], [-1, -1], [0, 1], [-1, 1]];
  return d.map(([dc, dr]) => ({ c: c + dc, r: r + dr })).filter((p) => p.c >= 0 && p.r >= 0 && p.c < COLS && p.r < ROWS);
}
function cube(p: Pos) {
  const x = p.c - (p.r - (p.r & 1)) / 2;
  return { x, z: p.r, y: -x - p.r };
}
export function dist(a: Pos, b: Pos): number {
  const A = cube(a);
  const B = cube(b);
  return Math.max(Math.abs(A.x - B.x), Math.abs(A.y - B.y), Math.abs(A.z - B.z));
}

// ───────── 캠페인 (저장되는 것) ─────────
export const TACTICS_VERSION = 2; // D119: 주인공 선택·스피릿 25종·100판
export interface RosterEntry {
  lv: number;
  xp: number;
  equip: Partial<Record<ItemSlot, string>>;
}
export interface Campaign {
  version: number;
  hero: 'aren' | 'lia'; // 고른 주인공 (지도자)
  roster: Record<string, RosterEntry>;
  joined: string[]; // 합류 순서
  party: string[]; // 마지막 출전 명단
  gold: number;
  bag: Record<string, number>; // 아이템 → 개수 (소모품·안 낀 장비)
  cleared: number[];
  tut: number;
}
export function newCampaign(hero: 'aren' | 'lia' = 'aren'): Campaign {
  const start = [hero, ...START_SPIRITS];
  return {
    version: TACTICS_VERSION,
    hero,
    roster: Object.fromEntries(start.map((id) => [id, { lv: 1, xp: 0, equip: {} }])),
    joined: [...start],
    party: [...start],
    gold: 100,
    bag: { potion: 3 },
    cleared: [],
    tut: 0,
  };
}
export const unlockedStage = (cp: Campaign) => Math.min(STAGES.length, Math.max(0, ...cp.cleared) + 1);
/** 출전 인원: 1~9판 4명, 10~39판 5명, 40판~ 6명 */
export const maxParty = (n: number) => (n < 10 ? 4 : n < 40 ? 5 : 6);
export const otherHero = (cp: Campaign) => (cp.hero === 'aren' ? 'lia' : 'aren');

// ───────── 전투 상태 ─────────
export type Side = 'ally' | 'enemy';
export interface Status {
  stun?: number;
  atkUp?: { pct: number; turns: number };
  defDown?: { pct: number; turns: number };
  taunt?: number;
  guard?: number;
}
export interface Unit {
  uid: number;
  def: string;
  side: Side;
  lv: number;
  xp: number;
  c: number;
  r: number;
  hp: number;
  sp: number;
  dead: boolean;
  moved: boolean;
  acted: boolean;
  from?: Pos; // 이동 취소용
  boss?: boolean;
  leader?: boolean; // 쓰러지면 패배
  gain?: number; // 이번 전투에서 얻은 경험치 (출전 못 한 스피릿 나눠 주기용)
  pw?: number; // 적 능력치 배율 (판마다)
  ai?: 'charge' | 'hold' | 'guard';
  equip: string[];
  st: Status;
}
export interface Battle {
  stage: number;
  turn: number;
  phase: Side;
  units: Unit[];
  bag: Record<string, number>;
  log: string[];
  result: null | 'win' | 'lose';
  seed: number;
  rc: number; // 난수 카운터
  awake: number[]; // 'hold' 적 중 움직이기 시작한 것
}
export type Ev =
  | { k: 'move'; uid: number; path: Pos[] }
  | { k: 'hit'; from: number; to: number; amount: number; mul: number; crit: boolean; counter?: boolean; skill?: string }
  | { k: 'heal'; uid: number; amount: number; sp?: boolean }
  | { k: 'die'; uid: number }
  | { k: 'lvup'; uid: number; lv: number }
  | { k: 'buff'; uid: number; text: string }
  | { k: 'skill'; uid: number; skill: string; cells: Pos[] }
  | { k: 'msg'; text: string };

export const defOf = (id: string): UnitDef => UNITS[id] ?? ENEMIES[id];
export const stageOf = (b: Battle): StageDef => STAGES[b.stage - 1];
export const unitAt = (b: Battle, c: number, r: number) => b.units.find((u) => !u.dead && u.c === c && u.r === r);
export const alive = (b: Battle, side?: Side) => b.units.filter((u) => !u.dead && (!side || u.side === side));

/** 능력치: 역할 기본 + 레벨 성장 + 개성 + 장비 + 상태 */
export function unitStats(u: Unit) {
  const d = defOf(u.def);
  const role = ROLES[d.role];
  const L = u.lv - 1;
  const eq = { hp: 0, atk: 0, def: 0, res: 0, move: 0, sp: 0 };
  for (const id of u.equip) for (const [k, v] of Object.entries(ITEMS[id]?.stats ?? {})) eq[k as keyof typeof eq] += v as number;
  const foe = u.side === 'enemy' ? { hp: BAL_FOE.hp * (u.pw ?? 1), atk: BAL_FOE.atk * (u.pw ?? 1) } : { hp: 1, atk: 1 };
  let atk = (role.base.atk + role.grow.atk * L + (d.bonus?.atk ?? 0) + eq.atk) * foe.atk;
  let def = role.base.def + role.grow.def * L + (d.bonus?.def ?? 0) + eq.def;
  let res = role.base.res + role.grow.res * L + (d.bonus?.res ?? 0) + eq.res;
  if (u.st.atkUp) atk *= 1 + u.st.atkUp.pct / 100;
  if (u.st.defDown) (def *= 1 - u.st.defDown.pct / 100), (res *= 1 - u.st.defDown.pct / 100);
  if (u.st.guard) (def *= 1.3), (res *= 1.3);
  // 지도자(고른 주인공)는 지휘관답게 더 단단하다
  if (u.leader) (def *= 1.15), (res *= 1.15);
  return {
    hp: Math.round((role.base.hp + role.grow.hp * L + (d.bonus?.hp ?? 0) + eq.hp) * foe.hp * (u.boss ? 1.5 : 1) * (u.leader ? 1.25 : 1)),
    atk,
    def,
    res,
    move: Math.max(2, role.move + (d.bonus?.move ?? 0) + eq.move),
    spMax: BAL.spMaxBase + L + eq.sp,
    range: role.range,
    dmg: role.dmg,
  };
}
/** 적 능력치 배율 (밸런스) */
export const BAL_FOE = { hp: 1.0, atk: 0.9 };

/** 유닛이 가진 기술 (역할 기술 2개, 두 번째는 5레벨부터) */
export function skillsOf(u: Unit): SkillDef[] {
  const d = defOf(u.def);
  const ids = d.skills ?? ROLES[d.role].skills;
  return ids.filter((_, i) => i === 0 || u.lv >= 5).map((id) => SKILLS[id]);
}

function rnd(b: Battle) {
  return createRng(hashSeed('tac', b.seed, b.rc++))();
}
const say = (b: Battle, t: string) => {
  b.log.unshift(t);
  if (b.log.length > 40) b.log.length = 40;
};
export const nameOf = (u: Unit) => (u.boss ? '👑' : '') + defOf(u.def).name;

// ───────── 전투 만들기 ─────────
export function createBattle(cp: Campaign, n: number, party: string[], seed = 1): Battle {
  const st = STAGES[n - 1];
  const units: Unit[] = [];
  // 탱커·근접은 앞줄(10), 원거리·힐러·서포터는 뒷줄(11)
  const maxR = Math.max(...st.deploy.map(([, r]) => r));
  const front = st.deploy.filter(([, r]) => r === maxR - 1);
  const back = st.deploy.filter(([, r]) => r === maxR);
  const melee = (id: string) => ['tank', 'pmelee', 'mmelee'].includes(defOf(id).role);
  const order = [...party].sort((a, b) => Number(melee(b)) - Number(melee(a)));
  for (const id of order.slice(0, maxParty(n))) {
    const pool = melee(id) ? (front.length ? front : back) : back.length ? back : front;
    const [c, r] = pool.shift()!;
    const ro = cp.roster[id];
    const u: Unit = { uid: units.length, def: id, side: 'ally', lv: ro.lv, xp: ro.xp, c, r, hp: 0, sp: BAL.spStart, dead: false, moved: false, acted: false, leader: id === cp.hero, gain: 0, equip: Object.values(ro.equip).filter(Boolean) as string[], st: {} };
    u.hp = unitStats(u).hp;
    units.push(u);
  }
  for (const e of st.enemies) {
    const u: Unit = { uid: units.length, def: `e_${e.id}`, side: 'enemy', lv: e.lv, xp: 0, c: e.c, r: e.r, hp: 0, sp: 0, pw: st.power, dead: false, moved: false, acted: false, boss: e.boss, ai: e.ai ?? 'charge', equip: [], st: {} };
    u.hp = unitStats(u).hp;
    units.push(u);
  }
  const b: Battle = { stage: n, turn: 1, phase: 'ally', units, bag: { ...cp.bag }, log: [], result: null, seed, rc: 0, awake: [] };
  say(b, `⚔️ ${st.name} — ${st.win === 'boss' ? '👑보스를 쓰러뜨려라' : '적을 모두 쓰러뜨려라'} (${st.turns}턴 안에)`);
  return b;
}

// ───────── 이동 ─────────
/** 이 칸에 들어가는 비용 (같은 속성 지형은 1) */
export function stepCost(b: Battle, u: Unit, c: number, r: number): number {
  const t = terrainAt(stageOf(b), c, r);
  if (!t || t === 'rock') return 99;
  const info = TERRAIN[t];
  if (info.element && info.element === defOf(u.def).element) return 1;
  return info.cost;
}
/** 갈 수 있는 칸 → 남은 이동력 (적은 못 지나가고, 아군은 지나가되 멈출 수 없다) */
export function moveRange(b: Battle, u: Unit): Map<string, { c: number; r: number; left: number; prev: string | null }> {
  const mv = unitStats(u).move;
  const out = new Map<string, { c: number; r: number; left: number; prev: string | null }>();
  out.set(key(u.c, u.r), { c: u.c, r: u.r, left: mv, prev: null });
  const q: Pos[] = [{ c: u.c, r: u.r }];
  while (q.length) {
    q.sort((a, c) => out.get(key(c.c, c.r))!.left - out.get(key(a.c, a.r))!.left);
    const p = q.shift()!;
    const left = out.get(key(p.c, p.r))!.left;
    for (const n of neighbors(p.c, p.r)) {
      const o = unitAt(b, n.c, n.r);
      if (o && o.side !== u.side) continue;
      const l = left - stepCost(b, u, n.c, n.r);
      if (l < 0) continue;
      const k = key(n.c, n.r);
      if ((out.get(k)?.left ?? -1) >= l) continue;
      out.set(k, { c: n.c, r: n.r, left: l, prev: key(p.c, p.r) });
      q.push(n);
    }
  }
  for (const [k, v] of out) if (k !== key(u.c, u.r) && unitAt(b, v.c, v.r)) out.delete(k);
  return out;
}
export function pathTo(range: ReturnType<typeof moveRange>, c: number, r: number): Pos[] {
  const path: Pos[] = [];
  let k: string | null = key(c, r);
  while (k) {
    const v = range.get(k);
    if (!v) break;
    path.unshift({ c: v.c, r: v.r });
    k = v.prev;
  }
  return path;
}
export function moveUnit(b: Battle, u: Unit, c: number, r: number): Ev[] | string {
  if (b.result || u.side !== b.phase || u.acted || u.moved) return '지금은 움직일 수 없어요';
  const range = moveRange(b, u);
  if (!range.has(key(c, r))) return '거기까지는 못 가요';
  const path = pathTo(range, c, r);
  u.from = { c: u.c, r: u.r };
  u.c = c;
  u.r = r;
  u.moved = true;
  return [{ k: 'move', uid: u.uid, path }];
}
/** 이동 취소 (행동하기 전만) */
export function undoMove(_b: Battle, u: Unit): boolean {
  if (!u.moved || u.acted || !u.from) return false;
  u.c = u.from.c;
  u.r = u.from.r;
  u.moved = false;
  return true;
}

// ───────── 공격 ─────────
const inRange = (d: number, [lo, hi]: [number, number]) => d >= lo && d <= hi;
/** 이 칸에서 기본 공격이 닿는 적 */
export function attackTargets(b: Battle, u: Unit, from: Pos = u): Unit[] {
  const rg = unitStats(u).range;
  return alive(b).filter((t) => t.side !== u.side && inRange(dist(from, t), rg));
}
/** 피해 계산 (난수 없이 기댓값). power: 배율 */
export function calcHit(b: Battle, a: Unit, t: Unit, power: number, dmg: 'phys' | 'magic', ownEl = false, counter = false, from: Pos = a) {
  const as = unitStats(a);
  const ts = unitStats(t);
  const guard = dmg === 'phys' ? ts.def : ts.res;
  const st = stageOf(b);
  const tt = TERRAIN[terrainAt(st, t.c, t.r) ?? 'plain'];
  const at = TERRAIN[terrainAt(st, from.c, from.r) ?? 'plain'];
  const ae = defOf(a.def).element;
  const mul = elMul(ae, defOf(t.def).element);
  const terrBoost = at.element && at.element === ae ? 1 + TERRAIN_EL_BONUS : 1;
  const amount = as.atk * power * (BAL.defK / (BAL.defK + guard)) * mul * (1 - tt.guard / 100) * terrBoost * (ownEl ? 1.1 : 1) * (counter ? BAL.counter : 1);
  return { amount: Math.max(1, Math.round(amount)), mul };
}
/** 공격 미리보기: 내 피해, 반격 피해, 쓰러뜨리는지 */
export function forecast(b: Battle, a: Unit, t: Unit, skill?: SkillDef, from: Pos = a) {
  const as = unitStats(a);
  const power = skill ? skill.power : 1;
  const hit = calcHit(b, a, t, power, skill?.dmg ?? as.dmg, !!skill?.ownElement, false, from);
  const kills = hit.amount >= t.hp;
  let counter = 0;
  if (!skill && !kills && !t.st.stun && inRange(dist(from, t), unitStats(t).range)) counter = calcHit(b, t, a, 1, unitStats(t).dmg, false, true, t).amount;
  return { dmg: hit.amount, mul: hit.mul, kills, counter };
}
function applyHit(b: Battle, ev: Ev[], a: Unit, t: Unit, power: number, dmg: 'phys' | 'magic', opts: { ownEl?: boolean; counter?: boolean; skill?: string } = {}) {
  const h = calcHit(b, a, t, power, dmg, opts.ownEl, opts.counter);
  const crit = rnd(b) < BAL.crit;
  const amount = Math.max(1, Math.round(h.amount * (0.92 + rnd(b) * 0.16) * (crit ? 1.5 : 1)));
  t.hp = Math.max(0, t.hp - amount);
  ev.push({ k: 'hit', from: a.uid, to: t.uid, amount, mul: h.mul, crit, counter: opts.counter, skill: opts.skill });
  say(b, `${nameOf(a)}${opts.counter ? ' 반격' : opts.skill ? ` ${SKILLS[opts.skill].name}` : ''} → ${nameOf(t)} -${amount}${h.mul > 1 ? ' (유리!)' : h.mul < 1 ? ' (불리)' : ''}${crit ? ' 치명타!' : ''}`);
  if (!opts.skill || SKILLS[opts.skill]?.kind === 'attack') a.sp = Math.min(unitStats(a).spMax, a.sp + (opts.skill ? 0 : BAL.spHit));
  gainXp(b, ev, a, Math.max(3, 10 + 3 * (t.lv - a.lv)));
  if (t.hp <= 0) {
    t.dead = true;
    ev.push({ k: 'die', uid: t.uid });
    say(b, `💀 ${nameOf(t)} 쓰러짐`);
    gainXp(b, ev, a, Math.max(t.boss ? 25 : 10, (t.boss ? 70 : 25) + 5 * (t.lv - a.lv)));
  }
  return amount;
}
/** 기본 공격 (반격 있음) */
export function attack(b: Battle, u: Unit, t: Unit): Ev[] | string {
  if (b.result || u.side !== b.phase || u.acted) return '지금은 공격할 수 없어요';
  if (!attackTargets(b, u).includes(t)) return '사거리 밖이에요';
  const ev: Ev[] = [];
  applyHit(b, ev, u, t, 1, unitStats(u).dmg);
  if (!t.dead && !t.st.stun && inRange(dist(t, u), unitStats(t).range)) applyHit(b, ev, t, u, 1, unitStats(t).dmg, { counter: true });
  finishAction(b, ev, u);
  return ev;
}

// ───────── 기술 ─────────
/** 기술을 쓸 수 있는 대상 칸 (from에서) */
export function skillTargets(b: Battle, u: Unit, sk: SkillDef, from: Pos = u): Pos[] {
  if (sk.range[1] === 0) return [{ c: from.c, r: from.r }];
  const out: Pos[] = [];
  for (const t of alive(b)) {
    const d = dist(from, t);
    if (!inRange(d, sk.range)) continue;
    const friend = t.side === u.side;
    if ((sk.kind === 'attack' || sk.kind === 'debuff') && !friend) out.push({ c: t.c, r: t.r });
    if ((sk.kind === 'heal' || sk.kind === 'buff') && friend) out.push({ c: t.c, r: t.r });
  }
  return out;
}
export function canUseSkill(u: Unit, sk: SkillDef): string | null {
  if (u.sp < sk.sp) return `SP가 모자라요 (${u.sp}/${sk.sp})`;
  return null;
}
export function useSkill(b: Battle, u: Unit, skillId: string, at: Pos): Ev[] | string {
  if (b.result || u.side !== b.phase || u.acted) return '지금은 쓸 수 없어요';
  const sk = SKILLS[skillId];
  if (!skillsOf(u).includes(sk)) return '배우지 않은 기술이에요';
  const err = canUseSkill(u, sk);
  if (err) return err;
  if (!skillTargets(b, u, sk).some((p) => p.c === at.c && p.r === at.r)) return '대상이 없어요';
  const ev: Ev[] = [];
  u.sp -= sk.sp;
  const self = { c: u.c, r: u.r };
  const main = unitAt(b, at.c, at.r);
  let cells: Pos[] = [at];
  if (sk.area === 'target+adj') cells = [at, ...neighbors(at.c, at.r)];
  if (sk.area === 'self+adj') cells = neighbors(self.c, self.r);
  if (sk.area === 'allies2') cells = alive(b, u.side).filter((x) => dist(x, self) <= 2).map((x) => ({ c: x.c, r: x.r }));
  ev.push({ k: 'skill', uid: u.uid, skill: sk.id, cells });
  const dmgType = sk.dmg ?? unitStats(u).dmg;
  const hits = cells.map((p) => unitAt(b, p.c, p.r)).filter((x): x is Unit => !!x);
  if (sk.kind === 'attack') {
    for (const t of hits.filter((x) => x.side !== u.side)) {
      const dealt = applyHit(b, ev, u, t, sk.power, dmgType, { ownEl: sk.ownElement, skill: sk.id });
      if (sk.drain) healUnit(b, ev, u, Math.round((dealt * sk.drain) / 100));
      if (sk.effect?.kind === 'stun' && !t.dead) (t.st.stun = sk.effect.turns), ev.push({ k: 'buff', uid: t.uid, text: '💫 기절' });
    }
  } else if (sk.kind === 'heal') {
    for (const t of hits.filter((x) => x.side === u.side)) {
      healUnit(b, ev, t, Math.round(unitStats(u).atk * sk.power + unitStats(t).hp * 0.1));
      gainXp(b, ev, u, supportXp(b, u, 12));
    }
  } else {
    const targets = sk.kind === 'buff' ? hits.filter((x) => x.side === u.side) : main ? [main] : [];
    if (sk.effect?.kind === 'taunt') {
      u.st.taunt = 1;
      u.st.guard = 1;
      ev.push({ k: 'buff', uid: u.uid, text: '📢 도발 · 방어 +30%' });
    }
    for (const t of sk.effect?.kind === 'taunt' ? [] : targets) {
      if (sk.effect?.kind === 'atkUp') (t.st.atkUp = { pct: sk.effect.pct ?? 20, turns: sk.effect.turns }), ev.push({ k: 'buff', uid: t.uid, text: `📯 공격 +${sk.effect.pct}%` });
      if (sk.effect?.kind === 'defDown') (t.st.defDown = { pct: sk.effect.pct ?? 20, turns: sk.effect.turns }), ev.push({ k: 'buff', uid: t.uid, text: `🌫️ 방어 -${sk.effect.pct}%` });
    }
    gainXp(b, ev, u, supportXp(b, u, 8));
    say(b, `${nameOf(u)} ${sk.name}!`);
  }
  finishAction(b, ev, u);
  return ev;
}
function healUnit(b: Battle, ev: Ev[], t: Unit, amount: number) {
  const max = unitStats(t).hp;
  const g = Math.min(max - t.hp, Math.max(0, amount));
  if (g <= 0) return;
  t.hp += g;
  ev.push({ k: 'heal', uid: t.uid, amount: g });
  say(b, `💚 ${nameOf(t)} +${g}`);
}

// ───────── 아이템 ─────────
/** 소모품: 자기 자신이나 바로 옆 아군 */
export function itemTargets(b: Battle, u: Unit): Unit[] {
  return alive(b, u.side).filter((t) => dist(t, u) <= 1);
}
export function useItem(b: Battle, u: Unit, itemId: string, t: Unit): Ev[] | string {
  if (b.result || u.side !== b.phase || u.acted) return '지금은 쓸 수 없어요';
  const it = ITEMS[itemId];
  if (!it?.use || (b.bag[itemId] ?? 0) <= 0) return '그 아이템이 없어요';
  if (!itemTargets(b, u).includes(t)) return '자기나 바로 옆 아군에게만 쓸 수 있어요';
  const ev: Ev[] = [];
  b.bag[itemId]--;
  if (it.use.heal) healUnit(b, ev, t, Math.round((unitStats(t).hp * it.use.heal) / 100));
  if (it.use.sp) {
    const g = Math.min(unitStats(t).spMax - t.sp, it.use.sp);
    t.sp += g;
    ev.push({ k: 'heal', uid: t.uid, amount: g, sp: true });
  }
  say(b, `${it.icon} ${nameOf(u)} → ${nameOf(t)} ${it.name}`);
  finishAction(b, ev, u);
  return ev;
}
export function waitUnit(b: Battle, u: Unit): Ev[] | string {
  if (b.result || u.side !== b.phase || u.acted) return '이미 행동했어요';
  const ev: Ev[] = [];
  finishAction(b, ev, u);
  return ev;
}

// ───────── 경험치·레벨 ─────────
/** 치료·강화 경험치: 적 평균 레벨보다 높을수록 줄어든다 (힐러만 혼자 레벨이 치솟지 않게) */
function supportXp(b: Battle, u: Unit, base: number) {
  const foes = b.units.filter((x) => x.side !== u.side);
  const avg = foes.reduce((a, x) => a + x.lv, 0) / Math.max(1, foes.length);
  return Math.max(1, base - 3 * Math.max(0, u.lv - avg));
}
function gainXp(b: Battle, ev: Ev[], u: Unit, amount: number) {
  if (u.side !== 'ally' || u.dead) return;
  u.xp += Math.max(1, Math.round(amount));
  u.gain = (u.gain ?? 0) + Math.max(1, Math.round(amount));
  while (u.xp >= BAL.xpLevel) {
    u.xp -= BAL.xpLevel;
    const before = unitStats(u).hp;
    u.lv++;
    u.hp += unitStats(u).hp - before;
    ev.push({ k: 'lvup', uid: u.uid, lv: u.lv });
    say(b, `⬆ ${nameOf(u)} ${u.lv}레벨!`);
  }
}

// ───────── 차례 ─────────
function finishAction(b: Battle, ev: Ev[], u: Unit) {
  u.acted = true;
  u.moved = true;
  checkEnd(b, ev);
}
export function checkEnd(b: Battle, ev: Ev[] = []) {
  if (b.result) return;
  const st = stageOf(b);
  const lost = alive(b, 'ally').length === 0 || b.units.some((u) => u.side === 'ally' && u.dead && u.leader);
  const won = st.win === 'boss' ? b.units.some((u) => u.boss && u.dead) : alive(b, 'enemy').length === 0;
  if (lost) b.result = 'lose';
  else if (won) b.result = 'win';
  if (b.result) ev.push({ k: 'msg', text: b.result === 'win' ? '🏆 승리!' : '패배…' });
}
/** 아군 차례 끝 → 적 차례 시작 */
export function endAllyPhase(b: Battle): Ev[] {
  const ev: Ev[] = [];
  if (b.result || b.phase !== 'ally') return ev;
  b.phase = 'enemy';
  startPhase(b, ev, 'enemy');
  return ev;
}
/** 적 차례 끝 → 다음 턴 아군 차례 */
export function endEnemyPhase(b: Battle): Ev[] {
  const ev: Ev[] = [];
  if (b.result) return ev;
  b.turn++;
  if (b.turn > stageOf(b).turns) {
    b.result = 'lose';
    ev.push({ k: 'msg', text: '제한 턴이 지났어요… 패배' });
    return ev;
  }
  b.phase = 'ally';
  startPhase(b, ev, 'ally');
  return ev;
}
function startPhase(b: Battle, ev: Ev[], side: Side) {
  for (const u of alive(b, side)) {
    u.moved = false;
    u.acted = false;
    u.from = undefined;
    u.sp = Math.min(unitStats(u).spMax, u.sp + BAL.spTurn);
    const t = terrainAt(stageOf(b), u.c, u.r);
    const heal = t ? TERRAIN[t].heal : 0;
    if (heal) healUnit(b, ev, u, Math.round((unitStats(u).hp * heal) / 100));
    // 상태: 이쪽 차례가 시작될 때 1턴씩 줄어든다
    if (u.st.atkUp && --u.st.atkUp.turns <= 0) delete u.st.atkUp;
    if (u.st.defDown && --u.st.defDown.turns <= 0) delete u.st.defDown;
    if (u.st.taunt && --u.st.taunt <= 0) delete u.st.taunt;
    if (u.st.guard && --u.st.guard <= 0) delete u.st.guard;
    if (u.st.stun) {
      u.st.stun--;
      if (u.st.stun <= 0) delete u.st.stun;
      u.acted = true; // 기절: 이번 차례 행동 못 함
      u.moved = true;
      ev.push({ k: 'buff', uid: u.uid, text: '💫 기절 — 쉰다' });
    }
  }
}

// ───────── 전투 끝 → 캠페인에 반영 ─────────
export interface BattleReward {
  win: boolean;
  first: boolean;
  gold: number;
  items: string[];
  joins: string[];
  levels: { id: string; from: number; to: number }[];
}
export function finishBattle(cp: Campaign, b: Battle): BattleReward {
  const st = stageOf(b);
  const win = b.result === 'win';
  const first = win && !cp.cleared.includes(st.n);
  const levels: BattleReward['levels'] = [];
  for (const u of b.units.filter((x) => x.side === 'ally')) {
    const ro = cp.roster[u.def];
    if (u.lv > ro.lv) levels.push({ id: u.def, from: ro.lv, to: u.lv });
    ro.lv = u.lv;
    ro.xp = u.xp;
  }
  // 출전 못 한 스피릿도 출전한 스피릿 평균 경험치의 일부를 받는다 (D119)
  const fought = b.units.filter((x) => x.side === 'ally');
  const avgGain = fought.reduce((a, x) => a + (x.gain ?? 0), 0) / Math.max(1, fought.length);
  for (const id of cp.joined) {
    if (fought.some((x) => x.def === id)) continue;
    const ro = cp.roster[id];
    const from = ro.lv;
    addXp(ro, Math.round(avgGain * BAL.benchXp));
    if (ro.lv > from) levels.push({ id, from, to: ro.lv });
  }
  // 쓴 소모품 반영
  for (const [id, n] of Object.entries(b.bag)) if (ITEMS[id]?.use) cp.bag[id] = n;
  const gold = win ? (first ? st.gold : Math.round(st.gold * 0.4)) : Math.round(st.gold * 0.1);
  cp.gold += gold;
  const items = first ? [...st.items] : [];
  for (const id of items) cp.bag[id] = (cp.bag[id] ?? 0) + 1;
  const joins: string[] = [];
  if (first) {
    cp.cleared.push(st.n);
    const avg = joinLevel(cp);
    const joinIds = [...st.joins, ...(st.n === 98 ? [otherHero(cp)] : [])];
    for (const id of joinIds)
      if (!cp.roster[id]) {
        cp.roster[id] = { lv: avg, xp: 0, equip: {} };
        cp.joined.push(id);
        joins.push(id);
      }
  }
  return { win, first, gold, items, joins, levels };
}

/** 경험치를 더하고 100마다 레벨업 (캠페인 쪽) */
export function addXp(ro: RosterEntry, amount: number) {
  ro.xp += Math.max(0, amount);
  while (ro.xp >= BAL.xpLevel) {
    ro.xp -= BAL.xpLevel;
    ro.lv++;
  }
}
/** 새로 합류하는 스피릿의 레벨: 가장 높은 6명 평균 - 1 */
export function joinLevel(cp: Campaign): number {
  const lvs = cp.joined.map((id) => cp.roster[id].lv).sort((a, b) => b - a).slice(0, 6);
  return Math.max(1, Math.round(lvs.reduce((a, x) => a + x, 0) / Math.max(1, lvs.length)) - 1);
}
/** 성장의 결정: 스피릿 하나에게 경험치 +100 */
export function useCrystal(cp: Campaign, id: string): string | null {
  if ((cp.bag.crystal ?? 0) <= 0) return '성장의 결정이 없어요 (상점·보상)';
  if (!cp.roster[id]) return '없는 스피릿이에요';
  cp.bag.crystal--;
  addXp(cp.roster[id], 100);
  return null;
}

// ───────── 부대·장비·상점 ─────────
export function canEquip(id: string, itemId: string): boolean {
  const it = ITEMS[itemId];
  if (!it?.slot) return false;
  return !it.roles || it.roles.includes(defOf(id).role);
}
export function equipItem(cp: Campaign, id: string, itemId: string): string | null {
  const it = ITEMS[itemId];
  if (!it?.slot || (cp.bag[itemId] ?? 0) <= 0) return '가방에 없어요';
  if (!canEquip(id, itemId)) return `${it.name}은 이 역할이 낄 수 없어요`;
  const ro = cp.roster[id];
  const old = ro.equip[it.slot];
  if (old) cp.bag[old] = (cp.bag[old] ?? 0) + 1;
  ro.equip[it.slot] = itemId;
  cp.bag[itemId]--;
  return null;
}
export function unequipItem(cp: Campaign, id: string, slot: ItemSlot) {
  const ro = cp.roster[id];
  const old = ro.equip[slot];
  if (!old) return;
  cp.bag[old] = (cp.bag[old] ?? 0) + 1;
  delete ro.equip[slot];
}
/** 상점에 나오는 물건 (진행할수록 늘어남) */
export function shopStock(cp: Campaign): string[] {
  const limit = 160 + cp.cleared.length * 130;
  return Object.values(ITEMS)
    .filter((it) => it.price <= limit)
    .map((it) => it.id);
}
export function buyItem(cp: Campaign, itemId: string): string | null {
  const it = ITEMS[itemId];
  if (!shopStock(cp).includes(itemId)) return '아직 팔지 않아요';
  if (cp.gold < it.price) return '골드가 모자라요';
  cp.gold -= it.price;
  cp.bag[itemId] = (cp.bag[itemId] ?? 0) + 1;
  return null;
}
export function sellItem(cp: Campaign, itemId: string): number {
  if ((cp.bag[itemId] ?? 0) <= 0) return 0;
  cp.bag[itemId]--;
  const g = Math.floor(ITEMS[itemId].price / 2);
  cp.gold += g;
  return g;
}
/** 유닛 하나의 능력치 (캠페인 화면용) */
export function rosterStats(cp: Campaign, id: string) {
  const ro = cp.roster[id];
  const u: Unit = { uid: -1, def: id, side: 'ally', lv: ro.lv, xp: ro.xp, c: 0, r: 0, hp: 0, sp: 0, dead: false, moved: false, acted: false, leader: id === cp.hero, equip: Object.values(ro.equip).filter(Boolean) as string[], st: {} };
  return { u, s: unitStats(u), skills: skillsOf(u) };
}
/** 장비 점수 (자동 장착용) */
export const itemScore = (itemId: string) => {
  const s = ITEMS[itemId]?.stats ?? {};
  return (s.atk ?? 0) * 2 + (s.def ?? 0) * 1.5 + (s.res ?? 0) * 1.5 + (s.hp ?? 0) * 0.4 + (s.move ?? 0) * 6 + (s.sp ?? 0) * 0.5;
};
/** 모두에게 가장 좋은 장비 자동으로 */
export function autoEquip(cp: Campaign, ids: string[] = cp.joined): number {
  let n = 0;
  for (const slot of ['weapon', 'armor', 'charm'] as ItemSlot[])
    for (const id of ids) {
      const cur = cp.roster[id].equip[slot];
      const best = Object.keys(cp.bag)
        .filter((it) => (cp.bag[it] ?? 0) > 0 && ITEMS[it].slot === slot && canEquip(id, it))
        .sort((a, b) => itemScore(b) - itemScore(a))[0];
      if (best && itemScore(best) > (cur ? itemScore(cur) : 0)) {
        equipItem(cp, id, best);
        n++;
      }
    }
  return n;
}
