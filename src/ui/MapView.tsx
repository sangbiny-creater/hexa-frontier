// 세로(아래→위) 헥사 지도. 칸마다 실제 몬스터/보물/동료 그림을 세워 보여 준다.
import { useEffect, useRef } from 'react';
import { reachableTiles, visibleTiles, type GameState } from '../core/game';
import { hexCorners } from '../core/hex';
import { difficulty, recommendedPower, teamPower } from '../core/power';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { TILES, type TileDef } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { asset, ELEMENT_ICON, enemyStage, sprite } from './art';

const SIZE = 38; // 헥스 반지름
const W = Math.sqrt(3) * SIZE;
export const DIFF_COLOR = { easy: '#58d68d', fair: '#f4d03f', hard: '#ff6b6b' } as const;

function pos(t: TileDef) {
  return { x: W * (t.col + (t.row & 1 ? 0.5 : 0)) + W / 2 + 6, y: -t.row * SIZE * 1.5 };
}

function tileArt(t: TileDef, cleared: boolean): { href: string; scale: number } {
  if (t.kind === 'start') return { href: asset('forest-3'), scale: 1 };
  if (t.kind === 'gate') return { href: asset('tile-locked'), scale: 1 };
  if (t.kind === 'resource') return cleared ? { href: asset('forest-2'), scale: 1 } : { href: asset('tile-treasure'), scale: 1.05 };
  if (t.kind === 'spirit') {
    if (cleared) return { href: asset('forest-1'), scale: 1 };
    return { href: sprite(SPIRITS[t.spiritId!], 1), scale: 1.15 };
  }
  if (t.encounterId) {
    if (cleared && t.kind !== 'boss') return { href: asset(t.row % 2 ? 'forest-1' : 'forest-2'), scale: 1 };
    const enc = ENCOUNTERS[t.encounterId];
    const main = enc.enemies.find((e) => ENEMIES[e.enemyId].isBoss) ?? enc.enemies[0];
    const def = ENEMIES[main.enemyId];
    return { href: sprite(def, enemyStage(def, main.level)), scale: t.kind === 'boss' ? 1.45 : 1.15 };
  }
  return { href: asset('forest-1'), scale: 1 };
}

export function MapView({
  state,
  selected,
  target,
  onTap,
}: {
  state: GameState;
  selected: string | null;
  target: string | null;
  onTap: (id: string) => void;
}) {
  const visible = visibleTiles(state);
  const reach = reachableTiles(state);
  const tp = teamPower(state);
  const shown = TILES.filter((t) => visible.has(t.id));
  const pts = shown.map((t) => ({ t, ...pos(t) }));
  const minY = Math.min(...pts.map((p) => p.y)) - SIZE * 2.4;
  const maxY = Math.max(...pts.map((p) => p.y)) + SIZE * 1.6;
  const width = W * 5.5 + 12;
  const height = maxY - minY;
  const scroller = useRef<HTMLDivElement>(null);
  const hero = TILES.find((t) => t.id === state.lastTile) ?? TILES[0];
  const hp = pos(hero);

  // 목표 칸(또는 주인공)이 화면 가운데쯤 오도록 스크롤
  const focus = TILES.find((t) => t.id === target) ?? hero;
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const svgH = el.scrollHeight;
    const fy = ((pos(focus).y - minY) / height) * svgH;
    el.scrollTo({ top: Math.max(0, fy - el.clientHeight * 0.55), behavior: 'smooth' });
  }, [focus.id, height, minY]);

  return (
    <div className="map-scroll" ref={scroller}>
      <svg className="map-svg" viewBox={`0 ${minY} ${width} ${height}`} style={{ aspectRatio: `${width} / ${height}` }}>
        {/* 길 표시: 탐험한 칸끼리 은은한 연결 */}
        {pts.map(({ t, x, y }) => {
          const cleared = state.cleared.includes(t.id);
          const reachable = reach.has(t.id);
          return (
            <polygon
              key={'b' + t.id}
              points={hexCorners(x, y, SIZE - 1)}
              className={`hexbase ${cleared ? 'cleared' : ''} ${reachable ? 'reachable' : ''} ${target === t.id ? 'target' : ''} ${selected === t.id ? 'selected' : ''}`}
            />
          );
        })}
        {[...pts]
          .sort((a, b) => a.y - b.y)
          .map(({ t, x, y }) => {
            const cleared = state.cleared.includes(t.id);
            const art = tileArt(t, cleared);
            const w = W * art.scale * 1.08;
            const rec = t.encounterId ? recommendedPower(t.encounterId) : 0;
            const diff = rec ? difficulty(tp, rec) : null;
            const showPower = rec > 0 && (!cleared || t.kind !== 'boss');
            const mainEl = t.encounterId ? ENEMIES[(ENCOUNTERS[t.encounterId].enemies.find((e) => ENEMIES[e.enemyId].isBoss) ?? ENCOUNTERS[t.encounterId].enemies[0]).enemyId].element : null;
            return (
              <g key={t.id} className={`tile ${cleared ? 'is-cleared' : ''}`} onClick={() => onTap(t.id)} role="button" aria-label={t.name}>
                <polygon points={hexCorners(x, y, SIZE)} fill="transparent" />
                <image href={art.href} x={x - w / 2} y={y + SIZE * 0.9 - w * 1.05} width={w} height={w * 1.2} preserveAspectRatio="xMidYMax meet" />
                {t.kind === 'elite' && !cleared && (
                  <image href={asset('tile-elite')} x={x + SIZE * 0.3} y={y - SIZE * 1.15} width={SIZE * 0.75} height={SIZE * 0.75} />
                )}
                {showPower && (
                  <g transform={`translate(${x}, ${y - SIZE * (t.kind === 'boss' ? 1.55 : 1.05)})`}>
                    <rect x={-29} y={-9} width={58} height={17} rx={8} className="chip" stroke={cleared ? '#8899aa' : diff ? DIFF_COLOR[diff] : '#ccc'} />
                    <text y={4} textAnchor="middle" className="chip-text" fill={cleared ? '#c9d3df' : diff ? DIFF_COLOR[diff] : '#fff'}>
                      {mainEl ? ELEMENT_ICON[mainEl] : ''}
                      {cleared ? '⟳' : ''}
                      {rec}
                    </text>
                  </g>
                )}
                {t.kind === 'resource' && !cleared && <text x={x} y={y - SIZE * 0.95} textAnchor="middle" className="tag-text">보물</text>}
                {t.kind === 'spirit' && !cleared && (
                  <text x={x} y={y - SIZE * 1.05} textAnchor="middle" className="tag-text spirit">
                    ✦ 동료
                  </text>
                )}
                <text x={x} y={y + SIZE * 0.95} textAnchor="middle" className="tile-name">
                  {t.name}
                </text>
              </g>
            );
          })}
        {/* 주인공 */}
        <g className="hero" style={{ transform: `translate(${hp.x}px, ${hp.y}px)` }}>
          <image href={asset('hero-t')} x={-SIZE * 0.55} y={-SIZE * 1.25} width={SIZE * 1.1} height={SIZE * 1.3} preserveAspectRatio="xMidYMax meet" />
        </g>
        {target && visible.has(target) && (() => {
          const tt = TILES.find((t) => t.id === target)!;
          const p = pos(tt);
          return (
            <text x={p.x} y={p.y - SIZE * (tt.kind === 'boss' ? 2.05 : 1.55)} textAnchor="middle" className="target-arrow">
              ▼
            </text>
          );
        })()}
      </svg>
    </div>
  );
}
