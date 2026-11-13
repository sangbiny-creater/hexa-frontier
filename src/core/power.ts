// 전투력: 플레이어 안내용 지표 (기획서 10장: 실제 승패는 전투 시뮬레이션이 결정).
import { BALANCE } from '../data/balance';
import { RECOMMENDED_POWER } from '../data/recommended';
import { SPIRITS } from '../data/spirits';
import { computeStats } from './battle';
import type { GameState } from './game';
import type { UnitDef } from './types';

function rawPower(def: UnitDef, side: 'ally' | 'enemy', level: number, rank: number, stage = 1): number {
  // 열 보너스가 없는 칸(중열 가운데)을 기준으로 계산
  const st = computeStats({ uid: 'p', def, side, slot: 4, level, rank, stage, condition: 100 }, []);
  return st.atk * 6 + st.def * 4 + st.hp * 0.8;
}

export function spiritPower(s: GameState, id: string): number {
  const sp = s.spirits[id];
  return Math.round(rawPower(SPIRITS[id], 'ally', sp.level, sp.rank, sp.stage));
}

export function spiritPowerAt(id: string, level: number, rank: number, stage = 1): number {
  return Math.round(rawPower(SPIRITS[id], 'ally', level, rank, stage));
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

// ── 속성 상성 요약 (UI 안내용) ──
import { elementMultiplier } from './board';
import { ENCOUNTERS as _ENC, ENEMIES as _EN } from '../data/enemies';

export type Matchup = 'adv' | 'dis' | 'even';

/** 스피릿이 이 전투의 적들을 공격할 때 평균 상성 (보스는 가중치 3) */
export function attackMatchup(spiritId: string, encounterId: string): Matchup {
  const enc = _ENC[encounterId];
  let sum = 0;
  let w = 0;
  for (const e of enc.enemies) {
    const def = _EN[e.enemyId];
    const k = def.isBoss ? 3 : 1;
    sum += elementMultiplier(SPIRITS[spiritId].element, def.element) * k;
    w += k;
  }
  const m = sum / w;
  return m > 1.05 ? 'adv' : m < 0.95 ? 'dis' : 'even';
}

/** 이 전투에서 쓰면 좋은 스피릿 순서 (유리 → 보통 → 불리) */
export function suggestTeam(owned: string[], encounterId: string, max: number): string[] {
  const score = (id: string) => ({ adv: 2, even: 1, dis: 0 })[attackMatchup(id, encounterId)];
  // 탱커·회복은 상성이 보통이어도 남긴다
  const role = (id: string) => (SPIRITS[id].role === 'tank' || SPIRITS[id].role === 'healer' ? 0.5 : 0);
  return [...owned].sort((a, b) => score(b) + role(b) - (score(a) + role(a))).slice(0, max);
}

const MATCH_FACTOR: Record<Matchup, number> = { adv: 1.25, even: 1, dis: 0.5 };

/** 상성 보정 전투력: 출전 스피릿마다 이 전투의 적에 대한 상성(▲×1.25 / ▼×0.5)을 곱한 합 */
export function effectivePower(s: GameState, encounterId: string, ids: string[] = Object.keys(s.formation)): number {
  return Math.round(ids.reduce((a, id) => a + spiritPower(s, id) * MATCH_FACTOR[attackMatchup(id, encounterId)], 0));
}
