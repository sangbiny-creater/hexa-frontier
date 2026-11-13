// HEXA FRONTIER RPG 화면 (D72~D84)
// 스테이지 선택 → 스테이지(지도 끌어서 둘러보기, 오른쪽 방향 패드 길게 누르면 계속 걷기, 왼쪽 기술·물약) → 클리어 → 다음 판.
// 손을 떼면 시간이 멈추고, 몬스터가 붙어 있을 때만 저절로 싸운다.
import { useCallback, useEffect, useRef, useState } from 'react';
import { EL_COLOR, EL_ICON, EL_NAME, ELEMENTS, HEROES, MONSTERS, SPIRITS } from '../rpg/data';
import {
  autoAct,
  buy,
  engaged,
  equip,
  estimateHit,
  heroStats,
  itemScore,
  learnNode,
  leaveStage,
  move,
  nearestTarget,
  onCamp,
  sellItem,
  skillOf,
  spendSpiritPoint,
  stageInfo,
  startStage,
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
import { WorldView } from './WorldView';

const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;
const AUTO_MS = 650;
const WALK_MS = 220;
const PX_PER_ROW = 30;

export function RpgApp() {
  const { state, act, reset, hasSave } = useRpg();
  activate(state.stage); // 지도·규칙이 지금 스테이지를 보게
  const [started, setStarted] = useState(false);
  const [fx, setFx] = useState<Fx[]>([]);
  const [fxKey, setFxKey] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [popup, setPopup] = useState<Fx[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [pan, setPan] = useState(0);
  const drag = useRef<{ y: number; pan: number } | null>(null);
  const holdDir = useRef<Dir | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const hero = HEROES.knight;
  const hs = heroStats(state);
  const h = state.heroes.knight;
  const blockedUi = !!panel || popup.length > 0 || state.stageClear || !state.inStage;
  const blockedRef = useRef(blockedUi);
  blockedRef.current = blockedUi;

  const show = useCallback((list: Fx[]) => {
    setFx(list);
    setFxKey((k) => k + 1);
    const big = list.filter((f) => f.k === 'spirit' || f.k === 'boss' || f.k === 'death' || f.k === 'levelup');
    if (big.length) setPopup((p) => [...p, ...big]);
    const drop = list.find((f) => f.k === 'drop');
    const down = list.find((f) => f.k === 'petDown');
    const msgs = list.filter((f) => f.k === 'msg').map((f) => (f as { text: string }).text);
    if (list.some((f) => f.k === 'swarm')) setToast('⚠ 머뭇거리는 사이 몬스터 무리가 몰려와요! (앞으로 가면 멈춰요)');
    else if (down && down.k === 'petDown') setToast(`${EL_ICON[down.element]} ${SPIRITS[down.element].name} 쓰러짐 — 🏕야영지에서 되살아나요`);
    else if (drop && drop.k === 'drop') setToast(`🎁 ${drop.item.name} 획득! [장비]에서 착용`);
    else if (list.some((f) => f.k === 'point')) setToast('✨ 스피릿 포인트 +1 — [스피릿]에서 키울 속성을 고르세요');
    else if (msgs.length && !big.length) setToast(msgs[0]);
    if (list.some((f) => f.k === 'dmg' && f.onHero)) {
      setShake(true);
      setTimeout(() => setShake(false), 220);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const blockedDir = (s: RpgState, d: Dir) => {
    const t = step(s.pos.c, s.pos.r, d);
    return !isFloor(t.c, t.r);
  };
  const doMove = useCallback(
    (d: Dir, quiet = false) => {
      if (blockedRef.current) return;
      if (blockedDir(stateRef.current, d)) return quiet ? undefined : setToast('바위로 막혀 있어요');
      setPan(0); // 움직이면 내 위치로
      show(act((s) => move(s, d)));
    },
    [act, show],
  );
  const doSkill = (i: number) => !blockedUi && show(act((s) => useSkill(s, i)));

  // 방향 패드를 누르고 있으면 계속 걷기
  useEffect(() => {
    const id = setInterval(() => holdDir.current && doMove(holdDir.current, true), WALK_MS);
    return () => clearInterval(id);
  }, [doMove]);

  // 자동 전투: 몬스터가 붙어 있고, 손을 떼고 있을 때만
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      if (blockedRef.current || holdDir.current || !engaged(stateRef.current)) return;
      const r = act((s) => autoAct(s));
      if (r) show(r);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [started, act, show]);

  // 튜토리얼
  useEffect(() => {
    const st = TUT[state.tut];
    if (st && state.inStage && st.done(state)) act((s) => void (s.tut += 1));
  }, [state, act]);

  // 키보드 (PC)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { q: 'NW', e: 'NE', a: 'W', d: 'E', z: 'SW', c: 'SE' };
      const k = e.key.toLowerCase();
      if (map[k]) doMove(map[k]);
      else if (k === '1' || k === '2' || k === '3') doSkill(Number(k) - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // 지도 끌어서 둘러보기
  const info = state.inStage ? stageInfo(state) : null;
  const pointer = {
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as unknown as { setPointerCapture?: (id: number) => void }).setPointerCapture?.(e.pointerId);
      drag.current = { y: e.clientY, pan };
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!drag.current || !info) return;
      const p = drag.current.pan + (drag.current.y - e.clientY) / PX_PER_ROW;
      setPan(Math.max(-state.pos.r, Math.min(info.rows - 1 - state.pos.r, p)));
    },
    onPointerUp: () => void (drag.current = null),
    onPointerCancel: () => void (drag.current = null),
  };

  if (!started)
    return (
      <div className="rpg intro-screen">
        <img className="intro-hero" src={img('hero-t')} alt="" />
        <div className="intro-logo">
          HEXA <span>FRONTIER</span>
        </div>
        <div className="intro-sub">헥사 들판을 누비는 사냥 RPG</div>
        <ul className="intro-list">
          <li>⬡ 스테이지 10판 — 보스를 쓰러뜨리고 맨 위 출구로!</li>
          <li>⚔️ 몬스터가 붙으면 저절로 싸워요. 손을 떼면 시간이 멈춰요</li>
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

  const menu = (inStage: boolean) => (
    <div className="rmenu">
      <button onClick={() => setPanel('tree')} className={h.skillPts > 0 ? 'pulse' : ''}>
        🌳 기술{h.skillPts > 0 && <i className="badge">{h.skillPts}</i>}
      </button>
      <button onClick={() => setPanel('spirit')} className={state.spiritPoints > 0 ? 'pulse' : ''}>
        ✨ 스피릿{state.spiritPoints > 0 && <i className="badge">{state.spiritPoints}</i>}
      </button>
      <button onClick={() => setPanel('equip')}>
        🛡 장비{state.bag.some((it) => itemScore(it) > itemScore(h.gear[it.slot])) && <i className="badge">!</i>}
      </button>
      <button onClick={() => (!inStage || onCamp(state) ? setPanel('shop') : setToast('상점은 🏕야영지나 스테이지 선택 화면에서 열려요'))} className={!inStage || onCamp(state) ? '' : 'dim'}>
        🏪 상점
      </button>
    </div>
  );

  // ── 스테이지 선택 ──
  if (!state.inStage) {
    const open = unlockedStage(state);
    return (
      <div className="rpg">
        <header className="rhud">
          <div className="rhud-face">
            <img src={img('hero-p')} alt="" />
            <b>Lv{h.level}</b>
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
                    Lv{st.minLv}~{st.maxLv} · 👑{st.bossElite ? '대장 ' : ''}
                    {MONSTERS[st.boss].name} Lv{st.bossLv} {EL_ICON[MONSTERS[st.boss].element]}
                  </small>
                  <small className="muted">
                    {LAYOUT_NAME[st.layout]}
                    {st.shrine && !state.spirits[st.shrine] ? ` · ${EL_ICON[st.shrine]}스피릿 제단` : ''}
                  </small>
                </div>
                <button
                  className={`cta small-cta ${st.n === open && !cleared ? 'pulse' : ''}`}
                  disabled={locked}
                  onClick={() => {
                    act((s) => startStage(s, st.n));
                    setPan(0);
                  }}
                >
                  {locked ? '🔒' : cleared ? '다시 하기' : '도전'}
                </button>
              </div>
            );
          })}
        </div>
        {menu(false)}
        {panels}
      </div>
    );
  }

  // ── 스테이지 안 ──
  const tut = TUT[state.tut];
  const tip = tut ? null : tipFor(state);
  const focus = tut?.focus?.(state);
  const fight = engaged(state);
  const st = info!;
  const progress = Math.min(1, state.pos.r / (st.rows - 1));

  return (
    <div className={`rpg ${shake ? 'shake' : ''}`}>
      <header className="rhud">
        <div className="rhud-face">
          <img src={img('hero-p')} alt="" />
          <b>Lv{h.level}</b>
        </div>
        <div className="rhud-bars">
          <div className="rhud-name">
            STAGE {st.n} {st.name}
          </div>
          <div className="bar hp">
            <i style={{ width: `${(h.hp / hs.hp) * 100}%` }} />
            <span>
              {h.hp}/{hs.hp}
            </span>
          </div>
          <div className="bar xp">
            <i style={{ width: `${(h.xp / xpToNext(h.level)) * 100}%` }} />
          </div>
        </div>
        <div className="rhud-right">
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
          <button className="exit-btn" onClick={() => confirm('스테이지를 나갈까요? (진행은 사라져요, 얻은 경험치·장비는 남아요)') && act((s) => leaveStage(s))}>
            ⏏ 나가기
          </button>
        </div>
      </header>
      <div className="stage-progress">
        <div className="sp-bar">
          <i style={{ width: `${progress * 100}%` }} />
          <b style={{ left: `${(st.bossRow / (st.rows - 1)) * 100}%` }}>👑</b>
          <b style={{ left: '100%' }}>🚪</b>
        </div>
        <span>
          🚪 출구까지 {st.toExit}줄 · 남은 몬스터 {st.left} · {st.bossDown ? '출구 열림!' : `보스 ${MONSTERS[st.boss].name}`}
        </span>
      </div>

      <main className="rworld">
        <WorldView state={state} fx={fx} fxKey={fxKey} heroHue={0} pan={pan} onPointer={pointer} />
        {tut && (
          <div className="rtut">
            <div className="rtut-head">
              <b>
                튜토리얼 {state.tut + 1}/{TUT.length} · {tut.title}
              </b>
              <button className="link" onClick={() => act((s) => void (s.tut += 1))}>
                다음 ▶
              </button>
            </div>
            <div>{tut.text(state)}</div>
            <button className="link small" onClick={() => act((s) => void (s.tut = 99))}>
              튜토리얼 끄기
            </button>
          </div>
        )}
        {tip && <div className="rtip">{tip}</div>}
        {fight && <div className="fight-badge">⚔️ 자동 전투 중</div>}
        {!fight && <div className="pause-badge">⏸ 멈춤{state.stall >= 10 ? ` · ⚠ 머뭇거림 ${state.stall}` : ''}</div>}
        {Math.abs(pan) > 0.5 && (
          <button className="recenter" onClick={() => setPan(0)}>
            📍 내 위치로
          </button>
        )}
      </main>

      {menu(true)}

      <footer className="rcontrols">
        <div className={`skills ${focus === 'skills' ? 'pulse-box' : ''}`}>
          {hero.skills.map((id, i) => {
            const sk = skillOf(state, id);
            const cd = state.cds[sk.id] ?? 0;
            const target = sk.shape === 'around' ? state.monsters.find((m) => !m.dead && dist(m, state.pos) === 1) : nearestTarget(state, sk.range);
            const est = target ? estimateHit(state, sk, target) : null;
            return (
              <button key={sk.id} className={`skill ${i === 0 ? 'basic' : ''} ${target && !cd ? 'ready' : ''}`} disabled={cd > 0} onClick={() => doSkill(i)} style={{ borderColor: sk.element ? EL_COLOR[sk.element] : '#9aa5a0' }}>
                <span className="sk-icon">{sk.icon}</span>
                <span className="sk-name">{sk.name}</span>
                <span className="sk-meta">{i === 0 ? '자동' : `${sk.range}칸`}</span>
                {est && !cd && est.type > 1 && <span className="sk-tag adv">유리</span>}
                {est && !cd && (est.type < 1 || est.blocked) && <span className="sk-tag dis">{est.blocked ? '막힘' : '불리'}</span>}
                {cd > 0 && <span className="sk-cd">{cd}</span>}
              </button>
            );
          })}
          <button className={`potion ${focus === 'potion' ? 'pulse' : ''}`} disabled={state.potions.small <= 0} onClick={() => { const e = act((s) => usePotion(s, 'small')); setToast(e ?? '💊 체력 회복!'); }}>
            💊<b>{state.potions.small}</b>
          </button>
          <button className="potion" disabled={state.potions.big <= 0} onClick={() => { const e = act((s) => usePotion(s, 'big')); setToast(e ?? '🧪 체력 가득!'); }}>
            🧪<b>{state.potions.big}</b>
          </button>
        </div>
        <div className={`dpad ${focus === 'dpad' ? 'pulse-box' : ''}`}>
          {(
            [
              ['NW', '↖', 0, 0],
              ['NE', '↗', 1, 0],
              ['W', '←', -0.5, 1],
              ['E', '→', 1.5, 1],
              ['SW', '↙', 0, 2],
              ['SE', '↘', 1, 2],
            ] as [Dir, string, number, number][]
          ).map(([d, ch, x, y]) => (
            <button
              key={d}
              className={`dkey ${blockedDir(state, d) ? 'blocked' : ''} ${monAhead(state, d) ? 'attack' : ''}`}
              style={{ left: `${30 + x * 50}px`, top: `${y * 44}px` }}
              onPointerDown={(e) => {
                e.preventDefault();
                doMove(d);
                holdDir.current = d;
              }}
              onPointerUp={() => (holdDir.current = null)}
              onPointerLeave={() => (holdDir.current = null)}
              onPointerCancel={() => (holdDir.current = null)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {ch}
            </button>
          ))}
          <div className="dkey center" style={{ left: '55px', top: '44px' }}>
            ⬡
          </div>
        </div>
      </footer>

      {panels}
      {state.stageClear && <ClearScreen state={state} onNext={() => (act((s) => startStage(s, Math.min(STAGES.length, s.stage + 1))), setPan(0))} onRetry={() => (act((s) => startStage(s, s.stage)), setPan(0))} onList={() => act((s) => leaveStage(s))} />}
      {popup.length > 0 && !state.stageClear && <Popup f={popup[0]} state={state} onClose={() => setPopup((p) => p.slice(1))} onGo={(p) => (setPopup([]), setPanel(p))} />}
    </div>
  );
}

function ClearScreen({ state, onNext, onRetry, onList }: { state: RpgState; onNext: () => void; onRetry: () => void; onList: () => void }) {
  const st = active().stage;
  const last = st.n >= STAGES.length;
  return (
    <div className="modal">
      <div className="reveal clear-card">
        <div className="reveal-tag">STAGE {st.n} CLEAR!</div>
        <h2>{st.name}</h2>
        <p>보스를 쓰러뜨리고 출구에 도착했어요.</p>
        <div className="small muted">이번 판 {state.turn}턴 · 누적 처치 {state.kills} · 누적 쓰러짐 {state.deaths}</div>
        {!last ? (
          <>
            <div className="next-stage">
              ▶ 다음: STAGE {st.n + 1} {STAGES[st.n].name}
              <small>
                Lv{STAGES[st.n].minLv}~{STAGES[st.n].maxLv} · {LAYOUT_NAME[STAGES[st.n].layout]}
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

function monAhead(s: RpgState, d: Dir) {
  const t = step(s.pos.c, s.pos.r, d);
  return s.monsters.some((m) => !m.dead && m.c === t.c && m.r === t.r);
}

/** 단계별 튜토리얼 (스테이지 안에서) */
interface TutStep {
  title: string;
  text: (s: RpgState) => string;
  done: (s: RpgState) => boolean;
  focus?: (s: RpgState) => string;
}
const TUT: TutStep[] = [
  { title: '이동', text: () => '오른쪽 방향 패드로 움직여요. 누르고 있으면 계속 걸어요. 손을 떼면 시간이 멈춰요 — 딴짓해도 괜찮아요!', done: (s) => s.turn >= 4, focus: () => 'dpad' },
  { title: '지도 둘러보기', text: () => '지도를 위아래로 끌면 앞을 미리 볼 수 있어요. 바위 사이 길목, 몬스터 무리, 맨 위 👑보스와 🚪출구를 확인해 보세요.', done: (s) => s.turn >= 8 },
  { title: '자동 전투', text: () => '몬스터 옆에 서면 아무것도 안 눌러도 저절로 싸워요. 길목에 서면 한 마리씩, 넓은 곳에선 둘러싸여요!', done: (s) => s.kills >= 2 },
  { title: '기술', text: () => '왼쪽 기술 버튼으로 강한 기술을 직접! 🌀회오리 베기는 주변 6칸 전부, 🛡️방패 강타는 기절.', done: (s) => s.stat.skills >= 1, focus: () => 'skills' },
  { title: '물약', text: () => '체력이 줄면 💊물약을 눌러요 (바로 40% 회복). 🏪상점에서 더 살 수 있어요.', done: (s) => s.potions.small < 3 || s.kills >= 6, focus: () => 'potion' },
  { title: '기술 테크트리', text: (s) => (s.heroes.knight.level >= 2 ? '레벨업마다 기술 포인트 1개! [🌳기술]에서 테크트리를 찍어요.' : '몬스터를 잡아 레벨을 올려 보세요 (Lv2부터 기술 포인트).'), done: (s) => s.heroes.knight.nodes.length > 0 },
  { title: '스피릿', text: () => '반짝이는 제단에 가면 스피릿이 동료가 돼요. 칸을 차지하고 같이 싸우고, 쓰러지면 🏕야영지에서 되살아나요.', done: (s) => s.pets.length >= 1 },
  { title: '스피릿 키우기', text: () => '사냥하면 스피릿 포인트가 쌓여요. [✨스피릿]에서 어떤 속성을 키울지 골라요 — Lv3·6·10에 새 능력!', done: (s) => Object.values(s.spirits).reduce((a, b) => a + (b ?? 0), 0) > Object.keys(s.spirits).length },
  { title: '야영지', text: () => '🏕야영지에서 캐릭터·스피릿이 모두 회복돼요. 한 번 쉬면 15턴 뒤에 다시 쉴 수 있어요. 쓰러지면 마지막 야영지에서 다시 시작!', done: (s) => s.stat.camps >= 1 },
  { title: '머뭇거리면', text: () => '앞으로 못 가고 한 곳에 오래 있으면 몬스터 무리가 몰려와요. 레벨이 모자랄 땐 일부러 버티며 경험치를 벌 수도 있어요!', done: (s) => s.stall >= 20 || s.kills >= 10 },
  { title: '보스와 출구', text: () => '맨 위 👑보스를 쓰러뜨리면 🚪출구가 열려요. 출구에 들어가면 스테이지 클리어 → 다음 판!', done: (s) => s.stageClear || s.cleared.length > 0 },
];

function tipFor(s: RpgState): string | null {
  const h = s.heroes.knight;
  if (h.hp < heroStats(s).hp * 0.3) return s.potions.small + s.potions.big > 0 ? '체력이 위험해요! 💊물약을 쓰거나 물러나세요.' : '체력이 위험해요! 적에게서 멀어지거나 🏕야영지로.';
  if (s.spiritPoints > 0) return '✨ 스피릿 포인트가 있어요 — [스피릿]에서 키울 속성을 고르세요.';
  if (h.skillPts > 0) return '🌳 기술 포인트가 있어요 — [기술]에서 테크트리를 찍으세요.';
  const st = active().stage;
  if (!s.bossDown && st.bossLv - h.level >= 3 && s.pos.r > active().rows * 0.6) return `👑 보스는 Lv${st.bossLv}. 아직 버거워요 — 머뭇거리면 몰려오는 몬스터로 레벨을 올려 보세요.`;
  if (s.bossDown) return '🚪 출구가 열렸어요! 맨 위 출구로 가면 클리어.';
  const shell = s.monsters.find((m) => !m.dead && dist(m, s.pos) <= 3 && MONSTERS[m.def].def > MONSTERS[m.def].res * 1.6);
  if (shell) return `${MONSTERS[shell.def].name}은 단단해요. ⛰️방패 강타·스피릿의 상성 공격이 좋아요.`;
  return null;
}
