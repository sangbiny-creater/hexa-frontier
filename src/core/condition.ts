// 컨디션 B안 (기획서 6장, D20): 승리로는 감소하지 않고, 패배·위기·전투불능에서만 피로.
import { BALANCE } from '../data/balance';

const C = BALANCE.condition;

export function conditionTier(condition: number) {
  return C.tiers.find((t) => condition >= t.min) ?? C.tiers[C.tiers.length - 1];
}

export function conditionMultiplier(condition: number): number {
  return conditionTier(condition).mul;
}

/**
 * 전투 1회의 스피릿 개인 컨디션 변화량.
 * 승리: 전투불능된 스피릿만 -10. 패배: 패배 -5(보스 -8), HP30%↓ -3, 전투불능 추가 -10. 상한 -15.
 */
export function conditionDelta(opts: { won: boolean; isBoss: boolean; minHpRatio: number; ko: boolean }): number {
  let d = 0;
  if (opts.won) {
    if (opts.ko) d += C.ko;
  } else {
    d += opts.isBoss ? C.lossBoss : C.lossNormal;
    if (opts.minHpRatio <= 0.3) d += C.lowHp;
    if (opts.ko) d += C.ko;
  }
  return Math.max(C.perBattleCap, d);
}
