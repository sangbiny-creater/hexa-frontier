// 이미지 경로와 공용 작은 컴포넌트들.
import { ELEMENT_LABEL, ROLE_LABEL } from '../core/board';
import type { Element, Role, UnitDef } from '../core/types';

const BASE = import.meta.env?.BASE_URL ?? '/';

export function asset(name: string): string {
  return `${BASE}assets/${name}.webp`;
}


/** 적 그림 단계 */
export function enemyStage(def: UnitDef, level: number): 1 | 2 | 3 {
  return def.fixedStage ?? (level >= 12 ? 3 : level >= 7 ? 2 : 1);
}

export function portrait(def: UnitDef, stage: number) {
  return asset(`${def.art}-p${stage}`);
}
export function sprite(def: UnitDef, stage: number) {
  return asset(`${def.art}-t${stage}`);
}

/** 진화 단계 이름 (D60: 진화는 레벨이 아니라 중복 소환으로) */
export function stageName(def: UnitDef, stage: number): string {
  return def.stages ? def.stages[stage - 1] : def.name;
}

export const ELEMENT_COLOR: Record<Element, string> = {
  water: '#4aa3ff',
  fire: '#ff7a45',
  forest: '#5cc46a',
  earth: '#c9a063',
  electric: '#7fe0d0',
};

export const ELEMENT_ICON: Record<Element, string> = { water: '💧', fire: '🔥', forest: '🌿', earth: '⛰️', electric: '🌪️' };

export function ElementTag({ element }: { element: Element }) {
  return (
    <span className="tag" style={{ color: ELEMENT_COLOR[element], borderColor: ELEMENT_COLOR[element] + '99' }}>
      {ELEMENT_ICON[element]} {ELEMENT_LABEL[element]}
    </span>
  );
}

const CYCLE: Element[] = ['water', 'fire', 'forest', 'earth', 'electric'];

/** 속성 상성표: 오각형, 화살표 방향으로 강하다 */
/** focus: 그 속성으로 들어오는 화살표(그 속성에 강한 쪽)는 초록, 나가는 화살표는 빨강 */
export function ElementChart({ highlight, focus }: { highlight?: [Element, Element]; focus?: Element }) {
  const R = 92;
  const c = 120;
  const pt = (i: number) => ({ x: c + R * Math.sin((i * 2 * Math.PI) / 5), y: c - R * Math.cos((i * 2 * Math.PI) / 5) });
  return (
    <svg viewBox="0 0 240 240" className="echart">
      <defs>
        <marker id="arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#8a7448" />
        </marker>
        <marker id="arwh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#e0583a" />
        </marker>
        <marker id="arwg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#2f9e44" />
        </marker>
      </defs>
      {CYCLE.map((el, i) => {
        const a = pt(i);
        const b = pt((i + 1) % 5);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const L = Math.hypot(dx, dy);
        const off = 27;
        const next = CYCLE[(i + 1) % 5];
        const hl = (highlight && highlight[0] === el && highlight[1] === next) || focus === el;
        const into = focus === next;
        return (
          <line
            key={el}
            x1={a.x + (dx / L) * off}
            y1={a.y + (dy / L) * off}
            x2={b.x - (dx / L) * off}
            y2={b.y - (dy / L) * off}
            stroke={into ? '#2f9e44' : hl ? '#e0583a' : '#8a7448'}
            strokeWidth={hl || into ? 4 : 2.5}
            markerEnd={into ? 'url(#arwg)' : hl ? 'url(#arwh)' : 'url(#arw)'}
          />
        );
      })}
      {CYCLE.map((el, i) => {
        const p = pt(i);
        const hl = (highlight && highlight.includes(el)) || focus === el;
        return (
          <g key={el}>
            <circle cx={p.x} cy={p.y} r={hl ? 25 : 22} fill="#fff8" stroke={ELEMENT_COLOR[el]} strokeWidth={hl ? 4 : 2.5} />
            <text x={p.x} y={p.y + 2} textAnchor="middle" fontSize="18">
              {ELEMENT_ICON[el]}
            </text>
            <text x={p.x} y={p.y + 17} textAnchor="middle" fontSize="9" fontWeight="800" fill="#2b2416">
              {ELEMENT_LABEL[el]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function RoleTag({ role }: { role: Role }) {
  return <span className="tag">{ROLE_LABEL[role]}</span>;
}

export function Bar({ value, max, color, h = 8 }: { value: number; max: number; color: string; h?: number }) {
  return (
    <div className="bar" style={{ height: h }}>
      <div style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, background: color }} />
    </div>
  );
}

export const GOLD = '🪙';
export const STONE = '💎';
export const POWER = '⚔️';
