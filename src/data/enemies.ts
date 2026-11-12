import type { Encounter, EnemyDef } from '../core/types';

// 적대적 야생 존재는 monster로 부른다 (스피릿과 구분, 기획서 1장).
export const ENEMIES: Record<string, EnemyDef> = {
  moss_slime: {
    id: 'moss_slime', name: '이끼 슬라임', element: 'forest', role: 'dealer', range: 'melee',
    base: { hp: 45, atk: 7, def: 3, spd: 38 }, xp: 8, gold: 12, stoneChance: 0.1,
    skills: [{ id: 'ms_basic', name: '몸통 박기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' }],
  },
  thorn_boar: {
    id: 'thorn_boar', name: '가시 멧돼지', element: 'earth', role: 'dealer', range: 'melee',
    base: { hp: 100, atk: 15, def: 8, spd: 44 }, xp: 12, gold: 18, stoneChance: 0.18,
    skills: [
      { id: 'tb_basic', name: '들이받기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'tb_charge', name: '가시 돌진', kind: 'active', cooldown: 8, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1.7 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  mist_newt: {
    id: 'mist_newt', name: '물안개 도롱뇽', element: 'water', role: 'dealer', range: 'ranged',
    base: { hp: 80, atk: 18, def: 6, spd: 48 }, xp: 16, gold: 20, stoneChance: 0.2,
    skills: [
      { id: 'mn_basic', name: '물줄기', kind: 'basic', cooldown: 0, target: 'enemyHighestAtk', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  spark_beetle: {
    id: 'spark_beetle', name: '번개 딱정벌레', element: 'electric', role: 'support', range: 'ranged',
    base: { hp: 90, atk: 15, def: 10, spd: 52 }, xp: 18, gold: 22, stoneChance: 0.22,
    skills: [
      { id: 'sb_basic', name: '정전기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'sb_arc', name: '연쇄 번개', kind: 'active', cooldown: 9, target: 'enemyAll', effects: [{ type: 'damage', coef: 0.6 }], condition: { type: 'enemiesAtLeast', count: 2 }, desc: '' },
    ],
  },
  elder_treant: {
    id: 'elder_treant', name: '고목 수호자', element: 'forest', role: 'tank', range: 'melee', isBoss: true,
    base: { hp: 760, atk: 20, def: 10, spd: 38 }, xp: 60, gold: 90, stoneChance: 1,
    skills: [
      { id: 'et_basic', name: '가지 휘두르기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'et_roots', name: '뿌리 조이기', kind: 'active', cooldown: 8, target: 'enemyAll', effects: [{ type: 'damage', coef: 0.75 }], condition: { type: 'none' }, desc: '' },
      { id: 'et_ult', name: '고목의 분노', kind: 'ultimate', cooldown: 0, target: 'enemyLowestHp', effects: [{ type: 'damage', coef: 2.6 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  stone_giant: {
    id: 'stone_giant', name: '바위 거인 몽돌', element: 'earth', role: 'tank', range: 'melee', isBoss: true,
    base: { hp: 1100, atk: 30, def: 18, spd: 36 }, xp: 200, gold: 400, stoneChance: 1,
    skills: [
      { id: 'sg_basic', name: '주먹', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'sg_quake', name: '지진', kind: 'active', cooldown: 9, target: 'enemyAll', effects: [{ type: 'damage', coef: 0.85 }], condition: { type: 'none' }, desc: '' },
      { id: 'sg_harden', name: '바위 피부', kind: 'active', cooldown: 14, target: 'self', effects: [{ type: 'shield', maxHpRatio: 0.12, duration: 6 }], condition: { type: 'selfHpBelow', ratio: 0.6 }, desc: '' },
      { id: 'sg_ult', name: '거인의 일격', kind: 'ultimate', cooldown: 0, target: 'enemyHighestAtk', effects: [{ type: 'damage', coef: 3.0 }], condition: { type: 'none' }, desc: '' },
    ],
  },
};

const e = (enemyId: string, level: number, slot: number) => ({ enemyId, level, slot });

export const ENCOUNTERS: Record<string, Encounter> = {
  slimes_a: { id: 'slimes_a', name: '슬라임 무리', enemies: [e('moss_slime', 1, 1), e('moss_slime', 1, 4)], firstClear: { gold: 30, stones: 1, xp: 30 } },
  slimes_b: { id: 'slimes_b', name: '슬라임과 멧돼지', enemies: [e('moss_slime', 2, 0), e('thorn_boar', 2, 2), e('moss_slime', 2, 4)], firstClear: { gold: 40, stones: 2, xp: 80 } },
  boar_den: { id: 'boar_den', name: '멧돼지 굴', enemies: [e('thorn_boar', 3, 1), e('thorn_boar', 3, 4)], firstClear: { gold: 50, stones: 2 } },
  north_path: { id: 'north_path', name: '북쪽 오솔길', enemies: [e('moss_slime', 2, 0), e('moss_slime', 2, 1), e('moss_slime', 2, 2)], firstClear: { gold: 40, stones: 1 } },
  north_grove: { id: 'north_grove', name: '이끼 숲', enemies: [e('thorn_boar', 3, 0), e('moss_slime', 3, 2), e('moss_slime', 3, 5)], firstClear: { gold: 60, stones: 2 } },
  creek: { id: 'creek', name: '개울가', enemies: [e('thorn_boar', 3, 1), e('moss_slime', 3, 3), e('moss_slime', 3, 5)], firstClear: { gold: 60, stones: 2 } },
  boss_treant: { id: 'boss_treant', name: '고목 수호자', bossKind: 'normal', enemies: [e('elder_treant', 4, 1), e('moss_slime', 3, 3)], firstClear: { gold: 200, stones: 10 } },
  // 고목 수호자 이후 지역
  mist_ford: { id: 'mist_ford', name: '물안개 여울', enemies: [e('mist_newt', 7, 4), e('mist_newt', 7, 7), e('thorn_boar', 7, 1)], firstClear: { gold: 90, stones: 3 } },
  beetle_field: { id: 'beetle_field', name: '딱정벌레 들판', enemies: [e('spark_beetle', 8, 3), e('spark_beetle', 8, 5), e('thorn_boar', 8, 1)], firstClear: { gold: 100, stones: 3 } },
  boar_herd: { id: 'boar_herd', name: '멧돼지 떼', enemies: [e('thorn_boar', 10, 0), e('thorn_boar', 10, 1), e('thorn_boar', 10, 2)], firstClear: { gold: 110, stones: 4 } },
  mixed_camp: { id: 'mixed_camp', name: '야생 무리', enemies: [e('thorn_boar', 12, 1), e('mist_newt', 12, 4), e('spark_beetle', 12, 7)], firstClear: { gold: 130, stones: 4 } },
  storm_ridge: { id: 'storm_ridge', name: '폭풍 능선', enemies: [e('spark_beetle', 13, 3), e('spark_beetle', 13, 4), e('spark_beetle', 13, 5)], firstClear: { gold: 150, stones: 5 } },
  giant_gate: { id: 'giant_gate', name: '거인의 문턱', enemies: [e('thorn_boar', 12, 0), e('thorn_boar', 12, 2), e('mist_newt', 12, 4), e('spark_beetle', 12, 7)], firstClear: { gold: 180, stones: 6 } },
  deep_woods: { id: 'deep_woods', name: '깊은 숲', enemies: [e('moss_slime', 13, 0), e('moss_slime', 13, 1), e('moss_slime', 13, 2), e('mist_newt', 13, 7)], firstClear: { gold: 150, stones: 5 } },
  boss_giant: { id: 'boss_giant', name: '바위 거인 몽돌', bossKind: 'region', enemies: [e('stone_giant', 12, 1), e('spark_beetle', 10, 6), e('mist_newt', 10, 8)], firstClear: { gold: 1000, stones: 30 } },
};
