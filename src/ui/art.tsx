// 이미지 경로와 공용 작은 컴포넌트들.
import { ELEMENT_LABEL, ROLE_LABEL } from '../core/board';
import type { Element, Role, UnitDef } from '../core/types';

const BASE = import.meta.env.BASE_URL;

export function asset(name: string): string {
  return `${BASE}assets/${name}.webp`;
}

/** 레벨에 따른 진화 단계 (스피릿): Lv1~9 / Lv10~24 / Lv25~ */
export function spiritStage(level: number): 1 | 2 | 3 {
  return level >= 25 ? 3 : level >= 10 ? 2 : 1;
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

export function stageName(def: UnitDef, level: number): string {
  return def.stages ? def.stages[spiritStage(level) - 1] : def.name;
}

export const ELEMENT_COLOR: Record<Element, string> = {
  water: '#4aa3ff',
  fire: '#ff7a45',
  forest: '#5cc46a',
  earth: '#c9a063',
  electric: '#7fe0d0',
};

export function ElementTag({ element }: { element: Element }) {
  return (
    <span className="tag" style={{ color: ELEMENT_COLOR[element], borderColor: ELEMENT_COLOR[element] + '99' }}>
      {ELEMENT_LABEL[element]}
    </span>
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
