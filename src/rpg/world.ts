// 스테이지 지도 (D82): 10판. 판마다 크기가 정해진 세로 헥사 지도, 아래(row 0)에서 위의 출구로.
// 판마다 장애물 배치가 달라 전략이 생긴다: 길목(한 마리씩 끊어 잡기) · 넓은 곳(둘러싸일 위험) · 방 · 기둥밭 · 통로.
// 좌표는 odd-r 오프셋 (col, row). 화면에서는 row가 클수록 위.
import { MONSTERS } from './data';
import { createRng, hashSeed } from '../core/rng';
import type { Element } from './data';

export const COLS = 9;

export type Feature = { kind: 'camp' } | { kind: 'shrine'; element: Element } | { kind: 'chest' } | { kind: 'exit' };
export interface Cell {
  c: number;
  r: number;
  floor: boolean;
  feature?: Feature;
}

export type Layout = 'pillars' | 'maze' | 'rooms' | 'corridors' | 'open';
export const LAYOUT_NAME: Record<Layout, string> = {
  pillars: '기둥밭 — 기둥 뒤로 돌며 싸우기',
  maze: '덤불 미로 — 길목에서 한 마리씩',
  rooms: '방과 문 — 문 앞을 지키면 유리',
  corridors: '세 갈래 통로 — 갈림길에서 포위 주의',
  open: '탁 트인 들판 — 둘러싸이기 쉬움!',
};

export interface StageDef {
  n: number;
  name: string;
  rows: number;
  layout: Layout;
  monsters: string[];
  minLv: number;
  maxLv: number;
  boss: string;
  bossLv: number;
  bossElite?: boolean; // 일반 몬스터를 키운 '대장'
  shrine?: Element;
}

// D107: 2판부터 몬스터 레벨을 올려, 보스 뒤 몰려오는 무리나 다시 하기로 약간의 경험치 벌기가 필요하게
export const STAGES: StageDef[] = [
  { n: 1, name: '이끼 숲 입구', rows: 18, layout: 'pillars', monsters: ['leafpup', 'leafpup', 'leafkit'], minLv: 1, maxLv: 3, boss: 'leafpup', bossLv: 4, bossElite: true, shrine: 'fire' },
  { n: 2, name: '덤불 미로', rows: 20, layout: 'maze', monsters: ['leafpup', 'leafkit', 'bloom'], minLv: 3, maxLv: 6, boss: 'leafkit', bossLv: 7, bossElite: true, shrine: 'water' },
  { n: 3, name: '고목의 뜰', rows: 22, layout: 'rooms', monsters: ['leafkit', 'bloom', 'leafpup'], minLv: 6, maxLv: 8, boss: 'golem', bossLv: 9 },
  { n: 4, name: '물안개 개울', rows: 22, layout: 'corridors', monsters: ['tidekit', 'shell', 'tidekit'], minLv: 9, maxLv: 11, boss: 'shell', bossLv: 13, bossElite: true, shrine: 'wind' },
  { n: 5, name: '개울 동굴', rows: 24, layout: 'maze', monsters: ['tidekit', 'shell', 'bloom'], minLv: 12, maxLv: 14, boss: 'tidekit', bossLv: 16, bossElite: true },
  { n: 6, name: '해일의 둥지', rows: 24, layout: 'open', monsters: ['tidekit', 'shell'], minLv: 15, maxLv: 17, boss: 'tidelord', bossLv: 19, shrine: 'forest' },
  { n: 7, name: '바위엄니 고개', rows: 26, layout: 'corridors', monsters: ['boar', 'ember', 'boar'], minLv: 18, maxLv: 20, boss: 'boar', bossLv: 22, bossElite: true },
  { n: 8, name: '테라스톤 광산', rows: 26, layout: 'rooms', monsters: ['boar', 'ember'], minLv: 21, maxLv: 23, boss: 'terra', bossLv: 25, shrine: 'earth' },
  { n: 9, name: '폭풍 언덕', rows: 28, layout: 'pillars', monsters: ['wolf', 'ember', 'wolf'], minLv: 24, maxLv: 26, boss: 'wolf', bossLv: 28, bossElite: true },
  { n: 10, name: '폭풍의 정상', rows: 30, layout: 'maze', monsters: ['wolf', 'shell', 'ember', 'wolf'], minLv: 27, maxLv: 29, boss: 'storm', bossLv: 32 },
];

export const key = (c: number, r: number) => `${c},${r}`;

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
  stage: StageDef;
  rows: number;
  cells: Map<string, Cell>;
  start: { c: number; r: number };
  exit: { c: number; r: number };
  bossAt: { c: number; r: number };
  camps: { c: number; r: number }[];
}

export interface Spawn {
  id: string;
  level: number;
  c: number;
  r: number;
  pack: number;
  boss?: boolean;
  elite?: boolean;
}

function connected(cells: Map<string, Cell>, from: { c: number; r: number }): Set<string> {
  const seen = new Set([key(from.c, from.r)]);
  const q = [from];
  while (q.length) {
    const p = q.shift()!;
    for (const n of neighbors(p.c, p.r)) {
      const k = key(n.c, n.r);
      if (cells.get(k)?.floor && !seen.has(k)) (seen.add(k), q.push(n));
    }
  }
  return seen;
}

export function buildStage(n: number): World {
  const st = STAGES[n - 1];
  const R = st.rows;
  const rng = createRng(hashSeed('hexa-stage', n));
  const cells = new Map<string, Cell>();
  for (let r = 0; r < R; r++) for (let c = 0; c < COLS; c++) cells.set(key(c, r), { c, r, floor: true });
  const rock = (c: number, r: number) => {
    const x = cells.get(key(c, r));
    if (x && r > 1 && r < R - 4) x.floor = false;
  };
  // ── 장애물 배치 ──
  if (st.layout === 'pillars') {
    for (let r = 3; r < R - 4; r++) for (let c = 0; c < COLS; c++) if (rng() < 0.16 && !neighbors(c, r).some((x) => cells.get(key(x.c, x.r))?.floor === false)) rock(c, r);
  } else if (st.layout === 'maze') {
    // 3~4줄마다 가로 벽, 틈(길목)은 1~2개
    for (let r = 3; r < R - 4; r += 3 + Math.floor(rng() * 2)) {
      const gaps = new Set<number>();
      const g = 1 + Math.floor(rng() * 2);
      while (gaps.size < g) gaps.add(Math.floor(rng() * COLS));
      for (let c = 0; c < COLS; c++) if (!gaps.has(c)) rock(c, r);
    }
  } else if (st.layout === 'rooms') {
    for (let r = 4; r < R - 4; r += 5) {
      const door = 1 + Math.floor(rng() * (COLS - 2));
      for (let c = 0; c < COLS; c++) if (c !== door) rock(c, r);
      // 방 안의 칸막이
      const wc = 2 + Math.floor(rng() * 5);
      for (let k = 1; k <= 3; k++) if (rng() < 0.75) rock(wc, r + k);
    }
  } else if (st.layout === 'corridors') {
    // 세로 벽 2줄로 세 갈래, 가끔 건너가는 틈
    for (let r = 3; r < R - 4; r++) {
      for (const c of [2, 6]) if (r % 5 !== 0) rock(c, r);
      if (rng() < 0.15) rock(Math.floor(rng() * COLS), r);
    }
  } else {
    for (let r = 3; r < R - 4; r++) for (let c = 0; c < COLS; c++) if (rng() < 0.05) rock(c, r);
  }
  // ── 특별한 칸 ──
  const start = { c: 4, r: 0 };
  const exit = { c: 4, r: R - 1 };
  const bossAt = { c: 4, r: R - 3 };
  const clearAround = (p: { c: number; r: number }, rad: number) => {
    for (const x of cells.values()) if (dist(x, p) <= rad) x.floor = true;
  };
  clearAround(start, 1);
  clearAround(bossAt, 2);
  clearAround(exit, 1);
  const midRow = Math.floor(R / 2);
  const midCamp = { c: rng() < 0.5 ? 2 : 6, r: midRow };
  clearAround(midCamp, 1);
  cells.get(key(start.c, start.r))!.feature = { kind: 'camp' };
  cells.get(key(midCamp.c, midCamp.r))!.feature = { kind: 'camp' };
  cells.get(key(exit.c, exit.r))!.feature = { kind: 'exit' };
  // 출구까지 이어지게: 안 이어지면 막힌 벽을 하나씩 뚫는다
  for (let guard = 0; guard < 60 && !connected(cells, start).has(key(exit.c, exit.r)); guard++) {
    const reach = connected(cells, start);
    const edge = [...cells.values()].filter((x) => !x.floor && neighbors(x.c, x.r).some((nb) => reach.has(key(nb.c, nb.r)))).sort((a, b) => b.r - a.r)[0];
    if (edge) edge.floor = true;
  }
  const reach = connected(cells, start);
  for (const [k, x] of cells) if (!reach.has(k)) x.floor = false;
  // 보물 상자 2개, 스피릿 제단(있으면)
  const free = () => [...cells.values()].filter((x) => x.floor && !x.feature && x.r > 2 && x.r < R - 4 && dist(x, midCamp) > 1);
  for (let k = 0; k < 2; k++) {
    const f = free();
    const p = f[Math.floor(rng() * f.length)];
    if (p) p.feature = { kind: 'chest' };
  }
  if (st.shrine) {
    const f = free().filter((x) => x.r < R * 0.6 && (x.c <= 1 || x.c >= 7));
    const p = f[Math.floor(rng() * f.length)] ?? free()[0];
    p.feature = { kind: 'shrine', element: st.shrine };
  }
  return { stage: st, rows: R, cells, start, exit, bossAt, camps: [start, midCamp] };
}

/** 처음 몬스터 배치: 무리(2~4마리)를 흩어 놓는다 */
export function stageSpawns(w: World): Spawn[] {
  const st = w.stage;
  const rng = createRng(hashSeed('hexa-stage-spawn', st.n));
  const out: Spawn[] = [{ id: st.boss, level: st.bossLv, c: w.bossAt.c, r: w.bossAt.r, pack: 0, boss: true, elite: st.bossElite }];
  const used = new Set([key(w.bossAt.c, w.bossAt.r)]);
  const floors = [...w.cells.values()].filter((x) => x.floor && !x.feature && x.r >= 3 && x.r < w.rows - 5 && w.camps.every((cp) => dist(cp, x) > 3));
  const centers: Cell[] = [];
  const packs = Math.round(w.rows / 3);
  let pack = 1;
  for (let tries = 0; tries < 300 && centers.length < packs; tries++) {
    const center = floors[Math.floor(rng() * floors.length)];
    if (!center || centers.some((x) => dist(x, center) < 4)) continue;
    centers.push(center);
    // D101: 무리 크기는 판이 갈수록 커진다 (1판 1~2(뒤쪽 2~3), 2~3판 2~3, 4판부터 2~4)
    const size = st.n === 1 ? (center.r < 7 ? 1 : 2) + Math.floor(rng() * 2) : st.n <= 3 ? 2 + Math.floor(rng() * 2) : 2 + Math.floor(rng() * 3);
    const spots = [center, ...neighbors(center.c, center.r).map((nb) => w.cells.get(key(nb.c, nb.r))).filter((x): x is Cell => !!x && x.floor && !x.feature)];
    const prog = center.r / w.rows;
    let ranged = 0;
    for (const s of spots.slice(0, size)) {
      if (used.has(key(s.c, s.r))) continue;
      used.add(key(s.c, s.r));
      let id = st.monsters[Math.floor(rng() * st.monsters.length)];
      // D101: 4판까지는 한 무리에 원거리 몬스터 1마리까지 (나머지는 근접으로)
      if (MONSTERS[id].range > 1 && st.n <= 4 && ranged >= 1) id = st.monsters.find((m) => MONSTERS[m].range <= 1) ?? id;
      if (MONSTERS[id].range > 1) ranged++;
      out.push({ id, level: Math.round(st.minLv + (st.maxLv - st.minLv) * prog), c: s.c, r: s.r, pack });
    }
    pack++;
  }
  return out;
}

// ── 지금 플레이 중인 스테이지 (화면·규칙이 함께 쓴다) ──
const CACHE = new Map<number, World>();
export function getStage(n: number): World {
  if (!CACHE.has(n)) CACHE.set(n, buildStage(n));
  return CACHE.get(n)!;
}
let ACTIVE: World = getStage(1);
export function activate(n: number): World {
  ACTIVE = getStage(n);
  return ACTIVE;
}
export const active = () => ACTIVE;
export const cellAt = (c: number, r: number) => ACTIVE.cells.get(key(c, r));
export const isFloor = (c: number, r: number) => !!cellAt(c, r)?.floor;
