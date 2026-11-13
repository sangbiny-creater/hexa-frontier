// 세로 전투 화면: 위쪽이 적, 아래쪽이 아군. 각 유닛은 헥스 스프라이트로 표시.
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActionId } from '../core/analysis';
import { laneOf, rowOf } from '../core/board';
import type { BattleEvent, UnitSnapshot } from '../core/battle';
import type { BattleOutcome } from '../core/game';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { TILE_BY_ID } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { enemyStage, GOLD, POWER, sprite, STONE } from './art';

export interface BattleTips {
  battle: boolean;
  win: boolean;
  defeat: boolean;
  note?: string;
}

function unitPos(u: UnitSnapshot) {
  const r = rowOf(u.slot);
  const l = laneOf(u.slot);
  const x = (r % 2 ? [38, 62, 86] : [24, 48, 72])[l];
  const y = u.side === 'ally' ? [60, 73, 86][r] : [38, 25, 12][r];
  return { x, y };
}

function unitSprite(u: UnitSnapshot) {
  if (u.side === 'ally') return sprite(SPIRITS[u.defId], u.stage);
  const def = ENEMIES[u.defId];
  return sprite(def, enemyStage(def, u.level));
}

interface Tl {
  t: number;
  hp: number;
  shield: number;
}

export function BattleView({
  outcome,
  onClose,
  onAction,
  tips,
  instant,
}: {
  outcome: BattleOutcome;
  /** 바로 결과 보기 (D61) */
  instant?: boolean;
  onClose: () => void;
  onAction: (id: ActionId, tileId?: string) => void;
  tips?: BattleTips | null;
}) {
  const { result } = outcome;
  const enc = ENCOUNTERS[outcome.encounterId];
  const end = result.duration + 0.8;
  const [t, setT] = useState(instant ? end : 0);
  const [speed, setSpeed] = useState(2);
  const [done, setDone] = useState(!!instant);
  const raf = useRef(0);

  const timelines = useMemo(() => {
    const m: Record<string, Tl[]> = {};
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
      setT((p) => {
        const n = p + dt * speed;
        if (n >= end) {
          setDone(true);
          return end;
        }
        return n;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [speed, done, end]);

  const at = (uid: string) => {
    let cur = timelines[uid][0];
    for (const p of timelines[uid]) {
      if (p.t > t) break;
      cur = p;
    }
    return cur;
  };
  const recent: BattleEvent[] = result.events.filter((e) => e.t <= t && e.t > t - 0.7);
  const calls = result.events.filter((e) => e.t <= t && e.t > t - 1.1 && e.skillKind !== 'basic');
  const unit = (uid: string) => result.units.find((u) => u.uid === uid)!;

  return (
    <div className="screen battle-screen">
      <div className="battle-top">
        <div>
          <b>{TILE_BY_ID[outcome.tileId]?.name ?? enc.name}</b> {enc.bossKind && <span className="boss-badge">BOSS</span>}
        </div>
        {!done && (
          <div className="speed">
            {[1, 2, 4].map((s) => (
              <button key={s} className={speed === s ? 'on' : ''} onClick={() => setSpeed(s)}>
                ×{s}
              </button>
            ))}
            <button onClick={() => (setT(end), setDone(true))}>⏭</button>
          </div>
        )}
      </div>
      <div className="arena">
        <div className="arena-label enemy">적</div>
        <div className="arena-label ally">아군</div>
        <div className="arena-mid" />
        {result.units.map((u) => {
          const p = unitPos(u);
          const st = at(u.uid);
          const dead = st.hp <= 0;
          const acting = recent.some((e) => e.actor === u.uid);
          const hit = recent.some((e) => e.targets.some((x) => x.uid === u.uid && x.kind === 'dmg'));
          return (
            <div
              key={u.uid}
              className={`unit ${u.side} ${dead ? 'dead' : ''} ${acting ? 'acting' : ''} ${hit ? 'hit' : ''} ${u.isBoss ? 'boss' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <div className="hpbar">
                <div className="hp" style={{ width: `${(Math.max(0, st.hp) / u.maxHp) * 100}%` }} />
                {st.shield > 0 && <div className="sh" style={{ width: `${Math.min(100, (st.shield / u.maxHp) * 100)}%` }} />}
              </div>
              <img src={unitSprite(u)} alt={u.name} draggable={false} />
            </div>
          );
        })}
        {recent.flatMap((e) =>
          e.targets.map((tg, i) => {
            const p = unitPos(unit(tg.uid));
            const age = t - e.t;
            const txt = tg.kind === 'dmg' ? `-${tg.amount}` : tg.kind === 'heal' && tg.amount > 0 ? `+${tg.amount}` : tg.kind === 'shield' ? '🛡' : tg.kind === 'taunt' ? '도발!' : tg.kind === 'buff' ? '공격↑' : '';
            if (!txt) return null;
            const strong = tg.elementMul && tg.elementMul > 1;
            const weak = tg.kind === 'dmg' && tg.elementMul !== undefined && tg.elementMul < 1;
            const blocked = tg.kind === 'dmg' && tg.resisted;
            return (
              <div
                key={`${e.t}${e.actor}${i}`}
                className={`float ${tg.kind} ${strong ? 'strong' : ''} ${weak || blocked ? 'weak' : ''}`}
                style={{ left: `${p.x + ((i % 3) - 1) * 4}%`, top: `calc(${p.y}% - ${30 + age * 40}px)`, opacity: 1 - age / 0.7 }}
              >
                {strong && <small className="ftag">유리!</small>}
                {weak && <small className="ftag">불리</small>}
                {blocked && <small className="ftag">막힘</small>}
                {txt}
              </div>
            );
          }),
        )}
        {calls.map((e) => {
          const p = unitPos(unit(e.actor));
          return (
            <div key={`c${e.t}${e.actor}`} className={`skill-call ${e.skillKind}`} style={{ left: `${p.x}%`, top: `calc(${p.y}% + 34px)` }}>
              {e.skillKind === 'ultimate' ? '★ ' : ''}
              {e.skillName}
            </div>
          );
        })}
      </div>
      {tips?.note && !done && <div className="tip element-tip">{tips.note}</div>}
      {tips?.battle && !tips?.note && !done && (
        <div className="tip">
          스피릿들이 <b>알아서</b> 싸워요. 파란 글씨는 스킬, <b className="gold">★노란 글씨</b>는 필살기! 빨리 보려면 ⏭
        </div>
      )}
      {done && <Result outcome={outcome} onClose={onClose} onAction={onAction} tips={tips} />}
    </div>
  );
}

export function Result({ outcome, onClose, onAction, tips }: { outcome: BattleOutcome; onClose: () => void; onAction: (id: ActionId, tileId?: string) => void; tips?: BattleTips | null }) {
  const { won, rewards, analysis, unlockedText } = outcome;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    // 골드 숫자가 차오르는 연출
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(rewards.gold, v + Math.max(1, Math.ceil(rewards.gold / 20)));
      setShown(v);
      if (v >= rewards.gold) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [rewards.gold]);

  if (won) {
    return (
      <div className="result win">
        <div className="result-title">VICTORY</div>
        <div className="loot">
          <div className="loot-item">
            <span className="big">{GOLD}</span>
            <b>+{shown}</b>
          </div>
          {rewards.stones > 0 && (
            <div className="loot-item">
              <span className="big">{STONE}</span>
              <b>+{rewards.stones}</b>
            </div>
          )}
        </div>
        {outcome.firstClear && <div className="first">첫 승리 보너스!</div>}
        {tips?.win && <div className="tip inline">이긴 칸 위쪽으로 길이 열려요. 골드는 나중에 스피릿을 강하게 만드는 데 써요.</div>}
        {unlockedText.map((u) => (
          <div key={u} className="unlock">
            🔓 {u}
          </div>
        ))}
        <button className="cta" onClick={onClose}>
          계속
        </button>
      </div>
    );
  }
  if (!analysis) return null;
  return (
    <div className="result lose">
      <div className="result-title">{analysis.nearMiss ? '아깝다!' : 'DEFEAT'}</div>
      <div className="muted">적 체력 {analysis.enemyHpPct}% 남음</div>
      <div className="compare">
        <div>
          <small>내 전투력(상성 보정)</small>
          <b className={analysis.teamPower >= analysis.recommended ? 'good' : 'bad'}>
            {POWER} {analysis.teamPower}
          </b>
        </div>
        <div className="vs">vs</div>
        <div>
          <small>권장 전투력</small>
          <b>
            {POWER} {analysis.recommended}
          </b>
        </div>
      </div>
      {analysis.teamPower < analysis.recommended && (
        <div className="need">
          전투력이 <b>{analysis.recommended - analysis.teamPower}</b> 부족해요
        </div>
      )}
      {tips?.defeat && <div className="tip inline">괜찮아요! 지면 이유를 알려 줘요. 아래 버튼을 누르면 바로 해결하러 가요.</div>}
      {rewards.gold > 0 && (
        <div className="muted small">
          진 전투에서도 {GOLD} {rewards.gold}
        </div>
      )}
      <div className="fix-list">
        {analysis.actions.map((a) => (
          <button key={a.id} className={`fix ${tips?.defeat ? 'pulse' : ''}`} onClick={() => onAction(a.id, a.tileId)}>
            <b>{a.label}</b>
            <small>{a.why}</small>
          </button>
        ))}
      </div>
      <button className="ghost" onClick={onClose}>
        지도로
      </button>
    </div>
  );
}
