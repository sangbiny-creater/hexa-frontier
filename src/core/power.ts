// 전투력: 플레이어 안내용 지표 (기획서 10장: 실제 승패는 전투 시뮬레이션이 결정).
import { BALANCE } from '../data/balance';
import { RECOMMENDED_POWER } from '../data/recommended';
import { SPIRITS } from '../data/spirits';
import { computeStats } from './battle';
import type { GameState } from './game';
import type { UnitDef } from './types';

function rawPower(def: UnitDef, side: 'ally' | 'enemy', level: number, rank: number): number {
  // 열 보너스가 없는 칸(중열 가운데)을 기준으로 계산
  const st = computeStats({ uid: 'p', def, side, slot: 4, level, rank, condition: 100 }, []);
  return st.atk * 6 + st.def * 4 + st.hp * 0.8;
}

export function spiritPower(s: GameState, id: string): number {
  const sp = s.spirits[id];
  return Math.round(rawPower(SPIRITS[id], 'ally', sp.level, sp.rank));
}

export function spiritPowerAt(id: string, level: number, rank: number): number {
  return Math.round(rawPower(SPIRITS[id], 'ally', level, rank));
}

/** 출전 편성의 전투력 합 */
export function teamPower(s: GameState, ids: string[] = Object.keys(s.formation)): number {
  return ids.reduce((a, id) => a + spiritPower(s, id), 0);
}

/** 권장 전투력: 시뮬레이션으로 측정한 '75% 이상 이기는 최소 전투력' (npm run sim:power로 재생성) */
export function recommendedPower(encounterId: string): number {
  return RECOMMENDED_POWER[encounterId] ?? 0;
}

export type Difficulty = 'easy' | 'fair' | 'hard';

export function difficulty(team: number, recommended: number): Difficulty {
  const r = team / recommended;
  if (r >= BALANCE.power.easyAt) return 'easy';
  if (r >= BALANCE.power.fairAt) return 'fair';
  return 'hard';
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: '쉬움', fair: '적정', hard: '위험' };
