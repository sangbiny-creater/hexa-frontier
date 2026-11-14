// 헥사 전술 전투 (D109·D117) 스테이지 10개: 지형(7×12 헥사), 적 배치, 승리 조건, 보상·합류 스피릿.
// 좌표: c(0~6 가로), r(0 = 맨 위 ~ 11 = 맨 아래). 홀수 줄은 반 칸 오른쪽(odd-r).
import type { Element, Role, Terrain, UnitDef } from './data';

export const COLS = 7; // D117: 9칸 → 7칸 (칸을 크게)
export const ROWS = 12;

/** 적 유닛 정의 (id는 e_로 시작 — 아군 스피릿과 겹치지 않게). 그림은 스피릿 그림의 다른 단계 */
export const ENEMIES: Record<string, UnitDef> = {
  e_leafpup: { id: 'e_leafpup', name: '잎새 강아지', art: 'leafpup-1', element: 'forest', role: 'pmelee', desc: '' },
  e_leafkit: { id: 'e_leafkit', name: '잎사슴', art: 'leafkit-2', element: 'forest', role: 'mranged', desc: '' },
  e_bloom: { id: 'e_bloom', name: '꽃요정', art: 'bloomel-2', element: 'forest', role: 'healer', desc: '' },
  e_golem: { id: 'e_golem', name: '고목 골렘', art: 'grovegolem-2', element: 'forest', role: 'tank', bonus: { hp: 40, atk: 4, def: 4 }, desc: '' },
  e_tidekit: { id: 'e_tidekit', name: '물결 여우', art: 'tidekit-2', element: 'water', role: 'mmelee', desc: '' },
  e_shell: { id: 'e_shell', name: '껍질 기사', art: 'shellknight-3', element: 'water', role: 'tank', desc: '' },
  e_coral: { id: 'e_coral', name: '산호 사수', art: 'shellknight-2', element: 'water', role: 'pranged', desc: '' },
  e_tidelord: { id: 'e_tidelord', name: '해일 여우왕', art: 'tidekit-3', element: 'water', role: 'mranged', bonus: { hp: 50, atk: 5, res: 4 }, desc: '' },
  e_ember: { id: 'e_ember', name: '불꽃새', art: 'emberwing-2', element: 'fire', role: 'mranged', desc: '' },
  e_flame: { id: 'e_flame', name: '불씨 정령', art: 'emberwing-3', element: 'fire', role: 'support', desc: '' },
  e_boar: { id: 'e_boar', name: '바위엄니', art: 'rocktusk-2', element: 'earth', role: 'pmelee', desc: '' },
  e_rockguard: { id: 'e_rockguard', name: '돌 파수꾼', art: 'rocktusk-3', element: 'earth', role: 'tank', desc: '' },
  e_terra: { id: 'e_terra', name: '테라스톤', art: 'terrastone-3', element: 'earth', role: 'mranged', bonus: { hp: 70, atk: 5, def: 6 }, desc: '' },
  e_wolf: { id: 'e_wolf', name: '돌풍 늑대', art: 'skywarden-2', element: 'wind', role: 'pmelee', bonus: { move: 1 }, desc: '' },
  e_gale: { id: 'e_gale', name: '돌풍 궁수', art: 'galewing-3', element: 'wind', role: 'pranged', desc: '' },
  e_windsage: { id: 'e_windsage', name: '바람 현자', art: 'galewing-2', element: 'wind', role: 'healer', desc: '' },
  e_storm: { id: 'e_storm', name: '폭풍 늑대왕', art: 'skywarden-3', element: 'wind', role: 'mmelee', bonus: { hp: 90, atk: 7, def: 4, res: 4, move: 1 }, desc: '' },
};

export interface EnemySpawn {
  id: string;
  lv: number;
  c: number;
  r: number;
  boss?: boolean;
  ai?: 'charge' | 'hold' | 'guard'; // charge: 바로 달려옴, hold: 사거리에 들어오면 움직임, guard: 제자리
}
export interface StageDef {
  n: number;
  name: string;
  story: string;
  map: string[]; // 12줄 × 7글자: . 평지, f 숲, h 언덕, w 물, # 바위, c 야영지
  deploy: [number, number][]; // 아군 배치 칸
  enemies: EnemySpawn[];
  win: 'rout' | 'boss';
  turns: number; // 제한 턴
  gold: number;
  items: string[]; // 첫 클리어 보상
  joins: string[]; // 첫 클리어 후 합류
  tip: string;
}

const T: Record<string, Terrain> = { '.': 'plain', f: 'forest', h: 'hill', w: 'water', '#': 'rock', c: 'camp' };
export const terrainAt = (st: StageDef, c: number, r: number): Terrain | null => (c < 0 || r < 0 || c >= COLS || r >= ROWS ? null : T[st.map[r][c]] ?? 'plain');

const BOTTOM: [number, number][] = [
  [2, 11],
  [3, 11],
  [4, 11],
  [1, 10],
  [2, 10],
  [3, 10],
  [4, 10],
];

export const STAGES: StageDef[] = [
  {
    n: 1,
    name: '숲 입구의 첫 싸움',
    story: '숲 입구에 잎새 강아지들이 길을 막았다. 아렌과 스피릿들이 처음으로 함께 싸운다.',
    map: ['.f...f.', 'f..h..f', '..f....', '..f..#.', '...f...', 'h.....f', '.f..#..', '....f..', '..h....', '.......', 'f.....f', '..c....'],
    deploy: BOTTOM,
    enemies: [
      { id: 'leafpup', lv: 1, c: 2, r: 4 },
      { id: 'leafpup', lv: 1, c: 4, r: 3, ai: 'hold' },
      { id: 'leafkit', lv: 1, c: 5, r: 1, ai: 'hold' },
    ],
    win: 'rout',
    turns: 15,
    gold: 120,
    items: ['potion', 'potion'],
    joins: ['galewing'],
    tip: '유닛을 누르면 파란 칸(이동)이 보여요. 이동한 뒤 [공격]. 🔥엠버윙은 🌿숲 몬스터에게 강해요!',
  },
  {
    n: 2,
    name: '물안개 여울',
    story: '여울을 건너야 한다. 물결 여우들이 물 위에서 기다린다. 물 속성 적에게는 🌪️바람이 강하다.',
    map: ['.h...h.', '.......', '.www...', 'wwwww..', '.www.ww', '..w.www', 'f...ww.', '....w..', '.f.....', 'h....f.', '.......', '...c...'],
    deploy: BOTTOM,
    enemies: [
      { id: 'tidekit', lv: 2, c: 2, r: 3 },
      { id: 'tidekit', lv: 3, c: 5, r: 4 },
      { id: 'coral', lv: 2, c: 1, r: 1, ai: 'hold' },
      { id: 'coral', lv: 2, c: 5, r: 1, ai: 'hold' },
      { id: 'shell', lv: 3, c: 3, r: 0, ai: 'hold' },
    ],
    win: 'rout',
    turns: 16,
    gold: 160,
    items: ['bow1', 'ether'],
    joins: ['leafkit'],
    tip: '물 칸은 이동이 3칸 몫이고 받는 피해가 늘어요(물 속성은 1칸 몫). 🌪️게일윙의 화살이 물 속성에 유리해요.',
  },
  {
    n: 3,
    name: '고목의 뜰',
    story: '숲의 주인 고목 골렘이 깨어났다. 골렘만 쓰러뜨리면 길이 열린다.',
    map: ['ff...ff', '..f.f..', 'f..h..f', '.f...f.', '...f...', 'f.....f', '.#.f.#.', '.......', 'f..h..f', '.......', '.f...f.', '...c...'],
    deploy: BOTTOM,
    enemies: [
      { id: 'golem', lv: 5, c: 3, r: 1, boss: true, ai: 'guard' },
      { id: 'bloom', lv: 4, c: 2, r: 0, ai: 'guard' },
      { id: 'leafpup', lv: 3, c: 1, r: 4 },
      { id: 'leafpup', lv: 4, c: 5, r: 4 },
      { id: 'leafkit', lv: 3, c: 0, r: 2, ai: 'hold' },
      { id: 'leafkit', lv: 4, c: 6, r: 2, ai: 'hold' },
    ],
    win: 'boss',
    turns: 18,
    gold: 220,
    items: ['staff1', 'armor1'],
    joins: ['tidekit', 'leafpup'],
    tip: '승리 조건: 👑보스 격파. 꽃요정(힐러)이 골렘을 치료하니 먼저 노려요. 숲 칸 위에선 받는 피해 -15%.',
  },
  {
    n: 4,
    name: '바위엄니 고개',
    story: '좁은 고갯길. 바위엄니 무리가 언덕 위에서 내려온다.',
    map: ['..h.h..', '.......', '#.h.h.#', '.......', '#..#..#', '...h...', '.......', '#.#.#.#', '.......', '..h.h..', '.......', '#..c..#'],
    deploy: BOTTOM,
    enemies: [
      { id: 'boar', lv: 5, c: 2, r: 3 },
      { id: 'boar', lv: 5, c: 4, r: 3 },
      { id: 'boar', lv: 6, c: 3, r: 5 },
      { id: 'rockguard', lv: 5, c: 3, r: 1, ai: 'hold' },
      { id: 'ember', lv: 5, c: 2, r: 0, ai: 'hold' },
      { id: 'ember', lv: 5, c: 4, r: 0, ai: 'hold' },
    ],
    win: 'rout',
    turns: 18,
    gold: 280,
    items: ['sword1', 'robe1'],
    joins: ['rocktusk'],
    tip: '좁은 길에선 탱커를 앞에 세워 길목을 막아요. ⛰️대지 적에게는 🌿숲, 🔥불 적에게는 💧물이 강해요.',
  },
  {
    n: 5,
    name: '개울 동굴',
    story: '어두운 동굴 속 물길. 해일 여우왕이 동굴 깊은 곳을 지킨다.',
    map: ['.w...w.', '.ww.ww.', 'w..h..w', '..www..', '.w...w.', '.w.#.w.', 'w.....w', '..w.w..', '.......', '.h...h.', '.......', '...c...'],
    deploy: BOTTOM,
    enemies: [
      { id: 'tidelord', lv: 8, c: 3, r: 2, boss: true, ai: 'hold' },
      { id: 'shell', lv: 7, c: 2, r: 3, ai: 'guard' },
      { id: 'shell', lv: 7, c: 4, r: 3, ai: 'guard' },
      { id: 'tidekit', lv: 7, c: 0, r: 5 },
      { id: 'tidekit', lv: 7, c: 6, r: 5 },
      { id: 'coral', lv: 6, c: 1, r: 1, ai: 'hold' },
      { id: 'coral', lv: 6, c: 5, r: 1, ai: 'hold' },
    ],
    win: 'boss',
    turns: 20,
    gold: 340,
    items: ['claw1', 'gem'],
    joins: ['terrastone'],
    tip: '껍질 기사는 방어가 높아요 → 마법(✨🔮💚📯)으로. 산호 사수는 방어가 낮아요 → 물리로.',
  },
  {
    n: 6,
    name: '불씨 언덕',
    story: '바위 틈에서 불길이 솟는다. 불꽃새들이 하늘을 덮었다.',
    map: ['h.h.h.h', '.......', '..#.#..', '..h.h..', '#.....#', '.h.#.h.', '.......', 'h.#.#.h', '.......', '.h...h.', '.......', '...c...'],
    deploy: BOTTOM,
    enemies: [
      { id: 'ember', lv: 9, c: 1, r: 1, ai: 'hold' },
      { id: 'ember', lv: 9, c: 5, r: 1, ai: 'hold' },
      { id: 'ember', lv: 9, c: 3, r: 3 },
      { id: 'flame', lv: 9, c: 3, r: 0, ai: 'hold' },
      { id: 'boar', lv: 9, c: 1, r: 4 },
      { id: 'boar', lv: 9, c: 5, r: 4 },
      { id: 'rockguard', lv: 10, c: 3, r: 6 },
    ],
    win: 'rout',
    turns: 20,
    gold: 400,
    items: ['staff2', 'amulet'],
    joins: ['flarewing', 'coralguard'],
    tip: '언덕 위에선 받는 피해 -20%. 원거리 딜러를 언덕에 올려 두세요.',
  },
  {
    n: 7,
    name: '테라스톤 광산',
    story: '거대한 돌 마법사 테라스톤이 광산을 막고 있다.',
    map: ['#.....#', '..h.h..', '.#...#.', '...h...', '.#.#.#.', '.......', '.h.#.h.', '.......', '.#...#.', '.......', '..h.h..', '#..c..#'],
    deploy: BOTTOM,
    enemies: [
      { id: 'terra', lv: 12, c: 3, r: 1, boss: true, ai: 'hold' },
      { id: 'rockguard', lv: 11, c: 2, r: 3, ai: 'guard' },
      { id: 'rockguard', lv: 11, c: 4, r: 3, ai: 'guard' },
      { id: 'boar', lv: 11, c: 0, r: 5 },
      { id: 'boar', lv: 11, c: 6, r: 5 },
      { id: 'boar', lv: 12, c: 3, r: 5 },
      { id: 'flame', lv: 11, c: 1, r: 1, ai: 'hold' },
    ],
    win: 'boss',
    turns: 22,
    gold: 480,
    items: ['sword2', 'robe2'],
    joins: ['skywarden'],
    tip: '⛰️대지에는 🌿숲이 강해요. 테라스톤은 마법 공격 → 마법방어가 높은 유닛으로 막아요.',
  },
  {
    n: 8,
    name: '폭풍 들판',
    story: '넓은 들판. 돌풍 늑대들이 사방에서 달려든다. 둘러싸이지 않게!',
    map: ['.......', '.f...f.', '.......', 'f..h..f', '.......', '..f.f..', '.......', 'f..h..f', '.......', '.f...f.', '.......', '...c...'],
    deploy: BOTTOM,
    enemies: [
      { id: 'wolf', lv: 14, c: 0, r: 4 },
      { id: 'wolf', lv: 14, c: 6, r: 4 },
      { id: 'wolf', lv: 14, c: 1, r: 2 },
      { id: 'wolf', lv: 14, c: 5, r: 2 },
      { id: 'gale', lv: 14, c: 2, r: 0, ai: 'hold' },
      { id: 'gale', lv: 14, c: 4, r: 0, ai: 'hold' },
      { id: 'windsage', lv: 13, c: 3, r: 1, ai: 'hold' },
    ],
    win: 'rout',
    turns: 22,
    gold: 560,
    items: ['boots', 'bow2'],
    joins: ['grovegolem'],
    tip: '🌪️바람에는 ⛰️대지가 강해요. 넓은 곳에선 뭉쳐서 서로 지켜요.',
  },
  {
    n: 9,
    name: '얼어붙은 호수',
    story: '호수 한가운데 섬. 물과 바람의 군세가 함께 기다린다.',
    map: ['ww...ww', 'w.h.h.w', '.......', 'w.www.w', '..www..', 'w.....w', 'ww.h.ww', 'w.....w', '...w...', 'w.....w', '.......', 'w..c..w'],
    deploy: BOTTOM,
    enemies: [
      { id: 'shell', lv: 16, c: 2, r: 1, ai: 'guard' },
      { id: 'shell', lv: 16, c: 4, r: 1, ai: 'guard' },
      { id: 'tidekit', lv: 16, c: 1, r: 4 },
      { id: 'tidekit', lv: 16, c: 5, r: 4 },
      { id: 'gale', lv: 16, c: 3, r: 0, ai: 'hold' },
      { id: 'wolf', lv: 16, c: 2, r: 5 },
      { id: 'wolf', lv: 16, c: 4, r: 5 },
      { id: 'windsage', lv: 15, c: 3, r: 2, ai: 'hold' },
    ],
    win: 'rout',
    turns: 24,
    gold: 640,
    items: ['plate', 'heart'],
    joins: ['stormwing', 'magmatusk'],
    tip: '물 속성 적과 바람 속성 적이 섞여 있어요. 상대마다 유리한 스피릿을 붙이세요.',
  },
  {
    n: 10,
    name: '폭풍의 정상',
    story: '마지막 봉우리. 폭풍 늑대왕이 모든 바람을 거느린다.',
    map: ['..h.h..', '.......', '.h...h.', '...#...', '.f...f.', '.......', '.h.#.h.', '.......', '.f...f.', '.......', '.......', '#..c..#'],
    deploy: BOTTOM,
    enemies: [
      { id: 'storm', lv: 20, c: 3, r: 1, boss: true, ai: 'hold' },
      { id: 'wolf', lv: 18, c: 1, r: 3 },
      { id: 'wolf', lv: 18, c: 5, r: 3 },
      { id: 'wolf', lv: 18, c: 3, r: 5 },
      { id: 'gale', lv: 18, c: 2, r: 0, ai: 'hold' },
      { id: 'gale', lv: 18, c: 4, r: 0, ai: 'hold' },
      { id: 'windsage', lv: 18, c: 3, r: 2, ai: 'hold' },
      { id: 'rockguard', lv: 18, c: 1, r: 6 },
    ],
    win: 'boss',
    turns: 25,
    gold: 800,
    items: ['sword3', 'staff3'],
    joins: [],
    tip: '마지막 싸움! 늑대왕은 이동력이 높고 마법 근접 공격을 해요. 탱커로 막고 ⛰️대지 딜러로 쳐요.',
  },
];

export const ROLE_ORDER: Role[] = ['tank', 'pmelee', 'mmelee', 'pranged', 'mranged', 'healer', 'support'];
export type { Element };
