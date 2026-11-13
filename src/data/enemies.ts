import type { Encounter } from '../core/types';
import { P01_ENCOUNTERS } from './p01';

export { ENEMIES } from './monsters';

const e = (enemyId: string, level: number, slot: number) => ({ enemyId, level, slot });

// P00 튜토리얼 전투 (D57: 튜토리얼 전용으로 축소)
const P00_ENCOUNTERS: Record<string, Encounter> = {
  slimes_a: { id: 'slimes_a', name: '슬라임 무리', enemies: [e('moss_slime', 1, 1), e('moss_slime', 1, 4)], firstClear: { gold: 30, stones: 1, xp: 30 } },
  slimes_b: { id: 'slimes_b', name: '잎새 강아지 떼', enemies: [e('moss_slime', 2, 0), e('moss_slime', 2, 2), e('moss_slime', 2, 4)], firstClear: { gold: 40, stones: 2, xp: 80 } },
  boar_den: { id: 'boar_den', name: '물결 여우 개울', enemies: [e('fox_kit', 1, 1), e('fox_kit', 1, 5)], firstClear: { gold: 50, stones: 2 } },
  boss_treant: { id: 'boss_treant', name: '고목 골렘', bossKind: 'normal', enemies: [e('elder_treant', 4, 1), e('moss_slime', 3, 3)], firstClear: { gold: 200, stones: 10 } },
  mist_ford: { id: 'mist_ford', name: '물안개 여울', enemies: [e('mist_newt', 6, 1), e('mist_newt', 7, 5)], firstClear: { gold: 90, stones: 3 } },
  boar_herd: { id: 'boar_herd', name: '바위엄니 떼', enemies: [e('thorn_boar', 6, 0), e('thorn_boar', 6, 1), e('thorn_boar', 6, 2)], firstClear: { gold: 110, stones: 4, summon: 10 } },
};

export const ENCOUNTERS: Record<string, Encounter> = { ...P00_ENCOUNTERS, ...P01_ENCOUNTERS };
