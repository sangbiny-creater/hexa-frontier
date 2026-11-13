import type { SpiritDef } from '../core/types';

// 스피릿 5종: 속성마다 하나 (대지 락터스크는 D58에서 추가)
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
  galewing: {
    id: 'galewing',
    name: '게일윙',
    art: 'galewing',
    stages: ['게일 칙', '게일윙', '템페스트 아처'],
    title: '바람을 타는 궁수',
    element: 'electric',
    role: 'dealer',
    range: 'ranged',
    base: { hp: 82, atk: 18, def: 6, spd: 56 },
    skills: [
      { id: 'gw_basic', name: '바람 깃털', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1.0 }], condition: { type: 'none' }, desc: '적 하나에게 깃털을 날린다.' },
      { id: 'gw_shot', name: '돌풍 화살', kind: 'active', cooldown: 6, target: 'enemyHighestAtk', effects: [{ type: 'damage', coef: 1.7 }], condition: { type: 'none' }, desc: '공격력이 가장 높은 적에게 170% 피해.' },
      { id: 'gw_ult', name: '폭풍 깃', kind: 'ultimate', cooldown: 0, target: 'enemyAll', effects: [{ type: 'damage', coef: 1.1 }, { type: 'debuffDef', ratio: 0.2, duration: 5 }], condition: { type: 'none' }, desc: '적 전체에 110% 피해 + 5초간 방어 -20%.' },
    ],
  },
  rocky: {
    id: 'rocky',
    name: '락터스크',
    art: 'rocktusk',
    stages: ['락키', '락터스크', '가이아 터스크'],
    title: '바위 엄니의 돌격대',
    element: 'earth',
    role: 'dealer',
    range: 'melee',
    base: { hp: 120, atk: 17, def: 10, spd: 44 },
    skills: [
      { id: 'rk_basic', name: '들이받기', kind: 'basic', cooldown: 0, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1.0 }], condition: { type: 'none' }, desc: '가장 앞의 적을 들이받는다.' },
      { id: 'rk_charge', name: '바위 돌진', kind: 'active', cooldown: 7, target: 'enemyDefault', effects: [{ type: 'damage', coef: 1.8 }], condition: { type: 'none' }, desc: '앞의 적에게 180% 피해.' },
      { id: 'rk_ult', name: '대지 붕괴', kind: 'ultimate', cooldown: 0, target: 'enemyAll', effects: [{ type: 'damage', coef: 1.0 }, { type: 'debuffDef', ratio: 0.15, duration: 5 }], condition: { type: 'none' }, desc: '적 전체에 100% 피해 + 5초간 방어 -15%.' },
    ],
  },
};

/** 기본 편성 슬롯 (0~2 전열, 3~5 중열, 6~8 후열) */
export const DEFAULT_SLOT: Record<string, number> = {
  tideshell: 1,
  igni: 7,
  sylphy: 6,
  galewing: 8,
  rocky: 0,
};
