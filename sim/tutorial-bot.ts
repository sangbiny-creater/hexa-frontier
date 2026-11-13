// 튜토리얼 자동 플레이: 아렌의 안내(computeGuide)만 그대로 따라 P00을 끝까지 진행한다.
// 칸별 도전·패배·골드 벌기 횟수, 레벨, 걸린 시간을 돌려준다. (출력: sim/tutorial-run.ts, 테스트: tests/tutorial.test.ts)
import { canEvolve, claimIdle, enterTile, evolve, levelCap, levelUp, newGame, setFormation, summon } from '../src/core/game';
import { levelUpCost } from '../src/core/growth';
import { suggestTeam } from '../src/core/power';
import { TILE_BY_ID } from '../src/data/map';
import { DEFAULT_SLOT } from '../src/data/spirits';
import { computeGuide, type Tab } from '../src/ui/tutorial';

export function runTutorial(seed: number, verbose = false) {
  const s = newGame(1_700_000_000_000 + seed * 977_131);
  s.tutorial.introSeen = true;
  let now = s.createdAt;
  let tab: Tab = 'map';
  let selected: string | null = null;
  const log: string[] = [];
  const stat = { battles: 0, losses: 0, farm: 0, waitSec: 0 };
  const lossAt: string[] = [];
  for (let step = 0; step < 5000; step++) {
    const g = computeGuide(s, { selected, tab, now });
    if (!g) break;
    if (g.finish) {
      s.tutorial.done = true;
      break;
    }
    const t = g.target;
    if (!t) {
      now += 15_000;
      stat.waitSec += 15;
      continue;
    }
    if (t.kind === 'tab') {
      tab = t.tab;
      selected = null;
      if (tab === 'camp') {
        s.tutorial.campTip = true;
        claimIdle(s, now);
      }
      now += 3000;
    } else if (t.kind === 'tile') {
      selected = t.id;
      now += 2000;
    } else if (t.kind === 'tileAction') {
      const id = selected!;
      const wasCleared = s.cleared.includes(id);
      const r = enterTile(s, id, now);
      selected = null;
      if (r.type === 'battle') {
        stat.battles++;
        if (wasCleared) stat.farm++;
        if (!r.outcome.won) {
          stat.losses++;
          lossAt.push(id);
        }
        const sec = r.outcome.result.duration / 2 + 8;
        now += sec * 1000;
        if (verbose) log.push(`${id}${wasCleared ? '(파밍)' : ''} ${r.outcome.won ? '승' : '패'} 골드${s.gold} 레벨 ${Object.values(s.spirits).map((x) => x.defId.slice(0, 4) + x.level + (x.stage > 1 ? '★' : '')).join(',')}`);
      } else if (r.type === 'error') throw new Error(`${id}: ${r.message}`);
      else now += 3000;
    } else if (t.kind === 'altar') {
      const r = summon(s, t.element);
      if ('error' in r) throw new Error(r.error);
      if (verbose) log.push(`소환 ${r.spiritId}${r.duplicate ? '(중복)' : ''}`);
      now += 5000;
    } else if (t.kind === 'levelUp') {
      for (let k = 0; k < 400; k++) {
        const id = Object.keys(s.formation).filter((x) => s.spirits[x].level < levelCap(s.spirits[x])).sort((a, b) => s.spirits[a].level - s.spirits[b].level)[0];
        if (!id || s.gold < levelUpCost(s.spirits[id].level) || levelUp(s, id)) break;
      }
      now += 4000;
    } else if (t.kind === 'evolve') {
      if (canEvolve(s, t.id)) {
        evolve(s, t.id);
        if (verbose) log.push(`진화 ${t.id}`);
      } else if (levelUp(s, t.id)) throw new Error('levelUp failed');
      now += 2000;
    } else if (t.kind === 'suggest') {
      const b2 = suggestTeam(Object.keys(s.spirits), TILE_BY_ID[selected!].encounterId!, s.maxDeploy);
      for (const k of Object.keys(s.formation)) setFormation(s, k, null);
      for (const k of b2) setFormation(s, k, DEFAULT_SLOT[k]);
      now += 3000;
    }
  }
  return { state: s, done: s.tutorial.done, minutes: Math.round((now - s.createdAt) / 60_000), ...stat, lossAt: lossAt.join(' '), log, gold: s.gold };
}


