// 지도 모음. 좌표: (col, row) odd-r 오프셋. row 0이 맨 아래, 위로 갈수록 row가 커진다.
// P00 = 튜토리얼(이끼 숲), P01부터 본편. P01은 100개 스테이지(P01-001~P01-100)를 한 판으로 한다 (D57).
import { P01_RAW, P01_COLS } from './p01';

export type TileKind = 'start' | 'battle' | 'elite' | 'spirit' | 'resource' | 'boss' | 'gate';

export interface TileDef {
  id: string;
  map: string;
  col: number;
  row: number;
  q: number; // axial (계산용)
  r: number;
  kind: TileKind;
  name: string;
  /** 본편 스테이지 번호 (P01-001이면 1) */
  stage?: number;
  encounterId?: string;
  spiritId?: string;
  resource?: 'stones' | 'gold' | 'summon';
  hint?: string;
}

export interface MapDef {
  id: string;
  code: string; // 'P00'
  name: string;
  cols: number; // 칸이 놓일 수 있는 열 수 (0..cols-1)
  startId: string;
  /** 이 row까지는 바위(막힌 칸)를 그리지 않는다 */
  noRockUntilRow: number;
  tiles: TileDef[];
}

export type RawTile = Omit<TileDef, 'q' | 'r' | 'map'>;

// ── P00 튜토리얼: 한 줄 길 → 고목 골렘 → 짧은 갈래(상성·레벨업 연습) → P01로 가는 길 ──
const P00_RAW: RawTile[] = [
  { id: 'start', col: 2, row: 0, kind: 'start', name: '숲 입구', hint: '여기서 모험이 시작됐다' },
  { id: 'a1', col: 2, row: 1, kind: 'battle', name: '잎새 강아지 무리', encounterId: 'slimes_a' },
  { id: 'a2', col: 2, row: 2, kind: 'battle', name: '물결 여우 개울', encounterId: 'boar_den' },
  { id: 'a3', col: 2, row: 3, kind: 'resource', name: '신비한 결정', resource: 'summon' },
  { id: 's1', col: 2, row: 4, kind: 'battle', name: '잎새 강아지 떼', encounterId: 'slimes_b' },
  { id: 's2', col: 2, row: 5, kind: 'resource', name: '버섯 수풀', resource: 'gold' },
  { id: 'b1', col: 2, row: 6, kind: 'boss', name: '고목 골렘', encounterId: 'boss_treant' },
  { id: 'c1', col: 1, row: 7, kind: 'battle', name: '물안개 여울', encounterId: 'mist_ford' },
  { id: 'c2', col: 2, row: 7, kind: 'resource', name: '버려진 야영지', resource: 'gold' },
  { id: 'c3', col: 1, row: 8, kind: 'resource', name: '이끼 동굴', resource: 'stones' },
  { id: 'c4', col: 2, row: 8, kind: 'battle', name: '바위엄니 떼', encounterId: 'boar_herd' },
  { id: 'c5', col: 3, row: 8, kind: 'resource', name: '바람의 결정', resource: 'summon' },
  { id: 'gate', col: 2, row: 9, kind: 'gate', name: 'P01로 가는 길' },
];

/** odd-r 오프셋 → axial */
export function offsetToAxial(col: number, row: number): { q: number; r: number } {
  return { q: col - (row - (row & 1)) / 2, r: row };
}

const build = (map: string, raw: RawTile[]): TileDef[] => raw.map((t) => ({ ...t, map, ...offsetToAxial(t.col, t.row) }));

export const MAPS: Record<string, MapDef> = {
  P00: { id: 'P00', code: 'P00', name: '튜토리얼 · 이끼 숲', cols: 5, startId: 'start', noRockUntilRow: 6, tiles: build('P00', P00_RAW) },
  P01: { id: 'P01', code: 'P01', name: '바람골 숲', cols: P01_COLS, startId: 'p01-start', noRockUntilRow: 0, tiles: build('P01', P01_RAW) },
};

export const MAP_ORDER = ['P00', 'P01'];

export const TILES: TileDef[] = Object.values(MAPS).flatMap((m) => m.tiles);

export const TILE_BY_ID: Record<string, TileDef> = Object.fromEntries(TILES.map((t) => [t.id, t]));

/** 스테이지 번호 표기: P01-007 */
export function stageCode(t: TileDef): string | null {
  return t.stage ? `${t.map}-${String(t.stage).padStart(3, '0')}` : null;
}
