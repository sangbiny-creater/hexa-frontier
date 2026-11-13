// 밸런스 점검: 봇이 전투력 표시만 보고 P00 튜토리얼 → P01-001~P01-100을 진행할 때
// 각 보스까지 걸리는 전투 수·플레이 시간·실제 경과 시간(리스폰 대기 포함)을 잰다. 실행: npm run sim:boss
import { HOUR } from '../src/core/clock';
import {
  bestFarmTile,
  canEvolve,
  canRankUp,
  claimIdle,
  enterTile,
  evolve,
  levelCap,
  levelUp,
  newGame,
  reachableTiles,
  rankUp,
  setFormation,
  summon,
  summonCost,
  summonUnlocked,
  type GameState,
} from '../src/core/game';
import { levelUpCost } from '../src/core/growth';
import { difficulty, effectivePower, recommendedPower, suggestTeam } from '../src/core/power';
import { stageCode, TILE_BY_ID } from '../src/data/map';
import { DEFAULT_SLOT } from '../src/data/spirits';

function spendAll(s: GameState) {
  while (summonUnlocked(s) && s.summonStones >= summonCost('any')) summon(s, 'any');
  for (const id of Object.keys(s.spirits)) while (canEvolve(s, id)) evolve(s, id);
  for (const id of Object.keys(s.spirits)) while (canRankUp(s, id)) rankUp(s, id);
  for (let guard = 0; guard < 500; guard++) {
    const id = Object.keys(s.formation)
      .filter((x) => s.spirits[x].level < levelCap(s.spirits[x]))
      .sort((a, b) => s.spirits[a].level - s.spirits[b].level)[0];
    if (!id || s.gold < levelUpCost(s.spirits[id].level) || levelUp(s, id)) break;
  }
}

function formFor(s: GameState, enc: string) {
  const best = suggestTeam(Object.keys(s.spirits), enc, s.maxDeploy);
  for (const k of Object.keys(s.formation)) setFormation(s, k, null);
  for (const k of best) setFormation(s, k, DEFAULT_SLOT[k]);
}

function run(seed: number, idleHoursPer30min = 0) {
  const s = newGame(seed * 7777);
  s.tutorial.done = true;
  let now = s.createdAt;
  let battles = 0;
  let seconds = 0;
  let nextBreak = 1800;
  const at: Record<string, string> = {};
  for (let guard = 0; guard < 20000 && !s.cleared.includes('p01-100'); guard++) {
    if (idleHoursPer30min && seconds >= nextBreak) {
      nextBreak += 1800;
      now += idleHoursPer30min * HOUR;
      claimIdle(s, now);
    }
    spendAll(s);
    const reach = [...reachableTiles(s)].map((id) => TILE_BY_ID[id]);
    const free = reach.find((t) => !t.encounterId && (t.kind !== 'gate' || s.cleared.includes('b2')));
    if (free) {
      enterTile(s, free.id, now);
      continue;
    }
    const doable = reach
      .filter((t) => t.encounterId && (formFor(s, t.encounterId), difficulty(effectivePower(s, t.encounterId), recommendedPower(t.encounterId)) !== 'hard'))
      .sort((a, b) => (a.stage ?? 0) - (b.stage ?? 0));
    const target = doable[0]?.id ?? bestFarmTile(s, now);
    if (!target) {
      // 농사할 칸이 전부 리스폰 대기 중이면 기다린다 (실제 경과 시간)
      now += 5 * 60_000;
      claimIdle(s, now);
      continue;
    }
    formFor(s, TILE_BY_ID[target].encounterId!);
    const r = enterTile(s, target, now);
    if (r.type !== 'battle') continue;
    battles++;
    const sec = r.outcome.result.duration / 2 + 6; // ×2 재생 + 조작 6초
    seconds += sec;
    now += sec * 1000;
    const t = TILE_BY_ID[target];
    if (r.outcome.won && t.kind === 'boss' && !at[target])
      at[stageCode(t) ?? target] = `${battles}전 플레이${Math.round(seconds / 60)}분 경과${Math.round((now - s.createdAt) / HOUR)}h`;
  }
  return {
    ...at,
    battles,
    lv: Object.values(s.spirits).map((x) => `${x.defId}${x.level}★${x.rank}단${x.stage}`).join(' '),
  };
}

console.log('── 직접 플레이만 ──');
for (let i = 1; i <= 2; i++) console.log(i, run(i));
console.log('── 30분 플레이마다 8시간 자리 비움 (방치 보상 수령) ──');
for (let i = 1; i <= 2; i++) console.log(i, run(i, 8));
