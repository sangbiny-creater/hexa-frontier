// 밸런스 점검 (D32 골드 레벨업 기준): 봇이 전투력 표시만 보고 플레이할 때
// 고목 수호자·바위 거인까지 걸리는 전투 수와 시간을 잰다. 실행: npm run sim:boss
import { HOUR } from '../src/core/clock';
import { bestFarmTile, canRankUp, claimIdle, enterTile, levelUp, newGame, rankUp, reachableTiles, type GameState } from '../src/core/game';
import { levelUpCost } from '../src/core/growth';
import { difficulty, recommendedPower, teamPower } from '../src/core/power';
import { TILE_BY_ID } from '../src/data/map';

function spendAll(s: GameState) {
  for (const id of Object.keys(s.spirits)) while (canRankUp(s, id)) rankUp(s, id);
  for (let guard = 0; guard < 500; guard++) {
    const ids = Object.keys(s.formation).sort((a, b) => s.spirits[a].level - s.spirits[b].level);
    const id = ids[0];
    if (!id || s.gold < levelUpCost(s.spirits[id].level) || levelUp(s, id)) break;
  }
}

function run(seed: number, idleHoursPer30min = 0) {
  const s = newGame(seed * 7777);
  let now = s.createdAt;
  let battles = 0;
  let seconds = 0;
  let nextBreak = 1800;
  const at: Record<string, string> = {};
  for (let guard = 0; guard < 4000 && !s.cleared.includes('b2'); guard++) {
    if (idleHoursPer30min && seconds >= nextBreak) {
      nextBreak += 1800;
      now += idleHoursPer30min * HOUR;
      claimIdle(s, now);
    }
    spendAll(s);
    const tp = teamPower(s);
    const reach = [...reachableTiles(s)].map((id) => TILE_BY_ID[id]).filter((t) => t.kind !== 'gate');
    const free = reach.find((t) => !t.encounterId);
    if (free) {
      enterTile(s, free.id, now);
      continue;
    }
    const doable = reach
      .filter((t) => t.encounterId && difficulty(tp, recommendedPower(t.encounterId)) !== 'hard')
      .sort((a, b) => (a.kind === 'boss' ? 1 : 0) - (b.kind === 'boss' ? 1 : 0));
    const target = doable[0]?.id ?? bestFarmTile(s);
    if (!target) break;
    const r = enterTile(s, target, now);
    if (r.type !== 'battle') continue;
    battles++;
    const sec = r.outcome.result.duration / 2 + 6; // ×2 재생 + 조작 6초
    seconds += sec;
    now += sec * 1000;
    if (r.outcome.won && TILE_BY_ID[target].kind === 'boss' && !at[target]) at[target] = `${battles}전 ${Math.round(seconds / 60)}분`;
  }
  return {
    ...at,
    battles,
    minutes: Math.round(seconds / 60),
    lv: Object.values(s.spirits).map((x) => `${x.defId}${x.level}★${x.rank}`).join(' '),
  };
}

console.log('── 직접 플레이만 ──');
for (let i = 1; i <= 3; i++) console.log(i, run(i));
console.log('── 30분 플레이마다 8시간 자리 비움 (방치 보상 수령) ──');
for (let i = 1; i <= 3; i++) console.log(i, run(i, 8));
