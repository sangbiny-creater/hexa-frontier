// 헥사 전술 전투 (D109·D117) 스테이지 10개: 지형(6×12 헥사), 적 배치, 승리 조건, 보상·합류 스피릿.
// 좌표: c(0~5 가로), r(0 = 맨 위 ~ 11 = 맨 아래). 홀수 줄은 반 칸 오른쪽(odd-r).
import { createRng, hashSeed } from '../core/rng';
import { EL_ICON, EL_NAME, beatenBy, SPIRIT_IDS, UNITS, type Element, type Role, type Terrain, type UnitDef } from './data';

// D120: 화면에 보이는 가로는 6칸(VIEW_COLS). 지도 자체는 판마다 더 넓고 길 수 있다(최대 COLS×ROWS) — 위아래·좌우로 밀어서 본다
export const VIEW_COLS = 6;
export const COLS = 12; // 지도 최대 가로
export const ROWS = 18; // 지도 최대 세로
/** 이 판 지도의 크기 */
export const sizeOf = (st: StageDef) => ({ cols: st.map[0].length, rows: st.map.length });

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
  map: string[]; // 12줄 × 6글자: . 평지, f 숲, h 언덕, w 물, # 바위, c 야영지
  deploy: [number, number][]; // 아군 배치 칸
  enemies: EnemySpawn[];
  win: 'rout' | 'boss';
  turns: number; // 제한 턴
  gold: number;
  items: string[]; // 첫 클리어 보상
  joins: string[]; // 첫 클리어 후 합류
  tip: string;
  power?: number; // 적 능력치 배율 (주제가 있는 판은 상성을 맞춰야 수월하게)
}

const T: Record<string, Terrain> = { '.': 'plain', f: 'forest', h: 'hill', w: 'water', '#': 'rock', c: 'camp' };
export const terrainAt = (st: StageDef, c: number, r: number): Terrain | null => (c < 0 || r < 0 || r >= st.map.length || c >= st.map[r].length ? null : T[st.map[r][c]] ?? 'plain');

const BOTTOM: [number, number][] = [
  [2, 11],
  [3, 11],
  [4, 11],
  [1, 10],
  [2, 10],
  [3, 10],
  [4, 10],
];

const HAND: StageDef[] = [
  {
    n: 1,
    name: '숲 입구의 첫 싸움',
    story: '숲 입구에 잎새 강아지들이 길을 막았다. 주인공과 스피릿들이 처음으로 함께 싸운다.',
    map: ['.f...f', 'f..h..', '..f...', '..f..#', '...f..', 'h.....', '.f..#.', '....f.', '..h...', '......', 'f.....', '..c...'],
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
    map: ['.h...h', '......', '.www..', 'wwwww.', '.www.w', '..w.ww', 'f...ww', '....w.', '.f....', 'h....f', '......', '...c..'],
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
    map: ['ff...f', '..f.f.', 'f..h..', '.f...f', '...f..', 'f.....', '.#.f.#', '......', 'f..h..', '......', '.f...f', '...c..'],
    deploy: BOTTOM,
    enemies: [
      { id: 'golem', lv: 5, c: 3, r: 1, boss: true, ai: 'guard' },
      { id: 'bloom', lv: 4, c: 2, r: 0, ai: 'guard' },
      { id: 'leafpup', lv: 3, c: 1, r: 4 },
      { id: 'leafpup', lv: 4, c: 5, r: 4 },
      { id: 'leafkit', lv: 3, c: 0, r: 2, ai: 'hold' },
      { id: 'leafkit', lv: 4, c: 5, r: 2, ai: 'hold' },
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
    map: ['..h.h.', '......', '#.h.h.', '......', '#..#..', '...h..', '......', '#.#.#.', '......', '..h.h.', '......', '#..c..'],
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
    map: ['.w...w', '.ww.ww', 'w..h..', '..www.', '.w...w', '.w.#.w', 'w.....', '..w.w.', '......', '.h...h', '......', '...c..'],
    deploy: BOTTOM,
    enemies: [
      { id: 'tidelord', lv: 8, c: 3, r: 2, boss: true, ai: 'hold' },
      { id: 'shell', lv: 7, c: 2, r: 3, ai: 'guard' },
      { id: 'shell', lv: 7, c: 4, r: 3, ai: 'guard' },
      { id: 'tidekit', lv: 7, c: 0, r: 5 },
      { id: 'tidekit', lv: 7, c: 5, r: 5 },
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
    map: ['h.h.h.', '......', '..#.#.', '..h.h.', '#.....', '.h.#.h', '......', 'h.#.#.', '......', '.h...h', '......', '...c..'],
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
    map: ['#.....', '..h.h.', '.#...#', '...h..', '.#.#.#', '......', '.h.#.h', '......', '.#...#', '......', '..h.h.', '#..c..'],
    deploy: BOTTOM,
    enemies: [
      { id: 'terra', lv: 12, c: 3, r: 1, boss: true, ai: 'hold' },
      { id: 'rockguard', lv: 11, c: 2, r: 3, ai: 'guard' },
      { id: 'rockguard', lv: 11, c: 4, r: 3, ai: 'guard' },
      { id: 'boar', lv: 11, c: 0, r: 5 },
      { id: 'boar', lv: 11, c: 5, r: 5 },
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
    map: ['......', '.f...f', '......', 'f..h..', '......', '..f.f.', '......', 'f..h..', '......', '.f...f', '......', '...c..'],
    deploy: BOTTOM,
    enemies: [
      { id: 'wolf', lv: 14, c: 0, r: 4 },
      { id: 'wolf', lv: 14, c: 5, r: 4 },
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
    map: ['ww...w', 'w.h.h.', '......', 'w.www.', '..www.', 'w.....', 'ww.h.w', 'w.....', '...w..', 'w.....', '......', 'w..c..'],
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
    map: ['..h.h.', '......', '.h...h', '...#..', '.f...f', '......', '.h.#.h', '......', '.f...f', '......', '......', '#..c..'],
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

// ───────── D119: 100판 ─────────
/** 판별 적 기준 레벨 (100판에 약 50레벨) */
export const baseLv = (n: number) => Math.max(1, Math.round(1 + (n - 1) * 0.5));

/** 스피릿 합류 일정: 시작 3종(쉘나이트·엠버윙·블루멜) + 22종을 4판마다. 고르지 않은 주인공은 98판을 깨면(99판부터) 합류 */
export const JOIN_ORDER = ['aeralis', 'flameclaw', 'cloudtusk', 'sylphia', 'wavefang', 'neritha', 'aquadron', 'rocktusk', 'pebblin', 'terrastone', 'bladewarden', 'grovegolem', 'sylvanarcher', 'ignagolem', 'skywarden', 'willowisp', 'aqualyn', 'terrawisp', 'flamora', 'geomancer', 'pyronomad', 'cloudavian'];
export const joinsAt = (n: number): string[] => {
  const i = (n - 2) / 4;
  return Number.isInteger(i) && i >= 0 && i < JOIN_ORDER.length ? [JOIN_ORDER[i]] : [];
};
export const START_SPIRITS = ['shellknight', 'emberwing', 'bloomel'];

/** 장(10판씩)마다 적 속성 주제 */
export const CHAPTERS: { name: string; els: Element[] | null; names: string[] }[] = [
  { name: '1장 · 첫 원정', els: null, names: [] },
  { name: '2장 · 물안개 해안', els: ['water'], names: ['조개 해변', '물안개 둑길', '산호 여울', '파도 동굴', '소금 늪', '거품 호수', '썰물 갯벌', '물보라 절벽', '해초 숲', '해일 여왕의 둥지'] },
  { name: '3장 · 불꽃 화산', els: ['fire'], names: ['재 언덕', '숯불 고개', '용암 개울', '불씨 숲', '연기 협곡', '화염 광장', '마그마 굴', '붉은 사막', '불새 둥지', '화산의 심장'] },
  { name: '4장 · 바람 고원', els: ['wind'], names: ['산들 초원', '구름 다리', '회오리 들판', '깃털 언덕', '돌풍 고개', '하늘 정원', '바람개비 마을', '천둥 봉우리', '구름 성', '폭풍의 눈'] },
  { name: '5장 · 대지 협곡', els: ['earth'], names: ['자갈 길', '바위 미로', '사암 절벽', '흙먼지 협곡', '수정 광산', '돌기둥 숲', '모래 폭포', '지진 계곡', '거인의 무덤', '대지의 왕좌'] },
  { name: '6장 · 깊은 숲', els: ['forest'], names: ['이끼 오솔길', '버섯 숲', '덩굴 미로', '고목 마을', '반딧불 늪', '꽃잎 계곡', '가시 덤불', '잎새 신전', '세계수 뿌리', '숲의 심판자'] },
  { name: '7장 · 증기의 땅', els: ['water', 'fire'], names: ['온천 계곡', '증기 늪', '끓는 호수', '안개 화산', '수증기 동굴', '뜨거운 여울', '흑요석 해변', '용암 바다', '증기 요새', '물과 불의 군주'] },
  { name: '8장 · 모래폭풍', els: ['wind', 'earth'], names: ['모래 언덕', '바람 사암', '먼지 회오리', '돌풍 협곡', '떠다니는 바위', '사막 탑', '모래폭풍 길', '바위 하늘', '폭풍 성채', '모래폭풍의 왕'] },
  { name: '9장 · 혼돈의 숲', els: ['forest', 'water', 'fire'], names: ['불타는 숲', '젖은 정글', '이끼 화산', '안개 밀림', '덩굴 호수', '불꽃 늪', '세 갈래 숲', '뒤엉킨 뿌리', '혼돈의 제단', '혼돈의 수호자'] },
  { name: '10장 · 헥사의 끝', els: null, names: ['다섯 갈래 길', '원소의 문', '무지개 다리', '부서진 하늘', '마지막 야영지', '원소의 탑', '시간의 정원', '별의 협곡', '두 영웅의 재회', '헥사의 끝'] },
];
export const chapterOf = (n: number) => Math.floor((n - 1) / 10);

/** 스피릿 그림을 쓰는 야생 적 (e_<스피릿 id>), 장 보스 (e_boss_<id>) */
for (const id of SPIRIT_IDS) {
  const u = UNITS[id];
  ENEMIES[`e_${id}`] = { ...u, id: `e_${id}`, name: `야생 ${u.name}`, hero: false };
  ENEMIES[`e_boss_${id}`] = { ...u, id: `e_boss_${id}`, name: `${u.name} 군주`, hero: false, bonus: { hp: 40 + (u.bonus?.hp ?? 0), atk: 4, def: 4, res: 4, move: u.bonus?.move ?? 0 } };
}
const BY_ROLE = (el: Element, role: Role) => SPIRIT_IDS.find((id) => UNITS[id].element === el && UNITS[id].role === role)!;
const ROLES5: Role[] = ['tank', 'pmelee', 'mmelee', 'pranged', 'mranged', 'healer', 'support'];
const roleOfEl = (el: Element, kind: 'tank' | 'melee' | 'ranged' | 'healer' | 'support'): string => {
  if (kind === 'tank' || kind === 'healer' || kind === 'support') return BY_ROLE(el, kind);
  const ids = SPIRIT_IDS.filter((id) => UNITS[id].element === el && (kind === 'melee' ? ['pmelee', 'mmelee'] : ['pranged', 'mranged']).includes(UNITS[id].role));
  return ids[0];
};
void ROLES5;

/** 장 주제에 맞는 지형 */
function genMap(n: number, els: Element[], rng: () => number, W: number, H: number): string[] {
  const g: string[][] = Array.from({ length: H }, () => Array(W).fill('.'));
  const feat: Record<Element, string> = { water: 'w', fire: 'h', forest: 'f', earth: 'h', wind: 'f' };
  const dens = 0.16 + Math.min(0.1, n / 1000);
  for (let r = 0; r < H - 2; r++)
    for (let c = 0; c < W; c++) {
      const x = rng();
      const el = els[Math.floor(rng() * els.length)];
      if (x < dens) g[r][c] = feat[el];
      else if (x < dens + 0.06 && r > 0 && r < H - 3) g[r][c] = el === 'fire' || el === 'earth' ? '#' : rng() < 0.5 ? '#' : feat[el];
      else if (x < dens + 0.1) g[r][c] = rng() < 0.5 ? 'f' : 'h';
    }
  // 물 주제는 물웅덩이를 이어 붙인다
  if (els.includes('water')) for (let k = 0; k < 3; k++) {
    let c = Math.floor(rng() * W), r = 2 + Math.floor(rng() * (H - 6));
    for (let t = 0; t < 4; t++) {
      g[r][c] = 'w';
      c = Math.max(0, Math.min(W - 1, c + (rng() < 0.5 ? -1 : 1)));
      r = Math.max(1, Math.min(H - 4, r + (rng() < 0.5 ? 0 : 1)));
    }
  }
  g[H - 1][Math.floor(W / 2) - 1] = 'c';
  if (n % 10 >= 5) g[Math.floor(H / 2)][Math.floor(rng() * W)] = 'c';
  for (const [c, r] of bottomDeploy(W, H)) if (g[r][c] === '#' || g[r][c] === 'w') g[r][c] = '.';
  return g.map((row) => row.join(''));
}
/** 배치 칸에서 모든 적 칸까지 바위를 피해 갈 수 있는가 */
function connected(st: StageDef): boolean {
  const seen = new Set<string>();
  const [c0, r0] = st.deploy[0];
  const q: [number, number][] = [[c0, r0]];
  seen.add(`${c0},${r0}`);
  while (q.length) {
    const [c, r] = q.shift()!;
    const d = r & 1 ? [[1, 0], [-1, 0], [1, -1], [0, -1], [1, 1], [0, 1]] : [[1, 0], [-1, 0], [0, -1], [-1, -1], [0, 1], [-1, 1]];
    for (const [dc, dr] of d) {
      const nc = c + dc, nr = r + dr;
      const t = terrainAt(st, nc, nr);
      if (!t || t === 'rock' || seen.has(`${nc},${nr}`)) continue;
      seen.add(`${nc},${nr}`);
      q.push([nc, nr]);
    }
  }
  return st.enemies.every((e) => seen.has(`${e.c},${e.r}`)) && st.deploy.every(([c, r]) => seen.has(`${c},${r}`));
}

const ITEM_TIERS = [['potion', 'armor1', 'robe1', 'sword1', 'bow1', 'staff1', 'claw1'], ['ether', 'ring', 'amulet', 'heart', 'gem'], ['armor2', 'robe2', 'sword2', 'bow2', 'staff2', 'claw2', 'boots'], ['hipotion', 'plate', 'sword3', 'staff3']];

/** 아래 두 줄 가운데에 아군 배치 칸 7개 */
function bottomDeploy(W: number, H: number): [number, number][] {
  const m = Math.floor(W / 2);
  return [
    [m - 1, H - 1],
    [m, H - 1],
    [m + 1, H - 1],
    [m - 2, H - 2],
    [m - 1, H - 2],
    [m, H - 2],
    [m + 1, H - 2],
  ];
}

/** D119: 주제 판의 적 배율 — 상성이 맞으면(피해 ×1.3, 받는 피해 ×0.75) 할 만하고, 안 맞으면 버겁게 */
export const POWER = (n: number) => 1.0 + Math.min(0.12, n / 800);

function genStage(n: number): StageDef {
  const ch = CHAPTERS[chapterOf(n)];
  const k = (n - 1) % 10;
  const boss = n % 10 === 0;
  const all: Element[] = ['water', 'fire', 'forest', 'earth', 'wind'];
  for (let attempt = 0; attempt < 40; attempt++) {
    const rng = createRng(hashSeed('tac-stage', n, attempt));
    const themeEls: Element[] = ch.els ?? [all[(n + attempt) % 5], all[(n + 2) % 5]];
    // D120: 지도는 판이 갈수록 넓고 길어진다 (가로 7~10, 세로 12~16). 화면에는 가로 6칸만 보인다
    const W = Math.min(10, 7 + Math.floor((n - 11) / 25));
    const H = Math.min(16, 12 + Math.floor((n - 11) / 22));
    const map = genMap(n, themeEls, rng, W, H);
    // 적 수 ≈ 출전 인원 (+판 뒤쪽·후반에 1~2): 상성을 맞추면 이기고, 안 맞추면 지는 정도
    const party = n < 10 ? 4 : n < 40 ? 5 : 6;
    // 속성이 셋 이상 섞인 장(9·10장)은 한 가지 상성으로 대응할 수 없으니 적을 하나 줄인다
    const count = party + (k >= 6 ? 1 : 0) + Math.floor(n / 50) - (boss ? 1 : 0) - (themeEls.length >= 3 || !ch.els ? 1 : 0) - (n === 100 ? 1 : 0); // 마지막 판은 보스에 집중
    const lv = baseLv(n) + 1;
    const kinds: ('tank' | 'melee' | 'ranged' | 'healer' | 'support')[] = ['tank', 'melee', 'ranged', 'melee', 'ranged', 'healer', 'melee', 'support', 'ranged'];
    const enemies: EnemySpawn[] = [];
    const used = new Set<string>();
    const free = (c: number, r: number) => !used.has(`${c},${r}`) && T[map[r][c]] !== 'rock';
    const spot = (rowLo: number, rowHi: number): [number, number] | null => {
      for (let t = 0; t < 60; t++) {
        const c = Math.floor(rng() * W), r = rowLo + Math.floor(rng() * (rowHi - rowLo + 1));
        if (free(c, r)) return [c, r];
      }
      return null;
    };
    if (boss) {
      const el = themeEls[0];
      const pick = roleOfEl(el, (['tank', 'melee', 'ranged'] as const)[Math.floor(n / 10) % 3]);
      const p = spot(0, 1);
      if (p) {
        used.add(`${p[0]},${p[1]}`);
        enemies.push({ id: `boss_${pick}`, lv: lv + 3, c: p[0], r: p[1], boss: true, ai: 'hold' });
      }
    }
    for (let i = 0; i < count; i++) {
      // 주제 속성 85%, 나머지 15% (주제를 이기는 속성은 섞지 않음)
      const off = all.filter((e) => !themeEls.includes(e) && !themeEls.some((t) => beatenBy(t) === e));
      const el = rng() < 0.85 || !off.length ? themeEls[Math.floor(rng() * themeEls.length)] : off[Math.floor(rng() * off.length)];
      const kind = kinds[i % kinds.length];
      const back = kind === 'ranged' || kind === 'healer' || kind === 'support';
      const p = back ? spot(0, Math.floor(H * 0.3)) : spot(2, Math.floor(H * 0.55));
      if (!p) continue;
      used.add(`${p[0]},${p[1]}`);
      const elite = n % 5 === 0 && !boss && i === 0;
      enemies.push({ id: roleOfEl(el, kind), lv: lv + (elite ? 3 : Math.floor(rng() * 2)) - (i > 5 ? 1 : 0), c: p[0], r: p[1], ai: back ? 'hold' : rng() < 0.7 ? 'charge' : 'hold' });
    }
    const counters = [...new Set(themeEls.map((e) => beatenBy(e)))];
    const st: StageDef = {
      n,
      name: ch.names[k] ?? `${ch.name} ${k + 1}`,
      story: boss ? `${ch.name}의 끝. 👑${UNITS[enemies[0].id.replace('boss_', '')].name} 군주가 기다린다.` : `${ch.name.split(' · ')[1]}. ${themeEls.map((e) => EL_ICON[e] + EL_NAME[e]).join('·')} 속성 적이 길을 막는다.`,
      map,
      deploy: bottomDeploy(W, H),
      enemies,
      win: boss ? 'boss' : 'rout',
      turns: Math.round(16 + enemies.length * 1.5 + (H - 12) * 1.5 + (W - 6) + (boss ? 4 : 0)),
      gold: 60 + n * 8,
      items: [ITEM_TIERS[Math.min(3, Math.floor(n / 25))][n % ITEM_TIERS[Math.min(3, Math.floor(n / 25))].length], ...(n % 5 === 0 ? ['crystal'] : [])],
      joins: joinsAt(n),
      power: POWER(n) + (themeEls.length === 1 && ch.els ? 0.06 : 0), // 속성 하나인 장은 상성을 맞춰야 수월하게
      tip: `${themeEls.map((e) => EL_ICON[e] + EL_NAME[e]).join('·')} 적이 많아요 → ${counters.map((e) => EL_ICON[e] + EL_NAME[e]).join('·')} 스피릿을 데려가면 유리해요. 반대로 ${themeEls.map((e) => EL_ICON[beats2(e)] + EL_NAME[beats2(e)]).join('·')} 스피릿은 불리해요.`,
    };
    if (connected(st)) return st;
  }
  throw new Error(`스테이지 ${n} 생성 실패`);
}
const beats2 = (e: Element): Element => (['water', 'fire', 'forest', 'earth', 'wind'] as Element[])[(['water', 'fire', 'forest', 'earth', 'wind'].indexOf(e) + 1) % 5];

/** 1장(1~10판)은 손으로 만든 판: 레벨만 100판 기준으로 다시 맞추고 합류 일정을 따른다 */
function relevel(st: StageDef): StageDef {
  const avg = st.enemies.reduce((a, e) => a + e.lv, 0) / st.enemies.length;
  return {
    ...st,
    enemies: st.enemies.map((e) => ({ ...e, lv: Math.max(1, Math.round(baseLv(st.n) + (e.lv - avg) * 0.4) + (e.boss ? 2 : 0)) })),
    joins: joinsAt(st.n),
    items: st.n === 5 || st.n === 10 ? [...st.items, 'crystal'] : st.items,
  };
}
export const STAGES: StageDef[] = [...HAND.map(relevel), ...Array.from({ length: 90 }, (_, i) => genStage(i + 11))];

export const ROLE_ORDER: Role[] = ['tank', 'pmelee', 'mmelee', 'pranged', 'mranged', 'healer', 'support'];
export type { Element };
