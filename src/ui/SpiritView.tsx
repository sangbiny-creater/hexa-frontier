// 스피릿 탭: 보유 스피릿 카드 → 상세(좌우로 넘기기), 출전 배치, 레벨업·승급. 안 열린 기능은 자물쇠로 보여 준다.
import { useRef, useState } from 'react';
import { elementMultiplier, ELEMENT_LABEL, ROLE_LABEL, ROW_LABEL, rowName } from '../core/board';
import { computeStats } from '../core/battle';
import { affordableLevelUps, ALL_SUMMONABLE, canEvolve, canRankUp, evolve, evolveNeed, levelCap, levelUp, rankUp, setFormation, upgradeUnlocked, type GameState } from '../core/game';
import { levelUpCost, rankUpCost } from '../core/growth';
import { hexCorners } from '../core/hex';
import { spiritPower, spiritPowerAt, teamPower } from '../core/power';
import type { Element } from '../core/types';
import { BALANCE } from '../data/balance';
import { SPIRITS } from '../data/spirits';
import { Bar, ELEMENT_COLOR, ELEMENT_ICON, ElementTag, GOLD, portrait, POWER, RoleTag, stageName, STONE } from './art';

type Act = <T>(fn: (s: GameState, now: number) => T) => T;
const ELEMENTS: Element[] = ['water', 'fire', 'forest', 'earth', 'electric'];
const EVO: { levelCap: readonly number[]; statMul: readonly number[] } = BALANCE.evolution;

export function SpiritView({
  state,
  act,
  toast,
  focusLevel,
  goal,
  onLeveled,
  onEvolve,
}: {
  state: GameState;
  act: Act;
  toast: (m: string) => void;
  focusLevel: boolean;
  goal: number | null;
  onLeveled: () => void;
  onEvolve: (id: string, stage: number) => void;
}) {
  const [detail, setDetail] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const owned = Object.keys(state.spirits);
  const canLevel = upgradeUnlocked(state);
  const ups = canLevel ? affordableLevelUps(state) : 0;
  const total = teamPower(state);
  const notOwned = ALL_SUMMONABLE.filter((id) => !state.spirits[id]);

  const levelOne = (id: string) => {
    const sp = state.spirits[id];
    const gain = spiritPowerAt(id, sp.level + 1, sp.rank, sp.stage) - spiritPower(state, id);
    const err = act((s) => levelUp(s, id));
    if (err) return toast(err);
    toast(`${stageName(SPIRITS[id], sp.stage)} Lv.${sp.level + 1}  ${POWER}+${gain}`);
    onLeveled();
  };

  const levelAll = () => {
    const n = act((s) => {
      let k = 0;
      for (let g = 0; g < 400; g++) {
        const id = Object.keys(s.formation)
          .filter((x) => s.spirits[x].level < levelCap(s.spirits[x]))
          .sort((a, b) => s.spirits[a].level - s.spirits[b].level)[0];
        if (!id || s.gold < levelUpCost(s.spirits[id].level) || levelUp(s, id)) break;
        k++;
      }
      return k;
    });
    if (!n) return;
    toast(`출전 스피릿 레벨업 ${n}번!`);
    onLeveled();
  };

  const tapSlot = (slot: number) => {
    const occ = Object.entries(state.formation).find(([, v]) => v === slot)?.[0];
    if (!picked) {
      if (occ) setPicked(occ);
      return;
    }
    const err = act((s) => setFormation(s, picked, slot));
    if (err) toast(err);
    setPicked(null);
  };

  return (
    <div className="page">
      <div className="up-head">
        <div>
          <div className="muted small">출전 팀 전투력</div>
          <div className="big-power">
            {POWER} {total.toLocaleString()}
          </div>
          {goal && (
            <div className="goal">
              다음 보스 목표 {POWER}
              {goal} {total >= goal ? <b className="good">✓</b> : <span className="bad">({goal - total} 부족)</span>}
            </div>
          )}
        </div>
        {canLevel ? (
          <button className={`cta small-cta ${focusLevel && ups ? 'pulse' : ''}`} disabled={!ups} onClick={levelAll}>
            모두 레벨업
            <small>{ups ? `${ups}번 가능` : '골드 부족'}</small>
          </button>
        ) : (
          <div className="lockbox">🔒 레벨업<small>첫 보스 도전 후</small></div>
        )}
      </div>

      <h3 className="sec">
        출전 배치 <span className="muted small">{Object.keys(state.formation).length}/{state.maxDeploy}명 · 위쪽이 적 방향</span>
      </h3>
      <FormationBoard state={state} picked={picked} onSlot={tapSlot} />
      <div className="chip-row">
        {owned.map((id) => {
          const on = state.formation[id] !== undefined;
          return (
            <button key={id} className={`spchip ${on ? 'on' : ''} ${picked === id ? 'picked' : ''}`} onClick={() => setPicked(picked === id ? null : id)}>
              <img src={portrait(SPIRITS[id], state.spirits[id].stage)} alt="" />
              <span>{on ? ROW_LABEL[rowName(state.formation[id])] : '대기'}</span>
            </button>
          );
        })}
      </div>
      <p className="explain small">
        {picked ? (
          <>
            <b>{stageName(SPIRITS[picked], state.spirits[picked].stage)}</b> 선택됨 → 배치판의 칸을 누르세요.{' '}
            {state.formation[picked] !== undefined && (
              <button
                className="link-btn"
                onClick={() => {
                  if (Object.keys(state.formation).length <= 1) return toast('최소 1명은 출전해야 해요');
                  act((s) => setFormation(s, picked, null));
                  setPicked(null);
                }}
              >
                출전에서 빼기
              </button>
            )}
          </>
        ) : (
          <>스피릿을 고른 뒤 칸을 누르면 배치돼요. <b>전열</b>: 받는 피해 -10%·탱커 방어↑ / <b>중열</b>: 지원 효과↑ / <b>후열</b>: 전열이 살아 있으면 근접 공격을 안 받음·원거리/회복↑</>
        )}
      </p>

      <h3 className="sec">보유 스피릿 {owned.length}</h3>
      <div className="card-grid">
        {owned.map((id) => {
          const d = SPIRITS[id];
          const sp = state.spirits[id];
          return (
            <button key={id} className="spcard" style={{ borderColor: ELEMENT_COLOR[d.element] }} onClick={() => setDetail(id)}>
              <img src={portrait(d, sp.stage)} alt="" />
              <div className="spcard-lv">Lv.{sp.level}</div>
              {state.formation[id] !== undefined && <div className="spcard-on">출전</div>}
              {canEvolve(state, id) ? <div className="spcard-evo">진화!</div> : sp.copies > 0 && <div className="spcard-evo dim">+{sp.copies}</div>}
              <div className="spcard-name">
                {ELEMENT_ICON[d.element]} {stageName(d, sp.stage)}
              </div>
              <div className="spcard-sub">
                {ROLE_LABEL[d.role]} · {POWER}
                {spiritPower(state, id)}
              </div>
            </button>
          );
        })}
        {notOwned.map((id) => (
          <div key={id} className="spcard locked">
            <img src={portrait(SPIRITS[id], 1)} alt="" />
            <div className="spcard-name">🔒 {SPIRITS[id].stages?.[0]}</div>
            <div className="spcard-sub">소환으로 얻기</div>
          </div>
        ))}
      </div>

      {detail && (
        <SpiritDetail
          state={state}
          ids={owned}
          id={detail}
          onChange={setDetail}
          onClose={() => setDetail(null)}
          canLevel={canLevel}
          focusLevel={focusLevel}
          onLevel={levelOne}
          onRank={(id) => {
            const err = act((s) => rankUp(s, id));
            toast(err ?? '승급! 능력치 +12%');
          }}
          onEvolve={(id) => {
            const err = act((s) => evolve(s, id));
            if (err) return toast(err);
            onEvolve(id, state.spirits[id].stage + 1);
          }}
        />
      )}
    </div>
  );
}

function FormationBoard({ state, picked, onSlot }: { state: GameState; picked: string | null; onSlot: (slot: number) => void }) {
  const R = 30;
  const bySlot = Object.fromEntries(Object.entries(state.formation).map(([id, slot]) => [slot, id]));
  // 세로 화면: 전열(row 0)이 위, 후열(row 2)이 아래. 칸(lane)은 가로.
  const at = (slot: number) => {
    const r = Math.floor(slot / 3);
    const l = slot % 3;
    return { x: 70 + l * 62 + (r % 2 ? 31 : 0), y: 40 + r * 54 };
  };
  return (
    <svg viewBox="0 0 330 186" className="formation-v">
      {[0, 1, 2].map((r) => (
        <text key={r} x={8} y={44 + r * 54} className="frow">
          {['전열', '중열', '후열'][r]}
        </text>
      ))}
      {Array.from({ length: 9 }, (_, slot) => {
        const p = at(slot);
        const id = bySlot[slot];
        const d = id ? SPIRITS[id] : null;
        return (
          <g key={slot} onClick={() => onSlot(slot)} className={`fslot ${picked ? 'target' : ''}`}>
            <polygon points={hexCorners(p.x, p.y, R)} fill={d ? ELEMENT_COLOR[d.element] + '40' : '#ffffff0a'} stroke={d ? ELEMENT_COLOR[d.element] : '#ffffff30'} strokeWidth={id && id === picked ? 4 : 2} />
            {d && <image href={portrait(d, state.spirits[id].stage)} x={p.x - 20} y={p.y - 20} width={40} height={40} clipPath="circle(20px)" />}
          </g>
        );
      })}
    </svg>
  );
}

function SpiritDetail({
  state,
  ids,
  id,
  onChange,
  onClose,
  canLevel,
  focusLevel,
  onLevel,
  onRank,
  onEvolve,
}: {
  state: GameState;
  ids: string[];
  id: string;
  onChange: (id: string) => void;
  onClose: () => void;
  canLevel: boolean;
  focusLevel: boolean;
  onLevel: (id: string) => void;
  onRank: (id: string) => void;
  onEvolve: (id: string) => void;
}) {
  const touch = useRef<number | null>(null);
  const idx = ids.indexOf(id);
  const go = (d: number) => onChange(ids[(idx + d + ids.length) % ids.length]);
  const def = SPIRITS[id];
  const sp = state.spirits[id];
  const slot = state.formation[id];
  const st = computeStats({ uid: 'x', def, side: 'ally', slot: slot ?? 4, level: sp.level, rank: sp.rank, stage: sp.stage }, []);
  const cost = levelUpCost(sp.level);
  const cap = levelCap(sp);
  const can = canLevel && state.gold >= cost && sp.level < cap;
  const gain = spiritPowerAt(id, sp.level + 1, sp.rank, sp.stage) - spiritPower(state, id);
  const need = evolveNeed(sp);
  const rc = rankUpCost(sp);
  const strong = ELEMENTS.filter((e) => elementMultiplier(def.element, e) > 1);
  const weak = ELEMENTS.filter((e) => elementMultiplier(e, def.element) > 1);
  const stage = sp.stage;

  return (
    <div
      className="screen detail"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="detail-top">
        <button className="icon-btn" onClick={onClose}>
          ✕
        </button>
        <span className="muted small">
          {idx + 1} / {ids.length} · 옆으로 밀어서 넘기기
        </span>
        <span style={{ width: 34 }} />
      </div>
      <div className="detail-scroll">
        <div className="detail-hero" style={{ background: `radial-gradient(circle at 50% 40%, ${ELEMENT_COLOR[def.element]}55, transparent 70%)` }}>
          <button className="nav-btn" onClick={() => go(-1)}>
            ‹
          </button>
          <img src={portrait(def, stage)} alt="" />
          <button className="nav-btn" onClick={() => go(1)}>
            ›
          </button>
        </div>
        <div className="detail-name">
          <h2>{stageName(def, sp.stage)}</h2>
          <div className="muted">
            {def.name} · {def.title}
          </div>
          <div className="tags">
            <ElementTag element={def.element} /> <RoleTag role={def.role} />
            <span className="tag">{def.range === 'melee' ? '근접' : '원거리'}</span>
            <span className="tag">{slot !== undefined ? `출전 · ${ROW_LABEL[rowName(slot)]}` : '대기'}</span>
          </div>
          <div className="detail-power">
            Lv.{sp.level} {'★'.repeat(sp.rank)} · {POWER} {spiritPower(state, id)}
          </div>
        </div>

        <div className="dbox">
          <h4>능력치</h4>
          <div className="stats">
            <div>
              <small>체력</small>
              <b>{st.hp}</b>
            </div>
            <div>
              <small>공격</small>
              <b>{Math.round(st.atk)}</b>
            </div>
            <div>
              <small>방어</small>
              <b>{Math.round(st.def)}</b>
            </div>
            <div>
              <small>속도</small>
              <b>{st.spd}</b>
            </div>
          </div>
          {st.match && <div className="small good">✓ 지금 자리({ROW_LABEL[rowName(slot ?? 4)]})가 역할에 맞아 능력치 +10%</div>}
        </div>

        <div className="dbox">
          <h4>속성 상성</h4>
          <div className="small">
            강한 상대: {strong.map((e) => `${ELEMENT_ICON[e]}${ELEMENT_LABEL[e]}`).join(' ')} <b className="adv">(피해 ×1.3)</b>
          </div>
          <div className="small">
            약한 상대: {weak.map((e) => `${ELEMENT_ICON[e]}${ELEMENT_LABEL[e]}`).join(' ')} <b className="dis">(받는 피해 ×1.3)</b>
          </div>
        </div>

        <div className="dbox">
          <h4>스킬 (자동 사용)</h4>
          {def.skills.map((k) => (
            <div key={k.id} className={`skill-row ${k.kind}`}>
              <b>
                {k.kind === 'ultimate' ? '★ 필살기 ' : k.kind === 'active' ? '◆ 스킬 ' : '● 기본 '}
                {k.name}
              </b>
              {k.cooldown > 0 && <span className="muted small"> · {k.cooldown}초마다</span>}
              <div className="small">{k.desc}</div>
            </div>
          ))}
        </div>

        <div className="dbox">
          <h4>진화</h4>
          <div className="evo-strip">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`evo-cell ${s <= stage ? 'got' : ''}`}>
                <img src={portrait(def, s)} alt="" />
                <small>{def.stages?.[s - 1]}</small>
                <small className="muted">
                  {s === 1 ? '소환' : `Lv.${BALANCE.evolution.levelCap[s - 2]} + 같은 스피릿 ${BALANCE.evolution.copies[s - 2]}`}
                </small>
              </div>
            ))}
          </div>
          <div className="small">
            등급은 없어요. <b>같은 스피릿이 다시 소환되면</b> 진화 재료가 돼요. 모은 재료 <b>{sp.copies}</b>개
          </div>
          {need ? (
            <button className={`rank-btn evo-btn ${canEvolve(state, id) ? 'can pulse' : ''}`} disabled={!canEvolve(state, id)} onClick={() => onEvolve(id)}>
              ✨ 진화 → {(def.stages as readonly string[] | undefined)?.[stage]}{' '}
              <small>
                (Lv.{sp.level}/{need.level} · 같은 스피릿 {sp.copies}/{need.copies} · 능력치 ×{(EVO.statMul[stage] / EVO.statMul[stage - 1]).toFixed(2)}, 최대 Lv.{EVO.levelCap[stage]})
              </small>
            </button>
          ) : (
            <div className="small good">최종 진화 완료!</div>
          )}
        </div>

        <div className="dbox">
          <h4>강화</h4>
          {canLevel ? (
            <button className={`lv-btn ${can ? 'can' : ''} ${focusLevel && can ? 'pulse' : ''}`} disabled={!can} onClick={() => onLevel(id)}>
              {can ? (
                <>
                  <b>▲ 레벨업</b>
                  <span>
                    {GOLD}
                    {cost} → {POWER}+{gain}
                  </span>
                </>
              ) : (
                <>
                  <b>레벨업</b>
                  <span>{sp.level >= cap ? `Lv.${cap} 최대 — 진화하면 더 올라요` : `${GOLD}${cost} 필요`}</span>
                </>
              )}
            </button>
          ) : (
            <div className="locked-row">🔒 레벨업 — 첫 보스에 도전하면 열려요</div>
          )}
          {rc && (
            <button className={`rank-btn ${canRankUp(state, id) ? 'can' : ''}`} disabled={!canRankUp(state, id)} onClick={() => onRank(id)}>
              ★ 승급 {STONE}
              {rc.stones} {GOLD}
              {rc.gold} <small>(Lv.{rc.minLevel}+, 능력치 +12%)</small>
            </button>
          )}
          {need && (
            <div className="evo">
              <small>
                이 단계 최대 Lv.{cap} (지금 Lv.{sp.level})
              </small>
              <Bar value={sp.level} max={cap} color="#b48cff" h={5} />
            </div>
          )}
          <div className="locked-row">🔒 스킬 강화 — 준비 중</div>
          <div className="locked-row">🔒 장비 — 준비 중</div>
          <div className="locked-row">🔒 컨디션·휴식 — 준비 중</div>
        </div>
      </div>
    </div>
  );
}
