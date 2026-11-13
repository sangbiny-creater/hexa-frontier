// 적 레벨을 바꿔 가며 '시작 팀이 이기는 최소 레벨'을 찾는다 (P00 조정용). 실행: npx tsx sim/p00-minlv.ts
import { simulateBattle } from '../src/core/battle';
import { buildSetup, newGame } from '../src/core/game';
import { ENCOUNTERS } from '../src/data/enemies';
import { DEFAULT_SLOT } from '../src/data/spirits';

type Comp = (lv: number) => [string, number, number?][];
function winRate(enc: string, comp: [string, number, number?][], elv: number | null, n = 16) {
  const s = newGame(0);
  s.spirits = {};
  s.formation = {};
  for (const [id, lv, st] of comp) {
    s.spirits[id] = { defId: id, level: lv, xp: 0, rank: 0, stage: (st ?? 1) as 1, copies: 0, condition: 100, injured: false, injuryProgress: 0 };
    s.formation[id] = DEFAULT_SLOT[id];
  }
  const orig = ENCOUNTERS[enc].enemies.map((e) => e.level);
  if (elv !== null) ENCOUNTERS[enc].enemies.forEach((e, i) => (e.level = Math.max(1, orig[i] - orig[0] + elv)));
  let w = 0;
  for (let i = 0; i < n; i++) if (simulateBattle(buildSetup(s, enc, 11 + i * 7919, 0)).outcome === 'win') w++;
  ENCOUNTERS[enc].enemies.forEach((e, i) => (e.level = orig[i]));
  return w / n;
}
export function minLv(enc: string, comp: Comp, elv: number | null) {
  for (let lv = 1; lv <= 30; lv++) if (winRate(enc, comp(lv), elv) >= 0.8) return lv;
  return 99;
}
const st: Comp = (lv) => [['tideshell', lv], ['sylphy', lv]];
const args = process.argv.slice(2);
const [enc, which, ...lvls] = args;
const comps: Record<string, Comp> = {
  st,
  igni: (lv) => [...st(lv), ['igni', Math.max(1, Math.floor(lv * 0.8))]],
  igniL: (lv) => [...st(lv), ['igni', lv]],
  rocky: (lv) => [...st(lv), ['rocky', Math.max(1, Math.floor(lv * 0.8))]],
  rockyL: (lv) => [...st(lv), ['rocky', lv]],
  gale: (lv) => [...st(lv), ['galewing', Math.max(1, Math.floor(lv * 0.8))]],
  rockyEvo: (lv) => [...st(lv), ['rocky', 10, 2]],
  evoL: (lv) => [...st(10), ['rocky', lv, 2]],
  noEvoL: (lv) => [...st(Math.min(10, lv)), ['rocky', Math.min(10, lv)]],
  evo9: (lv) => [...st(9), ['rocky', lv, 2]],
  igniEvo: (lv) => [...st(lv), ['igni', 10, 2]],
};
for (const l of lvls) console.log(enc, which, 'enemyLv', l, '→ min', minLv(enc, comps[which], Number(l)));
