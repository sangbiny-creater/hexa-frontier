// 세로(아래→위) 헥사 지도. 칸마다 실제 몬스터/보물 그림을 세워 보여 준다.
// - 화면 폭의 120%로 그려 칸을 크게 보이게 하고, 좌우는 밀어서 볼 수 있다.
// - 누르는 영역은 그림이 아니라 '바닥 헥스'만 (큰 보스 그림도 헥스 위치로만 눌림).
// - 길 옆의 빈자리는 지나갈 수 없는 바위/나무 칸으로 막는다.
import { useEffect, useRef } from 'react';
import { reachableTiles, visibleTiles, type GameState } from '../core/game';
import { axialNeighbors, hexCorners } from '../core/hex';
import { difficulty, recommendedPower, teamPower } from '../core/power';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { TILES, type TileDef } from '../data/map';
import { asset, ELEMENT_ICON, enemyStage, sprite } from './art';

const SIZE = 38; // 헥스 반지름 (viewBox 단위)
const W = Math.sqrt(3) * SIZE;
const ZOOM = 1.2; // 화면 폭 대비 120%
export const DIFF_COLOR = { easy: '#58d68d', fair: '#f4d03f', hard: '#ff6b6b' } as const;

function cellPos(col: number, row: number) {
  return { x: W * (col + (row & 1 ? 0.5 : 0)) + W * 1.5, y: -row * SIZE * 1.5 };
}
const pos = (t: TileDef) => cellPos(t.col, t.row);

const CELL = new Map(TILES.map((t) => [`${t.col},${t.row}`, t]));

function neighborCells(col: number, row: number): [number, number][] {
  const q = col - (row - (row & 1)) / 2;
  return axialNeighbors(q, row).map(([nq, nr]) => [nq + (nr - (nr & 1)) / 2, nr]);
}

function tileArt(t: TileDef, cleared: boolean): { href: string; scale: number } {
  if (t.kind === 'start') return { href: asset('forest-3'), scale: 1 };
  if (t.kind === 'gate') return { href: asset('tile-locked'), scale: 1 };
  if (t.kind === 'resource') {
    if (cleared) return { href: asset('forest-2'), scale: 1 };
    return { href: asset(t.resource === 'summon' ? 'tile-crystal' : 'tile-treasure'), scale: 1.05 };
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

const TREASURE_LABEL = { summon: '🔮 결정', stones: '💎 상자', gold: '🪙 상자' } as const;

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

  // 보이는 칸 둘레: 실제 칸이면 안개, 없는 자리면 막힌 칸
  const ring = new Map<string, { col: number; row: number; kind: 'rock' | 'fog' }>();
  for (const t of shown) {
    for (const [c, r] of neighborCells(t.col, t.row)) {
      const key = `${c},${r}`;
      if (r < 0 || c < -1 || c > 5 || ring.has(key)) continue;
      const real = CELL.get(key);
      if (real && visible.has(real.id)) continue;
      ring.set(key, { col: c, row: r, kind: real ? 'fog' : 'rock' });
    }
  }
  const ringPts = [...ring.values()].map((c) => ({ ...c, ...cellPos(c.col, c.row) }));

  const allY = [...pts.map((p) => p.y), ...ringPts.map((p) => p.y)];
  const minY = Math.min(...allY) - SIZE * 2.4;
  const maxY = Math.max(...allY) + SIZE * 1.4;
  const width = W * 8;
  const height = maxY - minY;
  const scroller = useRef<HTMLDivElement>(null);
  const hero = TILES.find((t) => t.id === state.lastTile) ?? TILES[0];
  const hp = pos(hero);

  // 목표 칸(또는 주인공)이 화면 가운데쯤 오도록 스크롤 (세로·가로)
  const focus = TILES.find((t) => t.id === target) ?? hero;
  const first = useRef(true);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      const svg = el.querySelector('svg');
      if (!svg) return;
      const p = pos(focus);
      const fy = ((p.y - minY) / height) * svg.clientHeight + (el.scrollHeight - svg.clientHeight - 150);
      const fx = (p.x / width) * svg.clientWidth;
      el.scrollTo({ top: Math.max(0, fy - el.clientHeight * 0.55), left: Math.max(0, fx - el.clientWidth / 2), behavior: first.current ? 'auto' : 'smooth' });
      first.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [focus.id, height, minY, width]);

  return (
    <div className="map-scroll" ref={scroller}>
      <svg className="map-svg" viewBox={`0 ${minY} ${width} ${height}`} style={{ width: `${ZOOM * 100 * (8 / 5.5)}%`, aspectRatio: `${width} / ${height}` }}>
        {/* 막힌 칸 / 안개 */}
        {ringPts
          .sort((a, b) => a.y - b.y)
          .map((c) =>
            c.kind === 'rock' ? (
              <image
                key={`r${c.col},${c.row}`}
                href={asset((c.col + c.row) % 2 ? 'forest-5' : 'forest-6')}
                x={c.x - W * 0.54}
                y={c.y + SIZE * 0.9 - W * 1.13}
                width={W * 1.08}
                height={W * 1.3}
                preserveAspectRatio="xMidYMax meet"
                className="blocked"
              />
            ) : (
              <g key={`f${c.col},${c.row}`} className="fogcell">
                <polygon points={hexCorners(c.x, c.y, SIZE - 2)} />
                <text x={c.x} y={c.y + 5} textAnchor="middle">
                  ?
                </text>
              </g>
            ),
          )}
        {/* 바닥 헥스 표시 */}
        {pts.map(({ t, x, y }) => (
          <polygon
            key={'b' + t.id}
            points={hexCorners(x, y, SIZE - 1)}
            className={`hexbase ${state.cleared.includes(t.id) ? 'cleared' : ''} ${reach.has(t.id) ? 'reachable' : ''} ${target === t.id ? 'target' : ''} ${selected === t.id ? 'selected' : ''}`}
          />
        ))}
        {/* 칸 그림 (누를 수 없음) */}
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
              <g key={t.id} className={`tile ${cleared ? 'is-cleared' : ''}`} pointerEvents="none">
                <image href={art.href} x={x - w / 2} y={y + SIZE * 0.9 - w * 1.05} width={w} height={w * 1.2} preserveAspectRatio="xMidYMax meet" />
                {t.kind === 'elite' && !cleared && <image href={asset('tile-elite')} x={x + SIZE * 0.3} y={y - SIZE * 1.15} width={SIZE * 0.75} height={SIZE * 0.75} />}
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
                {t.kind === 'resource' && !cleared && (
                  <text x={x} y={y - SIZE * 0.95} textAnchor="middle" className="tag-text">
                    {TREASURE_LABEL[t.resource ?? 'gold']}
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
        {/* 누르는 영역: 바닥 헥스만, 맨 위에 투명하게 */}
        {pts.map(({ t, x, y }) => (
          <polygon key={'h' + t.id} points={hexCorners(x, y, SIZE - 1)} className="hit" onClick={() => onTap(t.id)} role="button" aria-label={t.name} />
        ))}
      </svg>
    </div>
  );
}
