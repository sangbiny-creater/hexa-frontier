import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActionId } from '../core/analysis';
import { ROW_LABEL, laneOf, rowOf } from '../core/board';
import type { BattleEvent, UnitSnapshot } from '../core/battle';
import type { BattleOutcome } from '../core/game';
import { hexCorners } from '../core/hex';
import { ENCOUNTERS } from '../data/enemies';
import { SPIRITS } from '../data/spirits';
import { ELEMENT_COLOR } from './common';

const W = 760;
const H = 330;
const R = 34;
const COL = 64;
const LANE = 74;

function unitPos(u: UnitSnapshot) {
  const r = rowOf(u.slot);
  const l = laneOf(u.slot);
  const dir = u.side === 'ally' ? 1 : -1;
  const x = W / 2 + dir * (70 + r * COL);
  const y = 70 + l * LANE + (r % 2 === 1 ? LANE / 2 : 0);
  return { x, y };
}

interface Timeline {
  t: number;
  hp: number;
  shield: number;
}

export interface BattleTips {
  battle: boolean;
  win: boolean;
  defeat: boolean;
}

export function BattleView({
  outcome,
  onClose,
  onAction,
  tips,
}: {
  outcome: BattleOutcome;
  onClose: () => void;
  onAction: (id: ActionId) => void;
  tips?: BattleTips | null;
}) {
  const { result } = outcome;
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [done, setDone] = useState(false);
  const raf = useRef<number>(0);

  const timelines = useMemo(() => {
    const m: Record<string, Timeline[]> = {};
    for (const u of result.units) m[u.uid] = [{ t: 0, hp: u.maxHp, shield: 0 }];
    for (const e of result.events) for (const tg of e.targets) m[tg.uid].push({ t: e.t, hp: tg.hp, shield: tg.shield });
    return m;
  }, [result]);

  useEffect(() => {
    if (done) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((prev) => {
        const nt = prev + dt * speed;
        if (nt >= result.duration + 0.6) {
          setDone(true);
          return result.duration + 0.6;
        }
        return nt;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [speed, done, result.duration]);

  const stateAt = (uid: string) => {
    const tl = timelines[uid];
    let cur = tl[0];
    for (const p of tl) {
      if (p.t > t) break;
      cur = p;
    }
    return cur;
  };

  const recent: BattleEvent[] = result.events.filter((e) => e.t <= t && e.t > t - 0.7);
  const recentSkills = result.events.filter((e) => e.t <= t && e.t > t - 1.2 && e.skillKind !== 'basic');
  const enc = ENCOUNTERS[outcome.encounterId];
  const log = result.events.filter((e) => e.t <= t && e.skillKind !== 'basic').slice(-5).reverse();
  const nameOf = (uid: string) => result.units.find((u) => u.uid === uid)?.name ?? uid;

  return (
    <div className="modal-backdrop">
      <div className="battle">
        <div className="battle-head">
          <div>
            <b>{enc?.name ?? '전투'}</b>
            {enc?.bossKind && <span className="boss-tag">{enc.bossKind === 'region' ? '지역 보스' : '보스'}</span>}
            <span className="muted"> · 시드 {result.seed}</span>
          </div>
          <div className="battle-clock">
            {Math.min(t, result.duration).toFixed(1)}초
            {!done && (
              <>
                {[1, 2, 4].map((s) => (
                  <button key={s} className={speed === s ? 'on' : ''} onClick={() => setSpeed(s)}>
                    ×{s}
                  </button>
                ))}
                <button onClick={() => (setT(result.duration + 0.6), setDone(true))}>건너뛰기</button>
              </>
            )}
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="battle-board">
          <text x={W / 2 - 70 - COL * 2} y={22} className="side-label" textAnchor="middle">
            적
          </text>
          <text x={W / 2 + 70 + COL * 2} y={22} className="side-label" textAnchor="middle">
            아군
          </text>
          {(['ally', 'enemy'] as const).map((side) =>
            Array.from({ length: 9 }, (_, slot) => {
              const p = unitPos({ side, slot } as UnitSnapshot);
              return <polygon key={side + slot} points={hexCorners(p.x, p.y, R)} className="slot" />;
            }),
          )}
          {(['front', 'mid', 'back'] as const).map((row, r) => (
            <text key={row} x={W / 2 + 70 + r * COL} y={H - 8} textAnchor="middle" className="row-label">
              {ROW_LABEL[row]}
            </text>
          ))}
          {result.units.map((u) => {
            const p = unitPos(u);
            const st = stateAt(u.uid);
            const dead = st.hp <= 0;
            const acting = recent.some((e) => e.actor === u.uid);
            const color = ELEMENT_COLOR[u.element];
            return (
              <g key={u.uid} opacity={dead ? 0.25 : 1} className={acting ? 'acting' : ''}>
                <polygon points={hexCorners(p.x, p.y, R - 3)} fill={color + '33'} stroke={color} strokeWidth={u.isBoss ? 4 : 2} />
                <text x={p.x} y={p.y + 2} textAnchor="middle" className="unit-name" fill="#fff">
                  {u.name.length > 5 ? u.name.slice(0, 5) : u.name}
                </text>
                <text x={p.x} y={p.y + 15} textAnchor="middle" className="unit-lv">
                  Lv{u.level}
                </text>
                <rect x={p.x - 26} y={p.y - 30} width={52} height={5} rx={2} fill="#0008" />
                <rect x={p.x - 26} y={p.y - 30} width={(52 * Math.max(0, st.hp)) / u.maxHp} height={5} rx={2} fill={u.side === 'ally' ? '#6fdc8c' : '#ff6b6b'} />
                {st.shield > 0 && <rect x={p.x - 26} y={p.y - 35} width={Math.min(52, (52 * st.shield) / u.maxHp)} height={3} rx={1} fill="#9ad7ff" />}
              </g>
            );
          })}
          {recent.flatMap((e) =>
            e.targets.map((tg, i) => {
              const u = result.units.find((x) => x.uid === tg.uid)!;
              const p = unitPos(u);
              const age = t - e.t;
              const txt = tg.kind === 'dmg' ? `-${tg.amount}` : tg.kind === 'heal' ? `+${tg.amount}` : tg.kind === 'shield' ? '보호막' : tg.kind === 'taunt' ? '도발' : tg.kind === 'buff' ? '공격↑' : '';
              if (!txt || (tg.kind === 'heal' && tg.amount === 0)) return null;
              const cls = `float ${tg.kind}${tg.elementMul && tg.elementMul > 1 ? ' strong' : ''}${tg.elementMul && tg.elementMul < 1 ? ' weak' : ''}`;
              return (
                <text key={`${e.t}-${e.actor}-${i}`} x={p.x + ((i % 3) - 1) * 8} y={p.y - 48 - age * 30} textAnchor="middle" className={cls} opacity={1 - age / 0.7}>
                  {txt}
                </text>
              );
            }),
          )}
          {recentSkills.map((e) => {
            const u = result.units.find((x) => x.uid === e.actor)!;
            const p = unitPos(u);
            return (
              <text key={`s${e.t}${e.actor}`} x={p.x} y={p.y - 38} textAnchor="middle" className={`skill-call ${e.skillKind}`}>
                {e.skillKind === 'ultimate' ? '★ ' : ''}
                {e.skillName}
              </text>
            );
          })}
        </svg>
        {tips?.battle && !done && (
          <div className="battle-tip">
            <b>헥시:</b> 스피릿은 자기 칸을 지키며 속도에 따라 행동해. <span className="c-active">파란 글씨</span>는 스킬,{' '}
            <span className="c-ult">★노란 글씨</span>는 필살기야. 전부 알아서 쓰니까 지켜보기만 해! 빨리 보고 싶으면 [건너뛰기].
          </div>
        )}
        <div className="battle-log">
          {log.map((e) => (
            <div key={`${e.t}${e.actor}`}>
              <span className="muted">{e.t.toFixed(1)}s</span> {nameOf(e.actor)} — <b>{e.skillName}</b>
            </div>
          ))}
        </div>
        {done && <ResultPanel outcome={outcome} onClose={onClose} onAction={onAction} tips={tips} />}
      </div>
    </div>
  );
}

function ResultPanel({ outcome, onClose, onAction, tips }: { outcome: BattleOutcome; onClose: () => void; onAction: (id: ActionId) => void; tips?: BattleTips | null }) {
  const { won, rewards, analysis, conditionChanges, newInjuries, unlockedText } = outcome;
  return (
    <div className={`result ${won ? 'win' : 'lose'}`}>
      {won ? (
        <>
          <h2>승리!</h2>
          {tips?.win && <div className="battle-tip">헥시: 이기면 <b>경험치·골드·성장석</b>을 얻어. 경험치가 차면 레벨 업! 성장석과 골드는 나중에 '승급'에 써.</div>}
          <div className="reward-row">
            <span>💰 {rewards.gold} 골드</span>
            {rewards.stones > 0 && <span>🔷 성장석 {rewards.stones}</span>}
            {outcome.firstClear && <span className="first">첫 클리어 보너스</span>}
          </div>
          <div className="xp-list">
            {Object.entries(rewards.xp).map(([id, xp]) => (
              <span key={id}>
                {SPIRITS[id].name} +{xp} XP{rewards.levelUps[id] ? <b className="lvup"> 레벨 업!</b> : null}
              </span>
            ))}
          </div>
          {unlockedText.map((u) => (
            <div key={u} className="unlock">
              🔓 {u}
            </div>
          ))}
          {(Object.keys(conditionChanges).length > 0 || newInjuries.length > 0) && <ConditionNote changes={conditionChanges} injuries={newInjuries} />}
          <button className="primary" onClick={onClose}>
            계속
          </button>
        </>
      ) : (
        analysis && (
          <>
            <h2>{analysis.nearMiss ? `아깝다! 적 HP ${analysis.enemyHpPct}% 남음` : '패배'}</h2>
            {tips?.defeat ? (
              <div className="battle-tip">
                헥시: 졌지만 괜찮아! 지는 것도 이 게임의 일부야. 여기서 <b>왜 졌는지</b>와 <b>이기는 방법</b>을 알려 줘. 아래 빛나는 버튼 중 하나를 골라 봐.
              </div>
            ) : (
              <p className="muted">패배해도 경험치 일부를 얻었습니다. 무엇이 부족했는지 확인하고 다음 방법을 고르세요.</p>
            )}
            <div className="reasons">
              {analysis.reasons.map((r) => (
                <div key={r.tag} className="reason">
                  <b>{r.label}</b> <span>{r.detail}</span>
                </div>
              ))}
            </div>
            <ul className="facts">
              {analysis.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <ConditionNote changes={conditionChanges} injuries={newInjuries} />
            <div className={`actions ${tips?.defeat ? 'tut-focus-group' : ''}`}>
              {analysis.actions.map((a) => (
                <button key={a.id} onClick={() => onAction(a.id)} title={a.why}>
                  <b>{a.label}</b>
                  <small>{a.why}</small>
                </button>
              ))}
            </div>
            <button className="ghost" onClick={onClose}>
              닫기
            </button>
          </>
        )
      )}
    </div>
  );
}

function ConditionNote({ changes, injuries }: { changes: Record<string, number>; injuries: string[] }) {
  const entries = Object.entries(changes);
  if (!entries.length && !injuries.length) return null;
  return (
    <div className="cond-note">
      {entries.map(([id, d]) => (
        <span key={id}>
          {SPIRITS[id].name} 컨디션 {d}
        </span>
      ))}
      {injuries.map((id) => (
        <span key={id} className="inj">
          {SPIRITS[id].name} 경상 (공격 -5%)
        </span>
      ))}
    </div>
  );
}

