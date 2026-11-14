// 전술 전투 밸런스 봇 (D109): 아군도 인공지능으로 두고 1판부터 차례로 깬다. 실행: npx tsx sim/tactics-bot.ts
// 지면 앞 판을 한 번 다시 해서(경험치 벌기) 재도전한다.
import { stepSide } from '../src/tactics/ai';
import { elMul } from '../src/tactics/data';
import { autoEquip, buyItem, createBattle, defOf, endAllyPhase, endEnemyPhase, finishBattle, maxParty, newCampaign, useCrystal, type Battle, type Campaign } from '../src/tactics/engine';
import { ENEMIES } from '../src/tactics/stages';
import { STAGES } from '../src/tactics/stages';

export function autoBattle(b: Battle, maxTurns = 60) {
  for (let t = 0; t < maxTurns && !b.result; t++) {
    while (stepSide(b, 'ally'));
    endAllyPhase(b);
    while (stepSide(b, 'enemy'));
    endEnemyPhase(b);
  }
  return b;
}
/** 출전 고르기: 지도자 + 탱커·힐러 하나씩 + 이번 판 적 속성에 유리한 순 (사람이 '상성 추천'을 누르는 것과 같음) */
export function pickParty(cp: Campaign, n: number): string[] {
  const max = maxParty(n);
  const els = STAGES[n - 1].enemies.map((e) => ENEMIES[`e_${e.id}`].element);
  const good = (id: string) => (process.env.NOCOUNTER ? 0 : 1) * els.reduce((a, x) => a + (elMul(defOf(id).element, x) > 1 ? 1 : 0) - (elMul(x, defOf(id).element) > 1 ? 0.7 : 0), 0);
  const pool = cp.joined.filter((id) => id !== cp.hero).sort((a, b) => good(b) + cp.roster[b].lv * 0.15 - (good(a) + cp.roster[a].lv * 0.15));
  const out: string[] = [cp.hero];
  for (const need of ['tank', 'healer']) {
    const x = pool.find((id) => defOf(id).role === need && !out.includes(id));
    if (x && out.length < max) out.push(x);
  }
  for (const id of pool) if (out.length < max && !out.includes(id)) out.push(id);
  return out;
}
export function shop(cp: Campaign) {
  while ((cp.bag.potion ?? 0) < 4 && !buyItem(cp, 'potion'));
  // 남는 골드로 좋은 장비 (가장 비싼 것부터)
  autoEquip(cp);
  // 성장의 결정은 레벨이 가장 낮은 스피릿에게
  while ((cp.bag.crystal ?? 0) > 0) {
    const low = [...cp.joined].sort((a, b) => cp.roster[a].lv - cp.roster[b].lv)[0];
    useCrystal(cp, low);
  }
}

export function runTacticsBot(log = false, upTo = STAGES.length, hero: 'aren' | 'lia' = 'aren') {
  const cp = newCampaign(hero);
  const rows: string[] = [];
  let firstTry = 0;
  let seed = 1;
  for (let n = 1; n <= upTo; n++) {
    let tries = 0;
    let won = false;
    while (!won && tries < 10) {
      shop(cp);
      const b = autoBattle(createBattle(cp, n, pickParty(cp, n), seed++));
      const r = finishBattle(cp, b);
      tries++;
      won = r.win;
      if (won && tries === 1) firstTry++;
      if (!won && n > 1) {
        // 앞 판에서 경험치 벌기
        shop(cp);
        finishBattle(cp, autoBattle(createBattle(cp, n - 1, pickParty(cp, n - 1), seed++)));
      }
      if (won) rows.push(`${n}판 승리 시도${tries} ${b.turn}턴 레벨 ${pickParty(cp, n).map((id) => cp.roster[id].lv).join('/')} 적${Math.round(STAGES[n - 1].enemies.reduce((a, e) => a + e.lv, 0) / STAGES[n - 1].enemies.length)} 골드${cp.gold}`);
    }
    if (!won) {
      rows.push(`${n}판 실패`);
      break;
    }
  }
  if (log) console.log(rows.join('\n') + `\n한 번에 이긴 판: ${firstTry}`);
  return { rows, firstTry, cp };
}

if (process.argv[1]?.endsWith('tactics-bot.ts')) runTacticsBot(true, Number(process.argv[2] ?? STAGES.length), (process.argv[3] as 'aren' | 'lia') ?? 'aren');
