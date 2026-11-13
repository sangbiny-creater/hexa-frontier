// 월드 지도 (D72): 세로로 긴 헥사 들판. 아래(row 0)에서 위로 올라간다. 4구역 × 16줄.
// 좌표는 odd-r 오프셋 (col, row). 화면에서는 row가 클수록 위.
import { createRng, hashSeed } from '../core/rng';
import type { Element } from './data';

export const COLS = 9;
export const ROWS = 64;
export const ZONE_ROWS = 16;

export type Feature = { kind: 'camp' } | { kind: 'shrine'; element: Element } | { kind: 'chest' } | { kind: 'boss'; monster: string };
export interface Cell {
  c: number;
  r: number;
  floor: boolean;
  feature?: Feature;
}

export interface Zone {
  name: string;
  monsters: string[];
  minLv: number;
  maxLv: number;
  boss: string;
  bossLv: number;
}
export const ZONES: Zone[] = [
  { name: '이끼 숲길', monsters: ['leafpup', 'leafpup', 'leafkit'], minLv: 1, maxLv: 5, boss: 'golem', bossLv: 7 },
  { name: '물안개 개울', monsters: ['tidekit', 'shell', 'bloom'], minLv: 6, maxLv: 11, boss: 'tidelord', bossLv: 13 },
  { name: '바위엄니 고개', monsters: ['boar', 'ember', 'boar'], minLv: 12, maxLv: 18, boss: 'terra', bossLv: 20 },
  { name: '폭풍 언덕', monsters: ['wolf', 'ember', 'shell', 'wolf'], minLv: 19, maxLv: 26, boss: 'storm', bossLv: 28 },
];

export const key = (c: number, r: number) => `${c},${r}`;
export const zoneOf = (r: number) => Math.min(ZONES.length - 1, Math.floor(r / ZONE_ROWS));

/** 이웃 6칸 (화면 기준 방향 이름 순서: 오른쪽, 왼쪽, 오른위, 왼위, 오른아래, 왼아래) */
export const DIRS = ['E', 'W', 'NE', 'NW', 'SE', 'SW'] as const;
export type Dir = (typeof DIRS)[number];
export function step(c: number, r: number, d: Dir): { c: number; r: number } {
  const odd = r & 1;
  switch (d) {
    case 'E':
      return { c: c + 1, r };
    case 'W':
      return { c: c - 1, r };
    case 'NE':
      return { c: odd ? c + 1 : c, r: r + 1 };
    case 'NW':
      return { c: odd ? c : c - 1, r: r + 1 };
    case 'SE':
      return { c: odd ? c + 1 : c, r: r - 1 };
    case 'SW':
      return { c: odd ? c : c - 1, r: r - 1 };
  }
}
export function neighbors(c: number, r: number) {
  return DIRS.map((d) => step(c, r, d));
}
function axial(c: number, r: number) {
  return { q: c - (r - (r & 1)) / 2, r };
}
export function dist(a: { c: number; r: number }, b: { c: number; r: number }): number {
  const A = axial(a.c, a.r);
  const B = axial(b.c, b.r);
  const dq = A.q - B.q;
  const dr = A.r - B.r;
  return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr));
}

export interface World {
  cells: Map<string, Cell>;
  start: { c: number; r: number };
}

/** 보스 칸: 그 줄에 길이 하나뿐 → 반드시 이겨야 지나간다 */
export const BOSS_ROWS = ZONES.map((_, i) => i * ZONE_ROWS + ZONE_ROWS - 1);
const CAMP_ROWS = [0, 8, 16, 24, 32, 40, 48, 56];
// 스피릿 제단: 다음 구역 몬스터에 강한 속성을 미리 얻게 배치
const SHRINES: [number, Element][] = [
  [5, 'fire'], // 숲 몬스터에 강함
  [12, 'water'],
  [20, 'wind'], // 물 몬스터에 강함
  [36, 'forest'], // 대지 몬스터에 강함
  [52, 'earth'], // 바람 몬스터에 강함
];

export function generateWorld(): World {
  const rng = createRng(hashSeed('hexa-rpg-world', 3));
  const cells = new Map<string, Cell>();
  const set = (c: number, r: number, floor: boolean) => cells.set(key(c, r), { c, r, floor });
  // 1) 무작위 바위
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) set(c, r, rng() > 0.24);
  // 2) 아래에서 위로 이어지는 큰 길
  let col = 4;
  for (let r = 0; r < ROWS; r++) {
    const bossRow = BOSS_ROWS.includes(r);
    if (bossRow || BOSS_ROWS.includes(r + 1) || BOSS_ROWS.includes(r - 1)) col = 4;
    else col = Math.max(1, Math.min(COLS - 2, col + (rng() < 0.33 ? -1 : rng() < 0.5 ? 1 : 0)));
    set(col, r, true);
    if (!bossRow) set(Math.min(COLS - 1, col + 1), r, true);
  }
  // 3) 보스 줄은 보스 칸 하나만, 앞뒤 줄은 보스로 이어지게
  ZONES.forEach((z, i) => {
    const r = BOSS_ROWS[i];
    for (let c = 0; c < COLS; c++) set(c, r, false);
    cells.set(key(4, r), { c: 4, r, floor: true, feature: { kind: 'boss', monster: z.boss } });
    for (const n of neighbors(4, r)) if (n.r !== r && cells.has(key(n.c, n.r))) cells.get(key(n.c, n.r))!.floor = true;
  });
  // 4) 야영지 (주변을 넓게)
  for (const r of CAMP_ROWS) {
    const cell = cells.get(key(4, r))!;
    cell.floor = true;
    cell.feature = { kind: 'camp' };
    for (const n of neighbors(4, r)) {
      const x = cells.get(key(n.c, n.r));
      if (x && !BOSS_ROWS.includes(n.r)) x.floor = true;
    }
  }
  // 5) 시작점에서 닿지 않는 칸은 바위로
  const seen = new Set<string>([key(4, 0)]);
  const q = [{ c: 4, r: 0 }];
  while (q.length) {
    const p = q.shift()!;
    for (const n of neighbors(p.c, p.r)) {
      const k = key(n.c, n.r);
      const x = cells.get(k);
      if (x?.floor && !seen.has(k)) (seen.add(k), q.push(n));
    }
  }
  for (const [k, x] of cells) if (!seen.has(k)) x.floor = false;
  // 6) 스피릿 제단: 큰 길에서 조금 떨어진 바닥 칸
  for (const [row, el] of SHRINES) {
    const cand = [...cells.values()].filter((x) => x.floor && !x.feature && Math.abs(x.r - row) <= 1 && (x.c <= 2 || x.c >= 6));
    const pick = cand[Math.floor(rng() * cand.length)] ?? [...cells.values()].find((x) => x.floor && !x.feature && x.r === row)!;
    pick.feature = { kind: 'shrine', element: el };
  }
  // 7) 보물 상자
  for (let z = 0; z < ZONES.length; z++)
    for (let k = 0; k < 3; k++) {
      const cand = [...cells.values()].filter((x) => x.floor && !x.feature && zoneOf(x.r) === z && x.r % ZONE_ROWS > 2 && x.r % ZONE_ROWS < 14);
      const pick = cand[Math.floor(rng() * cand.length)];
      if (pick) pick.feature = { kind: 'chest' };
    }
  return { cells, start: { c: 4, r: 0 } };
}

export const WORLD = generateWorld();
export const cellAt = (c: number, r: number) => WORLD.cells.get(key(c, r));
export const isFloor = (c: number, r: number) => !!cellAt(c, r)?.floor;

/** 처음 몬스터 배치: 구역마다 무리(2~4마리)를 흩어 놓는다 */
export function spawnPlan(): { id: string; level: number; c: number; r: number; pack: number; boss?: boolean }[] {
  const rng = createRng(hashSeed('hexa-rpg-spawn', 1));
  const out: { id: string; level: number; c: number; r: number; pack: number; boss?: boolean }[] = [];
  const used = new Set<string>();
  let pack = 0;
  ZONES.forEach((z, zi) => {
    const r0 = zi * ZONE_ROWS;
    out.push({ id: z.boss, level: z.bossLv, c: 4, r: BOSS_ROWS[zi], pack: pack++, boss: true });
    used.add(key(4, BOSS_ROWS[zi]));
    const floors = [...WORLD.cells.values()].filter((x) => x.floor && !x.feature && x.r > r0 + 1 && x.r < r0 + ZONE_ROWS - 1 && !CAMP_ROWS.some((cr) => dist(x, { c: 4, r: cr }) <= 3));
    const centers: Cell[] = [];
    const packs = zi === 0 ? 8 : 9;
    for (let tries = 0; tries < 200 && centers.length < packs; tries++) {
      const center = floors[Math.floor(rng() * floors.length)];
      // 무리끼리는 4칸 이상 떨어뜨리고, 첫 구역 입구(4줄)는 비워 둔다
      if (!center || used.has(key(center.c, center.r)) || centers.some((x) => dist(x, center) < 4) || (zi === 0 && center.r < 4)) continue;
      centers.push(center);
      const size = zi === 0 ? 1 + Math.floor(rng() * 3) : 2 + Math.floor(rng() * 3);
      const spots = [center, ...neighbors(center.c, center.r).map((n) => cellAt(n.c, n.r)).filter((x): x is Cell => !!x && x.floor && !x.feature)];
      const prog = (center.r - r0) / ZONE_ROWS;
      for (const s of spots.slice(0, size)) {
        if (used.has(key(s.c, s.r)) || CAMP_ROWS.some((cr) => dist(s, { c: 4, r: cr }) <= 2)) continue;
        used.add(key(s.c, s.r));
        const lv = Math.round(z.minLv + (z.maxLv - z.minLv) * prog + (rng() < 0.3 ? 1 : 0));
        out.push({ id: z.monsters[Math.floor(rng() * z.monsters.length)], level: lv, c: s.c, r: s.r, pack });
      }
      pack++;
    }
  });
  return out;
}
