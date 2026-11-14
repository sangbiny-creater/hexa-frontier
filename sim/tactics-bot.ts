// 전술 전투 밸런스 봇 (D109): 아군도 인공지능으로 두고 1판부터 차례로 깬다. 실행: npx tsx sim/tactics-bot.ts
// 지면 앞 판을 한 번 다시 해서(경험치 벌기) 재도전한다.
import { stepSide } from '../src/tactics/ai';
import { autoEquip, buyItem, createBattle, defOf, endAllyPhase, endEnemyPhase, finishBattle, maxParty, newCampaign, type Battle, type Campaign } from '../src/tactics/engine';
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
export function pickParty(cp: Campaign, n: number): string[] {
  const max = maxParty(n);
  const byLv = [...cp.joined].sort((a, b) => cp.roster[b].lv - cp.roster[a].lv);
  const out = ['aren'];
  // 역할이 겹치지 않게 먼저 채우고, 남으면 레벨 순
  for (const id of byLv) if (out.length < max && !out.includes(id) && !out.some((x) => defOf(x).role === defOf(id).role)) out.push(id);
  for (const id of byLv) if (out.length < max && !out.includes(id)) out.push(id);
  return out;
}
export function shop(cp: Campaign) {
  while ((cp.bag.potion ?? 0) < 4 && !buyItem(cp, 'potion'));
  autoEquip(cp);
}

export function runTacticsBot(log = false) {
  const cp = newCampaign();
  const rows: string[] = [];
  let firstTry = 0;
  let seed = 1;
  for (let n = 1; n <= STAGES.length; n++) {
    let tries = 0;
    let won = false;
    while (!won && tries < 5) {
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
      if (won) rows.push(`${n}판 승리 시도${tries} ${b.turn}턴 레벨 ${pickParty(cp, n).map((id) => cp.roster[id].lv).join('/')} 골드${cp.gold}`);
    }
    if (!won) {
      rows.push(`${n}판 실패`);
      break;
    }
  }
  if (log) console.log(rows.join('\n') + `\n한 번에 이긴 판: ${firstTry}`);
  return { rows, firstTry, cp };
}

if (process.argv[1]?.endsWith('tactics-bot.ts')) runTacticsBot(true);
