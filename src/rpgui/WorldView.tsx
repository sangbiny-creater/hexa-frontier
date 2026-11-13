// 스테이지 화면 (D82~D91): 카메라가 주인공을 부드럽게 따라간다. 헥사를 누르면 그곳으로, 주인공을 잡고(또는 꾹 눌러) 끌면 손가락을 따라 걷는다. 빈 곳을 끌면 둘러보기. 가로 화면이면 지도를 눕혀 왼쪽→오른쪽으로 나아간다.
import { useEffect, useRef, useState } from 'react';
import { hexCorners } from '../core/hex';
import { EL_COLOR, EL_NAME, MONSTERS, SPIRITS } from '../rpg/data';
import { monStats, petStats, type Fx, type RpgState } from '../rpg/game';
import { active, COLS, dist as dist2, key } from '../rpg/world';

const S = 22; // 헥스 반지름
const HW = Math.sqrt(3) * S;
const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;
export const ROW_H = S * 1.5;

/** 칸 → 화면 좌표. land(가로 화면)면 지도를 시계 방향으로 90° 돌려 왼쪽→오른쪽으로 나아간다 */
export function cellXY(c: number, r: number, land = false) {
  if (land) return { x: r * ROW_H + S * 1.6, y: HW * (c + (r & 1 ? 0.5 : 0)) + HW * 0.6 };
  return { x: HW * (c + (r & 1 ? 0.5 : 0)) + HW * 0.6, y: -r * ROW_H };
}
/** 가로 화면에서는 육각형도 눕힌다(평평한 윗변) */
function flatCorners(cx: number, cy: number, size: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i);
    pts.push(`${(cx + size * Math.cos(a)).toFixed(1)},${(cy + size * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
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
  land = false,
  onPan,
  onTap,
  onSteer,
}: {
  state: RpgState;
  fx: Fx[];
  fxKey: number;
  heroHue: number;
  pan: { x: number; y: number };
  goal: { c: number; r: number } | null;
  path: { c: number; r: number }[];
  onPan: (dx: number, dy: number) => void;
  land?: boolean;
  onTap: (c: number, r: number) => void;
  /** 주인공을 잡고(또는 지도를 꾹 누르고) 끌 때 손가락이 있는 칸. 손을 떼면 null */
  onSteer: (cell: { c: number; r: number } | null) => void;
}) {
  const w = active();
  const { pos } = state;
  const xy = (c: number, r: number) => cellXY(c, r, land);
  const hc = land ? flatCorners : hexCorners;
  const hero = xy(pos.c, pos.r);
  const drag = useRef<{ x: number; y: number; moved: boolean; mode: 'tap' | 'pan' | 'steer'; last: string; timer: number; hero: boolean; fx: number; fy: number } | null>(null);
  const box = useRef<SVGSVGElement>(null);
  const [aspect, setAspect] = useState(1.4);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.clientWidth && setAspect(el.clientHeight / el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // 카메라 목표
  let width: number, viewH: number, tX: number, tY: number;
  if (land) {
    // 가로 화면: 세로로 약 6.5칸이 보이게 확대(손가락으로 누르기 좋게), 앞쪽(오른쪽)이 넓게 보이게 주인공을 40% 지점에
    viewH = HW * 6.6;
    width = viewH / aspect;
    const fullH = HW * (COLS + 1.2);
    // 모서리 버튼(메뉴·정보·기술·이동)에 주인공이 가리지 않게 지도 끝에서도 여유를 둔다
    tY = Math.max(-S * 1.8 - viewH * 0.18, Math.min(fullH - viewH * 0.82, hero.y - viewH * 0.5 - pan.y * ROW_H));
    tX = Math.max(-width * 0.3, Math.min(w.rows * ROW_H + S * 2.2 - width * 0.65, hero.x + pan.x - width * 0.4));
  } else {
    const fullW = HW * (COLS + 1.2);
    width = HW * 7.3; // 가로 7칸
    viewH = width * aspect;
    // 주인공을 화면 60% 높이에 두고 pan(줄 단위)만큼 위아래로
    const camRow = Math.max(0, Math.min(w.rows - 1, pos.r + pan.y));
    tX = Math.max(0, Math.min(fullW - width, hero.x + pan.x - width / 2));
    const topRaw = -camRow * ROW_H - viewH * 0.6;
    // 맨 위(출구)는 화면 안쪽까지 내려오게 위에 여유
    tY = Math.min(S * 1.3 - viewH, Math.max(-(w.rows + 1) * ROW_H - S * 2.2, topRaw));
  }
  // 카메라가 한 칸씩 툭툭 튀지 않게 부드럽게 따라간다
  const cam = useRef({ x: tX, y: tY });
  const [, redraw] = useState(0);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      const c = cam.current;
      const dx = tX - c.x;
      const dy = tY - c.y;
      if ((Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) || Math.abs(dx) > width * 1.5 || Math.abs(dy) > viewH * 1.5) {
        cam.current = { x: tX, y: tY };
        redraw((n) => n + 1);
        return;
      }
      cam.current = { x: c.x + dx * 0.2, y: c.y + dy * 0.2 };
      redraw((n) => n + 1);
      raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [tX, tY, width, viewH]);
  const camX = cam.current.x;
  const top = cam.current.y;
  const rows: number[] = [];
  if (land) {
    for (let r = Math.floor(Math.min(camX, tX) / ROW_H) - 2; r <= Math.ceil((Math.max(camX, tX) + width) / ROW_H) + 1; r++) if (r >= 0 && r < w.rows) rows.push(r);
  } else {
    const lo = Math.min(top, tY);
    const hi = Math.max(top, tY);
    for (let r = Math.floor(-(hi + viewH) / ROW_H) - 1; r <= Math.ceil(-lo / ROW_H) + 2; r++) if (r >= 0 && r < w.rows) rows.push(r);
  }

  // 손가락을 누르고 있는 동안 화면이 따라 움직이면 손가락 밑 칸도 바뀐다 → 계속 그쪽으로 걷는다(지도 위 조이스틱)
  useEffect(() => {
    const d = drag.current;
    if (!d || d.mode !== 'steer') return;
    const cell = cellAtPoint(d.fx, d.fy);
    if (!cell) return;
    const k = key(cell.c, cell.r);
    if (k === d.last) return;
    d.last = k;
    onSteer(cell);
  });

  /** 화면 좌표 → 지도 좌표 */
  const toMap = (clientX: number, clientY: number) => {
    if (!box.current) return null;
    const pt = box.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const m = box.current.getScreenCTM();
    if (!m) return null;
    return pt.matrixTransform(m.inverse());
  };
  /** 주인공 그림(머리~발) 위를 눌렀나 — 손가락이 커도 잡히게 넉넉히 */
  const onHeroAt = (clientX: number, clientY: number) => {
    const sp = toMap(clientX, clientY);
    return !!sp && Math.abs(sp.x - hero.x) < S * 1.1 && sp.y > hero.y - S * 2.1 && sp.y < hero.y + S * 1.0;
  };
  /** 화면 좌표 → 가장 가까운 칸 */
  const cellAtPoint = (clientX: number, clientY: number) => {
    const sp = toMap(clientX, clientY);
    if (!sp) return null;
    let best: { c: number; r: number } | null = null;
    let bd = Infinity;
    for (const r of rows)
      for (let c = 0; c < COLS; c++) {
        const p = xy(c, r);
        const dd = (p.x - sp.x) ** 2 + (p.y - sp.y) ** 2;
        if (dd < bd) (bd = dd), (best = { c, r });
      }
    return best && bd < S * S * 1.3 ? best : null;
  };
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
        const cell = cellAtPoint(e.clientX, e.clientY);
        const onHero = onHeroAt(e.clientX, e.clientY) || (!!cell && dist2(cell, pos) === 0);
        const d = { x: e.clientX, y: e.clientY, moved: false, mode: (onHero ? 'steer' : 'tap') as 'tap' | 'pan' | 'steer', last: cell ? key(cell.c, cell.r) : '', timer: 0, hero: onHero, fx: e.clientX, fy: e.clientY };
        // 주인공이 아닌 곳은 꾹 누르고 있으면(0.3초) 끌어서 걷기로 바뀐다
        if (!onHero)
          d.timer = window.setTimeout(() => {
            if (drag.current === d && d.mode === 'tap') {
              d.mode = 'steer';
              if (cell) onSteer(cell);
            }
          }, 300);
        drag.current = d;
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        d.fx = e.clientX;
        d.fy = e.clientY;
        if (d.mode === 'steer') {
          const cell = cellAtPoint(e.clientX, e.clientY);
          if (!cell) return;
          const k = key(cell.c, cell.r);
          if (k === d.last) return;
          d.last = k;
          d.moved = true;
          onSteer(cell);
          return;
        }
        if (d.mode === 'tap' && Math.hypot(dx, dy) < 10) return;
        clearTimeout(d.timer);
        d.mode = 'pan';
        d.moved = true;
        const k = width / (box.current?.clientWidth || 1); // 화면 px → 지도 단위
        onPan(-dx * k, dy * k);
        d.x = e.clientX;
        d.y = e.clientY;
      }}
      onPointerUp={(e) => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        clearTimeout(d.timer);
        if (d.mode === 'steer') {
          // 주인공을 눌렀다 그냥 떼면 '멈춤', 끌었다 떼면 그 칸까지 마저 걷는다
          if (d.hero && !d.moved) onTap(pos.c, pos.r);
          onSteer(null);
          return;
        }
        if (d.mode === 'pan') return;
        const cell = cellAtPoint(e.clientX, e.clientY);
        if (cell) onTap(cell.c, cell.r);
      }}
      onPointerCancel={() => {
        if (drag.current) clearTimeout(drag.current.timer);
        if (drag.current?.mode === 'steer') onSteer(null);
        drag.current = null;
      }}
    >
      {rows.flatMap((r) =>
        Array.from({ length: COLS }, (_, c) => {
          const cell = w.cells.get(key(c, r))!;
          const p = xy(c, r);
          if (!cell.floor)
            return (
              <g key={`r${c},${r}`}>
                <polygon points={hc(p.x, p.y, S - 0.5)} fill="#1a2a20" />
                <image href={img((c + r) % 2 ? 'forest-5' : 'forest-6')} x={p.x - HW * 0.55} y={p.y - S * 1.45} width={HW * 1.1} height={S * 2.3} preserveAspectRatio="xMidYMax meet" />
              </g>
            );
          return <polygon key={`c${c},${r}`} points={hc(p.x, p.y, S - 0.8)} fill={FLOOR[th]} stroke={EDGE[th]} strokeWidth={0.8} />;
        }),
      )}
      {/* 야영지·제단·상자·출구 */}
      {rows.flatMap((r) =>
        Array.from({ length: COLS }, (_, c) => {
          const f = w.cells.get(key(c, r))!.feature;
          if (!f) return null;
          const p = xy(c, r);
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
        const q = xy(p.c, p.r);
        return <circle key={`pt${i}`} cx={q.x} cy={q.y} r={3} className="path-dot" />;
      })}
      {goal && (() => {
        const q = xy(goal.c, goal.r);
        return <polygon points={hc(q.x, q.y, S - 2)} className="goal-hex" />;
      })()}
      {/* 몬스터 */}
      {state.monsters
        .filter((m) => !m.dead && rows.includes(m.r))
        .sort((a, b) => xy(a.c, a.r).y - xy(b.c, b.r).y)
        .map((m) => {
          const d = MONSTERS[m.def];
          const p = xy(m.c, m.r);
          const big = m.boss;
          const wdt = big ? S * (m.elite ? 2.5 : 3) : S * 1.9;
          const stage = d.stage ?? (m.elite ? 3 : m.level >= 14 ? 3 : m.level >= 6 ? 2 : 1);
          const ratio = m.hp / monStats(m).hp;
          return (
            <g key={`m${m.id}`} className="mon-g" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              {big && <polygon points={hc(0, 0, S - 1)} fill="#ff3b3b22" stroke="#ff5a5a" strokeWidth={1.5} />}
              <image href={img(`${d.art}-t${stage}`)} x={-wdt / 2} y={-wdt * 0.95} width={wdt} height={wdt} preserveAspectRatio="xMidYMax meet" />
              <rect x={-S * 0.7} y={-wdt * 0.98} width={S * 1.4} height={3.5} rx={1.5} fill="#000a" />
              <rect x={-S * 0.7} y={-wdt * 0.98} width={S * 1.4 * ratio} height={3.5} rx={1.5} fill={m.aggro ? '#ff5a5a' : '#f4d03f'} />
              <circle cx={-S * 0.72} cy={-wdt * 0.98 + 2} r={4.5} fill={EL_COLOR[d.element]} />
              <text x={0} y={S * 0.75} textAnchor="middle" className={`mon-lv ${big ? 'boss' : ''}`}>
                {big ? `👑${m.elite ? '대장 ' : ''}` : ''}레벨 {m.level}
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
          const q = xy(p.c, p.r);
          const lv = state.spirits[p.element] ?? 1;
          const st = lv >= 20 ? 3 : lv >= 8 ? 2 : 1;
          const ratio = p.hp / petStats(state, p.element).hp;
          return (
            <g key={`p${p.element}`} className="pet-g" style={{ transform: `translate(${q.x}px, ${q.y}px)` }}>
              <polygon points={hc(0, 0, S - 2)} fill="none" stroke={EL_COLOR[p.element]} strokeWidth={2} strokeDasharray="4 3" />
              <image href={img(`${SPIRITS[p.element].art}-t${st}`)} x={-S * 0.85} y={-S * 1.6} width={S * 1.7} height={S * 1.7} preserveAspectRatio="xMidYMax meet" />
              <rect x={-S * 0.6} y={-S * 1.65} width={S * 1.2} height={3} rx={1.5} fill="#000a" />
              <rect x={-S * 0.6} y={-S * 1.65} width={S * 1.2 * ratio} height={3} rx={1.5} fill="#7ab8ff" />
              <text x={0} y={S * 0.8} textAnchor="middle" className="mon-lv">
                {EL_NAME[p.element]} {lv}레벨
              </text>
            </g>
          );
        })}
      {/* 주인공 */}
      <g className="hero-g" style={{ transform: `translate(${hero.x}px, ${hero.y}px)` }}>
        <polygon points={hc(0, 0, S - 2)} fill="none" stroke="#ffd257" strokeWidth={2} />
        <ellipse cx={0} cy={4} rx={S * 0.6} ry={4} fill="#0006" />
        <image href={img('hero-t')} x={-S * 0.8} y={-S * 1.9} width={S * 1.6} height={S * 2.2} preserveAspectRatio="xMidYMax meet" style={{ filter: `hue-rotate(${heroHue}deg) saturate(1.2)` }} />
      </g>
      {/* 효과 */}
      <g key={fxKey}>
        {fx.flatMap((f, i) => {
          if (f.k === 'skill')
            return f.cells.map((c, j) => {
              const p = xy(c.c, c.r);
              return <polygon key={`s${i}-${j}`} points={hc(p.x, p.y, S - 1)} className="skill-hex" style={f.element ? { fill: EL_COLOR[f.element] + '66', stroke: EL_COLOR[f.element] } : undefined} />;
            });
          if (f.k === 'dmg' || f.k === 'heal') {
            const p = xy(f.c, f.r);
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
            const a = xy(f.from.c, f.from.r);
            const b = xy(f.to.c, f.to.r);
            const col = f.who === 'mon' ? '#ff5a5a' : f.who === 'pet' ? (f.element ? EL_COLOR[f.element] : '#7ab8ff') : '#ffd257';
            return [<line key={`h${i}`} x1={a.x} y1={a.y - S * 0.7} x2={b.x} y2={b.y - S * 0.7} stroke={col} className={`hit-line ${f.who}`} />];
          }
          if (f.k === 'kill') {
            const p = xy(f.c, f.r);
            return [<circle key={`k${i}`} cx={p.x} cy={p.y - S * 0.5} r={S} className="fx-kill" />];
          }
          return [];
        })}
      </g>
    </svg>
  );
}
