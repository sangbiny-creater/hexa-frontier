// 권장 전투력 표 생성: 각 전투를 75% 이상 이기는 최소 파티 전투력(1~3명 중 최소)을 측정해
// src/data/recommended.ts 로 저장한다. 밸런스를 바꾸면 다시 실행: npm run sim:power
import { writeFileSync } from 'node:fs';
import { simulateBattle } from '../src/core/battle';
import { buildSetup, newGame } from '../src/core/game';
import { teamPower } from '../src/core/power';
import { ENCOUNTERS } from '../src/data/enemies';
import { DEFAULT_SLOT } from '../src/data/spirits';

const ids = ['tideshell', 'igni', 'sylphy'];
const out: Record<string, number> = {};
for (const enc of Object.keys(ENCOUNTERS)) {
  let best = Infinity;
  for (const n of [1, 2, 3]) {
    for (let lv = 1; lv <= 40; lv++) {
      const s = newGame(0);
      s.spirits = {};
      s.formation = {};
      for (const id of ids.slice(0, n)) {
        s.spirits[id] = { defId: id, level: lv, xp: 0, rank: 0, condition: 100, injured: false, injuryProgress: 0 };
        s.formation[id] = DEFAULT_SLOT[id];
      }
      let wins = 0;
      for (let i = 0; i < 12; i++) if (simulateBattle(buildSetup(s, enc, 77 + i * 131, 0)).outcome === 'win') wins++;
      if (wins >= 9) {
        best = Math.min(best, teamPower(s));
        break;
      }
    }
  }
  out[enc] = Math.ceil(best / 10) * 10;
  console.log(enc.padEnd(14), out[enc]);
}
writeFileSync(
  new URL('../src/data/recommended.ts', import.meta.url),
  `// 자동 생성: npm run sim:power (각 전투를 75% 이상 이기는 최소 파티 전투력)\nexport const RECOMMENDED_POWER: Record<string, number> = ${JSON.stringify(out, null, 2)};\n`,
);
