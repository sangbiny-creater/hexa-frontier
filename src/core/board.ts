import { BALANCE } from '../data/balance';
import type { Element, Role, Range, RowName } from './types';

// 편성판: 진영당 육각 9칸 = 3열(전/중/후) × 3칸. slot = row*3 + lane.
export const SLOT_COUNT = 9;
export const ROWS: RowName[] = ['front', 'mid', 'back'];
export const ROW_LABEL: Record<RowName, string> = { front: '전열', mid: '중열', back: '후열' };

export function rowOf(slot: number): number {
  return Math.floor(slot / 3);
}
export function rowName(slot: number): RowName {
  return ROWS[rowOf(slot)];
}
export function laneOf(slot: number): number {
  return slot % 3;
}

/** 육각 배치(열이 세로줄, 중열은 반 칸 내려감)에서 인접 칸. */
export function adjacentSlots(slot: number): number[] {
  const r = rowOf(slot);
  const l = laneOf(slot);
  const out: number[] = [];
  const push = (rr: number, ll: number) => {
    if (rr >= 0 && rr < 3 && ll >= 0 && ll < 3) out.push(rr * 3 + ll);
  };
  push(r, l - 1);
  push(r, l + 1);
  const offs = r % 2 === 1 ? [0, 1] : [-1, 0];
  for (const dr of [-1, 1]) for (const o of offs) push(r + dr, l + o);
  return out;
}

// ── 속성 ──
const cycle = BALANCE.element.cycle as readonly Element[];

export function elementMultiplier(attacker: Element, defender: Element): number {
  const i = cycle.indexOf(attacker);
  const j = cycle.indexOf(defender);
  if ((i + 1) % 5 === j) return BALANCE.element.advantage;
  if ((j + 1) % 5 === i) return BALANCE.element.disadvantage;
  return 1;
}

/** 상생: 한 칸 건너뛴 관계. supporter가 target을 돕는가 (물→숲, 불→대지, 숲→전기, 대지→물, 전기→불) */
export function supports(supporter: Element, target: Element): boolean {
  return (cycle.indexOf(supporter) + 2) % 5 === cycle.indexOf(target);
}

export const ELEMENT_LABEL: Record<Element, string> = {
  water: '물',
  fire: '불',
  forest: '숲',
  earth: '대지',
  electric: '전기',
};
export const ROLE_LABEL: Record<Role, string> = { tank: '탱커', dealer: '딜러', support: '지원', healer: '회복' };

/** 역할-열 일치 여부 (D12) */
export function roleMatchesRow(role: Role, range: Range, row: RowName): boolean {
  if (role === 'tank') return row === 'front';
  if (role === 'healer') return row === 'back';
  if (role === 'support') return row === 'mid';
  return range === 'ranged' ? row === 'back' : row === 'mid' || row === 'front';
}
