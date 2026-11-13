// 실시간 전투 화면 (D69). 옆에서 보는 전장: 왼쪽 아군, 오른쪽 적.
// 동료들은 자동으로 싸우고, 필살기 게이지가 차면 아래 초상화가 빛난다 → 눌러서 필살기!
// AUTO를 켜면 필살기도 알아서 쓴다. 속도 ×1/×2.
import { useEffect, useRef, useState } from 'react';
import { laneOf, rowOf } from '../core/board';
import { castUlt, createLive, finishLive, stepLive, ultReady, ultSensible, unitEnergy, unitHp, type BattleEvent, type BattleResult, type BattleSetup, type LiveBattle } from '../core/battle';
import { BALANCE } from '../data/balance';
import { ENEMIES } from '../data/enemies';
import { TILE_BY_ID } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { ELEMENT_COLOR, ELEMENT_ICON, enemyStage, portrait, sprite, stageName } from './art';

export interface LiveTips {
  /** 이 칸의 설명 한 줄 */
  note?: string;
  /** 필살기 사용 안내를 보여 줄지 (튜토리얼) */
  ultGuide: boolean;
}

// 세로 배치판 (D71: 처음 배치도와 같은 모양): 위쪽 3×3 헥사 = 적, 아래쪽 3×3 = 아군, 전열이 가운데에서 마주 본다.
const BW = 340;
const BH = 362;
const HR = 29;
function slotXY(slot: number, side: 'ally' | 'enemy') {
  const r = rowOf(slot);
  const l = laneOf(slot);
  return { x: 84 + l * 66 + (r % 2 ? 33 : 0), y: side === 'enemy' ? [150, 98, 46][r] : [224, 276, 328][r] };
}
/** 배치판 안의 % 위치 */
function pos(slot: number, side: 'ally' | 'enemy') {
  const p = slotXY(slot, side);
  return { x: (p.x / BW) * 100, y: (p.y / BH) * 100 };
}
function hexPts(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

export function LiveBattleView({
  tileId,
  setup,
  autoDefault,
  tips,
  onAuto,
  onDone,
}: {
  tileId: string;
  setup: BattleSetup;
  autoDefault: boolean;
  tips?: LiveTips | null;
  onAuto: (on: boolean) => void;
  onDone: (result: BattleResult) => void;
}) {
  const ref = useRef<LiveBattle>(createLive(setup, false));
  const [, setFrame] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [auto, setAuto] = useState(autoDefault);
  const [banner, setBanner] = useState<{ text: string; side: string; key: number } | null>(null);
  const [skip, setSkip] = useState(false);
  const done = useRef(false);
  const autoRef = useRef(auto);
  autoRef.current = auto;
  const b = ref.current;

  const showUlt = (ev: BattleEvent) => {
    const u = b.units.find((x) => x.snap.uid === ev.actor)!;
    setBanner({ text: `★ ${ev.skillName}`, side: u.snap.side, key: Date.now() });
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      acc += dt * (skip ? 40 : speed);
      let steps = 0;
      while (acc >= BALANCE.battle.tick && !b.outcome && steps < 400) {
        acc -= BALANCE.battle.tick;
        steps++;
        const evs = stepLive(b);
        for (const ev of evs) if (ev.skillKind === 'ultimate' && !skip) showUlt(ev);
        if (autoRef.current || skip)
          for (const u of b.units)
            if (u.snap.side === 'ally' && ultSensible(b, u.snap.uid)) {
              const ev = castUlt(b, u.snap.uid);
              if (ev && !skip) showUlt(ev);
            }
      }
      setFrame((f) => f + 1);
      if (b.outcome && !done.current) {
        done.current = true;
        setTimeout(() => onDone(finishLive(b)), skip ? 0 : 900);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed, skip]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!banner) return;
    const id = setTimeout(() => setBanner(null), 1100);
    return () => clearTimeout(id);
  }, [banner]);

  const tap = (uid: string) => {
    const ev = castUlt(b, uid);
    if (ev) {
      showUlt(ev);
      setFrame((f) => f + 1);
    }
  };

  const recent = b.events.filter((e) => e.t <= b.t && e.t > b.t - 0.8);
  const allies = b.units.filter((u) => u.snap.side === 'ally');
  const anyReady = allies.some((u) => ultReady(b, u.snap.uid));
  const tile = TILE_BY_ID[tileId];
  const unitSprite = (u: (typeof b.units)[number]) => (u.snap.side === 'ally' ? sprite(SPIRITS[u.snap.defId], u.snap.stage) : sprite(ENEMIES[u.snap.defId], enemyStage(ENEMIES[u.snap.defId], u.snap.level)));

  return (
    <div className="screen live">
      <div className="live-top">
        <b>{tile?.name}</b>
        <span className="live-time">⏱ {Math.max(0, Math.ceil(BALANCE.battle.maxTime - b.t))}</span>
        <div className="speed">
          {[1, 2].map((x) => (
            <button key={x} className={speed === x ? 'on' : ''} onClick={() => setSpeed(x)}>
              ×{x}
            </button>
          ))}
          <button
            className={`auto ${auto ? 'on' : ''}`}
            onClick={() => {
              setAuto(!auto);
              onAuto(!auto);
            }}
          >
            AUTO
          </button>
          <button onClick={() => setSkip(true)} aria-label="끝까지">
            ⏭
          </button>
        </div>
      </div>

      <div className={`stage ${banner ? `flash-${banner.side}` : ''}`}>
        <div className="board">
        <svg className="board-hex" viewBox={`0 0 ${BW} ${BH}`}>
          <rect x={0} y={186} width={BW} height={1.5} fill="#ffffff22" />
          {(['enemy', 'ally'] as const).flatMap((side) =>
            Array.from({ length: 9 }, (_, slot) => {
              const p = slotXY(slot, side);
              const u = b.units.find((x) => x.snap.side === side && x.snap.slot === slot);
              const col = u ? ELEMENT_COLOR[u.snap.element] : null;
              return <polygon key={side + slot} points={hexPts(p.x, p.y, HR)} fill={col ? col + '30' : '#ffffff08'} stroke={col ? (u!.snap.isBoss ? '#ff5a5a' : col) : '#ffffff1a'} strokeWidth={u?.snap.isBoss ? 3 : 1.5} />;
            }),
          )}
        </svg>
        {b.units.map((u) => {
          const p = pos(u.snap.slot, u.snap.side);
          const st = unitHp(b, u.snap.uid);
          const dead = st.hp <= 0;
          const acting = recent.some((e) => e.actor === u.snap.uid && e.t > b.t - 0.25);
          const hit = recent.some((e) => e.t > b.t - 0.25 && e.targets.some((x) => x.uid === u.snap.uid && x.kind === 'dmg'));
          return (
            <div
              key={u.snap.uid}
              className={`lunit ${u.snap.side} ${dead ? 'dead' : ''} ${acting ? 'acting' : ''} ${hit ? 'hit' : ''} ${u.snap.isBoss ? 'boss' : ''}`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: Math.round(p.y) }}
            >
              <div className="lhp">
                <div style={{ width: `${(st.hp / st.max) * 100}%` }} />
                {st.shield > 0 && <i style={{ width: `${Math.min(100, (st.shield / st.max) * 100)}%` }} />}
              </div>
              <img src={unitSprite(u)} alt={u.snap.name} draggable={false} />
            </div>
          );
        })}
        {recent.flatMap((e) =>
          e.targets.map((tg, i) => {
            const u = b.units.find((x) => x.snap.uid === tg.uid)!;
            const p = pos(u.snap.slot, u.snap.side);
            const age = b.t - e.t;
            const txt = tg.kind === 'dmg' ? `-${tg.amount}` : tg.kind === 'heal' && tg.amount > 0 ? `+${tg.amount}` : tg.kind === 'shield' ? '🛡' : tg.kind === 'taunt' ? '도발' : tg.kind === 'buff' ? '공↑' : tg.kind === 'debuff' ? '방↓' : '';
            if (!txt) return null;
            const strong = tg.elementMul !== undefined && tg.elementMul > 1;
            const weak = tg.kind === 'dmg' && ((tg.elementMul !== undefined && tg.elementMul < 1) || tg.resisted);
            return (
              <div
                key={`${e.t}${e.actor}${i}`}
                className={`lfloat ${tg.kind} ${strong ? 'strong' : ''} ${weak ? 'weak' : ''} ${e.skillKind === 'ultimate' ? 'ult' : ''}`}
                style={{ left: `${p.x + ((i % 3) - 1) * 3}%`, top: `calc(${p.y}% - ${36 + age * 50}px)`, opacity: 1 - age / 0.8 }}
              >
                {strong && <small>유리!</small>}
                {weak && <small>{tg.resisted ? '막힘' : '불리'}</small>}
                {txt}
              </div>
            );
          }),
        )}
        {banner && (
          <div key={banner.key} className={`ult-banner ${banner.side}`}>
            {banner.text}
          </div>
        )}
        </div>
        {tips?.note && <div className="live-note">{tips.note}</div>}
        {tips?.ultGuide && anyReady && !auto && <div className="live-guide">👇 빛나는 초상화를 눌러 <b>필살기</b>! 언제 쓰느냐가 승부를 갈라요</div>}
      </div>

      <div className="ult-bar">
        {allies.map((u) => {
          const st = unitHp(b, u.snap.uid);
          const en = unitEnergy(b, u.snap.uid);
          const ready = ultReady(b, u.snap.uid);
          const d = SPIRITS[u.snap.defId];
          const ult = d.skills.find((s) => s.kind === 'ultimate');
          return (
            <button key={u.snap.uid} className={`ult-btn ${ready ? 'ready' : ''} ${st.hp <= 0 ? 'dead' : ''}`} style={{ borderColor: ELEMENT_COLOR[d.element] }} onClick={() => tap(u.snap.uid)} disabled={!ready}>
              <img src={portrait(d, u.snap.stage)} alt="" />
              <span className="ub-el">{ELEMENT_ICON[d.element]}</span>
              <span className="ub-name">{ready ? ult?.name : stageName(d, u.snap.stage)}</span>
              <span className="ub-hp">
                <i style={{ width: `${(st.hp / st.max) * 100}%` }} />
              </span>
              <span className="ub-en">
                <i style={{ width: `${Math.min(100, en)}%` }} />
              </span>
              {ready && <span className="ub-tap">TAP!</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
