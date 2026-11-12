// 지역 1: 이끼 숲 (수작업 고정 맵, D9). axial 좌표 (q, r), pointy-top.
// 보스 칸은 x = q + r/2 축에서 유일한 관문이 되도록 배치한다 (테스트로 검증).

export type TileKind = 'start' | 'battle' | 'spirit' | 'resource' | 'facility' | 'boss' | 'gate';

export interface TileDef {
  id: string;
  q: number;
  r: number;
  kind: TileKind;
  name: string;
  encounterId?: string;
  spiritId?: string;
  resource?: 'stones' | 'gold';
  facility?: 'training' | 'rest';
  hint?: string;
}

export const REGION_NAME = '이끼 숲';

export const TILES: TileDef[] = [
  // 고목 수호자 이전 (x ≤ 3.5)
  { id: 'start', q: 0, r: 0, kind: 'start', name: '숲 입구', spiritId: 'tideshell', hint: '타이드쉘과 만난 곳' },
  { id: 'a1', q: 1, r: 0, kind: 'battle', name: '슬라임 무리', encounterId: 'slimes_a' },
  { id: 'a2', q: 2, r: 0, kind: 'spirit', name: '불씨 바위', spiritId: 'igni' },
  { id: 'a3', q: 3, r: 0, kind: 'battle', name: '수호자의 앞뜰', encounterId: 'slimes_b' },
  { id: 'b1', q: 4, r: 0, kind: 'boss', name: '고목 수호자', encounterId: 'boss_treant' },
  { id: 's1', q: 1, r: 1, kind: 'battle', name: '멧돼지 굴', encounterId: 'boar_den' },
  { id: 's2', q: 0, r: 2, kind: 'spirit', name: '이끼 요정의 샘', spiritId: 'sylphy' },
  { id: 's3', q: 2, r: 1, kind: 'resource', name: '이끼 수정 광맥', resource: 'stones' },
  { id: 's4', q: 3, r: 1, kind: 'battle', name: '개울가', encounterId: 'creek' },
  { id: 'w1', q: -1, r: 1, kind: 'battle', name: '덤불숲', encounterId: 'north_path' },
  { id: 'n1', q: 1, r: -1, kind: 'battle', name: '북쪽 오솔길', encounterId: 'north_path' },
  { id: 'n2', q: 2, r: -1, kind: 'resource', name: '반짝이는 풀밭', resource: 'gold' },
  { id: 'n3', q: 3, r: -1, kind: 'battle', name: '이끼 숲', encounterId: 'north_grove' },
  // 고목 수호자 이후 (5 ≤ x ≤ 8.5)
  { id: 'c1', q: 5, r: 0, kind: 'facility', name: '숲속 훈련장', facility: 'training' },
  { id: 'c2', q: 6, r: 0, kind: 'battle', name: '물안개 여울', encounterId: 'mist_ford' },
  { id: 'c3', q: 5, r: 1, kind: 'battle', name: '딱정벌레 들판', encounterId: 'beetle_field' },
  { id: 'c4', q: 6, r: -1, kind: 'facility', name: '이끼 휴식처', facility: 'rest' },
  { id: 'c5', q: 7, r: -1, kind: 'battle', name: '멧돼지 떼', encounterId: 'boar_herd' },
  { id: 'c6', q: 6, r: 1, kind: 'resource', name: '깊은 수정 동굴', resource: 'stones' },
  { id: 'c7', q: 7, r: 0, kind: 'battle', name: '야생 무리', encounterId: 'mixed_camp' },
  { id: 'c8', q: 7, r: 1, kind: 'battle', name: '깊은 숲', encounterId: 'deep_woods' },
  { id: 'c9', q: 8, r: -1, kind: 'battle', name: '폭풍 능선', encounterId: 'storm_ridge' },
  { id: 'c10', q: 8, r: 0, kind: 'battle', name: '거인의 문턱', encounterId: 'giant_gate' },
  { id: 'b2', q: 9, r: 0, kind: 'boss', name: '바위 거인 몽돌', encounterId: 'boss_giant' },
  { id: 'gate', q: 10, r: 0, kind: 'gate', name: '다음 지역 (준비 중)' },
];

export const TILE_BY_ID: Record<string, TileDef> = Object.fromEntries(TILES.map((t) => [t.id, t]));
