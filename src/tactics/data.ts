// 헥사 전술 전투 (D109) 데이터: 속성·역할 7종·기술·유닛(스피릿)·지형·아이템.
// 턴제 전술 전투: 아군 차례에 유닛마다 이동 → 행동(공격·기술·아이템·대기), 적군 차례에 적이 움직인다.

// ── 속성 (D8·D14·D15: 물 → 불 → 숲 → 대지 → 바람 → 물, 유리 ×1.3 / 불리 ×0.75) ──
export type Element = 'water' | 'fire' | 'forest' | 'earth' | 'wind';
export const ELEMENTS: Element[] = ['water', 'fire', 'forest', 'earth', 'wind'];
export const EL_ICON: Record<Element, string> = { water: '💧', fire: '🔥', forest: '🌿', earth: '⛰️', wind: '🌪️' };
export const EL_NAME: Record<Element, string> = { water: '물', fire: '불', forest: '숲', earth: '대지', wind: '바람' };
export const EL_COLOR: Record<Element, string> = { water: '#4aa3ff', fire: '#ff7a45', forest: '#5cc46a', earth: '#c9a063', wind: '#7fe0d0' };
export const EL_STRONG = 1.3;
export const EL_WEAK = 0.75;
/** a 속성이 b 속성을 공격할 때 배율 */
export function elMul(a: Element | null, b: Element | null): number {
  if (!a || !b) return 1;
  const i = ELEMENTS.indexOf(a);
  const j = ELEMENTS.indexOf(b);
  if ((i + 1) % 5 === j) return EL_STRONG;
  if ((j + 1) % 5 === i) return EL_WEAK;
  return 1;
}
export const beats = (e: Element): Element => ELEMENTS[(ELEMENTS.indexOf(e) + 1) % 5];
export const beatenBy = (e: Element): Element => ELEMENTS[(ELEMENTS.indexOf(e) + 4) % 5];

// ── 역할 7종 ──
export type Role = 'tank' | 'pmelee' | 'mmelee' | 'pranged' | 'mranged' | 'healer' | 'support';
export interface RoleDef {
  id: Role;
  name: string;
  icon: string;
  dmg: 'phys' | 'magic';
  move: number;
  range: [number, number]; // 기본 공격 사거리 (최소, 최대)
  base: { hp: number; atk: number; def: number; res: number };
  grow: { hp: number; atk: number; def: number; res: number }; // 레벨당 증가
  skills: [string, string]; // 1레벨, 5레벨에 배움
  desc: string;
}
export const ROLES: Record<Role, RoleDef> = {
  tank: { id: 'tank', name: '탱커', icon: '🛡️', dmg: 'phys', move: 3, range: [1, 1], base: { hp: 62, atk: 10, def: 13, res: 8 }, grow: { hp: 7, atk: 1.1, def: 1.5, res: 1 }, skills: ['taunt', 'shieldbash'], desc: '단단하다. 앞에서 적을 막고 끌어당긴다.' },
  pmelee: { id: 'pmelee', name: '물리 근접 딜러', icon: '⚔️', dmg: 'phys', move: 4, range: [1, 1], base: { hp: 46, atk: 15, def: 7, res: 4 }, grow: { hp: 5, atk: 1.8, def: 0.8, res: 0.5 }, skills: ['power', 'whirl'], desc: '빠르고 세게 벤다. 방어(물리)가 낮은 적에게.' },
  mmelee: { id: 'mmelee', name: '마법 근접 딜러', icon: '🔮', dmg: 'magic', move: 4, range: [1, 1], base: { hp: 42, atk: 14, def: 5, res: 9 }, grow: { hp: 4.5, atk: 1.7, def: 0.6, res: 1 }, skills: ['elstrike', 'drain'], desc: '마법을 두른 근접 공격. 단단한(방어 높은) 적에게.' },
  pranged: { id: 'pranged', name: '물리 원거리 딜러', icon: '🏹', dmg: 'phys', move: 3, range: [2, 3], base: { hp: 36, atk: 13, def: 4, res: 4 }, grow: { hp: 3.5, atk: 1.6, def: 0.5, res: 0.5 }, skills: ['snipe', 'volley'], desc: '2~3칸 떨어져서 쏜다. 바로 옆은 못 쏜다.' },
  mranged: { id: 'mranged', name: '마법 원거리 딜러', icon: '✨', dmg: 'magic', move: 3, range: [1, 2], base: { hp: 32, atk: 14, def: 3, res: 9 }, grow: { hp: 3, atk: 1.8, def: 0.4, res: 1 }, skills: ['elbolt', 'blast'], desc: '1~2칸 마법. 범위 마법으로 무리를 친다.' },
  healer: { id: 'healer', name: '힐러', icon: '💚', dmg: 'magic', move: 3, range: [1, 2], base: { hp: 36, atk: 8, def: 4, res: 10 }, grow: { hp: 3.5, atk: 1, def: 0.5, res: 1.1 }, skills: ['heal', 'massheal'], desc: '아군을 치료한다(SP 없이). 공격은 약하다.' },
  support: { id: 'support', name: '서포터', icon: '📯', dmg: 'magic', move: 4, range: [1, 2], base: { hp: 40, atk: 9, def: 5, res: 7 }, grow: { hp: 4, atk: 1.1, def: 0.6, res: 0.8 }, skills: ['cheer', 'weaken'], desc: '아군을 강하게, 적을 약하게.' },
};

// ── 기술 ──
export type SkillKind = 'attack' | 'heal' | 'buff' | 'debuff';
export interface SkillDef {
  id: string;
  name: string;
  icon: string;
  kind: SkillKind;
  sp: number;
  range: [number, number]; // 0 = 자기 자신
  power: number; // 공격: 피해 배율, 치료: 공격력 배율
  area?: 'target+adj' | 'self+adj' | 'allies2'; // 범위
  dmg?: 'phys' | 'magic'; // 없으면 역할 공격 종류
  effect?: { kind: 'stun' | 'atkUp' | 'defDown' | 'taunt' | 'guard'; turns: number; pct?: number };
  drain?: number; // 준 피해의 n% 회복
  ownElement?: boolean; // 내 속성으로 친다(상성 적용 + 피해 +10%)
  desc: string;
}
export const SKILLS: Record<string, SkillDef> = {
  taunt: { id: 'taunt', name: '도발', icon: '📢', kind: 'buff', sp: 8, range: [0, 0], power: 0, effect: { kind: 'taunt', turns: 1 }, desc: '다음 적 차례에 2칸 안의 적이 나를 노린다. 이 턴 방어 +30%.' },
  shieldbash: { id: 'shieldbash', name: '방패 강타', icon: '🔨', kind: 'attack', sp: 12, range: [1, 1], power: 1.3, effect: { kind: 'stun', turns: 1 }, desc: '1.3배 피해 + 1턴 기절(행동 못 함).' },
  power: { id: 'power', name: '강타', icon: '💥', kind: 'attack', sp: 8, range: [1, 1], power: 1.7, desc: '1.7배 피해. 반격을 받지 않는다.' },
  whirl: { id: 'whirl', name: '회오리 베기', icon: '🌀', kind: 'attack', sp: 14, range: [0, 0], power: 1.0, area: 'self+adj', desc: '주변 6칸의 적 모두에게 1.0배 피해.' },
  elstrike: { id: 'elstrike', name: '속성 일격', icon: '🌟', kind: 'attack', sp: 8, range: [1, 1], power: 1.6, ownElement: true, desc: '내 속성을 실어 1.6배 마법 피해 (상성 적용, +10%).' },
  drain: { id: 'drain', name: '흡수', icon: '🩸', kind: 'attack', sp: 12, range: [1, 1], power: 1.2, drain: 60, desc: '1.2배 마법 피해, 준 피해의 60% 회복.' },
  snipe: { id: 'snipe', name: '저격', icon: '🎯', kind: 'attack', sp: 10, range: [2, 4], power: 1.5, desc: '2~4칸, 1.5배 피해.' },
  volley: { id: 'volley', name: '화살비', icon: '🌧️', kind: 'attack', sp: 16, range: [2, 3], power: 0.9, area: 'target+adj', desc: '2~3칸, 대상과 그 주변의 적에게 0.9배 피해.' },
  elbolt: { id: 'elbolt', name: '원소탄', icon: '☄️', kind: 'attack', sp: 10, range: [1, 3], power: 1.5, ownElement: true, desc: '1~3칸, 내 속성 1.5배 마법 피해 (상성 적용, +10%).' },
  blast: { id: 'blast', name: '원소 폭발', icon: '💫', kind: 'attack', sp: 18, range: [1, 3], power: 1.0, area: 'target+adj', ownElement: true, desc: '1~3칸, 대상과 그 주변의 적에게 1.0배 마법 피해.' },
  heal: { id: 'heal', name: '치유', icon: '💚', kind: 'heal', sp: 0, range: [1, 2], power: 2.2, desc: '1~2칸 아군 체력 회복 (SP 없음).' },
  massheal: { id: 'massheal', name: '치유의 비', icon: '🌈', kind: 'heal', sp: 16, range: [0, 0], power: 1.5, area: 'allies2', desc: '2칸 안의 아군 모두 회복.' },
  cheer: { id: 'cheer', name: '격려', icon: '📯', kind: 'buff', sp: 8, range: [1, 2], power: 0, effect: { kind: 'atkUp', turns: 2, pct: 30 }, desc: '아군 하나 공격 +30% (2턴).' },
  weaken: { id: 'weaken', name: '약화', icon: '🌫️', kind: 'debuff', sp: 10, range: [1, 3], power: 0, effect: { kind: 'defDown', turns: 2, pct: 30 }, desc: '적 하나 방어·마법방어 -30% (2턴).' },
  command: { id: 'command', name: '지휘', icon: '🚩', kind: 'buff', sp: 12, range: [0, 0], power: 0, area: 'allies2', effect: { kind: 'atkUp', turns: 1, pct: 20 }, desc: '2칸 안의 아군 모두 공격 +20% (1턴).' },
};

// ── 유닛(스피릿·주인공) ──
export interface UnitDef {
  id: string;
  name: string;
  art: string; // public/assets/<art>.webp (t: 전신, p: 얼굴)
  element: Element | null;
  role: Role;
  bonus?: Partial<{ hp: number; atk: number; def: number; res: number; move: number }>; // 개성
  skills?: [string, string]; // 역할 기본 기술 대신
  leader?: boolean; // 쓰러지면 패배
  desc: string;
}
export const UNITS: Record<string, UnitDef> = {
  aren: { id: 'aren', name: '아렌', art: 'hero', element: null, role: 'pmelee', bonus: { hp: 8, def: 2 }, skills: ['power', 'command'], leader: true, desc: '모험가. 쓰러지면 패배. 속성이 없어 상성을 타지 않는다.' },
  shellknight: { id: 'shellknight', name: '쉘나이트', art: 'shellknight-1', element: 'water', role: 'tank', desc: '물의 방패. 불 속성 적을 막는 데 좋다.' },
  emberwing: { id: 'emberwing', name: '엠버윙', art: 'emberwing-1', element: 'fire', role: 'mranged', desc: '불꽃 마법사. 숲 속성 적을 태운다.' },
  bloomel: { id: 'bloomel', name: '블루멜', art: 'bloomel-1', element: 'forest', role: 'healer', desc: '꽃의 치유사.' },
  galewing: { id: 'galewing', name: '게일윙', art: 'galewing-1', element: 'wind', role: 'pranged', desc: '바람 궁수. 물 속성 적을 꿰뚫는다.' },
  rocktusk: { id: 'rocktusk', name: '락터스크', art: 'rocktusk-1', element: 'earth', role: 'pmelee', bonus: { hp: 6 }, desc: '바위 엄니로 들이받는다. 바람 속성 적에게 약하다.' },
  tidekit: { id: 'tidekit', name: '타이드킷', art: 'tidekit-1', element: 'water', role: 'mmelee', desc: '물결을 두른 발톱.' },
  leafkit: { id: 'leafkit', name: '리프킷', art: 'leafkit-1', element: 'forest', role: 'support', desc: '숲의 전령. 아군을 북돋운다.' },
  skywarden: { id: 'skywarden', name: '스카이워든', art: 'skywarden-1', element: 'wind', role: 'mmelee', desc: '폭풍을 부르는 늑대.' },
  terrastone: { id: 'terrastone', name: '테라스톤', art: 'terrastone-1', element: 'earth', role: 'mranged', desc: '대지를 울리는 돌 마법사.' },
  grovegolem: { id: 'grovegolem', name: '그로브골렘', art: 'grovegolem-1', element: 'forest', role: 'tank', bonus: { hp: 10, move: -1 }, desc: '고목의 거인. 느리지만 아주 단단하다.' },
  flarewing: { id: 'flarewing', name: '플레어윙', art: 'emberwing-2', element: 'fire', role: 'support', desc: '불꽃 깃발. 적의 방어를 녹인다.' },
  leafpup: { id: 'leafpup', name: '리프펍', art: 'leafpup-2', element: 'forest', role: 'pmelee', bonus: { move: 1 }, desc: '숲을 달리는 사냥개. 이동력 +1.' },
  stormwing: { id: 'stormwing', name: '스톰윙', art: 'galewing-2', element: 'wind', role: 'healer', desc: '바람의 치유사.' },
  coralguard: { id: 'coralguard', name: '코랄가드', art: 'shellknight-2', element: 'water', role: 'pranged', desc: '산호 창을 던진다.' },
  magmatusk: { id: 'magmatusk', name: '마그마터스크', art: 'rocktusk-2', element: 'fire', role: 'tank', desc: '용암 갑옷의 수호자.' },
};
/** 유닛 그림: '<이름>-<단계>' → 전신/얼굴 파일 */
export function unitArt(art: string, kind: 't' | 'p'): string {
  if (art === 'hero') return kind === 't' ? 'hero-t' : 'hero-p';
  const [name, tier] = art.split('-');
  return `${name}-${kind}${tier ?? 1}`;
}

// ── 지형 ──
export type Terrain = 'plain' | 'forest' | 'hill' | 'water' | 'rock' | 'camp';
export const TERRAIN: Record<Terrain, { name: string; cost: number; guard: number; heal?: number; element?: Element }> = {
  plain: { name: '평지', cost: 1, guard: 0 },
  forest: { name: '숲', cost: 2, guard: 15, element: 'forest' }, // 받는 피해 -15%
  hill: { name: '언덕', cost: 2, guard: 20, element: 'earth' },
  water: { name: '물', cost: 3, guard: -10, element: 'water' },
  rock: { name: '바위', cost: 99, guard: 0 },
  camp: { name: '야영지', cost: 1, guard: 10, heal: 20 }, // 차례 시작에 체력 20% 회복
};
/** 같은 속성 지형 위에서는 이동이 쉽고(비용 1), 피해 +10% */
export const TERRAIN_EL_BONUS = 0.1;

// ── 아이템 ──
export type ItemSlot = 'weapon' | 'armor' | 'charm';
export interface ItemDef {
  id: string;
  name: string;
  icon: string;
  slot?: ItemSlot; // 없으면 소모품
  price: number;
  stats?: Partial<{ hp: number; atk: number; def: number; res: number; move: number; sp: number }>;
  use?: { heal?: number; sp?: number }; // 소모품: 회복량(최대 체력 비율 %), SP
  roles?: Role[]; // 이 역할만 낄 수 있다 (없으면 누구나)
  desc: string;
}
export const ITEMS: Record<string, ItemDef> = {
  // 소모품 (아군 1~1칸, 행동 1번)
  potion: { id: 'potion', name: '상처약', icon: '💊', price: 30, use: { heal: 40 }, desc: '자기나 옆 아군 체력 40% 회복.' },
  hipotion: { id: 'hipotion', name: '회복약', icon: '🧪', price: 80, use: { heal: 100 }, desc: '자기나 옆 아군 체력 모두 회복.' },
  ether: { id: 'ether', name: 'SP 물약', icon: '🔷', price: 50, use: { sp: 20 }, desc: '자기나 옆 아군 SP +20.' },
  // 무기
  sword1: { id: 'sword1', name: '쇠 검', icon: '🗡️', slot: 'weapon', price: 120, stats: { atk: 4 }, roles: ['tank', 'pmelee'], desc: '공격 +4' },
  sword2: { id: 'sword2', name: '강철 대검', icon: '⚔️', slot: 'weapon', price: 420, stats: { atk: 9 }, roles: ['tank', 'pmelee'], desc: '공격 +9' },
  sword3: { id: 'sword3', name: '용의 이빨', icon: '🐉', slot: 'weapon', price: 1100, stats: { atk: 16, hp: 10 }, roles: ['tank', 'pmelee'], desc: '공격 +16, 체력 +10' },
  claw1: { id: 'claw1', name: '마력 발톱', icon: '🪝', slot: 'weapon', price: 130, stats: { atk: 4, res: 1 }, roles: ['mmelee'], desc: '공격 +4, 마법방어 +1' },
  claw2: { id: 'claw2', name: '룬 발톱', icon: '🔱', slot: 'weapon', price: 450, stats: { atk: 9, res: 3 }, roles: ['mmelee'], desc: '공격 +9, 마법방어 +3' },
  bow1: { id: 'bow1', name: '짧은 활', icon: '🏹', slot: 'weapon', price: 120, stats: { atk: 4 }, roles: ['pranged'], desc: '공격 +4' },
  bow2: { id: 'bow2', name: '바람 장궁', icon: '🎯', slot: 'weapon', price: 440, stats: { atk: 9, move: 1 }, roles: ['pranged'], desc: '공격 +9, 이동력 +1' },
  staff1: { id: 'staff1', name: '나무 지팡이', icon: '🪄', slot: 'weapon', price: 120, stats: { atk: 4, sp: 5 }, roles: ['mranged', 'healer', 'support'], desc: '공격 +4, 최대 SP +5' },
  staff2: { id: 'staff2', name: '원소의 홀', icon: '🔮', slot: 'weapon', price: 460, stats: { atk: 9, sp: 10 }, roles: ['mranged', 'healer', 'support'], desc: '공격 +9, 최대 SP +10' },
  staff3: { id: 'staff3', name: '별빛 지팡이', icon: '🌟', slot: 'weapon', price: 1150, stats: { atk: 15, sp: 15, res: 4 }, roles: ['mranged', 'healer', 'support'], desc: '공격 +15, SP +15, 마법방어 +4' },
  // 갑옷
  armor1: { id: 'armor1', name: '가죽 갑옷', icon: '🦺', slot: 'armor', price: 100, stats: { def: 3, hp: 5 }, desc: '방어 +3, 체력 +5' },
  armor2: { id: 'armor2', name: '사슬 갑옷', icon: '🛡️', slot: 'armor', price: 380, stats: { def: 7, hp: 12 }, desc: '방어 +7, 체력 +12' },
  robe1: { id: 'robe1', name: '마법사 로브', icon: '🧥', slot: 'armor', price: 110, stats: { res: 4, hp: 4 }, desc: '마법방어 +4, 체력 +4' },
  robe2: { id: 'robe2', name: '현자의 로브', icon: '🥋', slot: 'armor', price: 400, stats: { res: 8, def: 2, hp: 10 }, desc: '마법방어 +8, 방어 +2, 체력 +10' },
  plate: { id: 'plate', name: '거인의 판금', icon: '🏰', slot: 'armor', price: 1000, stats: { def: 14, res: 6, hp: 25 }, roles: ['tank'], desc: '방어 +14, 마법방어 +6, 체력 +25 (탱커)' },
  // 장신구
  boots: { id: 'boots', name: '질풍 장화', icon: '👢', slot: 'charm', price: 500, stats: { move: 1 }, desc: '이동력 +1' },
  ring: { id: 'ring', name: '힘의 반지', icon: '💍', slot: 'charm', price: 300, stats: { atk: 4 }, desc: '공격 +4' },
  amulet: { id: 'amulet', name: '수호 부적', icon: '🧿', slot: 'charm', price: 300, stats: { def: 3, res: 3 }, desc: '방어·마법방어 +3' },
  gem: { id: 'gem', name: '정령석', icon: '💎', slot: 'charm', price: 320, stats: { sp: 12 }, desc: '최대 SP +12' },
  heart: { id: 'heart', name: '생명의 심장', icon: '❤️', slot: 'charm', price: 340, stats: { hp: 20 }, desc: '체력 +20' },
};

// ── 수치 ──
export const BAL = {
  defK: 30, // 피해 = 공격 × 배율 × defK / (defK + 방어)
  counter: 0.7, // 반격 피해 배율
  crit: 0.05,
  spStart: 10,
  spTurn: 5, // 차례마다
  spHit: 3, // 기본 공격·반격이 맞으면
  spMaxBase: 30,
  xpLevel: 100, // 레벨업에 필요한 경험치 (고정)
  maxParty: [4, 4, 4, 5, 5, 5, 6, 6, 6, 6], // 스테이지별 출전 인원
};
