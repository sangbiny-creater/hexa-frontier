// 권장 전투력 표 생성: 여러 편성(3명 조합)으로 각 전투를 75% 이상 이기는 최소 레벨을 찾고,
// 그때의 '상성 보정 전투력'(effectivePower) 중 최솟값을 권장값으로 저장한다.
// 밸런스를 바꾸면 다시 실행: npm run sim:power
import { writeFileSync } from 'node:fs';
import { simulateBattle } from '../src/core/battle';
import { buildSetup, newGame } from '../src/core/game';
import { effectivePower } from '../src/core/power';
import { ENCOUNTERS } from '../src/data/enemies';
import { DEFAULT_SLOT } from '../src/data/spirits';

const COMPS = [
  ['tideshell', 'sylphy'],
  ['tideshell', 'sylphy', 'igni'],
  ['tideshell', 'sylphy', 'galewing'],
  ['tideshell', 'igni', 'galewing'],
  ['sylphy', 'igni', 'galewing'],
];
const out: Record<string, number> = {};
for (const enc of Object.keys(ENCOUNTERS)) {
  let best = Infinity;
  for (const ids of COMPS) {
    for (let lv = 1; lv <= 40; lv++) {
      const s = newGame(0);
      s.spirits = {};
      s.formation = {};
      for (const id of ids) {
        s.spirits[id] = { defId: id, level: lv, xp: 0, rank: 0, condition: 100, injured: false, injuryProgress: 0 };
        s.formation[id] = DEFAULT_SLOT[id];
      }
      let wins = 0;
      for (let i = 0; i < 12; i++) if (simulateBattle(buildSetup(s, enc, 77 + i * 131, 0)).outcome === 'win') wins++;
      if (wins >= 9) {
        best = Math.min(best, effectivePower(s, enc));
        break;
      }
    }
  }
  out[enc] = Math.round(best / 10) * 10;
  console.log(enc.padEnd(14), out[enc]);
}
writeFileSync(
  new URL('../src/data/recommended.ts', import.meta.url),
  `// 자동 생성: npm run sim:power (여러 편성 중 75% 이상 이기는 최소 '상성 보정 전투력')\nexport const RECOMMENDED_POWER: Record<string, number> = ${JSON.stringify(out, null, 2)};\n`,
);
