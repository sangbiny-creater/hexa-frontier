// 보통 사람처럼 하는 봇 (D101): 그냥 앞으로(보스 → 출구) 걸어가고, 길에서 만나는 몬스터와 싸우고, 체력이 낮으면 물약.
// 일부러 레벨을 올리거나 돌아가지 않는다. 포인트는 'spend'면 대충 찍고, 'lazy'면 안 찍는다.
// 실행: npx tsx sim/casual-bot.ts
import { TREES } from '../src/rpg/data';
import { autoAct, buy, engaged, equipBest, heroStats, learnNode, move, newRpg, spendSpiritPoint, startStage, stepToward, usePotion, wait, type RpgState } from '../src/rpg/game';
import { active, STAGES } from '../src/rpg/world';

type Style = 'spend' | 'between' | 'lazy' | 'grind';

function spendPoints(s: RpgState) {
  for (let k = 0; k < 20 && s.heroes.knight.skillPts > 0; k++) {
    let did = false;
    for (const n of TREES.knight) if (!learnNode(s, n.id)) did = true;
    if (!did) break;
  }
  const owned = Object.keys(s.spirits) as (keyof typeof s.spirits)[];
  for (let k = 0; k < 20 && s.spiritPoints > 0 && owned.length; k++) spendSpiritPoint(s, owned[k % owned.length]);
  equipBest(s);
}

export function playCasual(s: RpgState, n: number, style: Style, maxTurns = 2500) {
  startStage(s, n);
  const d0 = s.deaths;
  const lv0 = s.heroes.knight.level;
  let low = 1;
  const pot0 = s.potions.small + s.potions.big;
  for (let t = 0; t < maxTurns && !s.stageClear; t++) {
    low = Math.min(low, s.heroes.knight.hp / heroStats(s).hp);
    if (s.deaths - d0 >= 8) break;
    if (style === 'spend') spendPoints(s);
    const h = s.heroes.knight;
    const max = heroStats(s).hp;
    if (h.hp < max * 0.35) usePotion(s, 'big') && usePotion(s, 'small');
    if (engaged(s) && autoAct(s)) continue; // 기술은 자동(D105)
    // grind: 보스를 잡은 뒤 다음 판 몬스터 레벨이 될 때까지 몰려오는 무리와 싸운다 (체력이 바닥나고 물약이 없으면 그만)
    if (style === 'grind' && s.bossDown && n < STAGES.length) {
      const target = STAGES[n].minLv + 1;
      const out = s.potions.small + s.potions.big === 0 && h.hp < max * 0.3;
      if (h.level < target && !out) {
        wait(s);
        continue;
      }
    }
    // 목표: 보스가 살아 있으면 보스, 아니면 출구
    let goal: { c: number; r: number } | null = null;
    if (s.bossDown) {
      for (const c of active().cells.values()) if (c.feature?.kind === 'exit') goal = c;
    } else {
      const b = s.monsters.find((m) => m.boss && !m.dead);
      if (b) goal = b;
    }
    const d = goal ? stepToward(s, goal) : null;
    if (d) move(s, d);
    else wait(s);
  }
  return { ok: s.stageClear, deaths: s.deaths - d0, turns: s.turn, lv0, lv1: s.heroes.knight.level, low: Math.round(low * 100), pots: pot0 - s.potions.small - s.potions.big };
}

export function runCasual(style: Style, log = false) {
  const s = newRpg();
  s.tut = 99;
  const rows: string[] = [];
  let firstTry = 0;
  for (let n = 1; n <= 10; n++) {
    while (s.potions.small < 3 && !('error' in buy(s, 'small')));
    if (style === 'between' || style === 'grind') spendPoints(s); // 판 사이에만 포인트·장비 정리
    let r = playCasual(s, n, style);
    let tries = 1;
    if (r.ok && r.deaths === 0) firstTry++;
    while (!r.ok && tries < 4) {
      while (s.potions.small < 3 && !('error' in buy(s, 'small')));
      r = playCasual(s, n, style);
      tries++;
    }
    rows.push(`${n}판 ${r.ok ? '클리어' : '실패'} 시도${tries} 사망${r.deaths} 턴${r.turns} 레벨${r.lv0}→${r.lv1} 최저체력${r.low}% 물약${r.pots}`);
    if (!r.ok) break;
  }
  if (log) console.log(`[${style}]\n` + rows.join('\n') + `\n한 번에(사망 0) 깬 판: ${firstTry}`);
  return { rows, firstTry };
}

if (process.argv[1]?.endsWith('casual-bot.ts')) {
  runCasual('between', true);
  runCasual('grind', true);
  runCasual('lazy', true);
}
