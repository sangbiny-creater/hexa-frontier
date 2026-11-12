import { useState } from 'react';
import { ROW_LABEL, rowName } from '../core/board';
import { computeStats } from '../core/battle';
import { conditionTier } from '../core/condition';
import { canRankUp, clinicHeal, isBusy, rankUp, setFormation, type GameState } from '../core/game';
import { rankUpCost, xpMultiplier, xpToNext } from '../core/growth';
import { hexCorners } from '../core/hex';
import { BALANCE } from '../data/balance';
import { SPIRITS } from '../data/spirits';
import { Bar, ElementBadge, ELEMENT_COLOR, Portrait, RoleBadge } from './common';

type Act = <T>(fn: (s: GameState, now: number) => T) => T;

export function SpiritPanel({ state, now, act, toast }: { state: GameState; now: number; act: Act; toast: (m: string) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const owned = Object.values(state.spirits);

  const placeAt = (slot: number) => {
    const occupant = Object.entries(state.formation).find(([, v]) => v === slot)?.[0];
    if (!picked) {
      if (occupant) setPicked(occupant);
      return;
    }
    const err = act((s) => setFormation(s, picked, slot));
    if (err) toast(err);
    setPicked(null);
  };

  return (
    <div className="panel">
      <h3>
        편성 <span className="muted">출전 {Object.keys(state.formation).length}/{state.maxDeploy}</span>
      </h3>
      <p className="hint">스피릿 카드를 누른 뒤 칸을 눌러 배치하세요. 전열은 피해 -10%, 후열은 전열이 살아 있는 동안 근접 공격을 받지 않습니다.</p>
      <FormationBoard state={state} picked={picked} onSlot={placeAt} />
      {picked && state.formation[picked] !== undefined && (
        <button
          className="small"
          onClick={() => {
            act((s) => setFormation(s, picked, null));
            setPicked(null);
          }}
        >
          {SPIRITS[picked].name} 편성 해제
        </button>
      )}
      <h3>스피릿</h3>
      <div className="spirit-list">
        {owned.map((sp) => {
          const def = SPIRITS[sp.defId];
          const slot = state.formation[sp.defId];
          const busy = isBusy(state, sp.defId, now);
          const tier = conditionTier(sp.condition);
          const cost = rankUpCost(sp);
          const stats = computeStats(
            { uid: 'x', def, side: 'ally', slot: slot ?? 4, level: sp.level, rank: sp.rank, condition: sp.condition, injured: sp.injured },
            [],
          );
          const mul = xpMultiplier(sp, owned, 'battle');
          return (
            <div key={sp.defId} className={`spirit-card ${picked === sp.defId ? 'picked' : ''}`} onClick={() => setPicked(picked === sp.defId ? null : sp.defId)}>
              <div className="sc-head">
                <Portrait name={def.name} element={def.element} size={48} dim={!!busy} />
                <div className="sc-title">
                  <div>
                    <b>{def.name}</b> <span className="stars">{'★'.repeat(sp.rank)}</span>
                  </div>
                  <div className="muted small">{def.title}</div>
                  <div>
                    <ElementBadge element={def.element} /> <RoleBadge role={def.role} />
                    {slot !== undefined && <span className="badge">{ROW_LABEL[rowName(slot)]}</span>}
                    {busy && <span className="badge busy">{busy.type === 'rest' ? '휴식 중' : busy.type === 'training' ? '훈련 중' : '채집 중'}</span>}
                    {sp.injured && <span className="badge inj">경상</span>}
                  </div>
                </div>
                <div className="sc-lv">Lv.{sp.level}</div>
              </div>
              <div className="sc-bars">
                <label>
                  XP {sp.level >= BALANCE.growth.maxLevel ? 'MAX' : `${sp.xp}/${xpToNext(sp.level)}`}
                  {mul > 1 && <span className="boost"> 따라잡기 ×{mul}</span>}
                </label>
                <Bar value={sp.xp} max={xpToNext(sp.level)} color="#8ab4ff" />
                <label>
                  컨디션 {Math.floor(sp.condition)} · {tier.label} {tier.mul < 1 && <span className="warn">(공·방 {Math.round(tier.mul * 100)}%)</span>}
                </label>
                <Bar value={sp.condition} max={100} color={sp.condition >= 80 ? '#6fdc8c' : sp.condition >= 40 ? '#f2cf3c' : '#ff6b6b'} />
              </div>
              <div className="sc-stats">
                <span>HP {stats.hp}</span>
                <span>공격 {Math.round(stats.atk)}</span>
                <span>방어 {Math.round(stats.def)}</span>
                <span>속도 {stats.spd}</span>
                {stats.match && <span className="good">역할-열 일치</span>}
              </div>
              <div className="skills">
                {def.skills.map((k) => (
                  <div key={k.id} className={`skill ${k.kind}`}>
                    <b>{k.kind === 'ultimate' ? '★ ' : k.kind === 'active' ? '◆ ' : ''}{k.name}</b>
                    {k.cooldown > 0 && <span className="muted"> {k.cooldown}초</span>}
                    <div className="muted small">{k.desc}</div>
                  </div>
                ))}
              </div>
              <div className="sc-actions" onClick={(e) => e.stopPropagation()}>
                {cost ? (
                  <button
                    disabled={!canRankUp(state, sp.defId)}
                    onClick={() => {
                      const err = act((s) => rankUp(s, sp.defId));
                      toast(err ?? `${def.name} 승급! 능력치 +12%`);
                    }}
                  >
                    승급 ★{sp.rank + 1} · 🔷{cost.stones} 💰{cost.gold} {sp.level < cost.minLevel ? `(Lv.${cost.minLevel} 필요)` : ''}
                  </button>
                ) : (
                  <span className="muted">최대 승급</span>
                )}
                {sp.injured && (
                  <button
                    onClick={() => {
                      const err = act((s) => clinicHeal(s, sp.defId));
                      toast(err ?? '치료 완료');
                    }}
                  >
                    치료소 💰{BALANCE.condition.clinicGold}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormationBoard({ state, picked, onSlot }: { state: GameState; picked: string | null; onSlot: (slot: number) => void }) {
  const R = 30;
  const COL = 56;
  const LANE = 64;
  const bySlot = Object.fromEntries(Object.entries(state.formation).map(([id, slot]) => [slot, id]));
  return (
    <svg viewBox="0 0 260 250" className="formation">
      {Array.from({ length: 9 }, (_, slot) => {
        const r = Math.floor(slot / 3);
        const l = slot % 3;
        const x = 50 + r * COL * 1.4;
        const y = 50 + l * LANE + (r % 2 ? LANE / 2 : 0);
        const id = bySlot[slot];
        const def = id ? SPIRITS[id] : null;
        return (
          <g key={slot} onClick={() => onSlot(slot)} className={`fslot ${picked ? 'target' : ''}`}>
            <polygon points={hexCorners(x, y, R)} fill={def ? ELEMENT_COLOR[def.element] + '33' : '#ffffff08'} stroke={def ? ELEMENT_COLOR[def.element] : '#ffffff30'} strokeWidth={id === picked ? 4 : 2} />
            <text x={x} y={y + 4} textAnchor="middle" className="fs-name">
              {def ? def.name : ''}
            </text>
          </g>
        );
      })}
      {(['front', 'mid', 'back'] as const).map((row, r) => (
        <text key={row} x={50 + r * COL * 1.4} y={245} textAnchor="middle" className="row-label">
          {ROW_LABEL[row]}
        </text>
      ))}
      <text x={10} y={14} className="row-label">← 적 방향</text>
    </svg>
  );
}
