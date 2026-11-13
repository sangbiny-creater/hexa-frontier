import type { Encounter } from '../core/types';
import { P01_ENCOUNTERS } from './p01';

export { ENEMIES } from './monsters';

const e = (enemyId: string, level: number, slot: number) => ({ enemyId, level, slot });

// P00 튜토리얼 전투 (D63: 한 줄 길 15칸, 막힘→해결법을 하나씩 가르친다)
const P00_ENCOUNTERS: Record<string, Encounter> = {
  slimes_a: { id: 'slimes_a', name: '잎새 강아지 무리', enemies: [e('moss_slime', 2, 1), e('moss_slime', 2, 4)], firstClear: { gold: 30, stones: 1 } },
  slimes_b: { id: 'slimes_b', name: '어린 바위엄니', enemies: [e('thorn_boar', 5, 1), e('thorn_boar', 5, 4)], firstClear: { gold: 40, stones: 1 } },
  boar_den: { id: 'boar_den', name: '아기 물결 여우', enemies: [e('fox_kit', 5, 1), e('fox_kit', 5, 5)], firstClear: { gold: 40, stones: 1 } },
  ember_nest: { id: 'ember_nest', name: '불씨 둥지', enemies: [e('wild_ember', 6, 3), e('wild_ember', 6, 5)], firstClear: { gold: 50, stones: 1 } },
  gust_hill: { id: 'gust_hill', name: '돌풍 언덕', enemies: [e('moss_slime', 6, 1), e('spark_beetle', 7, 4)], firstClear: { gold: 50, stones: 1 } },
  thorn_bush: { id: 'thorn_bush', name: '가시 덤불', enemies: [e('thorn_boar', 7, 0), e('thorn_boar', 7, 2), e('leaf_deer', 7, 4)], firstClear: { gold: 60, stones: 2 } },
  boss_treant: { id: 'boss_treant', name: '고목 골렘', bossKind: 'normal', enemies: [e('elder_treant', 6, 1), e('moss_slime', 6, 3)], firstClear: { gold: 200, stones: 5 } },
  mist_ford: { id: 'mist_ford', name: '물안개 여울', enemies: [e('fog_fox', 15, 1), e('fog_fox', 15, 5)], firstClear: { gold: 90, stones: 3 } },
  boar_herd: { id: 'boar_herd', name: '바위엄니 떼', enemies: [e('thorn_boar', 15, 0), e('thorn_boar', 15, 2)], firstClear: { gold: 110, stones: 3 } },
  boss_boar: { id: 'boss_boar', name: '바위엄니 대장', bossKind: 'normal', enemies: [e('boar_chief', 5, 1), e('thorn_boar', 4, 3), e('thorn_boar', 4, 5)], firstClear: { gold: 250, stones: 6, summon: 10 } },
};

export const ENCOUNTERS: Record<string, Encounter> = { ...P00_ENCOUNTERS, ...P01_ENCOUNTERS };
