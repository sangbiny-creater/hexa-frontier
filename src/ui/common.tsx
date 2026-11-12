import { ELEMENT_LABEL, ROLE_LABEL } from '../core/board';
import { hexCorners } from '../core/hex';
import type { Element, Role } from '../core/types';

export const ELEMENT_COLOR: Record<Element, string> = {
  water: '#4aa3ff',
  fire: '#ff7a45',
  forest: '#5cc46a',
  earth: '#c9a063',
  electric: '#f2cf3c',
};

export const ROLE_GLYPH: Record<Role, string> = { tank: '🛡', dealer: '⚔', support: '✚', healer: '✿' };

export function ElementBadge({ element }: { element: Element }) {
  return (
    <span className="badge" style={{ background: ELEMENT_COLOR[element] + '33', color: ELEMENT_COLOR[element], borderColor: ELEMENT_COLOR[element] + '88' }}>
      {ELEMENT_LABEL[element]}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span className="badge role">
      {ROLE_GLYPH[role]} {ROLE_LABEL[role]}
    </span>
  );
}

/** 스피릿/몬스터 임시 초상: 속성색 육각형 + 이름 첫 글자 (P0 임시 도형, D4) */
export function Portrait({ name, element, size = 44, dim = false }: { name: string; element: Element; size?: number; dim?: boolean }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: 'none', opacity: dim ? 0.45 : 1 }}>
      <polygon points={hexCorners(r, r, r - 1)} fill={ELEMENT_COLOR[element] + '30'} stroke={ELEMENT_COLOR[element]} strokeWidth={2} />
      <text x={r} y={r + size * 0.14} textAnchor="middle" fontSize={size * 0.4} fontWeight={700} fill={ELEMENT_COLOR[element]}>
        {name[0]}
      </text>
    </svg>
  );
}

export function Bar({ value, max, color, height = 6 }: { value: number; max: number; color: string; height?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="bar" style={{ height }}>
      <div style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
