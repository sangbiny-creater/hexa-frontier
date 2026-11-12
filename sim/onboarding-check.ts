// 튜토리얼 한 줄 길(잎새 강아지 → 불씨 둥지 → 수풀 오솔길 → 바위엄니 굴 → 꽃피는 샘 → 고목 골렘)을
// 강화 없이 지나 첫 보스에 지고, 모은 골드로 레벨업한 뒤 다시 이기는지 시드별로 확인한다.
// 실행: npm run sim:onboarding
import { enterTile, levelUp, newGame } from '../src/core/game';
import { levelUpCost } from '../src/core/growth';
import { recommendedPower, teamPower } from '../src/core/power';

for (let i = 0; i < 8; i++) {
  const s = newGame(1_700_000_000_000 + i * 977_131);
  const path: string[] = [];
  for (const id of ['a1', 'a2', 'a3', 's1', 's2']) {
    const r = enterTile(s, id, s.createdAt);
    if (r.type === 'battle') path.push(`${id}:${r.outcome.won ? 'W' : 'L'}`);
  }
  const p0 = teamPower(s);
  const r1 = enterTile(s, 'b1', s.createdAt);
  const gold = s.gold;
  for (let g = 0; g < 200; g++) {
    const id = Object.keys(s.formation).sort((a, b) => s.spirits[a].level - s.spirits[b].level)[0];
    if (s.gold < levelUpCost(s.spirits[id].level) || levelUp(s, id)) break;
  }
  const p1 = teamPower(s);
  const r2 = enterTile(s, 'b1', s.createdAt);
  if (r1.type === 'battle' && r2.type === 'battle')
    console.log(
      i,
      path.join(' '),
      `| 1차 ${p0}/${recommendedPower('boss_treant')} ${r1.outcome.won ? '승' : `패(${Math.round(r1.outcome.result.enemyHpRatio * 100)}%)`}`,
      `| 골드 ${gold} → 레벨업 ${p1} ${r2.outcome.won ? '승' : '패'}`,
      Object.values(s.spirits).map((x) => x.level).join('/'),
    );
}
