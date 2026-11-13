// 월드 화면: 주인공 주변의 헥사 지도. 주인공이 가운데 오도록 카메라가 따라간다.
import { useEffect, useMemo, useRef, useState } from 'react';
import { hexCorners } from '../core/hex';
import { EL_COLOR, MONSTERS, SPIRITS, type Element } from '../rpg/data';
import { monStats, type Fx, type RpgState } from '../rpg/game';
import { BOSS_ROWS, COLS, key, WORLD, zoneOf } from '../rpg/world';

const S = 22; // 헥스 반지름
const HW = Math.sqrt(3) * S;
const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;

export function cellXY(c: number, r: number) {
  return { x: HW * (c + (r & 1 ? 0.5 : 0)) + HW * 0.6, y: -r * S * 1.5 };
}

const ZONE_FLOOR = ['#2f5a37', '#2a5560', '#5a4a33', '#3e3a5c'];
const ZONE_EDGE = ['#4f8a55', '#4a8a96', '#8a7350', '#6a63a0'];

export function WorldView({ state, fx, fxKey, heroHue }: { state: RpgState; fx: Fx[]; fxKey: number; heroHue: number }) {
  const { pos } = state;
  const seen = useMemo(() => new Set(state.seen), [state.seen]);
  const rows: number[] = [];
  for (let r = pos.r - 6; r <= pos.r + 9; r++) if (r >= 0 && r < 64) rows.push(r);
  const hero = cellXY(pos.c, pos.r);
  const width = HW * (COLS + 1.2);
  // 화면 비율에 맞춰 세로 범위를 정한다 (가로 9칸은 항상 다 보이게)
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
  const top = hero.y - viewH * 0.6;
  for (let r = Math.floor(pos.r - viewH / (S * 1.5) * 0.45); r <= pos.r + Math.ceil(viewH / (S * 1.5) * 0.65); r++) if (r >= 0 && r < 64 && !rows.includes(r)) rows.push(r);
  const owned = (Object.keys(state.spirits) as Element[]).filter((e) => state.spirits[e]);

  return (
    <svg ref={box} className="world" viewBox={`0 ${top} ${width} ${viewH}`} preserveAspectRatio="xMidYMid meet">
      {rows.flatMap((r) =>
        Array.from({ length: COLS }, (_, c) => {
          const cell = WORLD.cells.get(key(c, r))!;
          const p = cellXY(c, r);
          const vis = seen.has(key(c, r));
          if (!vis) return <polygon key={`f${c},${r}`} points={hexCorners(p.x, p.y, S - 0.5)} className="fog" />;
          if (!cell.floor)
            return (
              <g key={`r${c},${r}`}>
                <polygon points={hexCorners(p.x, p.y, S - 0.5)} fill="#1a2a20" />
                <image href={img((c + r) % 2 ? 'forest-5' : 'forest-6')} x={p.x - HW * 0.55} y={p.y - S * 1.45} width={HW * 1.1} height={S * 2.3} preserveAspectRatio="xMidYMax meet" />
              </g>
            );
          const z = zoneOf(r);
          return <polygon key={`c${c},${r}`} points={hexCorners(p.x, p.y, S - 0.8)} fill={ZONE_FLOOR[z]} stroke={ZONE_EDGE[z]} strokeWidth={0.8} />;
        }),
      )}
      {/* 칸 위의 것들: 야영지·제단·상자 */}
      {rows.flatMap((r) =>
        Array.from({ length: COLS }, (_, c) => {
          const cell = WORLD.cells.get(key(c, r))!;
          const f = cell.feature;
          if (!f || !seen.has(key(c, r))) return null;
          const p = cellXY(c, r);
          const opened = state.opened.includes(key(c, r));
          if (f.kind === 'camp') return <image key={`ft${c},${r}`} href={img('tile-camp')} x={p.x - S} y={p.y - S * 1.4} width={S * 2} height={S * 2} />;
          if (f.kind === 'chest' && !opened) return <image key={`ft${c},${r}`} href={img('tile-treasure')} x={p.x - S * 0.8} y={p.y - S * 1.2} width={S * 1.6} height={S * 1.6} />;
          if (f.kind === 'shrine')
            return (
              <g key={`ft${c},${r}`} className={opened ? '' : 'shrine-glow'}>
                <circle cx={p.x} cy={p.y - 4} r={S * 0.8} fill={EL_COLOR[f.element] + (opened ? '22' : '55')} stroke={EL_COLOR[f.element]} strokeWidth={2} />
                {!opened && <image href={img(`${SPIRITS[f.element].art}-p1`)} x={p.x - S * 0.65} y={p.y - 4 - S * 0.65} width={S * 1.3} height={S * 1.3} clipPath="circle(48%)" />}
              </g>
            );
          return null;
        }),
      )}
      {/* 보스 줄 표시 */}
      {BOSS_ROWS.filter((r) => rows.includes(r)).map((r) => {
        const p = cellXY(4, r);
        return (
          <text key={`b${r}`} x={p.x} y={p.y + S * 1.15} textAnchor="middle" className="boss-label">
            BOSS
          </text>
        );
      })}
      {/* 몬스터 */}
      {state.monsters
        .filter((m) => !m.dead && rows.includes(m.r) && seen.has(key(m.c, m.r)))
        .sort((a, b) => b.r - a.r)
        .map((m) => {
          const d = MONSTERS[m.def];
          const p = cellXY(m.c, m.r);
          const w = m.boss ? S * 3 : S * 1.9;
          const stage = d.stage ?? (m.level >= 14 ? 3 : m.level >= 6 ? 2 : 1);
          const ratio = m.hp / monStats(m).hp;
          return (
            <g key={`m${m.id}`} className="mon-g" style={{ transform: `translate(${p.x}px, ${p.y}px)` }}>
              <image href={img(`${d.art}-t${stage}`)} x={-w / 2} y={-w * 0.95} width={w} height={w} preserveAspectRatio="xMidYMax meet" />
              <rect x={-S * 0.7} y={-w * 0.98} width={S * 1.4} height={3.5} rx={1.5} fill="#000a" />
              <rect x={-S * 0.7} y={-w * 0.98} width={S * 1.4 * ratio} height={3.5} rx={1.5} fill={m.aggro ? '#ff5a5a' : '#f4d03f'} />
              <circle cx={-S * 0.72} cy={-w * 0.98 + 2} r={4.5} fill={EL_COLOR[d.element]} />
              <text x={0} y={S * 0.75} textAnchor="middle" className="mon-lv">
                Lv{m.level}
              </text>
              {m.stun > 0 && <text x={S * 0.6} y={-w * 0.7} className="mon-st">💫</text>}
              {m.poison > 0 && <text x={-S * 0.9} y={-w * 0.6} className="mon-st">☠</text>}
            </g>
          );
        })}
      {/* 따라다니는 스피릿 */}
      {owned.map((e, i) => {
        const a = (i / Math.max(1, owned.length)) * Math.PI - Math.PI;
        return (
          <g key={e} className="spirit-g" style={{ transform: `translate(${hero.x + Math.cos(a) * S * 1.05}px, ${hero.y + 6 + Math.sin(a) * -S * 0.35}px)` }}>
            <circle r={6.5} fill={EL_COLOR[e]} stroke="#fff" strokeWidth={1} />
            <image href={img(`${SPIRITS[e].art}-p1`)} x={-6} y={-6} width={12} height={12} clipPath="circle(48%)" />
          </g>
        );
      })}
      {/* 주인공 */}
      <g className="hero-g" style={{ transform: `translate(${hero.x}px, ${hero.y}px)` }}>
        <ellipse cx={0} cy={4} rx={S * 0.6} ry={4} fill="#0006" />
        <image href={img('hero-t')} x={-S * 0.8} y={-S * 1.9} width={S * 1.6} height={S * 2.2} preserveAspectRatio="xMidYMax meet" style={{ filter: `hue-rotate(${heroHue}deg) saturate(1.2)` }} />
      </g>
      {/* 효과: 피해 숫자, 기술 범위 */}
      <g key={fxKey}>
        {fx.flatMap((f, i) => {
          if (f.k === 'skill')
            return f.cells.map((c, j) => {
              const p = cellXY(c.c, c.r);
              return <polygon key={`s${i}-${j}`} points={hexCorners(p.x, p.y, S - 1)} className="skill-hex" />;
            });
          if (f.k === 'dmg' || f.k === 'heal') {
            const p = cellXY(f.c, f.r);
            const txt = f.k === 'dmg' ? `-${f.amount}` : `+${f.amount}`;
            const cls = f.k === 'heal' ? 'heal' : f.onHero ? 'hurt' : f.eff === 'strong' ? 'strong' : f.eff === 'weak' || f.blocked ? 'weak' : '';
            return [
              <text key={`d${i}`} x={p.x + ((i % 3) - 1) * 6} y={p.y - S * 1.3} textAnchor="middle" className={`fx-num ${cls}`} style={{ animationDelay: `${(i % 4) * 0.05}s` }}>
                {f.k === 'dmg' && !f.onHero && f.eff === 'strong' ? '유리! ' : ''}
                {f.k === 'dmg' && f.blocked ? '막힘 ' : ''}
                {txt}
                {f.k === 'dmg' && f.crit ? '!' : ''}
              </text>,
            ];
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
