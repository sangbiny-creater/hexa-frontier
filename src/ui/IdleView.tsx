// 자동 사냥(방치 보상): 게임을 꺼 둬도 골드가 쌓인다.
import { claimIdle, idleGoldPerHour, idlePreview, type GameState } from '../core/game';
import { BALANCE } from '../data/balance';
import { asset, Bar, GOLD, STONE } from './art';

type Act = <T>(fn: (s: GameState, now: number) => T) => T;

export function IdleView({ state, now, act, toast }: { state: GameState; now: number; act: Act; toast: (m: string) => void }) {
  const p = idlePreview(state, now);
  const rate = idleGoldPerHour(state);
  return (
    <div className="page idle-page">
      <img className="camp" src={asset('tile-camp')} alt="" />
      <img className="camp-hero" src={asset('hero-t')} alt="" />
      <h2>자동 사냥</h2>
      <p className="explain">
        게임을 꺼 둬도 동료들이 사냥해서 {GOLD}골드를 모아요. 탐험한 칸이 많을수록 더 많이 벌어요. 최대 {BALANCE.idle.capHours}시간까지 쌓여요.
      </p>
      <div className="idle-rate">
        시간당 {GOLD} <b>{rate}</b>
      </div>
      <div className="idle-box">
        <div className="idle-amount">
          {GOLD} {p.gold}
          {p.stones > 0 && (
            <span>
              {' '}
              {STONE} {p.stones}
            </span>
          )}
        </div>
        <Bar value={p.hours} max={BALANCE.idle.capHours} color="#b48cff" h={10} />
        <div className="muted small">
          {p.hours.toFixed(1)}시간 / {BALANCE.idle.capHours}시간 쌓임
        </div>
        <button
          className="cta"
          disabled={p.gold === 0 && p.stones === 0}
          onClick={() => {
            const r = act((s, t) => claimIdle(s, t));
            toast(`자동 사냥 보상 ${GOLD}${r.gold}${r.stones ? ` ${STONE}${r.stones}` : ''}`);
          }}
        >
          받기
        </button>
      </div>
    </div>
  );
}
