// 온보딩 실제 경로(a1→a2→a3→b1)에서 첫 보스 결과를 시드별로 확인한다.
import { enterTile, newGame } from '../src/core/game';
for (let i = 0; i < 10; i++) {
  const s = newGame(1_700_000_000_000 + i * 977_131);
  for (const id of ['a1', 'a2', 'a3']) enterTile(s, id, s.createdAt);
  const r = enterTile(s, 'b1', s.createdAt);
  const lv = Object.values(s.spirits).map((x) => x.defId + x.level).join(' ');
  if (r.type === 'battle') console.log(i, lv, r.outcome.result.outcome, Math.round(r.outcome.result.enemyHpRatio * 100) + '%');
}
