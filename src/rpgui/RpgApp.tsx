// HEXA FRONTIER RPG 화면 (D72~D86)
// 스테이지 선택 → 스테이지: 헥사를 누르면 그곳까지 한 칸씩 걸어간다(한 칸 = 한 턴, 몬스터도 같이 움직임).
// 가는 길에 몬스터가 막거나 붙으면 자동으로 싸우고, 다 싸우면 남은 길을 계속 간다. 목표가 없고 붙은 적도 없으면 시간이 멈춘다.
import { useCallback, useEffect, useRef, useState } from 'react';
import { EL_COLOR, EL_ICON, EL_NAME, ELEMENTS, HEROES, MONSTERS, SPIRITS } from '../rpg/data';
import {
  autoAct,
  buy,
  engaged,
  equip,
  equipBest,
  heroStats,
  itemScore,
  learnNode,
  leaveStage,
  monAt,
  move,
  nearestTarget,
  onCamp,
  pathTo,
  sellItem,
  skillOf,
  spendSpiritPoint,
  stageInfo,
  startStage,
  stepToward,
  unequip,
  unlockedStage,
  usePotion,
  useSkill,
  xpToNext,
  type Fx,
  type RpgState,
} from '../rpg/game';
import { activate, active, dist, isFloor, LAYOUT_NAME, STAGES, step, type Dir } from '../rpg/world';
import { EquipPanel, Popup, ShopPanel, SpiritPanel, TreePanel, type Panel } from './Panels';
import { useRpg } from './store';
import { HexPad } from './HexPad';
import { ROW_H, WorldView } from './WorldView';

const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;
const TICK_MS = 280; // 한 턴(한 걸음·한 번 공격)의 화면 속도
// 각 방향의 화면 각도(0 = 오른쪽, 반시계). 세로 화면: 지도가 아래→위로 나아간다.
const DIR_DEG: [Dir, number][] = [
  ['E', 0],
  ['NE', 60],
  ['NW', 120],
  ['W', 180],
  ['SW', 240],
  ['SE', 300],
];
/** 이동 버튼 각도 → 갈 수 있는 방향 (바위면 바로 옆 방향으로 비켜 간다) */
function dirFromAngle(s: RpgState, deg: number): Dir | null {
  const diff = (a: number) => Math.min(Math.abs(a - deg), 360 - Math.abs(a - deg));
  for (const [d, a] of [...DIR_DEG].sort((x, y) => diff(x[1]) - diff(y[1]))) {
    if (diff(a) > 60) break;
    const t = step(s.pos.c, s.pos.r, d);
    if (isFloor(t.c, t.r)) return d;
  }
  return null;
}

export function RpgApp() {
  const { state, act, reset, hasSave } = useRpg();
  activate(state.stage);
  const [started, setStarted] = useState(false);
  const [fx, setFx] = useState<Fx[]>([]);
  const [fxKey, setFxKey] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [popup, setPopup] = useState<Fx[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [goal, setGoal] = useState<{ c: number; r: number } | null>(null);
  const padRef = useRef<number | null>(null);
  const [tutSeen, setTutSeen] = useState(-1);
  const goalRef = useRef(goal);
  goalRef.current = goal;
  const stateRef = useRef(state);
  stateRef.current = state;
  const hero = HEROES.knight;
  const hs = heroStats(state);
  const h = state.heroes.knight;
  const blockedUi = !!panel || popup.length > 0 || state.stageClear || !state.inStage || (!!TUT[state.tut] && tutSeen !== state.tut);
  const blockedRef = useRef(blockedUi);
  blockedRef.current = blockedUi;

  const show = useCallback((list: Fx[]) => {
    setFx(list);
    setFxKey((k) => k + 1);
    const big = list.filter((f) => f.k === 'spirit' || f.k === 'boss' || f.k === 'death');
    const lv = list.find((f) => f.k === 'levelup');
    if (big.length) {
      setPopup((p) => [...p, ...big]);
      if (list.some((f) => f.k === 'death' || f.k === 'spirit')) setGoal(null);
    }
    const drop = list.find((f) => f.k === 'drop');
    const down = list.find((f) => f.k === 'petDown');
    if (lv && lv.k === 'levelup') setToast(`⬆ 레벨 업! ${lv.level}레벨 — 🌳테크트리 포인트 +1`);
    else if (list.some((f) => f.k === 'swarm')) setToast('⚠ 머뭇거리는 사이 몬스터 무리가 몰려와요!');
    else if (down && down.k === 'petDown') setToast(`${EL_ICON[down.element]} ${SPIRITS[down.element].name} 쓰러짐 — 🏕야영지에서 부활`);
    else if (drop && drop.k === 'drop') setToast(`🎁 ${drop.item.name} 획득!`);
    else if (list.some((f) => f.k === 'point')) setToast('✨ 스피릿 포인트 +1');
    else if (list.some((f) => f.k === 'camp')) setToast('🏕 모두 회복! (15턴 뒤 다시)');
    else {
      const m = list.find((f) => f.k === 'msg');
      if (m && m.k === 'msg' && !big.length && !list.some((f) => f.k === 'dmg')) setToast(m.text);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  // 게임 진행: 붙은 적이 있으면 싸우고, 아니면 목표를 향해 한 걸음
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      if (blockedRef.current) return;
      const s = stateRef.current;
      if (padRef.current !== null) return; // 이동 버튼을 누르고 있는 동안은 버튼 쪽 박자로 걷는다
      if (engaged(s)) {
        const r = act((x) => autoAct(x));
        if (r) return show(r);
      }
      const g = goalRef.current;
      if (!g) return;
      if (s.pos.c === g.c && s.pos.r === g.r) return setGoal(null);
      const d = stepToward(s, g);
      if (!d) {
        setGoal(null);
        return setToast('갈 수 없는 곳이에요');
      }
      const r = act((x) => move(x, d));
      show(r);
      const after = stateRef.current;
      // 목표가 몬스터였다면 그 몬스터가 쓰러지면 끝
      if (monAt(s, g.c, g.r) && !monAt(after, g.c, g.r)) setGoal(null);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [started, act, show]);

  // 이동 버튼: 누르는 순간 한 걸음, 누르고 있으면 한 턴마다 한 걸음 (몬스터 쪽이면 공격)
  const padStep = () => {
    const s = stateRef.current;
    const deg = padRef.current;
    if (deg === null || blockedRef.current) return;
    const d = dirFromAngle(s, deg);
    if (!d) return;
    show(act((x) => move(x, d)));
  };
  const padTimer = useRef(0);
  const onPad = (deg: number | null) => {
    const was = padRef.current;
    padRef.current = deg;
    if (deg === null) {
      clearInterval(padTimer.current);
      padTimer.current = 0;
      return;
    }
    setGoal(null);
    setPan({ x: 0, y: 0 });
    // 누르는 순간 바로 한 걸음, 그 뒤로는 누른 때부터 한 턴 박자로 계속
    if (was === null) {
      padStep();
      clearInterval(padTimer.current);
      padTimer.current = window.setInterval(padStep, TICK_MS);
    }
  };
  useEffect(() => () => clearInterval(padTimer.current), []);

  // 주인공을 잡고 끌기: 손가락이 있는 칸이 계속 목표가 된다(손을 떼면 그 칸까지 마저 걷는다)
  const onSteer = (cell: { c: number; r: number } | null) => {
    if (!cell || blockedRef.current) return;
    const s = stateRef.current;
    if (cell.c === s.pos.c && cell.r === s.pos.r) return setGoal(null);
    if (!isFloor(cell.c, cell.r)) return;
    setPan({ x: 0, y: 0 });
    setGoal(cell);
  };

  // 튜토리얼
  useEffect(() => {
    const st = TUT[state.tut];
    if (st && state.inStage && st.done(state)) act((s) => void (s.tut += 1));
  }, [state, act]);

  // 상황 안내(체력 위험·출구 열림 등)는 바뀔 때 한 번만 짧게 알림으로
  const tipNow = state.inStage && !TUT[state.tut] ? tipFor(state) : null;
  useEffect(() => {
    if (tipNow) setToast(tipNow);
  }, [tipNow]);

  const tapCell = (c: number, r: number) => {
    if (blockedUi) return;
    if (!isFloor(c, r)) return setToast('바위라 갈 수 없어요');
    if (c === state.pos.c && r === state.pos.r) return setGoal(null);
    setPan({ x: 0, y: 0 });
    setGoal({ c, r });
  };
  const doSkill = (i: number) => {
    if (blockedUi) return;
    const r = act((s) => useSkill(s, i));
    show(r);
    const m = r.find((f) => f.k === 'msg');
    if (r.length === 1 && m && m.k === 'msg') setToast(m.text);
  };

  if (!started)
    return (
      <div className="rpg intro-screen">
        <img className="intro-hero" src={img('hero-t')} alt="" />
        <div className="intro-logo">
          헥사 <span>프론티어</span>
        </div>
        <div className="intro-sub">헥사 들판을 누비는 사냥 모험</div>
        <ul className="intro-list">
          <li>🕹 오른쪽 아래 이동 버튼을 누르고 있으면 걸어요. 헥사를 톡 눌러도 그곳까지 가요</li>
          <li>⚔️ 몬스터가 붙으면 저절로 싸워요. 멈춰 있으면 시간도 멈춰요</li>
          <li>🪨 장애물을 이용해 길목에서 싸우고, 넓은 곳에선 포위 조심</li>
          <li>🌳 기술 테크트리 + ✨어떤 스피릿을 키우느냐로 성장</li>
        </ul>
        <button className="cta" onClick={() => setStarted(true)}>
          {hasSave ? '이어서 하기' : '모험 시작'}
        </button>
        {hasSave && (
          <button
            className="ghost"
            onClick={() => {
              if (confirm('처음부터 다시 시작할까요?')) {
                reset();
                setStarted(true);
              }
            }}
          >
            처음부터
          </button>
        )}
      </div>
    );

  const panels = (
    <>
      {panel === 'tree' && (
        <TreePanel
          state={state}
          onClose={() => setPanel(null)}
          onLearn={(id) => {
            const e = act((s) => learnNode(s, id));
            if (e) setToast(e);
          }}
        />
      )}
      {panel === 'spirit' && (
        <SpiritPanel
          state={state}
          onClose={() => setPanel(null)}
          onSpend={(el) => {
            const e = act((s) => spendSpiritPoint(s, el));
            if (e) setToast(e);
          }}
        />
      )}
      {panel === 'equip' && (
        <EquipPanel
          state={state}
          onClose={() => setPanel(null)}
          onEquip={(uid) => act((s) => equip(s, uid))}
          onBest={() => {
            const n = act((s) => equipBest(s));
            setToast(n ? `✨ 장비 ${n}개를 더 좋은 것으로 바꿨어요` : '이미 가장 좋은 장비예요');
          }}
          onUnequip={(slot) => act((s) => unequip(s, slot))}
          onSell={(uid) => {
            const g = act((s) => sellItem(s, uid));
            setToast(`판매: 🪙 +${g}`);
          }}
        />
      )}
      {panel === 'shop' && (
        <ShopPanel
          state={state}
          onClose={() => setPanel(null)}
          onBuy={(it) => {
            const r = act((s) => buy(s, it));
            if ('error' in r) setToast(r.error);
            else setToast(r.item ? `🎁 ${r.item.name}!` : '구매했어요');
          }}
        />
      )}
      {toast && <div className="rtoast top">{toast}</div>}
    </>
  );

  const better = state.bag.some((it) => itemScore(it) > itemScore(h.gear[it.slot]));
  const shopOk = !state.inStage || onCamp(state);
  const menu = (
    <nav className="rmenu2">
      <button onClick={() => setPanel('tree')}>
        <span>🌳</span>테크트리{h.skillPts > 0 && <i className="dot">{h.skillPts}</i>}
      </button>
      <button onClick={() => setPanel('spirit')}>
        <span>✨</span>스피릿{state.spiritPoints > 0 && <i className="dot">{state.spiritPoints}</i>}
      </button>
      <button onClick={() => setPanel('equip')}>
        <span>🛡</span>장비{better && <i className="dot">!</i>}
      </button>
      <button onClick={() => (shopOk ? setPanel('shop') : setToast('상점은 🏕야영지 위나 스테이지 목록에서 열려요'))} className={shopOk ? '' : 'dim'}>
        <span>🏪</span>상점
      </button>
    </nav>
  );

  // ── 스테이지 선택 ──
  if (!state.inStage) {
    const open = unlockedStage(state);
    return (
      <div className="rpg">
        <header className="rhud">
          <div className="rhud-face">
            <img src={img('hero-p')} alt="" />
            <b>{h.level}레벨</b>
          </div>
          <div className="rhud-bars">
            <div className="rhud-name">{hero.name} · 스테이지 선택</div>
            <div className="small muted">
              🪙 {state.gold} · 💊 {state.potions.small} · 🧪 {state.potions.big} · 클리어 {state.cleared.length}/{STAGES.length}
            </div>
          </div>
        </header>
        <div className="stage-list">
          {STAGES.map((st) => {
            const cleared = state.cleared.includes(st.n);
            const locked = st.n > open;
            return (
              <div key={st.n} className={`stage-card ${cleared ? 'cleared' : ''} ${locked ? 'locked' : ''} ${st.n === open && !cleared ? 'next' : ''}`}>
                <div className="sc-num">{st.n}</div>
                <div className="sc-info">
                  <b>
                    {st.name} {cleared && '✅'}
                  </b>
                  <small>
                    레벨 {st.minLv}~{st.maxLv} · 👑{st.bossElite ? '대장 ' : ''}
                    {MONSTERS[st.boss].name} 레벨 {st.bossLv} {EL_ICON[MONSTERS[st.boss].element]}
                  </small>
                  <small className="muted">
                    {LAYOUT_NAME[st.layout]}
                    {st.shrine && !state.spirits[st.shrine] ? ` · ${EL_ICON[st.shrine]}스피릿 제단` : ''}
                  </small>
                </div>
                <button
                  className="cta small-cta"
                  disabled={locked}
                  onClick={() => {
                    act((s) => startStage(s, st.n));
                    setPan({ x: 0, y: 0 });
                    setGoal(null);
                  }}
                >
                  {locked ? '🔒' : cleared ? '다시' : '도전'}
                </button>
              </div>
            );
          })}
        </div>
        {menu}
        {panels}
      </div>
    );
  }

  // ── 스테이지 안 (D98: 세로 화면, 지도 전체 + 네 모서리) ──
  const tut = TUT[state.tut];
  const showTut = !!tut && tutSeen !== state.tut && !state.stageClear;
  const fight = engaged(state);
  const st = stageInfo(state);
  const progress = Math.min(1, state.pos.r / (st.rows - 1));
  const path = goal && !fight ? pathTo(state, goal, 25) : [];
  const logLines = state.log.slice(0, 3);
  const skills = hero.skills.slice(1).map((id) => skillOf(state, id)); // 기본 공격(베기)은 자동

  return (
    <div className="rpg game">
      <main className="rworld">
        <WorldView state={state} fx={fx} fxKey={fxKey} heroHue={0} pan={pan} goal={goal} path={path} onSteer={onSteer} onPan={(dx, dy) => setPan((p) => ({ x: p.x + dx, y: p.y + dy / ROW_H }))} onTap={tapCell} />
        <div className="battle-log">
          {logLines.map((l, i) => (
            <div key={i} style={{ opacity: 1 - i * 0.3 }}>
              {l}
            </div>
          ))}
        </div>
      </main>

      {/* 좌측 상단: 메뉴 */}
      <div className="g-tl">
        {menu}
        <div className={`state-badge ${fight ? 'fight' : goal || padRef.current !== null ? 'walk' : ''}`}>{fight ? '⚔️ 자동 전투 중' : goal || padRef.current !== null ? '🚶 이동 중' : `⏸ 멈춤${state.stall >= 10 ? ` · ⚠ 머뭇거림 ${state.stall}` : ''}`}</div>
      </div>

      {/* 우측 상단: 캐릭터 정보 */}
      <div className="g-hero">
        <div className="gh-top">
          <div className="rhud-face">
            <img src={img('hero-p')} alt="" />
            <b>{h.level}레벨</b>
          </div>
          <div className="rhud-bars">
            <div className="bar hp">
              <i style={{ width: `${(h.hp / hs.hp) * 100}%` }} />
              <span>
                체력 {h.hp}/{hs.hp}
              </span>
            </div>
            <div className="bar xp">
              <i style={{ width: `${(h.xp / xpToNext(h.level)) * 100}%` }} />
            </div>
            <div className="gh-row">
              <span>🪙 {state.gold}</span>
              <span className="spirit-dots">
                {ELEMENTS.map((e) => {
                  const p = state.pets.find((x) => x.element === e);
                  return (
                    <i key={e} style={{ background: state.spirits[e] ? EL_COLOR[e] : '#ffffff22', opacity: p?.dead ? 0.35 : 1 }} title={EL_NAME[e]}>
                      {state.spirits[e] ?? ''}
                    </i>
                  );
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="gh-stage">
          <b>
            스테이지 {st.n} · {st.name}
          </b>
          <div className="sp-bar">
            <i style={{ width: `${progress * 100}%` }} />
            <em style={{ left: `${(st.bossRow / (st.rows - 1)) * 100}%` }}>👑</em>
            <em style={{ left: '100%' }}>🚪</em>
          </div>
          <span>
            출구까지 {st.toExit}줄 · 남은 몬스터 {st.left}
            {st.bossDown ? ' · 출구 열림!' : ''}
          </span>
        </div>
        <div className="gh-btns">
          <button className="link" onClick={() => setTutSeen(-1)} disabled={!tut}>
            ❔ 안내
          </button>
          <button className="exit-btn" onClick={() => confirm('스테이지를 나갈까요? (진행은 사라져요, 얻은 경험치·장비는 남아요)') && act((s) => leaveStage(s))}>
            ⏏ 나가기
          </button>
        </div>
      </div>

      {(Math.abs(pan.x) > 4 || Math.abs(pan.y) > 0.5) && (
        <button className="recenter" onClick={() => setPan({ x: 0, y: 0 })}>
          📍 내 위치
        </button>
      )}

      {/* 좌측 하단: 기술·물약 */}
      <div className="g-bl">
        <div className="g-pots">
          <button className="g-potion" disabled={state.potions.small <= 0} onClick={() => setToast(act((s) => usePotion(s, 'small')) ?? '💊 체력 +40%')}>
            💊<b>{state.potions.small}</b>
          </button>
          <button className="g-potion" disabled={state.potions.big <= 0} onClick={() => setToast(act((s) => usePotion(s, 'big')) ?? '🧪 체력 가득!')}>
            🧪<b>{state.potions.big}</b>
          </button>
        </div>
        <div className="g-skills">
        {skills.map((sk, j) => {
          const i = j + 1;
          const cd = state.cds[sk.id] ?? 0;
          const target = sk.shape === 'around' ? state.monsters.find((m) => !m.dead && dist(m, state.pos) === 1) : nearestTarget(state, sk.range);
          return (
            <button key={sk.id} className={`g-skill ${!target || cd ? 'off' : ''}`} onClick={() => doSkill(i)} style={{ borderColor: sk.element ? EL_COLOR[sk.element] : '#7f8c86' }}>
              <span className="gs-icon">{sk.icon}</span>
              <b>{sk.name}</b>
              <small>{cd ? `${cd}턴 뒤` : !target ? (sk.shape === 'around' ? '옆에 적 없음' : '사거리 밖') : sk.shape === 'around' ? '주변 6칸' : '기절'}</small>
            </button>
          );
        })}
        </div>
      </div>

      {/* 우측 하단: 이동 버튼 (이 영역은 지도가 눌리지 않음) */}
      <HexPad onDir={onPad} />

      {panels}
      {state.stageClear && (
        <ClearScreen
          state={state}
          onNext={() => (act((s) => startStage(s, Math.min(STAGES.length, s.stage + 1))), setPan({ x: 0, y: 0 }), setGoal(null))}
          onRetry={() => (act((s) => startStage(s, s.stage)), setPan({ x: 0, y: 0 }), setGoal(null))}
          onList={() => (act((s) => leaveStage(s)), setGoal(null))}
        />
      )}
      {popup.length > 0 && !state.stageClear && <Popup f={popup[0]} state={state} onClose={() => setPopup((p) => p.slice(1))} onGo={(p) => (setPopup([]), setPanel(p))} />}
      {showTut && popup.length === 0 && !panel && (
        <div className="modal">
          <div className="reveal tut-card">
            <div className="reveal-tag">
              안내 {state.tut + 1}/{TUT.length}
            </div>
            <h2>{tut.title}</h2>
            <p>{tut.text(state)}</p>
            <button className="cta" onClick={() => setTutSeen(state.tut)}>
              확인
            </button>
            <button className="link" onClick={() => (act((s) => void (s.tut = 99)), setTutSeen(99))}>
              안내 그만 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ClearScreen({ state, onNext, onRetry, onList }: { state: RpgState; onNext: () => void; onRetry: () => void; onList: () => void }) {
  const st = active().stage;
  const last = st.n >= STAGES.length;
  return (
    <div className="modal">
      <div className="reveal clear-card">
        <div className="reveal-tag">스테이지 {st.n} 클리어!</div>
        <h2>{st.name}</h2>
        <p>보스를 쓰러뜨리고 출구에 도착했어요.</p>
        <div className="small muted">
          이번 판 {state.turn}턴 · 누적 처치 {state.kills}
        </div>
        {!last ? (
          <>
            <div className="next-stage">
              ▶ 다음: 스테이지 {st.n + 1} {STAGES[st.n].name}
              <small>
                레벨 {STAGES[st.n].minLv}~{STAGES[st.n].maxLv} · {LAYOUT_NAME[STAGES[st.n].layout]}
              </small>
            </div>
            <button className="cta" onClick={onNext}>
              다음 스테이지로!
            </button>
          </>
        ) : (
          <div className="next-stage">🏆 모든 스테이지를 깼어요! 다음 지역은 준비 중이에요.</div>
        )}
        <button className="ghost" onClick={onRetry}>
          이 판 다시 하기
        </button>
        <button className="ghost" onClick={onList}>
          스테이지 목록
        </button>
      </div>
    </div>
  );
}

/** 단계별 튜토리얼 (스테이지 안에서) */
interface TutStep {
  title: string;
  text: (s: RpgState) => string;
  done: (s: RpgState) => boolean;
}
const TUT: TutStep[] = [
  { title: '이동', text: () => '오른쪽 아래 이동 버튼을 누르고 있으면 그쪽으로 걸어요. 손가락을 미끄러뜨리면 방향이 바뀌고, 떼면 멈춰요. 가고 싶은 헥사를 톡 눌러도 그곳까지 걸어가요. (한 칸 = 한 턴, 몬스터도 같이 움직여요)', done: (s) => s.turn >= 3 },
  { title: '둘러보기', text: () => '지도를 끌면 앞을 미리 볼 수 있어요. 맨 위 👑보스와 🚪출구, 바위 사이 길목을 확인해 보세요. [📍 내 위치]로 돌아와요.', done: (s) => s.turn >= 6 },
  { title: '싸우기', text: () => '몬스터를 누르면 다가가서 싸워요. 붙어 있으면 아무것도 안 눌러도 자동 공격! 빨간 선 = 몬스터 공격, 노란 선 = 내 공격.', done: (s) => s.kills >= 2 },
  { title: '기술', text: () => '왼쪽 아래 기술 버튼: 🌀회오리 베기(주변 6칸 전부), 🛡️방패 강타(기절). 둘러싸였을 때 회오리가 최고! 옆의 💊🧪는 물약이에요.', done: (s) => s.stat.skills >= 1 },
  { title: '테크트리', text: () => '왼쪽 위 [🌳테크트리]에서 기술 포인트를 찍어요. 한 노드에 여러 번 찍을 수 있고, 3포인트 넣으면 아래 노드가 열려요.', done: (s) => Object.keys(s.heroes.knight.nodes).length > 0 },
  { title: '스피릿', text: () => '반짝이는 제단에 가면 스피릿이 동료가 돼요. 칸을 차지하고 같이 싸워요 (속성 색 선이 스피릿 공격).', done: (s) => s.pets.length >= 1 },
  { title: '스피릿 키우기', text: () => '사냥하면 스피릿 포인트가 쌓여요. 왼쪽 위 [✨스피릿]에서 어떤 속성을 키울지 골라요.', done: (s) => Object.values(s.spirits).reduce((a, b) => a + (b ?? 0), 0) > Object.keys(s.spirits).length },
  { title: '물약·야영지', text: () => '체력이 줄면 💊물약. 🏕야영지에 가면 모두 회복(한 번 쉬면 15턴 뒤 다시). 쓰러지면 마지막 야영지에서 다시 시작해요.', done: (s) => s.stat.camps >= 1 || s.potions.small < 3 },
  { title: '머뭇거리면', text: () => '앞으로 못 가고 한 곳에 오래 있으면 몬스터가 몰려와요. 레벨이 모자랄 땐 버티며 경험치를 벌어도 돼요.', done: (s) => s.stall >= 20 || s.kills >= 10 },
  { title: '보스와 출구', text: () => '맨 위 👑보스를 쓰러뜨리면 🚪출구가 열려요. 출구에 들어가면 클리어 → 다음 판!', done: (s) => s.stageClear || s.cleared.length > 0 },
];

function tipFor(s: RpgState): string | null {
  const h = s.heroes.knight;
  if (h.hp < heroStats(s).hp * 0.3) return s.potions.small + s.potions.big > 0 ? '체력이 위험해요! 💊물약을 쓰거나 물러나세요.' : '체력이 위험해요! 멀리 물러나거나 🏕야영지로.';
  const st = active().stage;
  if (s.bossDown) return '🚪 출구가 열렸어요! 맨 위 출구 헥사를 누르세요.';
  const ranged = s.monsters.find((m) => !m.dead && m.aggro && MONSTERS[m.def].range > 1 && dist(m, s.pos) === 2);
  if (ranged) return `${MONSTERS[ranged.def].name}은 2칸 밖에서 공격해요 — 자동으로 다가가서 싸워요.`;
  if (!s.bossDown && st.bossLv - h.level >= 3 && s.pos.r > active().rows * 0.6) return `👑 보스는 레벨 ${st.bossLv}. 아직 버거워요 — 머뭇거리면 몰려오는 몬스터로 레벨업.`;
  return null;
}
