// 게임 상태와 행동. 모든 함수는 state를 직접 변경한다 (UI는 복사본을 넘긴다).
// 시간은 항상 인자로 받는다 (Clock 교체 가능, 시뮬레이션 가능).
import { BALANCE } from '../data/balance';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { MAPS, TILE_BY_ID, TILES, TUTORIAL_END, stageCode, type TileDef } from '../data/map';
import { DEFAULT_SLOT, SPIRITS } from '../data/spirits';
import { analyzeDefeat, type DefeatAnalysis } from './analysis';
import { simulateBattle, type BattleResult, type BattleSetup, type BattleUnitInput } from './battle';
import { HOUR } from './clock';
import { conditionDelta, conditionMultiplier } from './condition';
import { grantXp, levelUpCost, rankUpCost, trainingXp, xpMultiplier } from './growth';
import { axialNeighbors } from './hex';
import { effectivePower, recommendedPower } from './power';
import { createRng, hashSeed } from './rng';
import type { ActivityRun, ActivityType, Element, OwnedSpirit } from './types';

export const SAVE_VERSION = 8;

/** 튜토리얼 진행 (저장 v2) */
export interface TutorialState {
  introSeen: boolean;
  done: boolean;
  battleTip: boolean; // 첫 전투 설명을 봤는가
  winTip: boolean; // 첫 승리 설명
  defeatTip: boolean; // 첫 패배 설명
  trainingTip: boolean; // 훈련을 한 번 맡겨 봤는가
  levelTip?: boolean; // 골드 레벨업을 해 봤는가 (D32)
  elementIntro?: boolean; // 속성표 설명을 봤는가 (D42)
  windIntro?: boolean; // (구) 바람→물 설명
  golemLoss?: boolean; // 고목 골렘 패배 후 상성 강조를 봤는가 (D63)
  golemWin?: boolean; // 고목 골렘 승리 후 상성 정리를 봤는가 (D63)
  campTip?: boolean; // 캠프 자동 사냥을 열어 봤는가
  magicIntro?: boolean; // 물리/마법 설명을 봤는가
  evoIntro?: boolean; // 진화 설명을 봤는가
}

export function newTutorial(): TutorialState {
  return { introSeen: false, done: false, battleTip: false, winTip: false, defeatTip: false, trainingTip: false };
}

export interface GameState {
  version: number;
  createdAt: number;
  lastTickAt: number;
  lastIdleClaimAt: number;
  gold: number;
  stones: number;
  summonStones: number; // 🔮 소환석 (D47)
  spirits: Record<string, OwnedSpirit>;
  formation: Record<string, number>; // spiritId -> slot
  maxDeploy: number;
  cleared: string[]; // 클리어/방문한 헥사
  nodes: string[]; // 발견한 자원 헥사
  unlocked: { training: boolean; gathering: boolean; rest: boolean };
  activities: ActivityRun[];
  battleCounter: number;
  activityCounter: number;
  lastTile: string;
  bossAttempts: Record<string, number>;
  attempts: Record<string, number>; // 칸별 전투 도전 횟수 (튜토리얼 판단용)
  messages: string[];
  tutorial: TutorialState;
  /** 지금 보고 있는 지도 (P00/P01) */
  map: string;
  /** 이긴 칸이 다시 열리는 시각 (D59) */
  respawnAt: Record<string, number>;
  summonCounter: number;
  settings: { skipBattle: boolean };
}

export function newGame(now: number): GameState {
  const s: GameState = {
    version: SAVE_VERSION,
    createdAt: now,
    lastTickAt: now,
    lastIdleClaimAt: now,
    gold: 0,
    stones: 0,
    summonStones: 0,
    spirits: {},
    formation: {},
    maxDeploy: BALANCE.deploy.initialMax,
    cleared: ['start'],
    nodes: [],
    unlocked: { training: false, gathering: false, rest: false },
    activities: [],
    battleCounter: 0,
    activityCounter: 0,
    lastTile: 'start',
    bossAttempts: {},
    attempts: {},
    messages: [],
    tutorial: newTutorial(),
    map: 'P00',
    respawnAt: {},
    summonCounter: 0,
    settings: { skipBattle: false },
  };
  // 시작 스피릿: 💧쉘나이트(탱커) + 🌿블루멜(회복) (D47)
  addSpirit(s, 'tideshell');
  addSpirit(s, 'sylphy');
  return s;
}

function addSpirit(s: GameState, id: string) {
  if (s.spirits[id]) return;
  // 새 동료는 최고 레벨의 80%로 합류 (따라잡기 E의 단순화, D32)
  const top = Math.max(1, ...Object.values(s.spirits).map((x) => x.level));
  const level = Math.max(1, Math.floor(top * BALANCE.growth.joinLevelRatio));
  s.spirits[id] = { defId: id, level: Math.min(level, BALANCE.evolution.levelCap[0]), xp: 0, rank: 0, stage: 1, copies: 0, condition: 100, injured: false, injuryProgress: 0 };
  if (Object.keys(s.formation).length < s.maxDeploy) {
    const want = DEFAULT_SLOT[id] ?? 4;
    const used = new Set(Object.values(s.formation));
    const slot = used.has(want) ? [4, 3, 5, 0, 2, 6, 8, 1, 7].find((x) => !used.has(x))! : want;
    s.formation[id] = slot;
  }
}

function msg(s: GameState, text: string) {
  s.messages.unshift(text);
  s.messages = s.messages.slice(0, 30);
}

// ───────── 맵 ─────────

const COORD_INDEX = new Map(TILES.map((t) => [`${t.map}:${t.q},${t.r}`, t]));

export function neighborsOf(tile: TileDef): TileDef[] {
  return axialNeighbors(tile.q, tile.r)
    .map(([q, r]) => COORD_INDEX.get(`${tile.map}:${q},${r}`))
    .filter((t): t is TileDef => !!t);
}

/** 들어갈 수 있는 칸: 지금 지도에서 클리어한 칸에 인접한 미클리어 칸 (D9) */
export function reachableTiles(s: GameState): Set<string> {
  const out = new Set<string>();
  for (const id of s.cleared) {
    const t = TILE_BY_ID[id];
    if (!t || t.map !== s.map) continue;
    for (const n of neighborsOf(t)) if (!s.cleared.includes(n.id)) out.add(n.id);
  }
  return out;
}

/** P01은 튜토리얼(바위엄니 떼)을 끝내면 열린다 */
export function mapUnlocked(s: GameState, mapId: string): boolean {
  if (mapId === 'P00') return true;
  if (mapId === 'P01') return s.cleared.includes(TUTORIAL_END);
  return false;
}

/** 지도 이동. 처음 가는 지도면 입구를 연다. */
export function travel(s: GameState, mapId: string): string | null {
  const m = MAPS[mapId];
  if (!m) return '준비 중인 지역이에요.';
  if (!mapUnlocked(s, mapId)) return '튜토리얼(P00)을 먼저 끝내세요.';
  s.map = mapId;
  if (!s.cleared.includes(m.startId)) s.cleared.push(m.startId);
  if (TILE_BY_ID[s.lastTile]?.map !== mapId) s.lastTile = m.startId;
  return null;
}

// ───────── 리스폰 (D59) ─────────

export function respawnMs(tile: TileDef): number {
  const R = BALANCE.respawn;
  const enc = tile.encounterId ? ENCOUNTERS[tile.encounterId] : null;
  // 튜토리얼(P00) 일반 칸은 골드 벌기를 배울 수 있게 짧게 (D63)
  const normal = tile.map === 'P00' ? R.tutorialBattleMin : R.battleMin;
  const min = enc?.bossKind === 'region' ? R.regionBossMin : enc?.bossKind ? R.bossMin : tile.kind === 'elite' ? R.eliteMin : normal;
  return min * 60_000;
}

/** 다시 싸울 수 있기까지 남은 시간 (0이면 지금 가능) */
export function respawnLeft(s: GameState, tileId: string, now: number): number {
  return Math.max(0, (s.respawnAt[tileId] ?? 0) - now);
}

/** 안개가 걷힌 칸: 클리어 칸 + 그 인접 칸 */
export function visibleTiles(s: GameState): Set<string> {
  const out = new Set<string>(s.cleared.filter((id) => TILE_BY_ID[id]?.map === s.map));
  for (const id of reachableTiles(s)) out.add(id);
  return out;
}

// ───────── 시간 경과 ─────────

export function isBusy(s: GameState, spiritId: string, now: number): ActivityRun | null {
  return (
    s.activities.find(
      (a) => a.spiritId === spiritId && a.status === 'running' && (a.completesAt === null || now < a.completesAt),
    ) ?? null
  );
}

/** 마지막 갱신 이후 컨디션/경상 회복을 반영. 시계가 뒤로 가면 아무것도 지급하지 않는다 (D3). */
export function tick(s: GameState, now: number) {
  if (now <= s.lastTickAt) return;
  const C = BALANCE.condition;
  const from = s.lastTickAt;
  for (const sp of Object.values(s.spirits)) {
    let restH = 0;
    let busyH = 0;
    for (const a of s.activities) {
      if (a.spiritId !== sp.defId || a.status !== 'running') continue;
      const end = a.completesAt ?? Infinity;
      const overlap = Math.max(0, Math.min(now, end) - Math.max(from, a.startedAt)) / HOUR;
      if (a.type === 'rest') restH += overlap;
      else busyH += overlap;
    }
    const freeH = Math.max(0, (now - from) / HOUR - restH - busyH);
    sp.condition = Math.min(100, sp.condition + C.naturalPerHour * freeH + C.restPerHour * restH);
    if (sp.injured) {
      sp.injuryProgress += freeH / C.injuryNaturalHours + restH / C.injuryRestHours;
      if (sp.injuryProgress >= 1) {
        sp.injured = false;
        sp.injuryProgress = 0;
      }
    }
  }
  s.lastTickAt = now;
}

/** 저장 데이터를 불러올 때: 시계 역행 감지 */
export function detectRollback(s: GameState, now: number): boolean {
  return now < s.lastTickAt - BALANCE.time.rollbackToleranceMs;
}

// ───────── 전투 ─────────

export interface BattleOutcome {
  tileId: string;
  encounterId: string;
  setup: BattleSetup;
  result: BattleResult;
  won: boolean;
  firstClear: boolean;
  rewards: { gold: number; stones: number; summon?: number; xp: Record<string, number>; levelUps: Record<string, number> };
  conditionChanges: Record<string, number>;
  newInjuries: string[];
  unlockedText: string[];
  analysis: DefeatAnalysis | null;
}

export function availableTeam(s: GameState, now: number): string[] {
  return Object.keys(s.formation).filter((id) => s.spirits[id] && !isBusy(s, id, now));
}

export function buildSetup(s: GameState, encounterId: string, seed: number, now: number): BattleSetup {
  const enc = ENCOUNTERS[encounterId];
  const allies: BattleUnitInput[] = availableTeam(s, now).map((id) => {
    const sp = s.spirits[id];
    return {
      uid: `a:${id}`,
      def: SPIRITS[id],
      side: 'ally',
      slot: s.formation[id],
      level: sp.level,
      rank: sp.rank,
      stage: sp.stage,
      condition: BALANCE.condition.enabled ? sp.condition : 100,
      injured: BALANCE.condition.enabled ? sp.injured : false,
    };
  });
  const enemies: BattleUnitInput[] = enc.enemies.map((e, i) => ({
    uid: `e:${i}:${e.enemyId}`,
    def: ENEMIES[e.enemyId],
    side: 'enemy',
    slot: e.slot,
    level: e.level,
    isBoss: !!ENEMIES[e.enemyId].isBoss,
  }));
  return { allies, enemies, seed, encounterId };
}

export type EnterResult =
  | { type: 'spirit'; spiritId: string }
  | { type: 'resource'; resource: 'stones' | 'gold' | 'summon'; bonus: { gold: number; stones: number; summon: number } }
  | { type: 'gate' }
  | { type: 'travel'; map: string }
  | { type: 'battle'; outcome: BattleOutcome }
  | { type: 'error'; message: string };

export function enterTile(s: GameState, tileId: string, now: number): EnterResult {
  tick(s, now);
  const tile = TILE_BY_ID[tileId];
  if (!tile) return { type: 'error', message: '없는 칸' };
  const cleared = s.cleared.includes(tileId);
  if (!cleared && !reachableTiles(s).has(tileId)) return { type: 'error', message: '아직 갈 수 없는 칸입니다.' };
  if (tile.kind === 'gate') {
    const next = tile.map === 'P00' ? 'P01' : null;
    if (!next || !MAPS[next]) return { type: 'gate' };
    const err = travel(s, next);
    if (err) return { type: 'error', message: err };
    msg(s, `${next} ${MAPS[next].name}에 들어섰다!`);
    return { type: 'travel', map: next };
  }
  if (tile.encounterId) {
    const left = cleared ? respawnLeft(s, tileId, now) : 0;
    if (left > 0) return { type: 'error', message: `몬스터가 다시 나타나기까지 ${Math.ceil(left / 60_000)}분 남았어요.` };
    return fight(s, tile, now);
  }
  if (cleared) return { type: 'error', message: '이미 탐험한 칸입니다.' };

  s.cleared.push(tileId);
  s.lastTile = tileId;
  if (tile.kind === 'spirit' && tile.spiritId) {
    addSpirit(s, tile.spiritId);
    msg(s, `${SPIRITS[tile.spiritId].name}이(가) 동료가 되었다!`);
    return { type: 'spirit', spiritId: tile.spiritId };
  }
  if (tile.kind === 'resource' && tile.resource) {
    s.nodes.push(tileId);
    // 본편 보물은 튜토리얼보다 작게: 위로 갈수록 조금씩 커진다 (D62)
    const main = tile.map !== 'P00';
    const bonus =
      tile.resource === 'stones'
        ? { gold: 0, stones: main ? 3 + Math.floor(tile.row / 20) : 10, summon: 0 }
        : tile.resource === 'summon'
          ? { gold: 0, stones: 0, summon: BALANCE.summon.cost }
          : { gold: tile.amount ?? (main ? 60 + tile.row * 6 : 250), stones: 0, summon: 0 };
    s.gold += bonus.gold;
    s.stones += bonus.stones;
    s.summonStones += bonus.summon;
    msg(s, `보물 상자: ${tile.name}`);
    return { type: 'resource', resource: tile.resource, bonus };
  }
  return { type: 'error', message: '아무것도 없다.' };
}

function fight(s: GameState, tile: TileDef, now: number): EnterResult {
  const team = availableTeam(s, now);
  if (team.length === 0) return { type: 'error', message: '출전 가능한 스피릿이 없습니다. 편성을 확인하거나 활동을 중단하세요.' };
  const enc = ENCOUNTERS[tile.encounterId!];
  s.battleCounter++;
  const seed = hashSeed('battle', s.createdAt, s.battleCounter, tile.id);
  const setup = buildSetup(s, enc.id, seed, now);
  const result = simulateBattle(setup);
  const won = result.outcome === 'win';
  const firstClear = won && !s.cleared.includes(tile.id);
  const isBoss = !!enc.bossKind;
  if (isBoss) s.bossAttempts[tile.id] = (s.bossAttempts[tile.id] ?? 0) + 1;
  s.attempts[tile.id] = (s.attempts[tile.id] ?? 0) + 1;

  const rewards: BattleOutcome['rewards'] = { gold: 0, stones: 0, xp: {}, levelUps: {} };
  const rng = createRng(seed ^ 0x9e3779b9);
  const roster = Object.values(s.spirits);
  if (won) {
    for (const e of enc.enemies) {
      const def = ENEMIES[e.enemyId];
      const lvF = 1 + BALANCE.enemy.goldPerLevel * (e.level - 1);
      rewards.gold += Math.round(def.gold * lvF);
      if (rng() < def.stoneChance * BALANCE.enemy.stoneChanceMul) rewards.stones += def.isBoss ? 3 : 1;
    }
    if (firstClear) {
      rewards.gold += enc.firstClear.gold;
      rewards.stones += enc.firstClear.stones;
      rewards.summon = enc.firstClear.summon ?? 0;
      s.summonStones += rewards.summon;
    }
  }
  // P0 단순화(D32): 레벨은 골드로 올린다. 전투 경험치는 지급하지 않음 (패배 시에도 골드 30%).
  if (!won) {
    for (const e of enc.enemies) rewards.gold += Math.round(ENEMIES[e.enemyId].gold * (1 + BALANCE.enemy.goldPerLevel * (e.level - 1)) * 0.3);
  }
  const baseXp = enc.enemies.reduce((acc, e) => acc + ENEMIES[e.enemyId].xp * (1 + BALANCE.enemy.xpPerLevel * (e.level - 1)), 0);
  const xpShare = won ? 1 : 0.3;
  const xpMul = Object.fromEntries(team.map((id) => [id, xpMultiplier(s.spirits[id], roster, 'battle')]));
  for (const id of BALANCE.growth.battleXp ? team : []) {
    const sp = s.spirits[id];
    const firstXp = firstClear ? enc.firstClear.xp ?? 0 : 0;
    const amount = Math.round((baseXp * xpShare + firstXp) * xpMul[id]);
    rewards.xp[id] = amount;
    const ups = grantXp(sp, amount);
    if (ups) rewards.levelUps[id] = ups;
  }
  s.gold += rewards.gold;
  s.stones += rewards.stones;

  // 컨디션·경상
  const conditionChanges: Record<string, number> = {};
  const newInjuries: string[] = [];
  for (const id of BALANCE.condition.enabled ? team : []) {
    const rep = result.reports[`a:${id}`];
    const ko = rep.koTime !== null;
    const d = conditionDelta({ won, isBoss, minHpRatio: rep.minHpRatio, ko });
    const sp = s.spirits[id];
    sp.condition = Math.max(0, sp.condition + d);
    if (d) conditionChanges[id] = d;
    // 일반 보스에서는 경상 없음 (일반 보스는 긴 정체를 만들지 않는다, 결정 D29)
    const injuryAllowed = enc.bossKind !== 'normal';
    if (ko && injuryAllowed && !sp.injured && rng() < BALANCE.condition.injuryChanceOnKo) {
      sp.injured = true;
      sp.injuryProgress = 0;
      newInjuries.push(id);
    }
  }
  if (won) s.respawnAt[tile.id] = now + respawnMs(tile);

  const unlockedText: string[] = [];
  if (firstClear) {
    s.cleared.push(tile.id);
    if (tile.id === 'b1') {
      s.unlocked.training = true;
      s.unlocked.gathering = true;
      unlockedText.push('🏕캠프 자동 사냥이 열렸어요! 자리를 비워도 골드가 쌓여요.');
    }
    if (enc.unlockDeploy && enc.unlockDeploy > s.maxDeploy) {
      s.maxDeploy = enc.unlockDeploy;
      unlockedText.push(`출전 인원이 ${s.maxDeploy}명으로 늘었습니다!`);
    }
    if (tile.id === TUTORIAL_END) unlockedText.push('튜토리얼 끝! 지도 맨 위 길로 P01에 갈 수 있어요.');
    if (enc.bossKind === 'region') unlockedText.push(`${MAPS[tile.map].code} ${MAPS[tile.map].name}을(를) 돌파했습니다! 다음 지역은 준비 중이에요.`);
  }
  s.lastTile = tile.id;
  msg(s, `${stageCode(tile) ?? enc.name}: ${won ? '승리' : '패배'}`);

  const analysis = won ? null : analyzeDefeat(s, setup, result, now);
  return {
    type: 'battle',
    outcome: { tileId: tile.id, encounterId: enc.id, setup, result, won, firstClear, rewards, conditionChanges, newInjuries, unlockedText, analysis },
  };
}

/** 전투 전 피로 경고: 출전 예정 스피릿 중 컨디션 '최상' 미만 또는 경상 */
export function fatigueWarning(s: GameState, now: number): { names: string[]; worstMul: number } | null {
  if (!BALANCE.condition.enabled) return null;
  const team = availableTeam(s, now).map((id) => s.spirits[id]);
  const tired = team.filter((sp) => sp.condition < BALANCE.condition.tiers[0].min || sp.injured);
  if (!tired.length) return null;
  const worstMul = Math.min(...tired.map((sp) => conditionMultiplier(sp.condition)));
  return { names: tired.map((sp) => `${SPIRITS[sp.defId].name} ${Math.floor(sp.condition)}${sp.injured ? '·경상' : ''}`), worstMul };
}

/** 골드 벌기 좋은 칸: 클리어한 일반 전투 칸 중 '쉬움'인 가장 높은 칸 (없으면 가장 쉬운 칸) */
export function bestFarmTile(s: GameState, now: number): string | null {
  const farm = s.cleared
    .map((id) => TILE_BY_ID[id])
    .filter((t) => t && t.map === s.map && t.kind === 'battle' && t.encounterId && respawnLeft(s, t.id, now) === 0)
    .map((t) => ({ t, rec: recommendedPower(t.encounterId!) }));
  if (!farm.length) return null;
  const ok = farm.filter((f) => effectivePower(s, f.t.encounterId!) >= f.rec * BALANCE.power.easyAt).sort((a, b) => b.rec - a.rec);
  return (ok[0] ?? farm.sort((a, b) => a.rec - b.rec)[0]).t.id;
}

/** 지금 들를 수 있는 동료 칸 */
export function reachableSpiritTile(s: GameState): string | null {
  return [...reachableTiles(s)].find((id) => TILE_BY_ID[id].kind === 'spirit') ?? null;
}

/** 지금 골드로 할 수 있는 레벨업 횟수 (가장 싼 것부터) */
export function affordableLevelUps(s: GameState): number {
  const levels = Object.keys(s.formation).map((id) => ({ lv: s.spirits[id].level, cap: levelCap(s.spirits[id]) }));
  let gold = s.gold;
  let n = 0;
  for (;;) {
    const open = levels.filter((x) => x.lv < x.cap).sort((a, b) => a.lv - b.lv);
    if (!open.length) break;
    const c = levelUpCost(open[0].lv);
    if (gold < c) break;
    gold -= c;
    open[0].lv++;
    n++;
    if (n > 200) break;
  }
  return n;
}

// ───────── 성장 ─────────

/** 진화 단계별 최대 레벨 (D60) */
export function levelCap(sp: OwnedSpirit): number {
  return Math.min(BALANCE.growth.maxLevel, BALANCE.evolution.levelCap[sp.stage - 1]);
}

/** 다음 진화 조건. 최종 단계면 null */
export function evolveNeed(sp: OwnedSpirit): { level: number; copies: number } | null {
  if (sp.stage >= 3) return null;
  return { level: BALANCE.evolution.levelCap[sp.stage - 1], copies: BALANCE.evolution.copies[sp.stage - 1] };
}

export function canEvolve(s: GameState, spiritId: string): boolean {
  const sp = s.spirits[spiritId];
  const need = sp && evolveNeed(sp);
  return !!need && sp.level >= need.level && sp.copies >= need.copies;
}

/** 진화: 최대 레벨 + 같은 스피릿 중복 소환 N개 (D60) */
export function evolve(s: GameState, spiritId: string): string | null {
  const sp = s.spirits[spiritId];
  const need = sp && evolveNeed(sp);
  if (!sp || !need) return '더 이상 진화할 수 없어요.';
  if (sp.level < need.level) return `Lv.${need.level}이 되어야 진화할 수 있어요.`;
  if (sp.copies < need.copies) return `같은 스피릿이 ${need.copies}번 더 소환돼야 해요 (지금 ${sp.copies}).`;
  sp.copies -= need.copies;
  sp.stage = (sp.stage + 1) as 2 | 3;
  msg(s, `${SPIRITS[spiritId].stages?.[sp.stage - 1] ?? SPIRITS[spiritId].name}(으)로 진화!`);
  return null;
}

/** 골드로 레벨업 (D32) */
export function levelUp(s: GameState, spiritId: string): string | null {
  const sp = s.spirits[spiritId];
  if (!sp) return '보유하지 않은 스피릿';
  if (sp.level >= BALANCE.growth.maxLevel) return '최대 레벨입니다.';
  if (sp.level >= levelCap(sp)) return `진화해야 더 올릴 수 있어요 (같은 스피릿 ${evolveNeed(sp)?.copies ?? 0}마리 필요).`;
  const cost = levelUpCost(sp.level);
  if (s.gold < cost) return `골드가 부족합니다 (${cost} 필요).`;
  s.gold -= cost;
  sp.level++;
  return null;
}

export function rankUp(s: GameState, spiritId: string): string | null {
  const sp = s.spirits[spiritId];
  const cost = sp && rankUpCost(sp);
  if (!sp || !cost) return '더 이상 승급할 수 없습니다.';
  if (sp.level < cost.minLevel) return `Lv.${cost.minLevel} 이상이 필요합니다.`;
  if (s.stones < cost.stones || s.gold < cost.gold) return '재료가 부족합니다.';
  s.stones -= cost.stones;
  s.gold -= cost.gold;
  sp.rank++;
  msg(s, `${SPIRITS[spiritId].name} 승급! (★${sp.rank})`);
  return null;
}

export function canRankUp(s: GameState, spiritId: string): boolean {
  const sp = s.spirits[spiritId];
  const cost = rankUpCost(sp);
  return !!cost && sp.level >= cost.minLevel && s.stones >= cost.stones && s.gold >= cost.gold;
}

export function clinicHeal(s: GameState, spiritId: string): string | null {
  const sp = s.spirits[spiritId];
  if (!sp?.injured) return '경상이 아닙니다.';
  if (s.gold < BALANCE.condition.clinicGold) return '골드가 부족합니다.';
  s.gold -= BALANCE.condition.clinicGold;
  sp.injured = false;
  sp.injuryProgress = 0;
  return null;
}

export function setFormation(s: GameState, spiritId: string, slot: number | null): string | null {
  if (!s.spirits[spiritId]) return '보유하지 않은 스피릿';
  if (slot === null) {
    delete s.formation[spiritId];
    return null;
  }
  const occupant = Object.entries(s.formation).find(([, v]) => v === slot)?.[0];
  const prev = s.formation[spiritId];
  if (occupant && occupant !== spiritId) {
    if (prev !== undefined) s.formation[occupant] = prev;
    else delete s.formation[occupant];
  }
  if (prev === undefined && !occupant && Object.keys(s.formation).length >= s.maxDeploy) {
    return `출전은 최대 ${s.maxDeploy}명입니다.`;
  }
  s.formation[spiritId] = slot;
  return null;
}

// ───────── 활동 (훈련·채집·휴식) ─────────

export function runningCount(s: GameState, type: ActivityType) {
  return s.activities.filter((a) => a.type === type && a.status === 'running').length;
}

export function startActivity(
  s: GameState,
  type: ActivityType,
  spiritId: string,
  now: number,
  nodeTileId?: string,
): string | null {
  tick(s, now);
  if (!s.spirits[spiritId]) return '보유하지 않은 스피릿';
  if (!s.unlocked[type]) return '아직 열리지 않은 시설입니다.';
  // 완료되었지만 수령하지 않은 활동은 자동 수령
  for (const a of s.activities) if (a.spiritId === spiritId && a.status === 'running') claimActivity(s, a.id, now);
  if (isBusy(s, spiritId, now)) return '이미 다른 활동 중입니다.';
  if (runningCount(s, type) >= BALANCE.activity.slots[type]) return '빈 슬롯이 없습니다.';
  if (type === 'gathering' && (!nodeTileId || !s.nodes.includes(nodeTileId))) return '채집할 자원 헥사를 먼저 발견하세요.';
  const hours = type === 'training' ? BALANCE.activity.trainingHours : type === 'gathering' ? BALANCE.activity.gatheringHours : null;
  s.activityCounter++;
  s.activities.push({
    id: `act${s.activityCounter}`,
    type,
    spiritId,
    startedAt: now,
    completesAt: hours === null ? null : now + hours * HOUR,
    nodeTileId,
    status: 'running',
  });
  return null;
}

function activityReward(s: GameState, a: ActivityRun, fraction: number) {
  const out = { gold: 0, stones: 0, xp: 0, levelUps: 0 };
  if (a.type === 'training') {
    const sp = s.spirits[a.spiritId];
    out.xp = Math.floor(trainingXp(sp.level) * xpMultiplier(sp, Object.values(s.spirits), 'training') * fraction);
    out.levelUps = grantXp(sp, out.xp);
  } else if (a.type === 'gathering') {
    const node = TILE_BY_ID[a.nodeTileId!];
    const R = BALANCE.activity.gatheringReward;
    if (node.resource === 'stones') out.stones = Math.floor(R.stones * fraction);
    else out.gold = Math.floor(R.gold * fraction);
    s.gold += out.gold;
    s.stones += out.stones;
  }
  return out;
}

/** 완료된 활동 수령. 멱등: 이미 수령/중단된 활동은 아무것도 주지 않는다. */
export function claimActivity(s: GameState, runId: string, now: number) {
  const a = s.activities.find((x) => x.id === runId);
  if (!a || a.status !== 'running' || a.completesAt === null || now < a.completesAt) return null;
  tick(s, now);
  const r = activityReward(s, a, 1);
  a.status = 'claimed';
  pruneActivities(s);
  return r;
}

/** 중단: 경과 시간 비례 보상 (기획서 8장 기본 제안) */
export function cancelActivity(s: GameState, runId: string, now: number) {
  const a = s.activities.find((x) => x.id === runId);
  if (!a || a.status !== 'running') return null;
  tick(s, now);
  if (a.completesAt !== null && now >= a.completesAt) return claimActivity(s, runId, now);
  const fraction = a.completesAt === null ? 0 : Math.max(0, (now - a.startedAt) / (a.completesAt - a.startedAt));
  const r = a.completesAt === null ? { gold: 0, stones: 0, xp: 0, levelUps: 0 } : activityReward(s, a, fraction);
  a.status = 'cancelled';
  pruneActivities(s);
  return r;
}

function pruneActivities(s: GameState) {
  const done = s.activities.filter((a) => a.status !== 'running');
  if (done.length > 20) s.activities = s.activities.filter((a) => a.status === 'running').concat(done.slice(-20));
}

// ───────── 방치 보상 (D21) ─────────

export function idlePreview(s: GameState, now: number) {
  const I = BALANCE.idle;
  const hours = Math.max(0, Math.min(I.capHours, (now - s.lastIdleClaimAt) / HOUR));
  return { hours, gold: Math.floor(hours * idleGoldPerHour(s)), stones: Math.floor(hours * I.stonesPerHour) };
}

export function idleGoldPerHour(s: GameState): number {
  return BALANCE.idle.goldPerHour + BALANCE.idle.goldPerClearedTile * (s.cleared.length - 1);
}

export function claimIdle(s: GameState, now: number) {
  if (now <= s.lastIdleClaimAt) return { hours: 0, gold: 0, stones: 0 };
  const p = idlePreview(s, now);
  s.gold += p.gold;
  s.stones += p.stones;
  s.lastIdleClaimAt = now;
  return p;
}

// ───────── 목표 안내 (온보딩) ─────────

/** 튜토리얼 한 줄 길 순서 (시작·관문 제외 P00 전체, D63) */
export const TUTORIAL_PATH = MAPS.P00.tiles.filter((t) => t.kind !== 'start' && t.kind !== 'gate').map((t) => t.id);

/** 목표 안내가 가리키는 칸 (지도에 ▼ 표시) */
export function objectiveTile(s: GameState): string | null {
  if (s.map !== 'P00') return mainObjectiveTile(s);
  return TUTORIAL_PATH.find((id) => !s.cleared.includes(id)) ?? 'gate';
}

/** 본편 지도: 갈 수 있는 칸 중 번호가 가장 작은 스테이지 */
function mainObjectiveTile(s: GameState): string | null {
  const reach = [...reachableTiles(s)].map((id) => TILE_BY_ID[id]).filter((t) => t.stage);
  reach.sort((a, b) => a.stage! - b.stage!);
  if (reach[0]) return reach[0].id;
  const gate = MAPS[s.map].tiles.find((t) => t.kind === 'gate');
  return gate && reachableTiles(s).has(gate.id) ? gate.id : null;
}

/** 본편 진행도: 이긴 스테이지 수 */
export function stageProgress(s: GameState, mapId: string): { cleared: number; total: number } {
  const st = MAPS[mapId].tiles.filter((t) => t.stage);
  return { cleared: st.filter((t) => s.cleared.includes(t.id)).length, total: st.length };
}

/** 레벨업은 첫 승리 뒤 열린다 (D63: 레벨업을 가장 먼저 가르친다) */
export function upgradeUnlocked(s: GameState): boolean {
  return s.cleared.includes('a1') || s.tutorial.done;
}

/** 소환은 첫 🔮결정(신비한 결정)을 주우면 열린다 (D63: 소환석이 있는데 못 쓰는 일이 없도록) */
export function summonUnlocked(s: GameState): boolean {
  return s.cleared.includes('a8') || s.tutorial.done || s.cleared.includes(TUTORIAL_END);
}

/** 속성별 소환 풀: 그 속성의 스피릿 중 하나가 나온다. 등급은 없다 (D60) */
export const SUMMON_POOL: Record<Element, string[]> = {
  water: ['tideshell'],
  fire: ['igni'],
  forest: ['sylphy'],
  electric: ['galewing'],
  earth: ['rocky'],
};

export const ALL_SUMMONABLE = Object.values(SUMMON_POOL).flat();

export type SummonMode = Element | 'any';

export function summonCost(mode: SummonMode): number {
  return mode === 'any' ? BALANCE.summon.randomCost : BALANCE.summon.cost;
}

/** 소환: 속성 소환(그 속성 중 하나) 또는 전체 랜덤. 이미 있는 스피릿이 나오면 진화 재료(copies +1) */
export function summon(s: GameState, mode: SummonMode): { spiritId: string; duplicate: boolean } | { error: string } {
  if (!summonUnlocked(s)) return { error: '아직 열리지 않았어요' };
  const pool = mode === 'any' ? ALL_SUMMONABLE : SUMMON_POOL[mode];
  if (!pool.length) return { error: '이 제단은 준비 중이에요' };
  const cost = summonCost(mode);
  if (s.summonStones < cost) return { error: `🔮소환석이 ${cost}개 필요해요` };
  s.summonStones -= cost;
  s.summonCounter++;
  const rng = createRng(hashSeed('summon', s.createdAt, s.summonCounter, mode));
  const id = pool[Math.floor(rng() * pool.length)];
  const duplicate = !!s.spirits[id];
  if (duplicate) s.spirits[id].copies++;
  else addSpirit(s, id);
  msg(s, `소환: ${SPIRITS[id].name}${duplicate ? ' (중복 → 진화 재료 +1)' : ''}`);
  return { spiritId: id, duplicate };
}

/** 자동 사냥(방치 보상)은 첫 보스 돌파 후 열린다 */
export function idleUnlocked(s: GameState): boolean {
  return s.cleared.includes('b1');
}

export function currentObjective(s: GameState): string {
  if (s.map === 'P00') {
    const next = TUTORIAL_PATH.find((id) => !s.cleared.includes(id));
    if (!next) return '튜토리얼 끝! 맨 위 길로 P01에 가세요';
    const t = TILE_BY_ID[next];
    if (t.kind === 'resource') return `${t.name}에서 보물을 챙기세요`;
    if (s.attempts[next]) return `${t.name} 재도전 준비: 아렌의 안내를 따라 해 보세요`;
    return `${t.name}에 도전하세요`;
  }
  const p = stageProgress(s, s.map);
  const obj = objectiveTile(s);
  const code = obj ? stageCode(TILE_BY_ID[obj]) : null;
  if (p.cleared >= p.total) return `${s.map} 돌파! 다음 지역은 준비 중 (${p.cleared}/${p.total})`;
  return `${code ? `${code} 클리어하기` : '길을 찾아 위로'} · ${p.cleared}/${p.total}`;
}
