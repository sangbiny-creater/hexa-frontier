// 레벨/승급/E+F 성장 보호 (기획서 5장, D25).
import { BALANCE } from '../data/balance';
import type { OwnedSpirit } from './types';

const G = BALANCE.growth;

/** 레벨 L → L+1 필요 경험치. 1~10 빠름, 11~20 보통, 21~30 느림 [가설]. */
export function xpToNext(level: number): number {
  const band = level <= 10 ? 1 : level <= 20 ? 1.6 : 2.6;
  return Math.round(12 * Math.pow(level, 1.45) * band);
}

/** 계정 최고 레벨 기준 따라잡기(E) + 선배 전수(F) 최종 배율. 상한 ×3.5. */
export function xpMultiplier(spirit: OwnedSpirit, roster: OwnedSpirit[], source: 'battle' | 'training'): number {
  const maxLevel = Math.max(...roster.map((s) => s.level));
  const threshold = Math.floor(maxLevel * G.catchUpRatio);
  // 레벨 차이가 최소 G.catchUpMinGap 이상일 때만 가속 (초반 동시 성장 시 과속 방지)
  const catchUp = spirit.level < threshold && maxLevel - spirit.level >= G.catchUpMinGap ? G.catchUpMultiplier : 1;
  const hasMentor = roster.some((s) => s !== spirit && s.level >= G.mentorLevel);
  const mentor = source === 'training' && hasMentor ? 1 + G.mentorBonus : 1;
  return Math.min(G.bonusCap, catchUp * mentor);
}

/** 경험치 지급. 레벨업 횟수를 돌려준다. 승급/스킬은 영향 없음. */
export function grantXp(spirit: OwnedSpirit, amount: number): number {
  let ups = 0;
  if (spirit.level >= G.maxLevel) return 0;
  spirit.xp += Math.round(amount);
  while (spirit.level < G.maxLevel && spirit.xp >= xpToNext(spirit.level)) {
    spirit.xp -= xpToNext(spirit.level);
    spirit.level++;
    ups++;
  }
  if (spirit.level >= G.maxLevel) spirit.xp = 0;
  return ups;
}

export function rankUpCost(spirit: OwnedSpirit) {
  if (spirit.rank >= G.maxRank) return null;
  return G.rankCost[spirit.rank];
}

export function trainingXp(level: number): number {
  return BALANCE.activity.trainingXpBase + BALANCE.activity.trainingXpPerLevel * level;
}
