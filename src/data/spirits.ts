import type { SpiritDef } from '../core/types';

// P0 스피릿 3종: 탱커 / 딜러 / 회복 (기획서 11장 P0)
export const SPIRITS: Record<string, SpiritDef> = {
  tideshell: {
    id: 'tideshell',
    name: '쉘나이트',
    art: 'shellknight',
    stages: ['쉘타이드', '리프나이트', '리바이어던'],
    title: '바다 등껍질의 수호자',
    element: 'water',
    role: 'tank',
    range: 'melee',
    base: { hp: 150, atk: 11, def: 14, spd: 40 },
    skills: [
      { id: 'ts_basic', name: '박치기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1.0 }], condition: { type: 'none' }, desc: '가장 앞의 적을 들이받는다.' },
      { id: 'ts_taunt', name: '도발의 포효', kind: 'active', cooldown: 9, target: 'self', effects: [{ type: 'taunt', duration: 4 }, { type: 'shield', maxHpRatio: 0.12, duration: 4 }], condition: { type: 'none' }, desc: '4초간 적의 공격을 끌어모으고 최대 HP 12% 보호막을 얻는다.' },
      { id: 'ts_ult', name: '파도의 방벽', kind: 'ultimate', cooldown: 0, target: 'allyAll', effects: [{ type: 'shield', maxHpRatio: 0.1, duration: 6 }], condition: { type: 'allyHpBelow', ratio: 0.85 }, desc: '아군 전체에 시전자 최대 HP 10% 보호막. 아군이 다치기 전엔 아껴 둔다.' },
    ],
  },
  igni: {
    id: 'igni',
    name: '엠버윙',
    art: 'emberwing',
    stages: ['엠버 칙', '플레어윙', '피닉스 아처'],
    title: '불꽃 깃털의 궁수',
    element: 'fire',
    role: 'dealer',
    range: 'ranged',
    base: { hp: 80, atk: 19, def: 6, spd: 50 },
    skills: [
      { id: 'ig_basic', name: '불씨', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1.0 }], condition: { type: 'none' }, desc: '적 하나에게 불씨를 날린다.' },
      { id: 'ig_bolt', name: '화염탄', kind: 'active', cooldown: 6, target: 'enemyLowestHp', effects: [{ type: 'damage', coef: 1.9 }], condition: { type: 'none' }, desc: 'HP가 가장 낮은 적에게 190% 피해.' },
      { id: 'ig_ult', name: '불꽃 폭풍', kind: 'ultimate', cooldown: 0, target: 'enemyAll', effects: [{ type: 'damage', coef: 1.3 }], condition: { type: 'none' }, desc: '적 전체에 130% 피해.' },
    ],
  },
  sylphy: {
    id: 'sylphy',
    name: '블루멜',
    art: 'bloomel',
    stages: ['버들링', '플로라나', '버던티스'],
    title: '꽃피우는 숲의 치유사',
    element: 'forest',
    role: 'healer',
    range: 'ranged',
    base: { hp: 90, atk: 13, def: 7, spd: 46 },
    skills: [
      { id: 'mr_basic', name: '꽃가루', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 0.8 }], condition: { type: 'none' }, desc: '적 하나에게 꽃가루를 날린다.' },
      { id: 'mr_heal', name: '새싹의 숨결', kind: 'active', cooldown: 6, target: 'allyLowestHp', effects: [{ type: 'heal', coef: 2.2 }], condition: { type: 'allyHpBelow', ratio: 0.75 }, desc: 'HP가 75% 아래인 아군이 있으면 가장 다친 아군을 회복.' },
      { id: 'mr_ult', name: '숲의 축복', kind: 'ultimate', cooldown: 0, target: 'allyAll', effects: [{ type: 'heal', coef: 1.4 }, { type: 'buffAtk', ratio: 0.15, duration: 6 }], condition: { type: 'allyHpBelow', ratio: 0.7 }, desc: '아군 전체 회복 + 6초간 공격 +15%.' },
    ],
  },
};

/** 기본 편성 슬롯 (0~2 전열, 3~5 중열, 6~8 후열) */
export const DEFAULT_SLOT: Record<string, number> = {
  tideshell: 1,
  igni: 7,
  sylphy: 6,
};
