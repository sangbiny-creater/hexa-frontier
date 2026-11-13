// 스테이지 화면 (D82~D86): 가로 7칸이 보이게 확대, 카메라가 주인공을 따라간다. 끌면 둘러보기, 헥사를 누르면 그곳으로 이동.
import { useEffect, useRef, useState } from 'react';
import { hexCorners } from '../core/hex';
import { EL_COLOR, EL_NAME, MONSTERS, SPIRITS } from '../rpg/data';
import { monStats, petStats, type Fx, type RpgState } from '../rpg/game';
import { active, COLS, key } from '../rpg/world';

const S = 22; // 헥스 반지름
const HW = Math.sqrt(3) * S;
const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;
export const ROW_H = S * 1.5;

export function cellXY(c: number, r: number) {
  return { x: HW * (c + (r & 1 ? 0.5 : 0)) + HW * 0.6, y: -r * ROW_H };
}

// 스테이지 테마 색 (1~3 숲, 4~6 물, 7~8 바위, 9~10 폭풍)
const THEME = (n: number) => (n <= 3 ? 0 : n <= 6 ? 1 : n <= 8 ? 2 : 3);
const FLOOR = ['#2f5a37', '#2a5560', '#5a4a33', '#3e3a5c'];
const EDGE = ['#4f8a55', '#4a8a96', '#8a7350', '#6a63a0'];

export function WorldView({
  state,
  fx,
  fxKey,
  heroHue,
  pan,
  goal,
  path,
  onPan,
  onTap,
}: {
  state: RpgState;
  fx: Fx[];
  fxKey: number;
  heroHue: number;
  pan: { x: number; y: number };
  goal: { c: number; r: number } | null;
  path: { c: number; r: number }[];
  onPan: (dx: number, dy: number) => void;
  onTap: (c: number, r: number) => void;
}) {
  const w = active();
  const { pos } = state;
  const hero = cellXY(pos.c, pos.r);
  const fullW = HW * (COLS + 1.2);
  const width = HW * 7.3; // 가로 7칸
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const box = useRef<SVGSVGElement>(null);
  const [aspect, setAspect] = useState(1.4);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.clientWidth && setAspect(el.clientHeight / el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const viewH = width * aspect;
  // 카메라: 주인공을 화면 60% 높이에 두고 pan(줄 단위)만큼 위아래로
  const camRow = Math.max(0, Math.min(w.rows - 1, pos.r + pan.y));
  const camX = Math.max(0, Math.min(fullW - width, hero.x + pan.x - width / 2));
  // 지도 끝에서는 빈 곳이 보이지 않게
  const topRaw = -camRow * ROW_H - viewH * 0.6;
  // 맨 위(출구)는 화면 안쪽까지 내려오게 위에 2줄 여유
  const top = Math.min(S * 1.3 - viewH, Math.max(-(w.rows + 1) * ROW_H - S * 2.2, topRaw));
  const visRows = Math.ceil(viewH / ROW_H) + 2;
  const rows: number[] = [];
  for (let r = Math.floor(-(top + viewH) / ROW_H) - 1; r <= Math.ceil(-top / ROW_H) + 2; r++) if (r >= 0 && r < w.rows) rows.push(r);
  void visRows;
  const th = THEME(w.stage.n);

  return (
    <svg
      ref={box}
      className="world"
      viewBox={`${camX} ${top} ${width} ${viewH}`}
      preserveAspectRatio="xMidYMid meet"
      onPointerDown={(e) => {
        try {
          (e.currentTarget as SVGSVGElement).setPointerCapture?.(e.pointerId);
        } catch {
          /* 일부 환경에서 실패해도 무시 */
        }
        drag.current = { x: e.clientX, y: e.clientY, moved: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        if (!d.moved && Math.hypot(dx, dy) < 10) return;
        d.moved = true;
        const k = width / (box.current?.clientWidth || 1); // 화면 px → 지도 단위
        onPan(-dx * k, dy * k);
        d.x = e.clientX;
        d.y = e.clientY;
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        if (!d || d.moved || !box.current) return;
        // 누른 곳의 헥사 찾기
        const pt = box.current.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const m = box.current.getScreenCTM();
        if (!m) return;
        const sp = pt.matrixTransform(m.inverse());
        let best: { c: number; r: number } | null = null;
        let bd = Infinity;
        for (const cell of w.cells.values()) {
          const p = cellXY(cell.c, cell.r);
          const dd = (p.x - sp.x) ** 2 + (p.y - sp.y) ** 2;
          if (dd < bd) (bd = dd), (best = cell);
        }
        if (best && bd < S * S * 1.3) onTap(best.c, best.r);
      }}
      onPointerCancel={() => (drag.current = null)}
    >
      {rows.flatMap((r) =>
        Array.from({ length: COLS }, (_, c) => {
          const cell = w.cells.get(key(c, r))!;
          const p = cellXY(c, r);
          if (!cell.floor)
            return (
              <g key={`r${c},${r}`}>
                <polygon points={hexCorners(p.x, p.y, S - 0.5)} fill="#1a2a20" />
                <image href={img((c + r) % 2 ? 'forest-5' : 'forest-6')} x={p.x - HW * 0.55} y={p.y - S * 1.45} width={HW * 1.1} height={S * 2.3} preserveAspectRatio="xMidYMax meet" />
              </g>
            );
          return <polygon key={`c${c},${r}`} points={hexCorners(p.x, p.y, S - 0.8)} fill={FLOOR[th]} stroke={EDGE[th]} strokeWidth={0.8} />;
        }),
      )}
      {/* 야영지·제단·상자·출구 */}
      {rows.flatMap((r) =>
        Array.from({ length: COLS }, (_, c) => {
          const f = w.cells.get(key(c, r))!.feature;
          if (!f) return null;
          const p = cellXY(c, r);
          const k = key(c, r);
          const opened = state.opened.includes(k);
          if (f.kind === 'camp') {
            const left = (state.campReady[k] ?? 0) - state.turn;
            return (
              <g key={`ft${k}`}>
                <image href={img('tile-camp')} x={p.x - S} y={p.y - S * 1.4} width={S * 2} height={S * 2} opacity={left > 0 ? 0.45 : 1} />
                {left > 0 && (
                  <text x={p.x} y={p.y + S * 0.85} textAnchor="middle" className="camp-cd">
                    ⏳{left}
                  </text>
                )}
              </g>
            );
          }
          if (f.kind === 'exit')
            return (
              <g key={`ft${k}`} className={state.bossDown ? 'exit-open' : ''}>
                <image href={img('tile-portal')} x={p.x - S * 1.1} y={p.y - S * 1.6} width={S * 2.2} height={S * 2.2} opacity={state.bossDown ? 1 : 0.4} />
                <text x={p.x} y={p.y + S * 0.85} textAnchor="middle" className="exit-label">
                  {state.bossDown ? '출구 열림!' : '🔒 출구'}
                </text>
              </g>
            );
          if (f.kind === 'chest' && !opened) return <image key={`ft${k}`} href={img('tile-treasure')} x={p.x - S * 0.8} y={p.y - S * 1.2} width={S * 1.6} height={S * 1.6} />;
          if (f.kind === 'shrine' && !state.spirits[f.element])
            return (
              <g key={`ft${k}`} className="shrine-glow">
                <circle cx={p.x} cy={p.y - 4} r={S * 0.8} fill={EL_COLOR[f.element] + '55'} stroke={EL_COLOR[f.element]} strokeWidth={2} />
                <image href={img(`${SPIRITS[f.element].art}-p1`)} x={p.x - S * 0.65} y={p.y - 4 - S * 0.65} width={S * 1.3} height={S * 1.3} clipPath="circle(48%)" />
              </g>
            );
          return null;
        }),
      )}
      {/* 이동 목표와 길 */}
      {path.map((p, i) => {
        const xy = cellXY(p.c, p.r);
        return <circle key={`pt${i}`} cx={xy.x} cy={xy.y} r={3} className="path-dot" />;
      })}
      {goal && (() => {
        const xy = cellXY(goal.c, goal.r);
        return <polygon points={hexCorners(xy.x, xy.y, S - 2)} className="goal-hex" />;
      })()}
      {/* 몬스터 */}
      {state.monsters
        .filter((m) => !m.dead && rows.includes(m.r))
        .sort((a, b) => b.r - a.r)
        .map((m) => {
          const d = MONSTERS[m.def];
          const p = cellXY(m.c, m.r);
          const big = m.boss;
          const wdt = big ? S * (m.elite ? 2.5 : 3) : S * 1.9;
          const stage = d.stage ?? (m.elite ? 3 : m.level >= 14 ? 3 : m.level >= 6 ? 2 : 1);
          const ratio = m.hp / monStats(m).hp;
          return (
            <g key={`m${m.id}`} className="mon-g" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              {big && <polygon points={hexCorners(0, 0, S - 1)} fill="#ff3b3b22" stroke="#ff5a5a" strokeWidth={1.5} />}
              <image href={img(`${d.art}-t${stage}`)} x={-wdt / 2} y={-wdt * 0.95} width={wdt} height={wdt} preserveAspectRatio="xMidYMax meet" />
              <rect x={-S * 0.7} y={-wdt * 0.98} width={S * 1.4} height={3.5} rx={1.5} fill="#000a" />
              <rect x={-S * 0.7} y={-wdt * 0.98} width={S * 1.4 * ratio} height={3.5} rx={1.5} fill={m.aggro ? '#ff5a5a' : '#f4d03f'} />
              <circle cx={-S * 0.72} cy={-wdt * 0.98 + 2} r={4.5} fill={EL_COLOR[d.element]} />
              <text x={0} y={S * 0.75} textAnchor="middle" className={`mon-lv ${big ? 'boss' : ''}`}>
                {big ? `👑${m.elite ? '대장 ' : ''}` : ''}Lv{m.level}
              </text>
              {m.stun > 0 && <text x={S * 0.6} y={-wdt * 0.7} className="mon-st">💫</text>}
              {(m.poison > 0 || m.burn > 0) && <text x={-S * 0.9} y={-wdt * 0.6} className="mon-st">{m.burn > 0 ? '🔥' : '☠'}</text>}
            </g>
          );
        })}
      {/* 함께 싸우는 스피릿 (칸을 차지한다) */}
      {state.pets
        .filter((p) => !p.dead && rows.includes(p.r))
        .map((p) => {
          const xy = cellXY(p.c, p.r);
          const lv = state.spirits[p.element] ?? 1;
          const st = lv >= 20 ? 3 : lv >= 8 ? 2 : 1;
          const ratio = p.hp / petStats(state, p.element).hp;
          return (
            <g key={`p${p.element}`} className="pet-g" style={{ transform: `translate(${xy.x}px, ${xy.y}px)` }}>
              <polygon points={hexCorners(0, 0, S - 2)} fill="none" stroke={EL_COLOR[p.element]} strokeWidth={2} strokeDasharray="4 3" />
              <image href={img(`${SPIRITS[p.element].art}-t${st}`)} x={-S * 0.85} y={-S * 1.6} width={S * 1.7} height={S * 1.7} preserveAspectRatio="xMidYMax meet" />
              <rect x={-S * 0.6} y={-S * 1.65} width={S * 1.2} height={3} rx={1.5} fill="#000a" />
              <rect x={-S * 0.6} y={-S * 1.65} width={S * 1.2 * ratio} height={3} rx={1.5} fill="#7ab8ff" />
              <text x={0} y={S * 0.8} textAnchor="middle" className="mon-lv">
                {EL_NAME[p.element]}Lv{lv}
              </text>
            </g>
          );
        })}
      {/* 주인공 */}
      <g className="hero-g" style={{ transform: `translate(${hero.x}px, ${hero.y}px)` }}>
        <polygon points={hexCorners(0, 0, S - 2)} fill="none" stroke="#ffd257" strokeWidth={2} />
        <ellipse cx={0} cy={4} rx={S * 0.6} ry={4} fill="#0006" />
        <image href={img('hero-t')} x={-S * 0.8} y={-S * 1.9} width={S * 1.6} height={S * 2.2} preserveAspectRatio="xMidYMax meet" style={{ filter: `hue-rotate(${heroHue}deg) saturate(1.2)` }} />
      </g>
      {/* 효과 */}
      <g key={fxKey}>
        {fx.flatMap((f, i) => {
          if (f.k === 'skill')
            return f.cells.map((c, j) => {
              const p = cellXY(c.c, c.r);
              return <polygon key={`s${i}-${j}`} points={hexCorners(p.x, p.y, S - 1)} className="skill-hex" style={f.element ? { fill: EL_COLOR[f.element] + '66', stroke: EL_COLOR[f.element] } : undefined} />;
            });
          if (f.k === 'dmg' || f.k === 'heal') {
            const p = cellXY(f.c, f.r);
            const txt = f.k === 'dmg' ? `-${f.amount}` : `+${f.amount}`;
            const cls = f.k === 'heal' ? 'heal' : f.onHero || f.onPet ? 'hurt' : f.eff === 'strong' ? 'strong' : f.eff === 'weak' || f.blocked ? 'weak' : '';
            return [
              <text key={`d${i}`} x={p.x + ((i % 3) - 1) * 6} y={p.y - S * 1.3} textAnchor="middle" className={`fx-num ${cls}`}>
                {f.k === 'dmg' && !f.onHero && !f.onPet && f.eff === 'strong' ? '유리! ' : ''}
                {f.k === 'dmg' && f.blocked ? '막힘 ' : ''}
                {txt}
                {f.k === 'dmg' && f.crit ? '!' : ''}
              </text>,
            ];
          }
          if (f.k === 'hit') {
            const a = cellXY(f.from.c, f.from.r);
            const b = cellXY(f.to.c, f.to.r);
            const col = f.who === 'mon' ? '#ff5a5a' : f.who === 'pet' ? (f.element ? EL_COLOR[f.element] : '#7ab8ff') : '#ffd257';
            return [<line key={`h${i}`} x1={a.x} y1={a.y - S * 0.7} x2={b.x} y2={b.y - S * 0.7} stroke={col} className={`hit-line ${f.who}`} />];
          }
          if (f.k === 'kill') {
            const p = cellXY(f.c, f.r);
            return [<circle key={`k${i}`} cx={p.x} cy={p.y - S * 0.5} r={S} className="fx-kill" />];
          }
          return [];
        })}
      </g>
    </svg>
  );
}
