// P01 '바람골 숲': 스테이지 100개(P01-001~P01-100)를 한 판으로 하는 본편 첫 지도 (D57).
// 지도와 전투는 시드 고정 생성기로 만든다 (실행할 때마다 같은 결과).
// 같이 플레이하며 손볼 곳은 아래 OVERRIDES / 테마 표 / 곡선 상수를 고치면 된다.
//
// 구조: 4구역 × (일반·정예 24칸 + 보물 칸들) + 구역 끝 보스 한 칸(025·050·075 중간 보스, 100 지역 보스).
// 보스 칸은 그 row에 혼자 있어서 반드시 지나가야 하는 길목이 된다.
import type { Encounter, EncounterEnemy } from '../core/types';
import { createRng, hashSeed } from '../core/rng';
import { ENEMIES } from './monsters';
import type { RawTile } from './map';

export const P01_COLS = 7;
const SEGMENTS = 4;
const SEG_ROWS = 13; // 구역마다 보스 전까지의 row 수
const PER_SEG = 25; // 구역마다 스테이지 수 (마지막이 보스)

// ── 난이도 곡선 ──
/** 스테이지 n의 적 레벨 */
export function p01Level(n: number): number {
  return Math.round(7 + (n - 1) * 0.31);
}
function enemyCount(n: number): number {
  return Math.min(5, 2 + Math.floor((n + 5) / 15));
}

// 구역별 몬스터 테마: 상성을 바꿔 가며 편성을 고민하게 한다
const THEMES: string[][] = [
  ['moss_slime', 'leaf_deer', 'fox_kit', 'mist_newt'], // 🌿·💧
  ['thorn_boar', 'leaf_deer', 'wild_ember', 'moss_slime'], // ⛰️·🌿·🔥
  ['mist_newt', 'wild_shell', 'spark_beetle', 'wild_ember'], // 💧·🌪️·🔥
  ['thorn_boar', 'spark_beetle', 'wild_shell', 'leaf_deer', 'wild_ember', 'mist_newt'], // 전부
];

const BOSSES: Record<number, { boss: string; adds: string[]; name: string; kind: 'normal' | 'region'; unlockDeploy?: number }> = {
  25: { boss: 'elder_treant', adds: ['leaf_deer', 'moss_slime'], name: '고목 골렘의 뜰', kind: 'normal', unlockDeploy: 4 },
  50: { boss: 'tide_lord', adds: ['wild_shell', 'mist_newt'], name: '해일 여우왕', kind: 'normal' },
  75: { boss: 'storm_king', adds: ['spark_beetle', 'spark_beetle', 'wild_shell'], name: '폭풍 늑대왕', kind: 'normal', unlockDeploy: 5 },
  100: { boss: 'stone_giant', adds: ['thorn_boar', 'spark_beetle', 'leaf_deer', 'wild_shell'], name: '테라스톤', kind: 'region' },
};

/** 손으로 고친 스테이지 (생성 결과를 덮어씀). 예: 3: { enemies: [...], name: '...' } */
const OVERRIDES: Record<number, Partial<Encounter>> = {};

// ── 지도 생성 ──
type Cell = { col: number; row: number };
const key = (c: number, r: number) => `${c},${r}`;

/** odd-r 오프셋 좌표의 이웃 6칸 */
function around(col: number, row: number): Cell[] {
  const odd = row & 1;
  const d = odd
    ? [[1, 0], [-1, 0], [0, -1], [1, -1], [0, 1], [1, 1]]
    : [[1, 0], [-1, 0], [-1, -1], [0, -1], [-1, 1], [0, 1]];
  return d.map(([dc, dr]) => ({ col: col + dc, row: row + dr }));
}

function genSegment(seg: number, entry: Cell, bossCol: number, attempt: number): Cell[] {
  const rng = createRng(hashSeed('P01-seg', seg, attempt));
  const base = entry.row + 1;
  const cells = new Map<string, Cell>();
  let center = entry.col;
  for (let i = 0; i < SEG_ROWS; i++) {
    const row = base + i;
    const last = i === SEG_ROWS - 1;
    let half = i === 0 ? (seg === 0 ? 0 : 1) : last ? 1 : seg === 0 && i < 3 ? 1 : 2 + (rng() < 0.5 ? 1 : 0);
    const roll = rng();
    center += roll < 0.3 ? -1 : roll < 0.6 ? 1 : 0;
    if (i >= SEG_ROWS - 3) center += Math.sign(bossCol - center);
    center = Math.max(1, Math.min(P01_COLS - 2, center));
    if (i === 0) center = entry.col;
    half = Math.min(half, 3);
    for (let c = center - half; c <= center + half; c++) {
      if (c < 0 || c >= P01_COLS) continue;
      const edge = i === 0 || last;
      if (!edge && rng() < 0.22) continue; // 길 안의 바위
      cells.set(key(c, row), { col: c, row });
    }
  }
  // 입구 바로 위, 보스 바로 아래 칸은 반드시 있게
  const firstRow = around(entry.col, entry.row).filter((n) => n.row === base);
  if (!firstRow.some((n) => cells.has(key(n.col, n.row)))) cells.set(key(firstRow[0].col, base), firstRow[0]);
  const bossRow = base + SEG_ROWS;
  const below = around(bossCol, bossRow).filter((n) => n.row === bossRow - 1);
  if (!below.some((n) => cells.has(key(n.col, n.row)))) cells.set(key(below[0].col, below[0].row), below[0]);
  // 입구에서 이어지지 않는 칸은 지운다
  const seen = new Set<string>();
  const q: Cell[] = [entry];
  while (q.length) {
    const c = q.shift()!;
    for (const n of around(c.col, c.row)) {
      const k = key(n.col, n.row);
      if (cells.has(k) && !seen.has(k)) (seen.add(k), q.push(n));
    }
  }
  const out = [...cells.entries()].filter(([k]) => seen.has(k)).map(([, c]) => c);
  // 보스에 닿는 칸이 살아남았는지 확인
  if (!out.some((c) => c.row === bossRow - 1 && around(c.col, c.row).some((n) => n.col === bossCol && n.row === bossRow))) return [];
  return out;
}

const BOSS_COLS = [3, 2, 4, 3];

function generate(): { tiles: RawTile[]; encounters: Record<string, Encounter> } {
  const tiles: RawTile[] = [{ id: 'p01-start', col: 3, row: 0, kind: 'start', name: '바람골 입구', hint: '본편의 시작. P01-001부터 P01-100까지!' }];
  const encounters: Record<string, Encounter> = {};
  let entry: Cell = { col: 3, row: 0 };
  let resN = 0;
  for (let seg = 0; seg < SEGMENTS; seg++) {
    const bossCol = BOSS_COLS[seg];
    let cells: Cell[] = [];
    for (let attempt = 0; attempt < 200; attempt++) {
      cells = genSegment(seg, entry, bossCol, attempt);
      if (cells.length >= 40 && cells.length <= 58) break;
    }
    cells.sort((a, b) => a.row - b.row || a.col - b.col);
    const battles = new Set<number>();
    for (let k = 0; k < PER_SEG - 1; k++) battles.add(Math.round((k * (cells.length - 1)) / (PER_SEG - 1.5)));
    let k = 0;
    const rng = createRng(hashSeed('P01-res', seg));
    cells.forEach((c, i) => {
      if (battles.has(i) && k < PER_SEG - 1) {
        const n = seg * PER_SEG + ++k;
        const enc = makeEncounter(n);
        encounters[enc.id] = enc;
        tiles.push({ id: tileId(n), col: c.col, row: c.row, kind: n % 10 === 0 ? 'elite' : 'battle', name: enc.name, stage: n, encounterId: enc.id });
      } else {
        const r = rng();
        const resource = r < 0.12 ? 'summon' : r < 0.42 ? 'stones' : 'gold';
        tiles.push({ id: `p01-r${++resN}`, col: c.col, row: c.row, kind: 'resource', resource, name: resource === 'summon' ? '소환 결정' : resource === 'stones' ? '성장석 상자' : '보물 상자' });
      }
    });
    const bossRow = entry.row + 1 + SEG_ROWS;
    const n = (seg + 1) * PER_SEG;
    const enc = makeEncounter(n);
    encounters[enc.id] = enc;
    tiles.push({ id: tileId(n), col: bossCol, row: bossRow, kind: 'boss', name: enc.name, stage: n, encounterId: enc.id });
    entry = { col: bossCol, row: bossRow };
  }
  tiles.push({ id: 'p01-gate', col: entry.col, row: entry.row + 1, kind: 'gate', name: 'P02로 가는 길' });
  return { tiles, encounters };
}

export function tileId(n: number): string {
  return `p01-${String(n).padStart(3, '0')}`;
}

const FRONT = [1, 0, 2];
const MID = [4, 3, 5];
const BACK = [7, 6, 8];

/** 역할에 맞는 열에 배치: 탱커·근접 → 전열, 지원 → 중열, 원거리 → 후열 (꽉 차면 옆 열로) */
function place(ids: string[], level: (i: number) => number): EncounterEnemy[] {
  const used = new Set<number>();
  return ids.map((enemyId, i) => {
    const d = ENEMIES[enemyId];
    const pref = d.range === 'melee' ? [FRONT, MID, BACK] : d.role === 'support' ? [MID, BACK, FRONT] : [BACK, MID, FRONT];
    const slot = pref.flat().find((s) => !used.has(s))!;
    used.add(slot);
    return { enemyId, level: level(i), slot };
  });
}

function makeEncounter(n: number): Encounter {
  const id = `p01_${String(n).padStart(3, '0')}`;
  const seg = Math.min(SEGMENTS - 1, Math.floor((n - 1) / PER_SEG));
  const lv = p01Level(n);
  const boss = BOSSES[n];
  let enc: Encounter;
  if (boss) {
    const enemies = place([boss.boss, ...boss.adds], (i) => (i === 0 ? lv + 1 : lv - 1));
    enc = {
      id,
      name: boss.name,
      bossKind: boss.kind,
      unlockDeploy: boss.unlockDeploy,
      enemies,
      firstClear: { gold: 150 + n * 8, stones: 6 + Math.floor(n / 10), summon: 10 },
    };
  } else {
    const rng = createRng(hashSeed('P01-enc', n));
    const theme = THEMES[seg];
    const elite = n % 10 === 0;
    const count = Math.min(5, enemyCount(n) + (elite ? 1 : 0));
    // 40%는 한 속성으로 몰아서 상성 공략이 확실히 통하게
    const mono = rng() < 0.4 ? theme[Math.floor(rng() * theme.length)] : null;
    const pool = mono ? theme.filter((x) => ENEMIES[x].element === ENEMIES[mono].element) : theme;
    const ids = Array.from({ length: count }, () => pool[Math.floor(rng() * pool.length)]);
    const main = ENEMIES[ids[0]];
    enc = {
      id,
      name: elite ? `정예: ${main.name} 부대` : `${main.name} ${count >= 4 ? '떼' : '무리'}`,
      enemies: place(ids, () => lv + (elite ? 2 : 0)),
      firstClear: elite ? { gold: 60 + n * 5, stones: 2 + Math.floor(n / 20), summon: 5 } : { gold: 20 + n * 3, stones: Math.floor(n / 25) },
    };
  }
  return { ...enc, ...OVERRIDES[n] };
}

const G = generate();
export const P01_RAW: RawTile[] = G.tiles;
export const P01_ENCOUNTERS: Record<string, Encounter> = G.encounters;
