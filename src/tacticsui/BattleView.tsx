// 전술 전투 지도 (D109): 9×12 헥사, 지형, 유닛, 이동·공격 범위 표시, 피해 숫자.
import { hexCorners } from '../core/hex';
import { EL_COLOR, TERRAIN, unitArt } from '../tactics/data';
import { defOf, unitStats, type Battle, type Ev } from '../tactics/engine';
import { sizeOf, STAGES, terrainAt, VIEW_COLS, type StageDef } from '../tactics/stages';

const S = 22; // 헥스 반지름
const HW = Math.sqrt(3) * S;
const TOP = S * 1.6; // 맨 윗줄 유닛 그림이 잘리지 않게
const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;

export function cellXY(c: number, r: number) {
  return { x: HW * (c + (r & 1 ? 0.5 : 0)) + HW * 0.55, y: S * 1.5 * r + S + TOP };
}
/** 이 판 지도의 SVG 크기 (지도 단위) */
export function viewSize(st: StageDef) {
  const { cols, rows } = sizeOf(st);
  return { w: HW * (cols + 0.6), h: S * 1.5 * (rows - 1) + S * 2 + TOP + 4, cols, rows };
}
/** 화면 너비 대비 지도 너비 (가로 6칸이 화면 너비) */
export const widthRatio = (st: StageDef) => (sizeOf(st).cols + 0.6) / (VIEW_COLS + 0.6);

// D136 '탐험의 숲': 밝은 잔디 헥사 + 아래 흙 옆면
const FILL: Record<string, string> = { plain: '#8cc84b', forest: '#6fb23f', hill: '#d2b16e', water: '#5cc0ee', rock: '#8a8a7e', camp: '#a6c95a' };
const EDGE: Record<string, string> = { plain: '#b7e36e', forest: '#98d25c', hill: '#ead08f', water: '#a8e4ff', rock: '#b0b0a4', camp: '#cfe58a' };

export interface Marks {
  move: Set<string>;
  target: Set<string>; // 공격·기술 대상
  area: Set<string>; // 기술 범위 미리보기
  threat: Set<string>; // 적 위협 범위
  path: { c: number; r: number }[];
}

export function BattleView({ b, marks, selected, fx, fxKey, onTap }: { b: Battle; marks: Marks; selected: number | null; fx: Ev[]; fxKey: number; onTap: (c: number, r: number) => void }) {
  const st = STAGES[b.stage - 1];
  const vs = viewSize(st);
  const cells: { c: number; r: number }[] = [];
  for (let r = 0; r < vs.rows; r++) for (let c = 0; c < vs.cols; c++) cells.push({ c, r });
  const k = (c: number, r: number) => `${c},${r}`;
  return (
    <svg className="tworld" viewBox={`0 0 ${vs.w} ${vs.h}`} preserveAspectRatio="xMidYMid meet" style={{ width: `${widthRatio(st) * 100}%` }}>
      {/* 지형 */}
      {cells.map(({ c, r }) => {
        const t = terrainAt(st, c, r) ?? 'plain';
        const p = cellXY(c, r);
        return (
          <g key={`t${c},${r}`} onClick={() => onTap(c, r)}>
            <polygon points={hexCorners(p.x, p.y + 4, S - 0.4)} fill={t === 'water' ? '#2f86b8' : '#7a5a34'} />
            <polygon points={hexCorners(p.x, p.y, S - 0.6)} fill={FILL[t]} stroke={EDGE[t]} strokeWidth={1.4} />
            <polygon points={hexCorners(p.x, p.y, S - 0.6)} fill="none" stroke="#2f5a1c55" strokeWidth={0.6} />
            {t === 'forest' && (
              <g className="t-trees" pointerEvents="none">
                <rect x={p.x - 4.6} y={p.y + 1} width={1.6} height={5} fill="#7a4a24" />
                <circle cx={p.x - 3.8} cy={p.y - 3} r={6} fill="#3f8f2c" />
                <circle cx={p.x - 5} cy={p.y - 5} r={3} fill="#6cc04a" />
                <rect x={p.x + 5.4} y={p.y + 3} width={1.6} height={5} fill="#7a4a24" />
                <circle cx={p.x + 6.2} cy={p.y - 1} r={5.4} fill="#357f26" />
                <circle cx={p.x + 5} cy={p.y - 3} r={2.6} fill="#64b844" />
              </g>
            )}
            {t === 'hill' && <path d={`M${p.x - 12},${p.y + 6} Q${p.x},${p.y - 10} ${p.x + 12},${p.y + 6} Z`} fill="#b8955a" stroke="#8a6a3a" strokeWidth={1} pointerEvents="none" />}
            {t === 'water' && <path d={`M${p.x - 11},${p.y - 2} q4,-4 8,0 t8,0 M${p.x - 7},${p.y + 5} q4,-4 8,0 t8,0`} stroke="#ffffffaa" strokeWidth={1.4} fill="none" pointerEvents="none" />}
            {t === 'plain' && (c * 7 + r * 3) % 5 === 0 && (
              <g pointerEvents="none">
                <circle cx={p.x - 6} cy={p.y + 5} r={1.5} fill="#fff" />
                <circle cx={p.x - 6} cy={p.y + 5} r={0.6} fill="#ffd24a" />
                <circle cx={p.x + 7} cy={p.y - 4} r={1.3} fill="#ffc0d8" />
              </g>
            )}
            {t === 'rock' && <image href={img('forest-5')} x={p.x - HW * 0.55} y={p.y - S * 1.4} width={HW * 1.1} height={S * 2.2} preserveAspectRatio="xMidYMax meet" pointerEvents="none" />}
            {t === 'camp' && <image href={img('tile-camp')} x={p.x - S * 0.9} y={p.y - S * 1.2} width={S * 1.8} height={S * 1.8} pointerEvents="none" />}
          </g>
        );
      })}
      {/* 범위 표시 */}
      {cells.map(({ c, r }) => {
        const p = cellXY(c, r);
        const id = k(c, r);
        const cls = marks.target.has(id) ? 'm-target' : marks.area.has(id) ? 'm-area' : marks.move.has(id) ? 'm-move' : marks.threat.has(id) ? 'm-threat' : '';
        if (!cls) return null;
        return <polygon key={`m${id}`} points={hexCorners(p.x, p.y, S - 2)} className={cls} pointerEvents="none" />;
      })}
      {selected !== null && b.units[selected] && !b.units[selected].dead && (() => {
        const u = b.units[selected];
        const p = cellXY(u.c, u.r);
        return <polygon points={hexCorners(p.x, p.y, S - 1.5)} className={`m-sel ${u.side}`} pointerEvents="none" />;
      })()}
      {marks.path.slice(1).map((p, i) => {
        const xy = cellXY(p.c, p.r);
        return <circle key={`pa${i}`} cx={xy.x} cy={xy.y} r={3} className="m-path" pointerEvents="none" />;
      })}
      {/* 유닛 (아래 줄이 앞에 그려지게) */}
      {b.units
        .filter((u) => !u.dead)
        .sort((a, c) => a.r - c.r)
        .map((u) => {
          const d = defOf(u.def);
          const p = cellXY(u.c, u.r);
          const s = unitStats(u);
          const big = u.boss ? 1.35 : 1;
          const w = S * 1.9 * big;
          const done = u.acted && u.side === b.phase && b.phase === 'ally';
          return (
            <g key={`u${u.uid}`} className={`tu ${u.side} ${done ? 'done' : ''} ${selected === u.uid ? 'sel' : ''}`} style={{ transform: `translate(${p.x}px, ${p.y}px)` }} onClick={() => onTap(u.c, u.r)}>
              <ellipse cx={0} cy={S * 0.38} rx={S * 0.62} ry={S * 0.24} className="tu-base" />
              <image href={img(unitArt(d.art, 't', u.lv))} x={-w / 2} y={-w * 0.9 + S * 0.35} width={w} height={w} preserveAspectRatio="xMidYMax meet" />
              <rect x={-S * 0.72} y={-w * 0.9 + S * 0.2} width={S * 1.44} height={4} rx={2} fill="#000b" />
              <rect x={-S * 0.72} y={-w * 0.9 + S * 0.2} width={S * 1.44 * Math.max(0, u.hp / s.hp)} height={4} rx={2} className={u.side === 'ally' ? 'hp-ally' : 'hp-enemy'} />
              {d.element && <circle cx={-S * 0.78} cy={-w * 0.9 + S * 0.22 + 2} r={4} fill={EL_COLOR[d.element]} stroke="#000" strokeWidth={0.6} />}
              <text x={0} y={S * 0.86} textAnchor="middle" className="tu-lv">
                {u.boss ? '👑' : ''}
                {u.lv}
              </text>
              {u.st.stun ? <text x={S * 0.55} y={-w * 0.55} className="tu-st">💫</text> : null}
              {u.st.atkUp ? <text x={-S * 0.95} y={-w * 0.45} className="tu-st">📯</text> : null}
              {u.st.defDown ? <text x={S * 0.55} y={-w * 0.3} className="tu-st">🌫️</text> : null}
              {u.st.taunt ? <text x={S * 0.55} y={-w * 0.5} className="tu-st">📢</text> : null}
            </g>
          );
        })}
      {/* 피해·회복 숫자 */}
      <g key={fxKey} pointerEvents="none">
        {(() => {
          const stack = new Map<number, number>();
          return fx.flatMap((e, i) => {
            const uid = e.k === 'hit' ? e.to : e.k === 'heal' || e.k === 'lvup' || e.k === 'buff' ? e.uid : -1;
            if (uid < 0) return [];
            const u = b.units[uid];
            const p = cellXY(u.c, u.r);
            const n = stack.get(uid) ?? 0;
            stack.set(uid, n + 1);
            const y = p.y - S * 1.9 - n * 11;
            if (e.k === 'hit')
              return [
                <text key={i} x={p.x} y={y} textAnchor="middle" className={`t-num ${u.side === 'ally' ? 'hurt' : ''} ${e.mul > 1 ? 'strong' : e.mul < 1 ? 'weak' : ''}`} style={{ animationDelay: `${n * 0.12}s` }}>
                  {e.mul > 1 ? '유리! ' : ''}-{e.amount}
                  {e.crit ? '!' : ''}
                </text>,
              ];
            if (e.k === 'heal')
              return [
                <text key={i} x={p.x} y={y} textAnchor="middle" className={`t-num ${e.sp ? 'sp' : 'heal'}`}>
                  {e.sp ? 'SP ' : ''}+{e.amount}
                </text>,
              ];
            if (e.k === 'lvup')
              return [
                <text key={i} x={p.x} y={y} textAnchor="middle" className="t-num lv">
                  레벨 업! {e.lv}
                </text>,
              ];
            if (e.k === 'buff')
              return [
                <text key={i} x={p.x} y={y} textAnchor="middle" className="t-num buff">
                  {e.text}
                </text>,
              ];
            return [];
          });
        })()}
      </g>
    </svg>
  );
}
export { TERRAIN };
