import { ELEMENT_LABEL } from '../core/board';
import { reachableTiles, visibleTiles, type GameState } from '../core/game';
import { axialToPixel, hexCorners } from '../core/hex';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { TILES, type TileDef } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { ELEMENT_COLOR } from './common';

const SIZE = 34;

const KIND_GLYPH: Record<TileDef['kind'], string> = {
  start: '⌂',
  battle: '⚔',
  spirit: '✦',
  resource: '◆',
  facility: '⛺',
  boss: '☠',
  gate: '➜',
};

export function tileColor(t: TileDef): string {
  switch (t.kind) {
    case 'boss':
      return '#d9534f';
    case 'spirit':
      return t.spiritId ? ELEMENT_COLOR[SPIRITS[t.spiritId].element] : '#9b7bff';
    case 'resource':
      return t.resource === 'stones' ? '#7fd3e6' : '#f2cf3c';
    case 'facility':
      return '#b48cff';
    case 'gate':
      return '#888';
    default:
      return '#6f8f73';
  }
}

export function HexMap({
  state,
  selected,
  onSelect,
  highlightFarm,
  targetTile,
}: {
  state: GameState;
  selected: string | null;
  onSelect: (id: string) => void;
  highlightFarm: boolean;
  targetTile?: string | null;
}) {
  const visible = visibleTiles(state);
  const reach = reachableTiles(state);
  const pts = TILES.map((t) => ({ t, ...axialToPixel(t.q, t.r, SIZE) }));
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const pad = SIZE + 6;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad - 18;
  const w = Math.max(...xs) - minX + pad;
  const h = Math.max(...ys) - minY + pad;

  return (
    <svg className="hexmap" viewBox={`${minX} ${minY} ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {pts.map(({ t, x, y }) => {
        if (!visible.has(t.id)) {
          return <polygon key={t.id} points={hexCorners(x, y, SIZE - 2)} className="hex fog" />;
        }
        const cleared = state.cleared.includes(t.id);
        const reachable = reach.has(t.id);
        const farmable = cleared && t.kind === 'battle';
        const color = tileColor(t);
        const cls = ['hex', cleared ? 'cleared' : '', reachable ? 'reachable' : '', selected === t.id ? 'selected' : '', highlightFarm && farmable ? 'farm-hint' : '', targetTile === t.id ? 'target' : '']
          .filter(Boolean)
          .join(' ');
        return (
          <g key={t.id} className={cls} onClick={() => onSelect(t.id)} role="button" aria-label={t.name}>
            <polygon points={hexCorners(x, y, SIZE - 2)} fill={cleared ? color + '40' : color + '1c'} stroke={color} />
            <text x={x} y={y + 2} textAnchor="middle" className="glyph" fill={color}>
              {cleared && t.kind === 'spirit' ? '✓' : KIND_GLYPH[t.kind]}
            </text>
            <text x={x} y={y + 19} textAnchor="middle" className="tile-label">
              {t.name.length > 6 ? t.name.slice(0, 6) + '…' : t.name}
            </text>
            {state.lastTile === t.id && <circle cx={x} cy={y - 18} r={4} className="here" />}
          </g>
        );
      })}
      {pts
        .filter(({ t }) => t.id === targetTile && visible.has(t.id))
        .map(({ x, y }) => (
          <text key="arrow" x={x} y={y - SIZE + 4} textAnchor="middle" className="target-arrow" pointerEvents="none">
            ▼
          </text>
        ))}
    </svg>
  );
}

export function tileSummary(t: TileDef) {
  if (!t.encounterId) return null;
  const enc = ENCOUNTERS[t.encounterId];
  return enc.enemies.map((e) => {
    const d = ENEMIES[e.enemyId];
    return { name: d.name, level: e.level, element: d.element, label: ELEMENT_LABEL[d.element], boss: !!d.isBoss };
  });
}
