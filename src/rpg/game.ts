// HEXA FRONTIER RPG (D72) 게임 규칙. 한 번 움직이거나 기술을 쓰면 한 턴, 그 뒤 몬스터들이 움직인다.
// 모든 함수는 state를 직접 바꾸고, 화면 연출용 이벤트를 돌려준다.
import { createRng, hashSeed } from '../core/rng';
import { fixJosa } from '../core/text';
import {
  BAL,
  beatenBy,
  EL_ICON,
  EL_NAME,
  ELEMENTS,
  HEROES,
  MONSTERS,
  RARITY_NAME,
  SKILLS,
  SPIRIT_BONUS_PER_LV,
  SPIRIT_GUARD_PER_LV,
  SPIRITS,
  typeMul,
  type Element,
  type Item,
  type Rarity,
  type SkillDef,
  type Slot,
} from './data';
import { BOSS_ROWS, cellAt, dist, isFloor, key, neighbors, spawnPlan, step, WORLD, ZONES, zoneOf, type Dir } from './world';

export const RPG_VERSION = 1;

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
  dead: boolean;
  deadAt: number;
  aggro: boolean;
  stun: number;
  slow: number;
  poison: number;
}

export interface HeroState {
  unlocked: boolean;
  level: number;
  xp: number;
  hp: number;
  gear: Partial<Record<Slot, Item>>;
}

export interface RpgState {
  version: number;
  turn: number;
  heroId: string;
  heroes: Record<string, HeroState>;
  pos: { c: number; r: number };
  camp: { c: number; r: number };
  monsters: Mon[];
  bossesDown: string[];
  spirits: Partial<Record<Element, number>>; // 얻은 스피릿 → 레벨
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
  tips: string[]; // 본 안내
  log: string[];
}

export type Fx =
  | { k: 'dmg'; c: number; r: number; amount: number; eff: 'strong' | 'weak' | null; blocked: boolean; crit: boolean; onHero?: boolean }
  | { k: 'heal'; c: number; r: number; amount: number }
  | { k: 'kill'; c: number; r: number; name: string }
  | { k: 'skill'; c: number; r: number; skill: string; cells: { c: number; r: number }[] }
  | { k: 'levelup'; hero: string; level: number }
  | { k: 'drop'; item: Item }
  | { k: 'spirit'; element: Element }
  | { k: 'point' }
  | { k: 'camp' }
  | { k: 'death' }
  | { k: 'boss'; name: string }
  | { k: 'unlock'; hero: string }
  | { k: 'msg'; text: string };

export function newRpg(): RpgState {
  const s: RpgState = {
    version: RPG_VERSION,
    turn: 0,
    heroId: 'knight',
    heroes: Object.fromEntries(Object.keys(HEROES).map((id) => [id, { unlocked: id !== 'archer', level: 1, xp: 0, hp: 0, gear: {} }])),
    pos: { ...WORLD.start },
    camp: { ...WORLD.start },
    monsters: spawnPlan().map((p, i) => ({
      id: i,
      def: p.id,
      level: p.level,
      c: p.c,
      r: p.r,
      hp: 0,
      home: { c: p.c, r: p.r },
      pack: p.pack,
      boss: p.boss,
      dead: false,
      deadAt: 0,
      aggro: false,
      stun: 0,
      slow: 0,
      poison: 0,
    })),
    bossesDown: [],
    spirits: {},
    spiritXp: 0,
    spiritPoints: 0,
    spiritEarned: 0,
    bag: [],
    gold: 0,
    cds: {},
    opened: [],
    seen: [],
    itemCounter: 0,
    kills: 0,
    deaths: 0,
    tips: [],
    log: [],
  };
  for (const m of s.monsters) m.hp = monStats(m).hp;
  for (const id of Object.keys(s.heroes)) s.heroes[id].hp = heroStats(s, id).hp;
  reveal(s);
  return s;
}

// ───────── 능력치 ─────────

export function heroStats(s: RpgState, id = s.heroId) {
  const d = HEROES[id];
  const h = s.heroes[id];
  const g = 1 + BAL.heroGrowth * (h.level - 1);
  const gear = Object.values(h.gear).filter((x): x is Item => !!x);
  const sumG = (k: 'atk' | 'def' | 'res' | 'hp') => gear.reduce((a, it) => a + it[k], 0);
  return {
    hp: Math.round(d.base.hp * g + sumG('hp')),
    atk: d.base.atk * g + sumG('atk'),
    def: d.base.def * g + sumG('def'),
    res: d.base.res * g + sumG('res'),
  };
}

export function monStats(m: Mon) {
  const d = MONSTERS[m.def];
  const g = 1 + BAL.monGrowth * (m.level - 1);
  return { hp: Math.round(d.hp * g), atk: d.atk * g, def: d.def * g, res: d.res * g };
}

export const xpToNext = (lv: number) => Math.round(BAL.xpBase * Math.pow(lv, BAL.xpPow));
export const spiritNeed = (earned: number) => BAL.spiritPointEvery + earned * 25;

/** 스피릿 보너스: 몬스터 속성을 이기는 스피릿의 레벨만큼 */
export function spiritBonus(s: RpgState, monEl: Element) {
  const lv = s.spirits[beatenBy(monEl)] ?? 0;
  return { atk: 1 + lv * SPIRIT_BONUS_PER_LV, guard: Math.max(0.4, 1 - lv * SPIRIT_GUARD_PER_LV), lv, element: beatenBy(monEl) };
}

/** 영웅 → 몬스터 예상 피해 (난수·급소 제외) */
export function estimateHit(s: RpgState, sk: SkillDef, m: Mon) {
  const hs = heroStats(s);
  const ms = monStats(m);
  const md = MONSTERS[m.def];
  const guard = sk.dmg === 'phys' ? ms.def : ms.res;
  const k = BAL.defK / (BAL.defK + guard);
  const t = typeMul(sk.element, md.element);
  const sp = spiritBonus(s, md.element).atk;
  const gear = Object.values(s.heroes[s.heroId].gear).reduce((a, it) => a * (it?.vs && it.vs.element === md.element ? 1 + it.vs.pct / 100 : 1), 1);
  return { dmg: hs.atk * sk.coef * k * t * sp * gear * BAL.heroDmg, type: t, blocked: k < 0.62 };
}

// ───────── 보이는 곳 ─────────

function reveal(s: RpgState) {
  const set = new Set(s.seen);
  for (let dr = -4; dr <= 4; dr++)
    for (let dc = -4; dc <= 4; dc++) {
      const c = s.pos.c + dc;
      const r = s.pos.r + dr;
      if (cellAt(c, r) && dist(s.pos, { c, r }) <= 4) set.add(key(c, r));
    }
  s.seen = [...set];
}

export const monAt = (s: RpgState, c: number, r: number) => s.monsters.find((m) => !m.dead && m.c === c && m.r === r);

function msg(s: RpgState, fx: Fx[], text: string) {
  const t = fixJosa(text);
  s.log.unshift(t);
  s.log = s.log.slice(0, 40);
  fx.push({ k: 'msg', text: t });
}

// ───────── 행동 ─────────

/** 방향키: 빈 칸이면 이동, 몬스터가 있으면 기본 공격 */
export function move(s: RpgState, d: Dir): Fx[] {
  const fx: Fx[] = [];
  const to = step(s.pos.c, s.pos.r, d);
  const m = monAt(s, to.c, to.r);
  if (m) {
    hit(s, fx, SKILLS[HEROES[s.heroId].skills[0]], m);
    endTurn(s, fx);
    return fx;
  }
  if (!isFloor(to.c, to.r)) return fx;
  s.pos = to;
  reveal(s);
  const cell = cellAt(to.c, to.r)!;
  const f = cell.feature;
  if (f?.kind === 'camp') {
    s.camp = { ...to };
    for (const id of Object.keys(s.heroes)) s.heroes[id].hp = heroStats(s, id).hp;
    s.cds = {};
    fx.push({ k: 'camp' });
    msg(s, fx, '🏕 야영지: 체력이 모두 회복됐다. 여기서 캐릭터를 바꿀 수 있다.');
  } else if (f?.kind === 'shrine' && !s.opened.includes(key(to.c, to.r))) {
    s.opened.push(key(to.c, to.r));
    s.spirits[f.element] = Math.max(1, s.spirits[f.element] ?? 0);
    fx.push({ k: 'spirit', element: f.element });
    msg(s, fx, `${EL_ICON[f.element]} ${SPIRITS[f.element].name}(${EL_NAME[f.element]} 스피릿)이(가) 동료가 되었다!`);
  } else if (f?.kind === 'chest' && !s.opened.includes(key(to.c, to.r))) {
    s.opened.push(key(to.c, to.r));
    const z = ZONES[zoneOf(to.r)];
    const it = makeItem(s, z.maxLv, 'rare');
    s.bag.push(it);
    fx.push({ k: 'drop', item: it });
    msg(s, fx, `보물 상자: ${it.name}!`);
  }
  endTurn(s, fx);
  return fx;
}

/** 기술 사용 (0 = 기본 공격, 1·2 = 기술). 사거리 안 가장 가까운 적을 노린다 */
export function useSkill(s: RpgState, i: number): Fx[] {
  const fx: Fx[] = [];
  const sk = SKILLS[HEROES[s.heroId].skills[i]];
  if ((s.cds[sk.id] ?? 0) > 0) return [{ k: 'msg', text: `${sk.name}: ${s.cds[sk.id]}턴 뒤에 쓸 수 있어요` }];
  if (sk.shape === 'around') {
    const targets = s.monsters.filter((m) => !m.dead && dist(m, s.pos) === 1);
    if (!targets.length) return [{ k: 'msg', text: '주변에 적이 없어요' }];
    fx.push({ k: 'skill', c: s.pos.c, r: s.pos.r, skill: sk.id, cells: neighbors(s.pos.c, s.pos.r) });
    for (const m of targets) hit(s, fx, sk, m);
  } else {
    const target = nearestTarget(s, sk.range);
    if (!target) return [{ k: 'msg', text: `사거리(${sk.range}칸) 안에 적이 없어요` }];
    const cells = sk.shape === 'splash' ? [{ c: target.c, r: target.r }, ...neighbors(target.c, target.r)] : [{ c: target.c, r: target.r }];
    fx.push({ k: 'skill', c: target.c, r: target.r, skill: sk.id, cells });
    hit(s, fx, sk, target);
    if (sk.shape === 'splash') for (const m of s.monsters.filter((x) => !x.dead && x !== target && dist(x, target) === 1)) hit(s, fx, sk, m, 0.5);
  }
  if (sk.cd) s.cds[sk.id] = sk.cd + 1; // 이번 턴 끝에 1 줄어든다
  endTurn(s, fx);
  return fx;
}

export function nearestTarget(s: RpgState, range: number): Mon | undefined {
  return s.monsters
    .filter((m) => !m.dead && dist(m, s.pos) <= range)
    .sort((a, b) => dist(a, s.pos) - dist(b, s.pos) || a.hp - b.hp)[0];
}

/** 제자리에서 한 턴 쉬기 */
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
  const crit = rand(s, m.id * 7 + 1) < 0.08;
  const amount = Math.max(1, Math.round(est.dmg * mul * (crit ? 1.5 : 1) * (0.9 + rand(s, m.id * 7 + 2) * 0.2)));
  m.hp -= amount;
  fx.push({ k: 'dmg', c: m.c, r: m.r, amount, eff: est.type > 1 ? 'strong' : est.type < 1 ? 'weak' : null, blocked: est.blocked, crit });
  // 맞으면 무리 전체가 깨어난다
  for (const x of s.monsters) if (x.pack === m.pack) x.aggro = true;
  if (sk.effect && m.hp > 0) {
    if (sk.effect.kind === 'stun') m.stun = sk.effect.turns;
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
  const xp = Math.round(d.xp * g);
  const gold = Math.round(d.gold * g);
  s.gold += gold;
  gainXp(s, fx, xp);
  // 스피릿 경험치 (얻은 스피릿이 있을 때만)
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
    s.bossesDown.push(m.def);
    fx.push({ k: 'boss', name: d.name });
    msg(s, fx, `👑 ${d.name}을(를) 쓰러뜨렸다! 위쪽 길이 열렸다.`);
    if (m.def === 'golem' && !s.heroes.archer.unlocked) {
      s.heroes.archer.unlocked = true;
      s.heroes.archer.level = Math.max(1, topLevel(s) - 2);
      s.heroes.archer.hp = heroStats(s, 'archer').hp;
      fx.push({ k: 'unlock', hero: 'archer' });
      msg(s, fx, '🏹 궁수 카이가 합류했다! 야영지에서 바꿀 수 있다.');
    }
  }
  // 장비 드롭
  const chance = m.boss ? 1 : BAL.dropChance;
  if (rand(s, m.id * 7 + 3) < chance) {
    const it = makeItem(s, m.level, m.boss ? (rand(s, 99) < 0.4 ? 'epic' : 'rare') : undefined);
    s.bag.push(it);
    fx.push({ k: 'drop', item: it });
  }
}

export const topLevel = (s: RpgState) => Math.max(...Object.values(s.heroes).filter((h) => h.unlocked).map((h) => h.level));

function gainXp(s: RpgState, fx: Fx[], xp: number) {
  // 쉬고 있는 동료(합류한 캐릭터)도 절반을 받는다
  for (const [id, o] of Object.entries(s.heroes)) {
    if (id === s.heroId || !o.unlocked) continue;
    o.xp += Math.round(xp * BAL.benchXp);
    while (o.xp >= xpToNext(o.level)) (o.xp -= xpToNext(o.level)), o.level++;
  }
  const h = s.heroes[s.heroId];
  h.xp += xp;
  while (h.xp >= xpToNext(h.level)) {
    h.xp -= xpToNext(h.level);
    h.level++;
    h.hp = heroStats(s).hp;
    fx.push({ k: 'levelup', hero: s.heroId, level: h.level });
  }
}

/** 턴 끝: 몬스터 행동, 독, 쿨타임, 회복, 리스폰 */
function endTurn(s: RpgState, fx: Fx[]) {
  s.turn++;
  const h = s.heroes[s.heroId];
  const hs = heroStats(s);
  for (const m of s.monsters) {
    if (m.dead) continue;
    if (m.poison > 0) {
      m.poison--;
      const p = Math.max(1, Math.round(monStats(m).hp * 0.07));
      m.hp -= p;
      fx.push({ k: 'dmg', c: m.c, r: m.r, amount: p, eff: null, blocked: false, crit: false });
      if (m.hp <= 0) {
        kill(s, fx, m);
        continue;
      }
    }
    monsterAct(s, fx, m);
    if (h.hp <= 0) break;
  }
  for (const k of Object.keys(s.cds)) s.cds[k] = Math.max(0, s.cds[k] - 1);
  if (h.hp <= 0) return die(s, fx);
  // 근처에 적이 없으면 조금씩 회복
  if (!s.monsters.some((m) => !m.dead && dist(m, s.pos) <= 2) && h.hp < hs.hp) {
    const g = Math.min(hs.hp - h.hp, Math.max(1, Math.round(hs.hp * BAL.regenPct)));
    h.hp += g;
  }
  // 리스폰 (보스 제외, 멀리 있을 때)
  for (const m of s.monsters)
    if (m.dead && !m.boss && s.turn - m.deadAt >= BAL.respawnTurns && dist(m.home, s.pos) > 5 && !monAt(s, m.home.c, m.home.r)) {
      Object.assign(m, { dead: false, c: m.home.c, r: m.home.r, hp: monStats(m).hp, aggro: false, stun: 0, slow: 0, poison: 0 });
    }
}

function monsterAct(s: RpgState, fx: Fx[], m: Mon) {
  const d = MONSTERS[m.def];
  if (m.stun > 0) return void m.stun--;
  if (m.slow > 0) {
    m.slow--;
    if (m.slow % 2 === 1) return;
  }
  const dd = dist(m, s.pos);
  if (dd <= (m.boss ? 2 : BAL.aggro)) m.aggro = true;
  if (m.aggro) for (const x of s.monsters) if (x.pack === m.pack && !x.dead) x.aggro = true;
  if (dd <= d.range) return monAttack(s, fx, m);
  if (!m.aggro) {
    // 어슬렁거리기
    if (!m.boss && rand(s, m.id * 13) < 0.25) {
      const opts = neighbors(m.c, m.r).filter((n) => isFloor(n.c, n.r) && !monAt(s, n.c, n.r) && !(n.c === s.pos.c && n.r === s.pos.r) && dist(n, m.home) <= 2 && !cellAt(n.c, n.r)?.feature);
      const n = opts[Math.floor(rand(s, m.id * 13 + 1) * opts.length)];
      if (n) (m.c = n.c), (m.r = n.r);
    }
    return;
  }
  const moves = m.def === 'wolf' && rand(s, m.id * 17) < 0.35 ? 2 : 1;
  for (let k = 0; k < moves; k++) {
    // 보스는 자기 자리에서 2칸까지만 쫓아온다
    const opts = neighbors(m.c, m.r).filter((n) => isFloor(n.c, n.r) && !monAt(s, n.c, n.r) && !(n.c === s.pos.c && n.r === s.pos.r) && cellAt(n.c, n.r)?.feature?.kind !== 'camp' && (!m.boss || dist(n, m.home) <= 2));
    const best = opts.sort((a, b) => dist(a, s.pos) - dist(b, s.pos))[0];
    if (!best || dist(best, s.pos) >= dist(m, s.pos)) break;
    m.c = best.c;
    m.r = best.r;
    if (dist(m, s.pos) <= d.range) {
      if (k === 0 && moves === 1) break;
      return monAttack(s, fx, m);
    }
  }
}

function monAttack(s: RpgState, fx: Fx[], m: Mon) {
  const d = MONSTERS[m.def];
  const ms = monStats(m);
  const hs = heroStats(s);
  const guard = d.dmg === 'phys' ? hs.def : hs.res;
  const sp = spiritBonus(s, d.element).guard;
  const amount = Math.max(1, Math.round(ms.atk * (BAL.defK / (BAL.defK + guard)) * sp * (0.85 + rand(s, m.id * 19) * 0.3) * BAL.monDmg));
  const h = s.heroes[s.heroId];
  h.hp = Math.max(0, h.hp - amount);
  fx.push({ k: 'dmg', c: s.pos.c, r: s.pos.r, amount, eff: null, blocked: false, crit: false, onHero: true });
}

function die(s: RpgState, fx: Fx[]) {
  s.deaths++;
  const lost = Math.floor(s.gold * BAL.deathGoldLoss);
  s.gold -= lost;
  s.pos = { ...s.camp };
  s.heroes[s.heroId].hp = heroStats(s).hp;
  s.cds = {};
  for (const m of s.monsters) if (!m.dead) Object.assign(m, { c: m.home.c, r: m.home.r, hp: monStats(m).hp, aggro: false, stun: 0, slow: 0, poison: 0 });
  fx.push({ k: 'death' });
  msg(s, fx, `쓰러졌다… 마지막 야영지에서 다시 일어났다. (골드 -${lost})`);
  reveal(s);
}

// ───────── 캐릭터·장비·스피릿 ─────────

export function onCamp(s: RpgState) {
  return cellAt(s.pos.c, s.pos.r)?.feature?.kind === 'camp';
}

export function switchHero(s: RpgState, id: string): string | null {
  if (!s.heroes[id]?.unlocked) return '아직 합류하지 않은 캐릭터예요';
  if (!onCamp(s)) return '캐릭터는 🏕야영지에서만 바꿀 수 있어요';
  s.heroId = id;
  s.heroes[id].hp = heroStats(s, id).hp;
  s.cds = {};
  return null;
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
  return null;
}

export function sellItem(s: RpgState, uid: string): number {
  const i = s.bag.findIndex((x) => x.uid === uid);
  if (i < 0) return 0;
  const it = s.bag[i];
  const price = Math.round((5 + it.level * 3) * { common: 1, rare: 2.5, epic: 6 }[it.rarity]);
  s.bag.splice(i, 1);
  s.gold += price;
  return price;
}

/** 장비 점수 (비교용) */
export function itemScore(it: Item | undefined): number {
  if (!it) return 0;
  return it.atk * 3 + it.def * 1.5 + it.res * 1.5 + it.hp * 0.3 + (it.vs ? it.vs.pct * 0.6 : 0);
}

export function spendSpiritPoint(s: RpgState, el: Element): string | null {
  if (s.spiritPoints <= 0) return '스피릿 포인트가 없어요';
  if (!s.spirits[el]) return '아직 얻지 못한 스피릿이에요';
  s.spiritPoints--;
  s.spirits[el] = (s.spirits[el] ?? 0) + 1;
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

export const rarityName = (r: Rarity) => RARITY_NAME[r];

/** 지금 구역 정보 */
export function currentZone(s: RpgState) {
  const z = zoneOf(s.pos.r);
  return { index: z, ...ZONES[z], bossDown: s.bossesDown.includes(ZONES[z].boss), bossRow: BOSS_ROWS[z] };
}
