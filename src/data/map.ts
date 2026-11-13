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
  /** 보물 양 (없으면 기본값) */
  amount?: number;
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

// ── P00 튜토리얼 (D63): 처음부터 끝까지 한 줄 길. 칸마다 한 가지를 배운다 ──
// 레벨업 → 상성 유리/불리 → 골드 벌기 → 소환·상성(고목 골렘) → 자동 사냥 → 물리/마법 → 진화(바위엄니 대장)
const P00_RAW: RawTile[] = [
  { id: 'start', col: 2, row: 0, kind: 'start', name: '숲 입구', hint: '여기서 모험이 시작됐다' },
  { id: 'a1', col: 2, row: 1, kind: 'battle', name: '잎새 강아지 무리', encounterId: 'slimes_a' },
  { id: 'a2', col: 2, row: 2, kind: 'resource', name: '버섯 수풀', resource: 'gold', amount: 60 },
  { id: 'a3', col: 2, row: 3, kind: 'battle', name: '어린 바위엄니', encounterId: 'slimes_b' },
  { id: 'a4', col: 2, row: 4, kind: 'battle', name: '아기 물결 여우', encounterId: 'boar_den' },
  { id: 'a5', col: 2, row: 5, kind: 'battle', name: '불씨 둥지', encounterId: 'ember_nest' },
  { id: 'a6', col: 2, row: 6, kind: 'battle', name: '돌풍 언덕', encounterId: 'gust_hill' },
  { id: 'a7', col: 2, row: 7, kind: 'battle', name: '가시 덤불', encounterId: 'thorn_bush' },
  { id: 'a8', col: 2, row: 8, kind: 'resource', name: '신비한 결정', resource: 'summon' },
  { id: 'b1', col: 2, row: 9, kind: 'boss', name: '고목 골렘', encounterId: 'boss_treant' },
  { id: 'c1', col: 2, row: 10, kind: 'resource', name: '버려진 야영지', resource: 'summon', hint: '누군가 두고 간 🔮결정' },
  { id: 'c2', col: 2, row: 11, kind: 'battle', name: '물안개 여울', encounterId: 'mist_ford' },
  { id: 'c3', col: 2, row: 12, kind: 'battle', name: '바위엄니 떼', encounterId: 'boar_herd' },
  { id: 'c4', col: 2, row: 13, kind: 'resource', name: '진화의 결정', resource: 'summon' },
  { id: 'b2', col: 2, row: 14, kind: 'boss', name: '바위엄니 대장', encounterId: 'boss_boar' },
  { id: 'gate', col: 2, row: 15, kind: 'gate', name: 'P01로 가는 길' },
];

/** 튜토리얼을 끝내는 칸 (이기면 P01이 열린다) */
export const TUTORIAL_END = 'b2';

/** odd-r 오프셋 → axial */
export function offsetToAxial(col: number, row: number): { q: number; r: number } {
  return { q: col - (row - (row & 1)) / 2, r: row };
}

const build = (map: string, raw: RawTile[]): TileDef[] => raw.map((t) => ({ ...t, map, ...offsetToAxial(t.col, t.row) }));

export const MAPS: Record<string, MapDef> = {
  P00: { id: 'P00', code: 'P00', name: '튜토리얼 · 이끼 숲', cols: 5, startId: 'start', noRockUntilRow: 9, tiles: build('P00', P00_RAW) },
  P01: { id: 'P01', code: 'P01', name: '바람골 숲', cols: P01_COLS, startId: 'p01-start', noRockUntilRow: 0, tiles: build('P01', P01_RAW) },
};

export const MAP_ORDER = ['P00', 'P01'];

export const TILES: TileDef[] = Object.values(MAPS).flatMap((m) => m.tiles);

export const TILE_BY_ID: Record<string, TileDef> = Object.fromEntries(TILES.map((t) => [t.id, t]));

/** 스테이지 번호 표기: P01-007 */
export function stageCode(t: TileDef): string | null {
  return t.stage ? `${t.map}-${String(t.stage).padStart(3, '0')}` : null;
}
