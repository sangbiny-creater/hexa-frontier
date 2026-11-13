// HEXA FRONTIER RPG (D72) 데이터: 캐릭터 3종, 기술, 몬스터, 스피릿 5종, 장비.
// 상성: 💧물 → 🔥불 → 🌿숲 → ⛰️대지 → 🌪️바람 → 💧물 (화살표 쪽에 강함)
export type Element = 'water' | 'fire' | 'forest' | 'earth' | 'wind';
export const ELEMENTS: Element[] = ['water', 'fire', 'forest', 'earth', 'wind'];
export const EL_ICON: Record<Element, string> = { water: '💧', fire: '🔥', forest: '🌿', earth: '⛰️', wind: '🌪️' };
export const EL_NAME: Record<Element, string> = { water: '물', fire: '불', forest: '숲', earth: '대지', wind: '바람' };
export const EL_COLOR: Record<Element, string> = { water: '#4aa3ff', fire: '#ff7a45', forest: '#5cc46a', earth: '#c9a063', wind: '#7fe0d0' };

/** a가 b를 공격할 때 상성 배율 */
export function typeMul(a: Element | null, b: Element): number {
  if (!a) return 1;
  const i = ELEMENTS.indexOf(a);
  const j = ELEMENTS.indexOf(b);
  if ((i + 1) % 5 === j) return 1.5;
  if ((j + 1) % 5 === i) return 0.67;
  return 1;
}
/** 이 속성이 이기는 속성 */
export const beats = (e: Element): Element => ELEMENTS[(ELEMENTS.indexOf(e) + 1) % 5];
/** 이 속성을 이기는 속성 */
export const beatenBy = (e: Element): Element => ELEMENTS[(ELEMENTS.indexOf(e) + 4) % 5];

// ── 기술 ──
export type Shape = 'single' | 'around' | 'splash' | 'self';
export interface SkillDef {
  id: string;
  name: string;
  icon: string;
  dmg: 'phys' | 'magic';
  element: Element | null;
  range: number; // 1 = 바로 옆 칸
  coef: number;
  cd: number; // 턴
  sp?: number; // D105: 쓰는 데 드는 SP (기본 공격은 0)
  heal?: number; // D105: 준 피해의 n% 회복
  shape: Shape; // single: 대상 하나, around: 내 주변 6칸 전부, splash: 대상 + 그 주변, self: 나에게
  effect?: { kind: 'stun' | 'slow' | 'poison' | 'rally'; turns: number };
  desc: string;
}

export const SKILLS: Record<string, SkillDef> = {
  slash: { id: 'slash', name: '베기', icon: '🗡️', dmg: 'phys', element: null, range: 1, coef: 1, cd: 0, shape: 'single', desc: '바로 옆의 적을 벤다.' },
  // D105: 검사 액티브 기술 6개 (테크트리에서 배우고, 4칸에 골라 넣는다). 쿨타임은 짧고 SP가 진짜 제한
  whirl: { id: 'whirl', name: '회오리 베기', icon: '🌀', dmg: 'phys', element: null, range: 1, coef: 0.9, cd: 2, sp: 30, shape: 'around', desc: '주변 6칸의 적을 모두 벤다. 둘러싸였을 때 최고.' },
  thrust: { id: 'thrust', name: '꿰뚫기', icon: '🔱', dmg: 'phys', element: null, range: 2, coef: 1.3, cd: 1, sp: 20, shape: 'single', desc: '2칸 안의 적을 찌른다. 멀리서 쏘는 몬스터에게 좋다.' },
  drain: { id: 'drain', name: '흡혈 검', icon: '🩸', dmg: 'phys', element: null, range: 1, coef: 1.2, cd: 2, sp: 25, heal: 35, shape: 'single', desc: '벤 피해의 35%만큼 체력을 되찾는다.' },
  bash: { id: 'bash', name: '방패 강타', icon: '🛡️', dmg: 'phys', element: 'earth', range: 1, coef: 1.4, cd: 3, sp: 25, shape: 'single', effect: { kind: 'stun', turns: 1 }, desc: '⛰️대지 속성. 강하게 내려쳐 1턴 기절시킨다.' },
  smash: { id: 'smash', name: '거인의 일격', icon: '🔨', dmg: 'phys', element: null, range: 1, coef: 2.6, cd: 4, sp: 50, shape: 'single', desc: '한 대상에게 아주 큰 피해. 보스·대장에게.' },
  rally: { id: 'rally', name: '전장의 함성', icon: '📯', dmg: 'phys', element: null, range: 0, coef: 0, cd: 8, sp: 40, shape: 'self', effect: { kind: 'rally', turns: 4 }, desc: '4턴 동안 내 피해 +25%, 스피릿 피해 +40%.' },
  bolt: { id: 'bolt', name: '마력탄', icon: '✨', dmg: 'magic', element: null, range: 3, coef: 0.95, cd: 0, shape: 'single', desc: '3칸 안의 가장 가까운 적에게 마력탄.' },
  fireball: { id: 'fireball', name: '화염구', icon: '🔥', dmg: 'magic', element: 'fire', range: 3, coef: 1.5, cd: 4, shape: 'splash', desc: '🔥불 속성. 맞은 적과 그 주변까지 불태운다.' },
  icespear: { id: 'icespear', name: '얼음창', icon: '❄️', dmg: 'magic', element: 'water', range: 4, coef: 1.6, cd: 4, shape: 'single', effect: { kind: 'slow', turns: 2 }, desc: '💧물 속성. 맞은 적은 2턴 동안 느려진다(한 턴 걸러 움직임).' },
  arrow: { id: 'arrow', name: '화살', icon: '🏹', dmg: 'phys', element: null, range: 4, coef: 0.85, cd: 0, shape: 'single', desc: '4칸 안의 가장 가까운 적을 쏜다.' },
  gale: { id: 'gale', name: '바람 화살', icon: '🌪️', dmg: 'phys', element: 'wind', range: 5, coef: 1.5, cd: 4, shape: 'single', desc: '🌪️바람 속성. 멀리 있는 적도 꿰뚫는다.' },
  venom: { id: 'venom', name: '독화살', icon: '🌿', dmg: 'phys', element: 'forest', range: 4, coef: 0.8, cd: 5, shape: 'single', effect: { kind: 'poison', turns: 4 }, desc: '🌿숲 속성. 4턴 동안 독 피해.' },
};

// ── 캐릭터 ──
export interface HeroDef {
  id: string;
  name: string;
  title: string;
  hue: number; // 주인공 그림 색 바꾸기
  base: { hp: number; atk: number; def: number; res: number };
  skills: [string, string, string]; // 기본 공격, 기술1, 기술2
  unlock: string; // 설명
}
export const HEROES: Record<string, HeroDef> = {
  knight: { id: 'knight', name: '검사 아렌', title: '⚔️물리 근접 · 단단함', hue: 0, base: { hp: 130, atk: 13, def: 9, res: 8 }, skills: ['slash', 'whirl', 'bash'], unlock: '처음부터' },
  mage: { id: 'mage', name: '마법사 리아', title: '✨마법 원거리 · 불·물 기술', hue: 220, base: { hp: 85, atk: 14, def: 3, res: 9 }, skills: ['bolt', 'fireball', 'icespear'], unlock: '첫 야영지' },
  archer: { id: 'archer', name: '궁수 카이', title: '⚔️물리 원거리 · 바람·숲 기술', hue: 100, base: { hp: 100, atk: 12, def: 5, res: 6 }, skills: ['arrow', 'gale', 'venom'], unlock: '첫 보스를 쓰러뜨리면' },
};

// ── 몬스터 ──
export interface MonsterDef {
  id: string;
  name: string;
  art: string;
  stage?: 1 | 2 | 3;
  element: Element;
  hp: number;
  atk: number;
  def: number; // 물리 방어
  res: number; // 마법 방어
  dmg: 'phys' | 'magic';
  range: number;
  xp: number;
  gold: number;
  boss?: boolean;
  note?: string;
}
export const MONSTERS: Record<string, MonsterDef> = {
  leafpup: { id: 'leafpup', name: '잎새 강아지', art: 'leafpup', element: 'forest', hp: 34, atk: 7, def: 3, res: 3, dmg: 'phys', range: 1, xp: 10, gold: 4 },
  leafkit: { id: 'leafkit', name: '잎사슴', art: 'leafkit', element: 'forest', hp: 30, atk: 7, def: 2, res: 7, dmg: 'magic', range: 2, xp: 11, gold: 5, note: '2칸 밖에서 공격' },
  tidekit: { id: 'tidekit', name: '물결 여우', art: 'tidekit', element: 'water', hp: 36, atk: 8, def: 3, res: 12, dmg: 'magic', range: 2, xp: 13, gold: 6, note: '마법 방어가 높다' },
  shell: { id: 'shell', name: '껍질 기사', art: 'shellknight', element: 'water', hp: 52, atk: 7, def: 10, res: 5, dmg: 'phys', range: 1, xp: 15, gold: 7, note: '물리 방어가 높다 → 마법으로' },
  ember: { id: 'ember', name: '불꽃새', art: 'emberwing', element: 'fire', hp: 32, atk: 10, def: 3, res: 6, dmg: 'magic', range: 2, xp: 14, gold: 6 },
  boar: { id: 'boar', name: '바위엄니', art: 'rocktusk', element: 'earth', hp: 58, atk: 10, def: 10, res: 5, dmg: 'phys', range: 1, xp: 17, gold: 8, note: '물리 방어가 높다 → 마법으로' },
  wolf: { id: 'wolf', name: '돌풍 늑대', art: 'skywarden', element: 'wind', hp: 44, atk: 11, def: 6, res: 6, dmg: 'phys', range: 1, xp: 16, gold: 7, note: '빠르다(가끔 두 번 움직임)' },
  bloom: { id: 'bloom', name: '꽃요정', art: 'bloomel', element: 'forest', hp: 40, atk: 8, def: 4, res: 10, dmg: 'magic', range: 2, xp: 15, gold: 7 },
  // 보스
  golem: { id: 'golem', name: '고목 골렘', art: 'grovegolem', stage: 2, element: 'forest', hp: 170, atk: 12, def: 10, res: 8, dmg: 'phys', range: 1, xp: 120, gold: 80, boss: true },
  tidelord: { id: 'tidelord', name: '해일 여우왕', art: 'tidekit', stage: 3, element: 'water', hp: 220, atk: 12, def: 8, res: 18, dmg: 'magic', range: 2, xp: 200, gold: 140, boss: true },
  terra: { id: 'terra', name: '테라스톤', art: 'terrastone', stage: 3, element: 'earth', hp: 300, atk: 16, def: 22, res: 10, dmg: 'phys', range: 1, xp: 300, gold: 200, boss: true },
  storm: { id: 'storm', name: '폭풍 늑대왕', art: 'skywarden', stage: 3, element: 'wind', hp: 360, atk: 19, def: 14, res: 14, dmg: 'phys', range: 1, xp: 420, gold: 300, boss: true },
};

// ── 스피릿 5종: 따라다니며, 레벨마다 '자기가 이기는 속성' 몬스터에게 피해 +8% ──
export interface SpiritDef {
  element: Element;
  name: string;
  art: string;
}
export const SPIRITS: Record<Element, SpiritDef> = {
  fire: { element: 'fire', name: '엠버윙', art: 'emberwing' },
  water: { element: 'water', name: '쉘나이트', art: 'shellknight' },
  forest: { element: 'forest', name: '블루멜', art: 'bloomel' },
  earth: { element: 'earth', name: '락터스크', art: 'rocktusk' },
  wind: { element: 'wind', name: '게일윙', art: 'galewing' },
};
export const SPIRIT_BONUS_PER_LV = 0.08;
export const SPIRIT_GUARD_PER_LV = 0.04; // 그 속성 몬스터에게 받는 피해 -4%/레벨

// ── 장비 ──
export type Slot = 'weapon' | 'armor' | 'ring';
export type Rarity = 'common' | 'rare' | 'epic';
export const SLOT_NAME: Record<Slot, string> = { weapon: '무기', armor: '갑옷', ring: '반지' };
export const RARITY_NAME: Record<Rarity, string> = { common: '일반', rare: '희귀', epic: '영웅' };
export const RARITY_COLOR: Record<Rarity, string> = { common: '#c9d3df', rare: '#5aa9ff', epic: '#c58cff' };
export interface Item {
  uid: string;
  slot: Slot;
  name: string;
  rarity: Rarity;
  level: number;
  atk: number;
  def: number;
  res: number;
  hp: number;
  /** 이 속성 몬스터에게 피해 +% */
  vs?: { element: Element; pct: number };
}

export const BAL = {
  heroGrowth: 0.11, // 레벨당 능력치 +11%
  monGrowth: 0.12, // D101: 몬스터가 레벨마다 주인공보다 빨리 세지던 것(0.16) 완화
  rangedMul: 0.7, // D101: 2칸 밖 원거리 공격은 70% 피해
  defK: 30, // 피해 = 공격 × 계수 × defK/(defK+방어)
  xpBase: 20, // D101: 그냥 앞으로 가도 판마다 약 2레벨 오르게 (예전 18, 1.45)
  xpPow: 1.25,
  xpGrowth: 0.2, // 몬스터 레벨당 경험치 +20%
  spiritPointEvery: 60, // 스피릿 경험치 60마다 1포인트 (점점 증가)
  regenPct: 0.03, // 근처에 적이 없을 때 한 걸음마다 회복
  aggro: 4,
  respawnTurns: 40,
  goldMul: 0.4,
  campCooldown: 15, // 야영지는 한 번 쉬면 15턴 뒤에 다시
  stallStart: 18, // 이만큼 앞으로 못 가면 몬스터가 몰려오기 시작
  stallEvery: 10,
  extraCap: 8,
  dropChance: 0.14,
  benchXp: 0.5, // 쉬고 있는 캐릭터도 경험치 50%
  heroDmg: 1.6,
  monDmg: 2.3, // (예전 값, 안 씀)
  monDmgStart: 1.2, // D101·D107: 몬스터 공격 배율 1판
  monDmgStep: 0.26, // 판마다 +
  monHp: 1.25, // D107: 몬스터 체력 배율 (기술·SP로 강해진 만큼)
  deathGoldLoss: 0.1,
  // D105 SP: 기술은 쿨타임이 끝나고 SP가 있어야 쓴다. 기본 공격으로 모으고 매 턴 조금씩 찬다
  spMax: 100,
  spRegen: 3, // 매 턴
  spOnHit: 7, // 기본 공격이 맞을 때마다
  // D106 포위(다굴): 나를 둘러싼 몬스터가 1마리 늘 때마다 방어 -12% (최대 -45%)
  surroundPer: 0.12,
  surroundMin: 0.55,
  // D107 보스를 쓰러뜨린 뒤 몰려오는 몬스터(경험치 벌기): n턴마다 한 무리, 살아 있는 수 상한
  waveEvery: 5,
  waveCap: 10,
};

// ── 기술 테크트리 (D79): 레벨업마다 기술 포인트 1. 캐릭터마다 3단계 ──
export type NodeEffect =
  | { kind: 'skillDmg'; skill: string; pct: number }
  | { kind: 'skillCd'; skill: string; delta: number }
  | { kind: 'skillRange'; skill: string; delta: number }
  | { kind: 'stat'; stat: 'hp' | 'atk' | 'def' | 'res'; pct: number }
  | { kind: 'allDmg'; pct: number }
  | { kind: 'lifesteal'; pct: number }
  | { kind: 'crit'; pct: number }
  | { kind: 'petAtk'; pct: number }
  | { kind: 'stunPlus'; turns: number }
  | { kind: 'poisonMul'; mul: number }
  | { kind: 'typeBonus'; pct: number }
  | { kind: 'spMax'; n: number }
  | { kind: 'spHit'; n: number };
export interface TreeNode {
  id: string;
  name: string;
  icon: string;
  /** D105: passive = 찍으면 늘 적용, active = 배우면 기술 칸에 넣어 쓰는 기술 */
  type: 'passive' | 'active';
  skill?: string; // active일 때 그 기술

  tier: 1 | 2 | 3;
  level: number; // 필요 캐릭터 레벨
  maxRank: number; // 여러 번 찍을 수 있다 (D85)
  pre?: string; // 윗 노드
  preRanks?: number; // 윗 노드에 이만큼 찍으면 열림
  per: NodeEffect[]; // 1랭크당 효과
  desc: string;
}
// 기술 테크트리 (D85): 노드마다 여러 번 찍고, 윗 노드에 3포인트 넣으면 아래가 열린다
export const TREES: Record<string, TreeNode[]> = {
  // D105: 패시브(늘 적용)와 액티브(기술 칸에 넣어 씀). 1단계는 바로, 2단계(레벨 4)·3단계(레벨 8)는 윗 노드 3포인트
  knight: [
    { id: 'k_slash', name: '날카로운 베기', icon: '🗡️', type: 'passive', tier: 1, level: 1, maxRank: 10, per: [{ kind: 'skillDmg', skill: 'slash', pct: 8 }], desc: '기본 공격(베기) 피해 +8% / 랭크' },
    { id: 'k_whirl', name: '회오리 베기', icon: '🌀', type: 'active', skill: 'whirl', tier: 1, level: 1, maxRank: 5, per: [{ kind: 'skillDmg', skill: 'whirl', pct: 12 }], desc: '주변 6칸 공격 · SP 30 · 랭크마다 피해 +12%' },
    { id: 'k_body', name: '단단한 몸', icon: '🛡️', type: 'passive', tier: 1, level: 1, maxRank: 10, per: [{ kind: 'stat', stat: 'def', pct: 5 }, { kind: 'stat', stat: 'res', pct: 4 }, { kind: 'stat', stat: 'hp', pct: 2 }], desc: '방어 +5%, 마법방어 +4%, 체력 +2% / 랭크' },
    { id: 'k_thrust', name: '꿰뚫기', icon: '🔱', type: 'active', skill: 'thrust', tier: 2, level: 4, maxRank: 5, pre: 'k_slash', preRanks: 3, per: [{ kind: 'skillDmg', skill: 'thrust', pct: 12 }], desc: '2칸 찌르기 · SP 20 · 랭크마다 피해 +12%' },
    { id: 'k_drain', name: '흡혈 검', icon: '🩸', type: 'active', skill: 'drain', tier: 2, level: 4, maxRank: 5, pre: 'k_whirl', preRanks: 3, per: [{ kind: 'skillDmg', skill: 'drain', pct: 12 }], desc: '베고 피해의 35% 회복 · SP 25 · 랭크마다 피해 +12%' },
    { id: 'k_focus', name: '정신 집중', icon: '🧘', type: 'passive', tier: 2, level: 4, maxRank: 10, pre: 'k_whirl', preRanks: 3, per: [{ kind: 'spMax', n: 8 }, { kind: 'spHit', n: 1 }], desc: '최대 SP +8, 기본 공격마다 SP +1 / 랭크' },
    { id: 'k_bash', name: '방패 강타', icon: '⛰️', type: 'active', skill: 'bash', tier: 2, level: 4, maxRank: 5, pre: 'k_body', preRanks: 3, per: [{ kind: 'skillDmg', skill: 'bash', pct: 12 }, { kind: 'stunPlus', turns: 0.25 }], desc: '내려쳐 기절 · SP 25 · 랭크마다 피해 +12%, 4랭크면 기절 +1턴' },
    { id: 'k_smash', name: '거인의 일격', icon: '🔨', type: 'active', skill: 'smash', tier: 3, level: 8, maxRank: 5, pre: 'k_thrust', preRanks: 3, per: [{ kind: 'skillDmg', skill: 'smash', pct: 12 }], desc: '한 대상에 큰 피해 · SP 50 · 랭크마다 피해 +12%' },
    { id: 'k_master', name: '검의 달인', icon: '⚔️', type: 'passive', tier: 3, level: 8, maxRank: 10, pre: 'k_drain', preRanks: 3, per: [{ kind: 'allDmg', pct: 3 }, { kind: 'crit', pct: 1 }], desc: '모든 피해 +3%, 치명타 +1% / 랭크' },
    { id: 'k_rally', name: '전장의 함성', icon: '📯', type: 'active', skill: 'rally', tier: 3, level: 8, maxRank: 5, pre: 'k_bash', preRanks: 3, per: [{ kind: 'petAtk', pct: 6 }], desc: '4턴 동안 내 피해 +25%·스피릿 +40% · SP 40 · 랭크마다 스피릿 공격 +6%' },
    { id: 'k_giant', name: '거인의 체력', icon: '💪', type: 'passive', tier: 3, level: 8, maxRank: 10, pre: 'k_bash', preRanks: 3, per: [{ kind: 'stat', stat: 'hp', pct: 5 }], desc: '최대 체력 +5% / 랭크' },
  ],
};

// ── 스피릿 테크트리 (D80): 스피릿 레벨에 따라 저절로 열린다 ──
export const SPIRIT_TREE: Record<Element, { lv3: string; lv6: string; lv10: string }> = {
  fire: { lv3: '🔥 화상: 공격한 적이 3턴 동안 불탄다', lv6: '🔥 불꽃 오라: 캐릭터 공격 +10%', lv10: '🔥 화염 폭발: 5턴마다 주변 2칸의 적 모두에게 큰 피해' },
  water: { lv3: '💧 치유의 물결: 3턴마다 캐릭터·스피릿 체력 회복', lv6: '💧 물의 가호: 근처에 적이 없을 때 회복 2배', lv10: '💧 해일: 5턴마다 주변 2칸의 적 모두에게 큰 피해' },
  forest: { lv3: '🌿 덩굴: 30% 확률로 적을 1턴 묶는다(못 움직임)', lv6: '🌿 생명의 숲: 캐릭터 최대 체력 +12%', lv10: '🌿 가시 폭풍: 5턴마다 주변 2칸의 적 모두에게 큰 피해' },
  earth: { lv3: '⛰️ 도발: 적들이 이 스피릿을 먼저 노린다, 방어 +50%', lv6: '⛰️ 대지의 갑옷: 캐릭터 방어·마법방어 +12%', lv10: '⛰️ 지진: 5턴마다 주변 2칸의 적 모두에게 큰 피해' },
  wind: { lv3: '🌪️ 질풍: 30% 확률로 두 번 공격', lv6: '🌪️ 바람의 눈: 캐릭터 치명타 +10%', lv10: '🌪️ 폭풍: 5턴마다 주변 2칸의 적 모두에게 큰 피해' },
};
