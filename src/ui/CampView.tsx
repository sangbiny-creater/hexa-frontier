// 캠프 탭: 자동 사냥 + 앞으로 열릴 시설들(자물쇠로 표시).
import { claimIdle, idleGoldPerHour, idlePreview, idleUnlocked, type GameState } from '../core/game';
import { BALANCE } from '../data/balance';
import { asset, Bar, GOLD, STONE } from './art';

type Act = <T>(fn: (s: GameState, now: number) => T) => T;

const FACILITIES = [
  { img: 'tile-heal', name: '휴식처', desc: '지친 스피릿의 컨디션을 회복해요. 컨디션이 낮으면 공격·방어가 약해져요.', lock: '준비 중 — 컨디션 시스템과 함께 열려요' },
  { img: 'tile-signpost', name: '훈련장', desc: '스피릿을 맡겨 두면 1시간 뒤 경험치를 받아요.', lock: '준비 중 — 이끼 숲 돌파 후' },
  { img: 'tile-crystal', name: '탐사대', desc: '발견한 자원 칸에 보내 2시간 동안 골드·성장석을 모아요.', lock: '준비 중 — 이끼 숲 돌파 후' },
  { img: 'tile-ruins', name: '유적 조사', desc: '4~24시간 장기 파견으로 희귀 재료와 소환석을 얻어요.', lock: '준비 중 — 다음 지역' },
  { img: 'tile-shop', name: '상점', desc: '골드로 성장석·소환석을 교환해요.', lock: '준비 중' },
  { img: 'tile-portal', name: '진화의 제단', desc: '조각을 모아 특별한 진화를 해요.', lock: '준비 중' },
];

export function CampView({ state, now, act, toast }: { state: GameState; now: number; act: Act; toast: (m: string) => void }) {
  const open = idleUnlocked(state);
  const p = idlePreview(state, now);
  return (
    <div className="page">
      <h2 className="sec">캠프</h2>
      <div className={`fac big ${open ? '' : 'locked'}`}>
        <img src={asset('tile-camp')} alt="" />
        <div className="fac-body">
          <b>자동 사냥</b>
          <div className="small">게임을 꺼 둬도 동료들이 사냥해서 {GOLD}골드를 모아요. 탐험한 칸이 많을수록 더 벌어요. (최대 {BALANCE.idle.capHours}시간)</div>
          {open ? (
            <>
              <div className="small">
                시간당 {GOLD} <b>{idleGoldPerHour(state)}</b> · 쌓인 보상 {GOLD} <b>{p.gold}</b>
                {p.stones > 0 && (
                  <>
                    {' '}
                    {STONE} <b>{p.stones}</b>
                  </>
                )}
              </div>
              <Bar value={p.hours} max={BALANCE.idle.capHours} color="#b48cff" h={6} />
              <button
                className="cta small-cta"
                disabled={p.gold === 0 && p.stones === 0}
                onClick={() => {
                  const r = act((s, t) => claimIdle(s, t));
                  toast(`자동 사냥 보상 ${GOLD}${r.gold}${r.stones ? ` ${STONE}${r.stones}` : ''}`);
                }}
              >
                받기
              </button>
            </>
          ) : (
            <div className="lock-line">🔒 고목 골렘을 쓰러뜨리면 열려요</div>
          )}
        </div>
      </div>
      {FACILITIES.map((f) => (
        <div key={f.name} className="fac locked">
          <img src={asset(f.img)} alt="" />
          <div className="fac-body">
            <b>{f.name}</b>
            <div className="small">{f.desc}</div>
            <div className="lock-line">🔒 {f.lock}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
