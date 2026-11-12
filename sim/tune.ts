// 보스 난이도 튜닝: 파티 레벨/승급별 승률과 남은 HP를 출력한다.
// 실행: npx tsx sim/tune.ts
import { buildSetup, newGame } from '../src/core/game';
import { simulateBattle } from '../src/core/battle';
import { DEFAULT_SLOT } from '../src/data/spirits';

export function testEncounter(encId: string, party: { id: string; level: number; rank?: number }[], seeds = 40) {
  const s = newGame(0);
  s.spirits = {};
  s.formation = {};
  for (const p of party) {
    s.spirits[p.id] = { defId: p.id, level: p.level, xp: 0, rank: p.rank ?? 0, condition: 100, injured: false, injuryProgress: 0 };
    s.formation[p.id] = DEFAULT_SLOT[p.id];
  }
  let wins = 0;
  let hp = 0;
  let dur = 0;
  for (let i = 0; i < seeds; i++) {
    const r = simulateBattle(buildSetup(s, encId, 1000 + i * 7919, 0));
    if (r.outcome === 'win') wins++;
    hp += r.enemyHpRatio;
    dur += r.duration;
  }
  return { win: Math.round((wins / seeds) * 100) + '%', hpLeft: Math.round((hp / seeds) * 100) + '%', sec: Math.round(dur / seeds) };
}

const P = (lv: number, rank = 0, ids = ['tideshell', 'igni', 'sylphy']) => ids.map((id) => ({ id, level: lv, rank }));

if (process.argv[1]?.endsWith('tune.ts')) {
  console.log('boss_treant (2명)');
  for (const lv of [3, 4, 5, 6]) console.log(' lv', lv, testEncounter('boss_treant', P(lv, 0, ['tideshell', 'igni'])));
  console.log('boss_treant (3명)');
  for (const [lv, rk] of [[4, 0], [5, 0], [5, 1], [6, 1], [7, 1]]) console.log(' lv', lv, '★', rk, testEncounter('boss_treant', P(lv, rk)));
  console.log('zone B 일반');
  for (const enc of ['mist_ford', 'beetle_field', 'boar_herd', 'mixed_camp', 'storm_ridge', 'deep_woods', 'giant_gate']) {
    console.log(' ', enc, [7, 9, 11, 13].map((lv) => `${lv}:${testEncounter(enc, P(lv, Math.floor(lv / 5)), 10).win}`).join(' '));
  }
  console.log('boss_giant');
  for (const [lv, rk] of [[10, 2], [12, 2], [13, 3], [14, 3], [15, 3], [16, 3], [18, 3]]) console.log(' lv', lv, '★', rk, testEncounter('boss_giant', P(lv, rk)));
}
