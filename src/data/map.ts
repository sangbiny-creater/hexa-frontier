// 지역 1: 이끼 숲 — 세로(아래→위)로 올라가는 헥사 맵 (모바일 세로 화면용).
// 좌표: (col, row) odd-r 오프셋. row 0이 맨 아래, 위로 갈수록 row가 커진다.
// 튜토리얼 구간(row 0~6)은 한 줄 길, 고목 골렘(row 6)을 넘으면 여러 갈래로 넓어진다.

export type TileKind = 'start' | 'battle' | 'elite' | 'spirit' | 'resource' | 'boss' | 'gate';

export interface TileDef {
  id: string;
  col: number;
  row: number;
  q: number; // axial (계산용)
  r: number;
  kind: TileKind;
  name: string;
  encounterId?: string;
  spiritId?: string;
  resource?: 'stones' | 'gold' | 'summon';
  hint?: string;
}

export const REGION_NAME = '이끼 숲';

type Raw = Omit<TileDef, 'q' | 'r'>;

const RAW: Raw[] = [
  // ── 튜토리얼: 한 줄 길 ──
  { id: 'start', col: 2, row: 0, kind: 'start', name: '숲 입구', hint: '여기서 모험이 시작됐다' },
  { id: 'a1', col: 2, row: 1, kind: 'battle', name: '잎새 강아지 무리', encounterId: 'slimes_a' },
  { id: 'a2', col: 2, row: 2, kind: 'battle', name: '물결 여우 개울', encounterId: 'boar_den' },
  { id: 'a3', col: 2, row: 3, kind: 'resource', name: '신비한 결정', resource: 'summon' },
  { id: 's1', col: 2, row: 4, kind: 'battle', name: '잎새 강아지 떼', encounterId: 'slimes_b' },
  { id: 's2', col: 2, row: 5, kind: 'resource', name: '버섯 수풀', resource: 'gold' },
  { id: 'b1', col: 2, row: 6, kind: 'boss', name: '고목 골렘', encounterId: 'boss_treant' },
  // ── 고목 골렘 너머: 여러 갈래 ──
  { id: 'c1', col: 1, row: 7, kind: 'battle', name: '물안개 여울', encounterId: 'mist_ford' },
  { id: 'c2', col: 2, row: 7, kind: 'resource', name: '버려진 야영지', resource: 'gold' },
  { id: 'c3', col: 1, row: 8, kind: 'resource', name: '이끼 동굴', resource: 'stones' },
  { id: 'c4', col: 2, row: 8, kind: 'battle', name: '바위엄니 떼', encounterId: 'boar_herd' },
  { id: 'c5', col: 3, row: 8, kind: 'resource', name: '바람의 결정', resource: 'summon' },
  { id: 'c6', col: 0, row: 9, kind: 'elite', name: '정예: 폭풍 둥지', encounterId: 'storm_ridge' },
  { id: 'c7', col: 1, row: 9, kind: 'battle', name: '돌풍 언덕', encounterId: 'beetle_field' },
  { id: 'c8', col: 2, row: 9, kind: 'battle', name: '깊은 숲', encounterId: 'deep_woods' },
  { id: 'c9', col: 3, row: 9, kind: 'resource', name: '반짝이는 풀밭', resource: 'gold' },
  { id: 'c10', col: 1, row: 10, kind: 'resource', name: '수정 광맥', resource: 'stones' },
  { id: 'c11', col: 2, row: 10, kind: 'battle', name: '야생 무리', encounterId: 'mixed_camp' },
  { id: 'c12', col: 3, row: 10, kind: 'elite', name: '정예: 고대 바위엄니', encounterId: 'elite_tusk' },
  { id: 'b2', col: 2, row: 11, kind: 'boss', name: '테라스톤', encounterId: 'boss_giant' },
  { id: 'gate', col: 2, row: 12, kind: 'gate', name: '다음 지역 (준비 중)' },
];

/** odd-r 오프셋 → axial */
export function offsetToAxial(col: number, row: number): { q: number; r: number } {
  return { q: col - (row - (row & 1)) / 2, r: row };
}

export const TILES: TileDef[] = RAW.map((t) => ({ ...t, ...offsetToAxial(t.col, t.row) }));

export const TILE_BY_ID: Record<string, TileDef> = Object.fromEntries(TILES.map((t) => [t.id, t]));

/** 튜토리얼 구간(한 줄 길)의 마지막 row */
export const TUTORIAL_LAST_ROW = 6;
