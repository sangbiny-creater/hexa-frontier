// 게임 상태와 행동. 모든 함수는 state를 직접 변경한다 (UI는 복사본을 넘긴다).
// 시간은 항상 인자로 받는다 (Clock 교체 가능, 시뮬레이션 가능).
import { BALANCE } from '../data/balance';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { TILE_BY_ID, TILES, type TileDef } from '../data/map';
import { DEFAULT_SLOT, SPIRITS } from '../data/spirits';
import { analyzeDefeat, type DefeatAnalysis } from './analysis';
import { simulateBattle, type BattleResult, type BattleSetup, type BattleUnitInput } from './battle';
import { HOUR } from './clock';
import { conditionDelta, conditionMultiplier } from './condition';
import { grantXp, rankUpCost, trainingXp, xpMultiplier } from './growth';
import { axialNeighbors } from './hex';
import { createRng, hashSeed } from './rng';
import type { ActivityRun, ActivityType, OwnedSpirit } from './types';

export const SAVE_VERSION = 2;

/** 튜토리얼 진행 (저장 v2) */
export interface TutorialState {
  introSeen: boolean;
  done: boolean;
  battleTip: boolean; // 첫 전투 설명을 봤는가
  winTip: boolean; // 첫 승리 설명
  defeatTip: boolean; // 첫 패배 설명
  trainingTip: boolean; // 훈련을 한 번 맡겨 봤는가
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
  messages: string[];
  tutorial: TutorialState;
}

export function newGame(now: number): GameState {
  const s: GameState = {
    version: SAVE_VERSION,
    createdAt: now,
    lastTickAt: now,
    lastIdleClaimAt: now,
    gold: 0,
    stones: 0,
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
    messages: [],
    tutorial: newTutorial(),
  };
  addSpirit(s, 'tideshell');
  return s;
}

function addSpirit(s: GameState, id: string) {
  if (s.spirits[id]) return;
  s.spirits[id] = { defId: id, level: 1, xp: 0, rank: 0, condition: 100, injured: false, injuryProgress: 0 };
  // 같은 레벨대로 빠르게 합류하도록 따라잡기(E)가 자동 적용된다.
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

const COORD_INDEX = new Map(TILES.map((t) => [`${t.q},${t.r}`, t]));

export function neighborsOf(tile: TileDef): TileDef[] {
  return axialNeighbors(tile.q, tile.r)
    .map(([q, r]) => COORD_INDEX.get(`${q},${r}`))
    .filter((t): t is TileDef => !!t);
}

/** 들어갈 수 있는 칸: 클리어한 칸에 인접한 미클리어 칸 (D9) */
export function reachableTiles(s: GameState): Set<string> {
  const out = new Set<string>();
  for (const id of s.cleared) {
    for (const n of neighborsOf(TILE_BY_ID[id])) if (!s.cleared.includes(n.id)) out.add(n.id);
  }
  return out;
}

/** 안개가 걷힌 칸: 클리어 칸 + 그 인접 칸 */
export function visibleTiles(s: GameState): Set<string> {
  const out = new Set<string>(s.cleared);
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
  rewards: { gold: number; stones: number; xp: Record<string, number>; levelUps: Record<string, number> };
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
      condition: sp.condition,
      injured: sp.injured,
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
  return { allies, enemies, seed };
}

export type EnterResult =
  | { type: 'spirit'; spiritId: string }
  | { type: 'resource'; resource: 'stones' | 'gold'; bonus: { gold: number; stones: number } }
  | { type: 'facility'; facility: 'training' | 'rest' }
  | { type: 'gate' }
  | { type: 'battle'; outcome: BattleOutcome }
  | { type: 'error'; message: string };

export function enterTile(s: GameState, tileId: string, now: number): EnterResult {
  tick(s, now);
  const tile = TILE_BY_ID[tileId];
  if (!tile) return { type: 'error', message: '없는 칸' };
  const cleared = s.cleared.includes(tileId);
  if (!cleared && !reachableTiles(s).has(tileId)) return { type: 'error', message: '아직 갈 수 없는 칸입니다.' };
  if (tile.kind === 'gate') return { type: 'gate' };
  if (tile.encounterId) return fight(s, tile, now);
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
    const bonus = tile.resource === 'stones' ? { gold: 0, stones: 5 } : { gold: 150, stones: 0 };
    s.gold += bonus.gold;
    s.stones += bonus.stones;
    msg(s, `자원 헥사 발견: ${tile.name}. 채집 목적지로 등록되었다.`);
    return { type: 'resource', resource: tile.resource, bonus };
  }
  if (tile.kind === 'facility' && tile.facility) {
    if (tile.facility === 'training') {
      s.unlocked.training = true;
      s.unlocked.gathering = true;
    } else s.unlocked.rest = true;
    msg(s, `시설 발견: ${tile.name}`);
    return { type: 'facility', facility: tile.facility };
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
    }
  }
  // 경험치: 승리 시 전액, 패배 시에도 30% (패배가 완전한 손해가 되지 않게)
  const baseXp = enc.enemies.reduce((acc, e) => acc + ENEMIES[e.enemyId].xp * (1 + BALANCE.enemy.xpPerLevel * (e.level - 1)), 0);
  const xpShare = won ? 1 : 0.3;
  const xpMul = Object.fromEntries(team.map((id) => [id, xpMultiplier(s.spirits[id], roster, 'battle')]));
  for (const id of team) {
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
  for (const id of team) {
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

  const unlockedText: string[] = [];
  if (firstClear) {
    s.cleared.push(tile.id);
    if (enc.bossKind === 'normal') {
      s.unlocked.training = true;
      s.unlocked.gathering = true;
      unlockedText.push('훈련장과 채집이 열렸습니다. 떠나 있는 동안에도 스피릿이 강해집니다.');
      unlockedText.push('고목 수호자 너머의 길이 열렸습니다.');
    }
    if (enc.bossKind === 'region') {
      s.maxDeploy = Math.min(5, s.maxDeploy + 1);
      unlockedText.push(`출전 인원이 ${s.maxDeploy}명으로 늘었습니다.`);
      unlockedText.push('이끼 숲을 돌파했습니다! 다음 지역은 준비 중입니다 (P0 끝).');
    }
  }
  s.lastTile = tile.id;
  msg(s, `${enc.name}: ${won ? '승리' : '패배'}`);

  const analysis = won ? null : analyzeDefeat(s, setup, result, now);
  return {
    type: 'battle',
    outcome: { tileId: tile.id, encounterId: enc.id, setup, result, won, firstClear, rewards, conditionChanges, newInjuries, unlockedText, analysis },
  };
}

/** 전투 전 피로 경고: 출전 예정 스피릿 중 컨디션 '최상' 미만 또는 경상 */
export function fatigueWarning(s: GameState, now: number): { names: string[]; worstMul: number } | null {
  const team = availableTeam(s, now).map((id) => s.spirits[id]);
  const tired = team.filter((sp) => sp.condition < BALANCE.condition.tiers[0].min || sp.injured);
  if (!tired.length) return null;
  const worstMul = Math.min(...tired.map((sp) => conditionMultiplier(sp.condition)));
  return { names: tired.map((sp) => `${SPIRITS[sp.defId].name} ${Math.floor(sp.condition)}${sp.injured ? '·경상' : ''}`), worstMul };
}

// ───────── 성장 ─────────

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
  return { hours, gold: Math.floor(hours * I.goldPerHour), stones: Math.floor(hours * I.stonesPerHour) };
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

/** 목표 안내가 가리키는 칸 (지도에 ▼ 표시) */
export function objectiveTile(s: GameState): string | null {
  const c = (id: string) => s.cleared.includes(id);
  const reach = reachableTiles(s);
  if (!c('a1')) return 'a1';
  if (!c('a2')) return 'a2';
  if (!c('a3')) return 'a3';
  if (!c('b1') && !s.bossAttempts['b1']) return 'b1';
  if (!c('b1') && !s.spirits.sylphy) return c('s1') ? 's2' : 's1';
  if (!c('b1')) return 'b1';
  if (!c('c1')) return 'c1';
  if (c('b2')) return null;
  if (reach.has('b2')) return 'b2';
  // 지역 보스까지 가장 가까운(오른쪽) 미탐험 칸
  const next = [...reach]
    .map((id) => TILE_BY_ID[id])
    .filter((t) => t.kind !== 'gate')
    .sort((a, b) => b.q + b.r / 2 - (a.q + a.r / 2))[0];
  return next?.id ?? null;
}

export function currentObjective(s: GameState): string {
  const c = (id: string) => s.cleared.includes(id);
  if (!c('a1')) return '오른쪽의 빛나는 칸을 눌러 이동하세요. 타이드쉘이 알아서 싸웁니다.';
  if (!c('a2')) return '불씨 바위로 가서 새 동료를 만나세요.';
  if (!c('b1') && !s.bossAttempts['b1']) return '숲을 지키는 고목 수호자에게 도전하세요.';
  if (!c('b1') && !s.spirits.sylphy) return '고목 수호자를 넘으려면 동료가 더 필요합니다. 남서쪽 멧돼지 굴 너머를 살펴보세요.';
  if (!c('b1')) return '파밍과 승급으로 강해진 뒤 고목 수호자에게 다시 도전하세요.';
  if (!c('c1')) return '고목 수호자 너머의 훈련장에 들러 보세요.';
  if (!c('b2')) return '이끼 숲의 주인, 바위 거인 몽돌을 쓰러뜨리세요. 막히면 훈련·채집을 맡기고 다시 오세요.';
  return '이끼 숲 돌파 완료! 다음 지역은 준비 중입니다.';
}
