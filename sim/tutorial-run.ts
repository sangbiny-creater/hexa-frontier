// 튜토리얼 자동 플레이 결과 출력. 실행: npx tsx sim/tutorial-run.ts [시드 수]
import { runTutorial } from './tutorial-bot';

const n = Number(process.argv[2] ?? 5);
for (let i = 0; i < n; i++) {
  const r = runTutorial(i, i === 0);
  if (i === -1) console.log(r.log.join('\n'));
  if (i < 3 || !r.done || r.losses !== 5) console.log(i, JSON.stringify({ done: r.done, m: r.minutes, b: r.battles, farm: r.farm, wait: r.waitSec, loss: r.lossAt }));
}
