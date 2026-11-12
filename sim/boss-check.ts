// 밸런스 점검: 온보딩 흐름과 '직접 플레이만으로' 지역 보스까지 걸리는 전투 수를 측정한다.
// 실행: npm run sim:boss
import { ENCOUNTERS } from '../src/data/enemies';
import { TILE_BY_ID, TILES } from '../src/data/map';
import { HOUR } from '../src/core/clock';
import { canRankUp, cancelActivity, enterTile, fatigueWarning, newGame, rankUp, reachableTiles, startActivity, tick, type GameState } from '../src/core/game';

function battleOf(r: ReturnType<typeof enterTile>) {
  if (r.type !== 'battle') throw new Error('battle expected: ' + JSON.stringify(r).slice(0, 120));
  return r.outcome;
}

function rankAll(s: GameState) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of Object.keys(s.spirits)) if (canRankUp(s, id)) changed = !rankUp(s, id) || changed;
  }
}

function onboarding(seed: number) {
  const s = newGame(seed * 1000);
  const now = s.createdAt;
  const steps: string[] = [];
  for (const id of ['a1', 'a2', 'a3']) {
    const r = enterTile(s, id, now);
    if (r.type === 'battle') steps.push(`${id}:${r.outcome.won ? 'W' : 'L'}`);
  }
  const boss1 = battleOf(enterTile(s, 'b1', now));
  const lv = Object.values(s.spirits).map((x) => `${x.defId}${x.level}`).join(' ');
  // 회복 담당 확보 후 재도전
  const den = battleOf(enterTile(s, 's1', now));
  enterTile(s, 's2', now);
  let farms = 0;
  let boss2 = battleOf(enterTile(s, 'b1', now));
  while (!boss2.won && farms < 30) {
    const r = battleOf(enterTile(s, farms % 2 ? 'a3' : 's1', now));
    farms++;
    void r;
    rankAll(s);
    if (farms % 3 === 0) boss2 = battleOf(enterTile(s, 'b1', now));
  }
  return {
    steps: steps.join(' '),
    boss1: boss1.won ? 'WIN' : `lose(${Math.round(boss1.result.enemyHpRatio * 100)}%)`,
    lv,
    den: den.won,
    farms,
    boss2: boss2.won,
    lv2: Object.values(s.spirits).map((x) => `${x.defId}${x.level}★${x.rank}`).join(' '),
  };
}

/** 직접 플레이만으로 끝까지: 탐험 → 막히면 파밍(이길 수 있는 가장 어려운 칸) → 보스 재도전 */
function fullRun(seed: number, restWhenTired: boolean) {
  const s = newGame(seed * 7777);
  let now = s.createdAt;
  let battles = 0;
  let lastBossPower = -1;
  const power = () => Object.values(s.spirits).reduce((a, x) => a + x.level + x.rank * 3, 0);
  let seconds = 0;
  const bossAt: Record<string, number> = {};
  const lastWin: Record<string, boolean> = {};
  let sinceBoss = 0;
  let restHours = 0;
  for (let guard = 0; guard < 3000 && !s.cleared.includes('b2'); guard++) {
    rankAll(s);
    const reach = [...reachableTiles(s)].map((id) => TILE_BY_ID[id]).filter((t) => t.kind !== 'gate');
    const free = reach.find((t) => !t.encounterId);
    if (free) {
      enterTile(s, free.id, now);
      continue;
    }
    // 보스가 아닌 전투 칸 먼저, 보스는 3번 파밍마다 시도
    const normal = reach.filter((t) => t.kind === 'battle');
    const boss = reach.find((t) => t.kind === 'boss');
    let target = normal[0];
    if (!target && boss && power() >= lastBossPower + 4) {
      if (restWhenTired && fatigueWarning(s, now)) {
        // 경고를 따르는 플레이어: 휴식처(있으면) 또는 자연 회복으로 '최상'까지 쉰다
        const team = Object.keys(s.formation);
        if (s.unlocked.rest) for (const id of team) startActivity(s, 'rest', id, now);
        while (fatigueWarning(s, now) || team.some((id) => s.spirits[id].condition < 80 || s.spirits[id].injured)) {
          now += HOUR / 4;
          restHours += 0.25;
          tick(s, now);
          if (restHours > 500) break;
        }
        for (const a of s.activities) if (a.status === 'running' && a.type === 'rest') cancelActivity(s, a.id, now);
      }
      lastBossPower = power();
      target = boss;
      sinceBoss = 0;
    }
    if (!target) {
      // 파밍: 클리어한 전투 칸 중 가장 어려운(마지막) 칸
      const farmable = s.cleared.map((id) => TILE_BY_ID[id]).filter((t) => t.kind === 'battle');
      target = farmable[farmable.length - 1];
      if (!target) break;
    }
    const o = battleOf(enterTile(s, target.id, now));
    battles++;
    sinceBoss++;
    seconds += o.result.duration / 2 + 8; // x2 재생 + 화면 이동 8초 가정
    now += (o.result.duration / 2 + 8) * 1000;
    lastWin[target.id] = o.won;
    if (!o.won && target.kind === 'battle' && !s.cleared.includes(target.id)) {
      // 일반 칸에서 지면 이전 칸 파밍
      const farmable = s.cleared.map((id) => TILE_BY_ID[id]).filter((t) => t.kind === 'battle');
      const f = farmable[farmable.length - 1];
      if (f) {
        const fo = battleOf(enterTile(s, f.id, now));
        battles++;
        seconds += fo.result.duration / 2 + 8;
      }
    }
    if (o.won && target.kind === 'boss') bossAt[target.id] = battles;
  }
  return {
    bossAt,
    battles,
    minutes: Math.round(seconds / 60),
    lv: Object.values(s.spirits).map((x) => `${x.defId}${x.level}★${x.rank} c${Math.round(x.condition)}${x.injured ? '!' : ''}`).join(' '),
    bossTries: JSON.stringify(s.bossAttempts),
    restHours,
    done: s.cleared.includes('b2'),
  };
}

console.log('── 온보딩 (seed별) ──');
for (let i = 1; i <= 8; i++) console.log(i, onboarding(i));
console.log('\n── 직접 플레이만으로 지역 보스까지 ──');
for (let i = 1; i <= 5; i++) console.log(i, '[피로 무시]', fullRun(i, false));
console.log('\n── 같은 조건 + 피로 경고를 따라 쉬고 도전 ──');
for (let i = 1; i <= 5; i++) console.log(i, '[휴식 후 도전]', fullRun(i, true));
void ENCOUNTERS;
void TILES;
