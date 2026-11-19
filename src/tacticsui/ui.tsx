// '탐험의 숲' UI 공통 조각 (D136): 머리줄, 아래 탭, 리본 제목, 속성 배지, 별, 스피릿 카드.
import type { ReactNode } from 'react';
import { EL_ICON, EL_NAME, ROLES, unitArt, type Element } from '../tactics/data';
import { defOf, type Campaign } from '../tactics/engine';

const BASE = (import.meta.env?.BASE_URL ?? '/') + 'ui/';
const ABASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
/** public/ui/<이름>.webp */
export const ui = (n: string) => `${BASE}${n}.webp`;
export const art = (n: string) => `${ABASE}${n}.webp`;
/** 얼굴 그림: 주인공은 새 카드 그림, 스피릿은 초상 */
export const face = (id: string, lv = 1) => {
  const d = defOf(id);
  return d.hero ? ui(`hero-${id}`) : art(unitArt(d.art, 'p', lv));
};
// CSS 배경 그림 (상대 경로 빌드에서도 맞게)
if (typeof document !== 'undefined') document.documentElement.style.setProperty('--fx-bg', `url(${new URL(ui('bg-forest'), document.baseURI).href})`);

export type Tab = 'expedition' | 'party' | 'spirit' | 'dex' | 'shop';
export const TABS: { id: Tab; name: string }[] = [
  { id: 'expedition', name: '원정' },
  { id: 'party', name: '부대' },
  { id: 'spirit', name: '스피릿' },
  { id: 'dex', name: '도감' },
  { id: 'shop', name: '상점' },
];

/** 판 번호 → "3-7" */
export const stageCode = (n: number) => `${Math.floor((n - 1) / 10) + 1}-${((n - 1) % 10) + 1}`;
/** 역할 묶음 (도감·필터): 탱커 / 근딜 / 원딜 / 힐러 / 서포터 */
export const ROLE_GROUPS: { id: string; name: string; icon: string; roles: string[] }[] = [
  { id: 'tank', name: '탱커', icon: '🛡️', roles: ['tank'] },
  { id: 'melee', name: '근딜', icon: '⚔️', roles: ['pmelee', 'mmelee'] },
  { id: 'ranged', name: '원딜', icon: '🏹', roles: ['pranged', 'mranged'] },
  { id: 'healer', name: '힐러', icon: '💚', roles: ['healer'] },
  { id: 'support', name: '서포터', icon: '📯', roles: ['support'] },
];
/** a를 이기는 속성 (물 → 불 → 숲 → 대지 → 바람 → 물) */
export const COUNTER: Record<Element, Element> = { fire: 'water', forest: 'fire', earth: 'forest', wind: 'earth', water: 'wind' };

export function TopBar({ cp }: { cp: Campaign }) {
  return (
    <header className="fx-top">
      <div className="fx-me">
        <img src={ui(`face-${cp.hero}`)} alt="" />
        <b>헥사 프론티어</b>
      </div>
      <div className="fx-money">
        <span className="fx-pill" title="성장의 결정">
          <img src={ui('gem')} alt="" />
          {(cp.bag.crystal ?? 0).toLocaleString()}
        </span>
        <span className="fx-pill" title="골드">
          <img src={ui('coin')} alt="" />
          {cp.gold.toLocaleString()}
        </span>
      </div>
    </header>
  );
}

export function TabBar({ tab, onTab, badge }: { tab: Tab | null; onTab: (t: Tab) => void; badge?: Partial<Record<Tab, number>> }) {
  return (
    <nav className="fx-tabs">
      {TABS.map((t) => (
        <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => onTab(t.id)}>
          <img src={ui(`tab-${t.id}${tab === t.id ? '-on' : ''}`)} alt="" />
          <span>{t.name}</span>
          {!!badge?.[t.id] && <i className="fx-badge">{badge[t.id]}</i>}
        </button>
      ))}
    </nav>
  );
}

/** 잎 장식이 달린 녹색 리본 제목 */
export function Ribbon({ children, small }: { children: ReactNode; small?: boolean }) {
  return (
    <div className={`fx-ribbon ${small ? 'small' : ''}`}>
      <span>{children}</span>
    </div>
  );
}
/** 작은 녹색 소제목 (출현 적, 승리 조건 …) */
export function Label({ children }: { children: ReactNode }) {
  return <span className="fx-label">{children}</span>;
}

export function ElBadge({ el, size = 22 }: { el: Element | null; size?: number }) {
  if (!el) return null;
  return (
    <i className={`fx-el el-${el}`} style={{ width: size, height: size, fontSize: size * 0.6 }} title={EL_NAME[el]}>
      {EL_ICON[el]}
    </i>
  );
}

export function Stars({ n, max = 3, size = 16 }: { n: number; max?: number; size?: number }) {
  return (
    <span className="fx-stars">
      {Array.from({ length: max }, (_, i) => (
        <img key={i} src={ui(i < n ? 'star' : 'star-off')} alt="" style={{ width: size, height: size }} />
      ))}
    </span>
  );
}
/** 진화 단계 별: 1~9 → 2개, 10~24 → 3개, 25~ → 4개 */
export const tierStars = (lv: number) => (lv >= 25 ? 4 : lv >= 10 ? 3 : 2);

/** 스피릿 네모 카드 (부대·스피릿 목록) */
export function SpiritCard({ id, cp, on, tag, check, stars, onClick }: { id: string; cp: Campaign; on?: boolean; tag?: ReactNode; check?: boolean; stars?: boolean; onClick?: () => void }) {
  const d = defOf(id);
  const lv = cp.roster[id]?.lv ?? 1;
  return (
    <button className={`fx-card el-bg-${d.element ?? 'none'} ${on ? 'on' : ''}`} onClick={onClick}>
      <img className="fx-card-art" src={face(id, lv)} alt="" />
      {tag}
      {check && <i className="fx-check">✓</i>}
      <span className="fx-card-foot">
        <ElBadge el={d.element} size={18} />
        <b>Lv.{lv}</b>
        <i className="fx-role" title={ROLES[d.role].name}>
          {ROLES[d.role].icon}
        </i>
      </span>
      {stars && (
        <span className="fx-card-stars">
          <Stars n={tierStars(lv)} max={4} size={12} />
        </span>
      )}
      <span className="fx-card-name">{d.name}</span>
    </button>
  );
}

export function Modal({ onClose, children, className = '' }: { onClose?: () => void; children: ReactNode; className?: string }) {
  return (
    <div className="fx-modal" onClick={onClose}>
      <div className={`fx-sheet ${className}`} onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className="fx-x" onClick={onClose}>
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
