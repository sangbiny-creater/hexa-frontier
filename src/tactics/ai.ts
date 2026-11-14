// 헥사 전술 전투 (D109) 인공지능: 적 차례에 적이 움직이고, 시험용으로 아군도 같은 방식으로 둘 수 있다.
// 갈 수 있는 칸마다 할 수 있는 행동(공격·기술·치료)에 점수를 매겨 가장 좋은 것을 고른다.
// 할 게 없으면 지형을 따라 가장 가까운 상대 쪽으로 다가간다.
import { TERRAIN } from './data';
import {
  alive,
  attack,
  attackTargets,
  defOf,
  dist,
  forecast,
  itemTargets,
  key,
  moveRange,
  moveUnit,
  neighbors,
  skillsOf,
  skillTargets,
  stageOf,
  stepCost,
  unitAt,
  unitStats,
  useItem,
  useSkill,
  waitUnit,
  type Battle,
  type Ev,
  type Pos,
  type Unit,
} from './engine';
import { terrainAt } from './stages';

export type Act = { k: 'attack'; t: Unit } | { k: 'skill'; skill: string; at: Pos } | { k: 'item'; item: string; t: Unit } | { k: 'wait' };
export interface Plan {
  move: Pos | null;
  act: Act;
  score: number;
}

/** 이 칸에 섰을 때 다음 상대 차례에 받을 수 있는 피해 합 (대략) */
function threat(u: Unit, at: Pos, foes: Unit[]): number {
  let sum = 0;
  for (const f of foes) {
    const fs = unitStats(f);
    if (f.ai === 'guard' && dist(f, at) > fs.range[1]) continue;
    if (dist(f, at) > fs.move + fs.range[1]) continue;
    const ds = unitStats(u);
    const guard = fs.dmg === 'phys' ? ds.def : ds.res;
    sum += fs.atk * (30 / (30 + guard));
  }
  return sum;
}

/** 상대(들)까지 지형을 따라 가는 거리 (유닛은 무시) */
function distField(b: Battle, u: Unit, goals: Pos[]): Map<string, number> {
  const d = new Map<string, number>();
  const q: Pos[] = [];
  for (const g of goals) {
    d.set(key(g.c, g.r), 0);
    q.push(g);
  }
  while (q.length) {
    q.sort((a, c) => d.get(key(a.c, a.r))! - d.get(key(c.c, c.r))!);
    const p = q.shift()!;
    const base = d.get(key(p.c, p.r))!;
    for (const n of neighbors(p.c, p.r)) {
      const cost = stepCost(b, u, n.c, n.r);
      if (cost >= 99) continue;
      const v = base + cost;
      if (v < (d.get(key(n.c, n.r)) ?? Infinity)) {
        d.set(key(n.c, n.r), v);
        q.push(n);
      }
    }
  }
  return d;
}

export function planAction(b: Battle, u: Unit): Plan {
  const foes = alive(b).filter((x) => x.side !== u.side);
  const friends = alive(b, u.side);
  const s = unitStats(u);
  const wait: Plan = { move: null, act: { k: 'wait' }, score: 0 };
  if (!foes.length) return wait;
  // 'hold' 적은 누군가 가까이 오면 깨어난다
  if (u.ai === 'hold' && !b.awake.includes(u.uid)) {
    const reach = s.move + s.range[1] + 2;
    if (foes.some((f) => dist(f, u) <= reach) || u.hp < unitStats(u).hp) b.awake.push(u.uid);
    else return wait;
  }
  // 위험할 때 물약 (아군 자동만)
  if (u.side === 'ally' && u.hp < s.hp * 0.35) {
    const it = ['hipotion', 'potion'].find((id) => (b.bag[id] ?? 0) > 0);
    if (it) return { move: null, act: { k: 'item', item: it, t: u }, score: 2000 };
  }
  const range = u.ai === 'guard' ? new Map([[key(u.c, u.r), { c: u.c, r: u.r, left: 0, prev: null }]]) : moveRange(b, u);
  const taunter = foes.find((f) => f.st.taunt && dist(f, u) <= 2 + s.move);
  let best: Plan | null = null;
  const consider = (p: Plan) => {
    if (p.act.k !== 'wait') p.score += 200;
    if (!best || p.score > best.score) best = p;
  };
  const leader = !!defOf(u.def).leader;
  // 다가가기 점수: 힐러·서포터는 아군 쪽, 나머지는 상대 쪽 (지형을 따라 가는 거리)
  const support = ['healer', 'support'].includes(roleOf(u));
  const goals = support && friends.length > 1 ? friends.filter((x) => x !== u).map((x) => ({ c: x.c, r: x.r })) : foes.map((x) => ({ c: x.c, r: x.r }));
  const field = u.ai === 'guard' ? null : distField(b, u, goals);
  const pull = u.side === 'enemy' ? 2.5 : 1.4;
  for (const cell of range.values()) {
    const from = { c: cell.c, r: cell.r };
    const tt = terrainAt(stageOf(b), from.c, from.r);
    // 위험도: 이 칸에 서 있으면 다음 상대 차례에 받을 수 있는 피해
    const th = threat(u, from, foes);
    const safety = (tt ? TERRAIN[tt].guard * 0.15 + (TERRAIN[tt].heal ? 2 : 0) : 0) - th * (u.side === 'ally' ? 0.35 : 0.1) - (leader && th >= u.hp * 0.7 ? 300 : 0);
    const mv = from.c === u.c && from.r === u.r ? null : from;
    // 이 칸에서 아무것도 안 하고 기다리기 (다가가는 만큼 점수)
    const tooClose = s.range[0] >= 2 && foes.some((f) => dist(f, from) < 2) ? 15 : 0;
    const fd = field ? field.get(key(from.c, from.r)) ?? 50 : 0;
    consider({ move: mv, act: { k: 'wait' }, score: safety - fd * pull - tooClose });
    // 기본 공격
    for (const t of attackTargets(b, u, from)) {
      const f = forecast(b, u, t, undefined, from);
      let sc = f.dmg + (f.kills ? 40 + (t.boss ? 30 : 0) : 0) - f.counter * 0.7 + safety + (1 - t.hp / unitStats(t).hp) * 8 + (f.mul > 1 ? 4 : 0);
      if (taunter) sc += t === taunter ? 1000 : -500;
      consider({ move: mv, act: { k: 'attack', t }, score: sc });
    }
    // 기술
    for (const sk of skillsOf(u)) {
      if (u.sp < sk.sp) continue;
      for (const at of skillTargets(b, u, sk, from)) {
        let sc = -1;
        if (sk.kind === 'attack') {
          const cells = sk.area === 'target+adj' ? [at, ...neighbors(at.c, at.r)] : sk.area === 'self+adj' ? neighbors(from.c, from.r) : [at];
          const hit = cells.map((p) => unitAt(b, p.c, p.r)).filter((x): x is Unit => !!x && x.side !== u.side && x !== u);
          sc = 0;
          for (const t of hit) {
            const f = forecast(b, u, t, sk, from);
            sc += f.dmg + (f.kills ? 40 + (t.boss ? 30 : 0) : 0);
            if (sk.effect?.kind === 'stun' && !f.kills) sc += 12;
          }
          sc = sc * 1.05 - sk.sp * 0.4 + safety;
          if (taunter) sc += hit.includes(taunter) ? 1000 : -500;
        } else if (sk.kind === 'heal') {
          const cells = sk.area === 'allies2' ? friends.filter((x) => dist(x === u ? from : x, from) <= 2) : [unitAt(b, at.c, at.r)].filter((x): x is Unit => !!x);
          const need = cells.reduce((a, x) => a + Math.min(unitStats(x).hp - x.hp, unitStats(u).atk * sk.power + unitStats(x).hp * 0.1), 0);
          sc = need > 6 ? need * 1.2 - sk.sp * 0.5 + safety : -1;
        } else if (sk.effect?.kind === 'taunt') {
          const near = foes.filter((f) => dist(f, from) <= 3).length;
          sc = near >= 2 && u.hp > s.hp * 0.5 ? 14 + near * 4 + safety : -1;
        } else if (sk.kind === 'buff') {
          const ts = sk.area === 'allies2' ? friends.filter((x) => dist(x === u ? from : x, from) <= 2) : [unitAt(b, at.c, at.r)].filter((x): x is Unit => !!x);
          const busy = ts.filter((t) => !t.st.atkUp && foes.some((f) => dist(f, t) <= 4));
          sc = busy.length ? busy.reduce((a, t) => a + unitStats(t).atk * 0.6, 0) + safety : -1;
        } else if (sk.kind === 'debuff') {
          const t = unitAt(b, at.c, at.r);
          sc = t && !t.st.defDown ? 10 + (t.boss ? 12 : 0) + (unitStats(t).def + unitStats(t).res) * 0.4 + safety : -1;
        }
        if (sc > 0) consider({ move: mv, act: { k: 'skill', skill: sk.id, at }, score: sc });
      }
    }
  }
  // 행동에는 +200을 얹는다: 웬만하면 행동하고, 아주 위험할 때(지도자가 죽을 자리)만 물러나 기다린다
  return best ?? wait;
}
const roleOf = (u: Unit) => defOf(u.def).role;

/** 계획대로 움직이고 행동한다 */
export function runPlan(b: Battle, u: Unit, p: Plan): Ev[] {
  const ev: Ev[] = [];
  if (p.move) {
    const r = moveUnit(b, u, p.move.c, p.move.r);
    if (typeof r !== 'string') ev.push(...r);
  }
  let r: Ev[] | string;
  if (p.act.k === 'attack') r = attack(b, u, p.act.t);
  else if (p.act.k === 'skill') r = useSkill(b, u, p.act.skill, p.act.at);
  else if (p.act.k === 'item') r = itemTargets(b, u).includes(p.act.t) ? useItem(b, u, p.act.item, p.act.t) : waitUnit(b, u);
  else r = waitUnit(b, u);
  if (typeof r === 'string') r = waitUnit(b, u);
  if (typeof r !== 'string') ev.push(...r);
  return ev;
}

/** 이번 차례에서 아직 행동 안 한 다음 유닛 하나를 움직인다. 없으면 null */
export function stepSide(b: Battle, side: 'ally' | 'enemy'): { uid: number; ev: Ev[] } | null {
  if (b.result || b.phase !== side) return null;
  // 가까운 유닛부터
  const foes = alive(b).filter((x) => x.side !== side);
  const next = alive(b, side)
    .filter((u) => !u.acted)
    .sort((a, c) => Math.min(...foes.map((f) => dist(f, a))) - Math.min(...foes.map((f) => dist(f, c))))[0];
  if (!next) return null;
  return { uid: next.uid, ev: runPlan(b, next, planAction(b, next)) };
}

