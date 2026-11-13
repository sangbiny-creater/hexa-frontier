import type { EnemyDef } from '../core/types';

// 적대적 야생 존재는 monster로 부른다 (스피릿과 구분, 기획서 1장).
export const ENEMIES: Record<string, EnemyDef> = {
  moss_slime: {
    id: 'moss_slime', name: '잎새 강아지', art: 'leafpup', element: 'forest', role: 'dealer', range: 'melee',
    base: { hp: 45, atk: 7, def: 3, spd: 38 }, xp: 8, gold: 12, stoneChance: 0.1,
    skills: [{ id: 'ms_basic', name: '몸통 박기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' }],
  },
  thorn_boar: {
    id: 'thorn_boar', name: '바위엄니', art: 'rocktusk', element: 'earth', role: 'dealer', range: 'melee',
    base: { hp: 100, atk: 15, def: 8, spd: 44 }, xp: 12, gold: 18, stoneChance: 0.18,
    skills: [
      { id: 'tb_basic', name: '들이받기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'tb_charge', name: '가시 돌진', kind: 'active', cooldown: 8, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1.7 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  mist_newt: {
    id: 'mist_newt', name: '물결 여우', art: 'tidekit', element: 'water', role: 'dealer', range: 'ranged',
    base: { hp: 80, atk: 18, def: 6, spd: 48 }, xp: 16, gold: 20, stoneChance: 0.2,
    skills: [
      { id: 'mn_basic', name: '물줄기', kind: 'basic', cooldown: 0, target: 'enemyHighestAtk', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  fox_kit: {
    id: 'fox_kit', name: '아기 물결 여우', art: 'tidekit', fixedStage: 1, element: 'water', role: 'dealer', range: 'ranged',
    base: { hp: 55, atk: 10, def: 4, spd: 44 }, xp: 10, gold: 15, stoneChance: 0.15,
    skills: [{ id: 'fk_basic', name: '물방울', kind: 'basic', cooldown: 0, target: 'enemyHighestAtk', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' }],
  },
  spark_beetle: {
    id: 'spark_beetle', name: '돌풍 늑대', art: 'skywarden', element: 'electric', role: 'support', range: 'ranged',
    base: { hp: 90, atk: 15, def: 10, spd: 52 }, xp: 18, gold: 22, stoneChance: 0.22,
    skills: [
      { id: 'sb_basic', name: '정전기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'sb_arc', name: '연쇄 번개', kind: 'active', cooldown: 9, target: 'enemyAll', effects: [{ type: 'damage', coef: 0.6 }], condition: { type: 'enemiesAtLeast', count: 2 }, desc: '' },
    ],
  },
  elder_treant: {
    id: 'elder_treant', name: '고목 골렘', art: 'grovegolem', fixedStage: 2, element: 'forest', role: 'tank', range: 'melee', isBoss: true,
    base: { hp: 1180, atk: 20, def: 10, spd: 38 }, xp: 60, gold: 90, stoneChance: 1,
    skills: [
      { id: 'et_basic', name: '가지 휘두르기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'et_roots', name: '뿌리 조이기', kind: 'active', cooldown: 8, target: 'enemyAll', effects: [{ type: 'damage', coef: 0.75 }], condition: { type: 'none' }, desc: '' },
      { id: 'et_ult', name: '고목의 분노', kind: 'ultimate', cooldown: 0, target: 'enemyLowestHp', effects: [{ type: 'damage', coef: 2.6 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  stone_giant: {
    id: 'stone_giant', name: '테라스톤', art: 'terrastone', fixedStage: 3, element: 'earth', role: 'tank', range: 'melee', isBoss: true,
    base: { hp: 1100, atk: 30, def: 18, spd: 36 }, xp: 200, gold: 400, stoneChance: 1,
    skills: [
      { id: 'sg_basic', name: '주먹', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'sg_quake', name: '지진', kind: 'active', cooldown: 9, target: 'enemyAll', effects: [{ type: 'damage', coef: 0.85 }], condition: { type: 'none' }, desc: '' },
      { id: 'sg_harden', name: '바위 피부', kind: 'active', cooldown: 14, target: 'self', effects: [{ type: 'shield', maxHpRatio: 0.12, duration: 6 }], condition: { type: 'selfHpBelow', ratio: 0.6 }, desc: '' },
      { id: 'sg_ult', name: '거인의 일격', kind: 'ultimate', cooldown: 0, target: 'enemyHighestAtk', effects: [{ type: 'damage', coef: 3.0 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  // ── P01 몬스터 (D58): 야생 스피릿 + 새 중간 보스 ──
  leaf_deer: {
    id: 'leaf_deer', name: '잎사슴', art: 'leafkit', element: 'forest', role: 'support', range: 'ranged',
    base: { hp: 85, atk: 13, def: 8, spd: 46 }, xp: 14, gold: 18, stoneChance: 0.18,
    skills: [
      { id: 'ld_basic', name: '잎날', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'ld_cheer', name: '숲의 노래', kind: 'active', cooldown: 10, target: 'allyAll', effects: [{ type: 'buffAtk', ratio: 0.15, duration: 5 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  wild_ember: {
    id: 'wild_ember', name: '야생 엠버윙', art: 'emberwing', element: 'fire', role: 'dealer', range: 'ranged',
    base: { hp: 72, atk: 18, def: 5, spd: 50 }, xp: 16, gold: 20, stoneChance: 0.2,
    skills: [
      { id: 'we_basic', name: '불씨', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'we_bolt', name: '화염탄', kind: 'active', cooldown: 8, target: 'enemyLowestHp', effects: [{ type: 'damage', coef: 1.6 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  wild_shell: {
    id: 'wild_shell', name: '야생 쉘타이드', art: 'shellknight', element: 'water', role: 'tank', range: 'melee',
    base: { hp: 150, atk: 10, def: 14, spd: 38 }, xp: 16, gold: 20, stoneChance: 0.2,
    skills: [
      { id: 'ws_basic', name: '박치기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'ws_taunt', name: '도발', kind: 'active', cooldown: 10, target: 'self', effects: [{ type: 'taunt', duration: 3 }, { type: 'shield', maxHpRatio: 0.1, duration: 3 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  tide_lord: {
    id: 'tide_lord', name: '해일 여우왕', art: 'tidekit', fixedStage: 3, element: 'water', role: 'dealer', range: 'ranged', isBoss: true,
    base: { hp: 950, atk: 24, def: 12, spd: 46 }, xp: 120, gold: 250, stoneChance: 1,
    skills: [
      { id: 'tl_basic', name: '물기둥', kind: 'basic', cooldown: 0, target: 'enemyHighestAtk', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'tl_wave', name: '해일', kind: 'active', cooldown: 8, target: 'enemyAll', effects: [{ type: 'damage', coef: 0.8 }], condition: { type: 'none' }, desc: '' },
      { id: 'tl_ult', name: '소용돌이', kind: 'ultimate', cooldown: 0, target: 'enemyLowestHp', effects: [{ type: 'damage', coef: 2.8 }], condition: { type: 'none' }, desc: '' },
    ],
  },
  storm_king: {
    id: 'storm_king', name: '폭풍 늑대왕', art: 'skywarden', fixedStage: 3, element: 'electric', role: 'dealer', range: 'melee', isBoss: true,
    base: { hp: 1050, atk: 27, def: 14, spd: 52 }, xp: 160, gold: 320, stoneChance: 1,
    skills: [
      { id: 'sk_basic', name: '번개 발톱', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1 }], condition: { type: 'none' }, desc: '' },
      { id: 'sk_storm', name: '뇌우', kind: 'active', cooldown: 9, target: 'enemyAll', effects: [{ type: 'damage', coef: 0.75 }, { type: 'debuffDef', ratio: 0.15, duration: 4 }], condition: { type: 'none' }, desc: '' },
      { id: 'sk_ult', name: '천둥 질주', kind: 'ultimate', cooldown: 0, target: 'enemyHighestAtk', effects: [{ type: 'damage', coef: 3.0 }], condition: { type: 'none' }, desc: '' },
    ],
  },
};
