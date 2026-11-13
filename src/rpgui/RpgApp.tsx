// HEXA FRONTIER RPG 화면 (D72~D81)
// 위 HUD · 가운데 헥사 월드(누른 채 끌면 조이스틱) · 아래 왼쪽 기술 / 오른쪽 방향 패드.
// 손을 떼면 시간이 멈추고, 몬스터가 붙어 있을 때만 저절로 싸운다.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  beats,
  EL_COLOR,
  EL_ICON,
  EL_NAME,
  ELEMENTS,
  HEROES,
  MONSTERS,
  RARITY_COLOR,
  RARITY_NAME,
  SLOT_NAME,
  SPIRIT_BONUS_PER_LV,
  SPIRIT_GUARD_PER_LV,
  SPIRIT_TREE,
  SPIRITS,
  TREES,
  type Element,
  type Item,
  type Slot,
} from '../rpg/data';
import {
  autoAct,
  currentZone,
  engaged,
  equip,
  estimateHit,
  heroStats,
  itemPrice,
  itemScore,
  learnNode,
  move,
  nearestTarget,
  onCamp,
  petStats,
  sellItem,
  skillOf,
  spendSpiritPoint,
  spiritNeed,
  switchHero,
  unequip,
  useSkill,
  xpToNext,
  type Fx,
  type RpgState,
} from '../rpg/game';
import { dist, isFloor, step, WORLD, type Dir } from '../rpg/world';
import { useRpg } from './store';
import { WorldView } from './WorldView';

const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;

type Panel = 'hero' | 'tree' | 'spirit' | 'equip' | null;
const AUTO_MS = 650;
const WALK_MS = 230;

export function RpgApp() {
  const { state, act, reset, hasSave } = useRpg();
  const [started, setStarted] = useState(false);
  const [fx, setFx] = useState<Fx[]>([]);
  const [fxKey, setFxKey] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [popup, setPopup] = useState<Fx[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [stick, setStick] = useState<{ x: number; y: number; dx: number; dy: number } | null>(null);
  const dirRef = useRef<Dir | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const hero = HEROES[state.heroId];
  const hs = heroStats(state);
  const h = state.heroes[state.heroId];
  const blockedUi = !!panel || popup.length > 0;
  const blockedRef = useRef(blockedUi);
  blockedRef.current = blockedUi;

  const show = useCallback((list: Fx[]) => {
    setFx(list);
    setFxKey((k) => k + 1);
    const big = list.filter((f) => f.k === 'spirit' || f.k === 'boss' || f.k === 'unlock' || f.k === 'death' || f.k === 'levelup');
    if (big.length) setPopup((p) => [...p, ...big]);
    const drop = list.find((f) => f.k === 'drop');
    const down = list.find((f) => f.k === 'petDown');
    const msgs = list.filter((f) => f.k === 'msg').map((f) => (f as { text: string }).text);
    if (down && down.k === 'petDown') setToast(`${EL_ICON[down.element]} ${SPIRITS[down.element].name} 쓰러짐 — 🏕야영지에서 되살아나요`);
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
    const id = setTimeout(() => setToast(null), 2300);
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
      show(act((s) => move(s, d)));
    },
    [act, show],
  );
  const doSkill = (i: number) => !blockedUi && show(act((s) => useSkill(s, i)));

  // 조이스틱: 누르고 있는 동안 그 방향으로 계속 걷기
  useEffect(() => {
    const id = setInterval(() => dirRef.current && doMove(dirRef.current, true), WALK_MS);
    return () => clearInterval(id);
  }, [doMove]);

  // 자동 전투: 몬스터가 붙어 있고, 손을 떼고 있을 때만
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      if (blockedRef.current || dirRef.current || !engaged(stateRef.current)) return;
      const r = act((s) => autoAct(s));
      if (r) show(r);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [started, act, show]);

  // 튜토리얼 단계 진행
  useEffect(() => {
    const st = TUT[state.tut];
    if (st && st.done(state)) act((s) => void (s.tut += 1));
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

  const pointer = {
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as unknown as { setPointerCapture?: (id: number) => void }).setPointerCapture?.(e.pointerId);
      setStick({ x: e.clientX, y: e.clientY, dx: 0, dy: 0 });
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!stick) return;
      const dx = e.clientX - stick.x;
      const dy = e.clientY - stick.y;
      setStick({ ...stick, dx, dy });
      if (Math.hypot(dx, dy) < 22) return void (dirRef.current = null);
      const deg = ((Math.atan2(-dy, dx) * 180) / Math.PI + 360) % 360;
      const d: Dir = deg < 30 || deg >= 330 ? 'E' : deg < 90 ? 'NE' : deg < 150 ? 'NW' : deg < 210 ? 'W' : deg < 270 ? 'SW' : 'SE';
      if (dirRef.current !== d) {
        dirRef.current = d;
        doMove(d, true);
      }
    },
    onPointerUp: () => ((dirRef.current = null), setStick(null)),
    onPointerCancel: () => ((dirRef.current = null), setStick(null)),
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
          <li>⬡ 방향 패드나 지도를 누른 채 끌어서 이동 — 손을 떼면 시간이 멈춰요</li>
          <li>⚔️ 몬스터가 붙으면 저절로 싸워요. 강한 기술은 직접!</li>
          <li>✨ 5속성 스피릿이 칸을 차지하고 함께 싸워요</li>
          <li>🌳 기술 테크트리 + 어떤 스피릿을 키우느냐로 캐릭터가 달라져요</li>
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

  const zone = currentZone(state);
  const tut = TUT[state.tut];
  const tip = tut ? null : tipFor(state);
  const focus = tut?.focus?.(state);
  const fight = engaged(state);

  return (
    <div className={`rpg ${shake ? 'shake' : ''}`}>
      <header className="rhud">
        <button className="rhud-face" onClick={() => setPanel('hero')}>
          <img src={img('hero-p')} alt="" style={{ filter: `hue-rotate(${hero.hue}deg)` }} />
          <b>Lv{h.level}</b>
        </button>
        <div className="rhud-bars">
          <div className="rhud-name">
            {hero.name} <span className="muted">· {zone.name}</span>
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
        </div>
      </header>

      <main className="rworld">
        <WorldView state={state} fx={fx} fxKey={fxKey} heroHue={hero.hue} onPointer={pointer as never} />
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
        {toast && <div className="rtoast">{toast}</div>}
        {fight && <div className="fight-badge">⚔️ 자동 전투 중</div>}
        {!fight && !stick && <div className="pause-badge">⏸ 멈춤 — 움직이면 시간이 흘러요</div>}
        <div className="row-indicator">
          ▲ {zone.bossDown ? '다음 구역' : `BOSS ${MONSTERS[zone.boss].name}`} · {Math.max(0, zone.bossRow - state.pos.r)}줄 위
        </div>
        {stick && (
          <div className="stick" style={{ left: stick.x, top: stick.y }}>
            <i style={{ transform: `translate(${Math.max(-34, Math.min(34, stick.dx))}px, ${Math.max(-34, Math.min(34, stick.dy))}px)` }} />
          </div>
        )}
      </main>

      <div className="rmenu">
        <button onClick={() => setPanel('hero')} className={focus === 'hero' ? 'pulse' : ''}>
          🧙 캐릭터{onCamp(state) && <i className="badge">교체</i>}
        </button>
        <button onClick={() => setPanel('tree')} className={focus === 'tree' || h.skillPts > 0 ? 'pulse' : ''}>
          🌳 기술{h.skillPts > 0 && <i className="badge">{h.skillPts}</i>}
        </button>
        <button onClick={() => setPanel('spirit')} className={focus === 'spirit' || state.spiritPoints > 0 ? 'pulse' : ''}>
          ✨ 스피릿{state.spiritPoints > 0 && <i className="badge">{state.spiritPoints}</i>}
        </button>
        <button onClick={() => setPanel('equip')} className={focus === 'equip' ? 'pulse' : ''}>
          🛡 장비{state.bag.some((it) => itemScore(it) > itemScore(h.gear[it.slot])) && <i className="badge">!</i>}
        </button>
      </div>

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
                <span className="sk-meta">
                  {sk.dmg === 'phys' ? '⚔️' : '✨'} {sk.range}칸{i === 0 ? ' · 자동' : ''}
                </span>
                {est && !cd && est.type > 1 && <span className="sk-tag adv">유리</span>}
                {est && !cd && (est.type < 1 || est.blocked) && <span className="sk-tag dis">{est.blocked ? '막힘' : '불리'}</span>}
                {cd > 0 && <span className="sk-cd">{cd}</span>}
              </button>
            );
          })}
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
            <button key={d} className={`dkey ${blockedDir(state, d) ? 'blocked' : ''} ${monAhead(state, d) ? 'attack' : ''}`} style={{ left: `${30 + x * 50}px`, top: `${y * 44}px` }} onClick={() => doMove(d)}>
              {ch}
            </button>
          ))}
          <div className="dkey center" style={{ left: '55px', top: '44px' }}>
            ⬡
          </div>
        </div>
      </footer>

      {panel === 'hero' && (
        <HeroPanel
          state={state}
          onClose={() => setPanel(null)}
          onSwitch={(id) => {
            const e = act((s) => switchHero(s, id));
            setToast(e ?? `${HEROES[id].name}(으)로 교체!`);
          }}
        />
      )}
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

      {popup.length > 0 && <Popup f={popup[0]} state={state} onClose={() => setPopup((p) => p.slice(1))} onGo={(p) => (setPopup([]), setPanel(p))} />}
    </div>
  );
}

function monAhead(s: RpgState, d: Dir) {
  const t = step(s.pos.c, s.pos.r, d);
  return s.monsters.some((m) => !m.dead && m.c === t.c && m.r === t.r);
}

function shrineHint(s: RpgState): string {
  const shrine = [...WORLD.cells.values()].find((x) => x.feature?.kind === 'shrine' && !s.opened.includes(`${x.c},${x.r}`));
  if (!shrine) return '';
  const f = shrine.feature as { element: Element };
  const v = shrine.r > s.pos.r ? '위' : shrine.r < s.pos.r ? '아래' : '';
  const hz = shrine.c > s.pos.c ? '오른쪽' : shrine.c < s.pos.c ? '왼쪽' : '';
  return `${EL_ICON[f.element]}제단: ${hz}${hz && v ? ' ' : ''}${v} ${Math.abs(shrine.r - s.pos.r)}줄`;
}

/** 단계별 튜토리얼 */
interface TutStep {
  title: string;
  text: (s: RpgState) => string;
  done: (s: RpgState) => boolean;
  focus?: (s: RpgState) => string;
}
const TUT: TutStep[] = [
  { title: '이동', text: () => '오른쪽 방향 패드를 누르거나, 지도를 누른 채 가고 싶은 쪽으로 끌어 보세요. 손을 떼면 시간이 멈춰요 — 딴짓해도 괜찮아요!', done: (s) => s.turn >= 4, focus: () => 'dpad' },
  { title: '자동 전투', text: () => '몬스터 옆에 서 보세요. 붙어 있는 동안은 아무것도 안 눌러도 저절로 싸워요. 빨간 방향키(몬스터 쪽)를 누르면 직접 때려요.', done: (s) => s.kills >= 2, focus: () => 'world' },
  { title: '기술', text: () => '왼쪽 기술 버튼으로 강한 기술을 골라 쓸 수 있어요. 🌀회오리 베기는 주변 6칸 전부, 🛡️방패 강타는 기절! 버튼의 "유리/막힘" 표시를 보세요.', done: (s) => s.stat.skills >= 1, focus: () => 'skills' },
  { title: '기술 테크트리', text: (s) => (s.heroes[s.heroId].level >= 2 ? '레벨이 오르면 기술 포인트 1개! [🌳기술]에서 테크트리를 찍어 기술을 강화하세요.' : '몬스터를 더 잡아 레벨을 올려 보세요 (Lv2가 되면 기술 포인트).'), done: (s) => Object.values(s.heroes).some((h) => h.nodes.length > 0), focus: (s) => (s.heroes[s.heroId].level >= 2 ? 'tree' : 'world') },
  { title: '스피릿 찾기', text: (s) => `지도의 반짝이는 제단에 가면 스피릿이 동료가 돼요. (${shrineHint(s)})`, done: (s) => s.pets.length >= 1, focus: () => 'world' },
  { title: '함께 싸우는 스피릿', text: () => '스피릿은 칸을 차지하고 같이 싸워요. 몬스터도 스피릿을 노려요. 쓰러져도 🏕야영지에 가면 되살아나요. 계속 사냥해서 스피릿 포인트를 모아요!', done: (s) => s.spiritEarned >= 1, focus: () => 'world' },
  { title: '스피릿 키우기', text: () => '[✨스피릿]에서 어떤 속성을 키울지 골라요. 키운 속성이 이기는 몬스터에게 강해지고, Lv3·6·10에 새 능력이 열려요!', done: (s) => Object.values(s.spirits).reduce((a, b) => a + (b ?? 0), 0) > Object.keys(s.spirits).length, focus: () => 'spirit' },
  { title: '장비', text: (s) => (s.bag.length ? '장비를 얻었어요! [🛡장비]에서 무기·갑옷·반지 칸을 눌러 착용하세요.' : '몬스터를 잡다 보면 장비가 떨어져요. 보물 상자도 열어 보세요.'), done: (s) => s.stat.equips >= 1, focus: (s) => (s.bag.length ? 'equip' : 'world') },
  { title: '야영지', text: () => '🏕야영지에 가면 캐릭터·스피릿이 모두 회복되고, 쓰러지면 마지막 야영지에서 다시 시작해요.', done: (s) => s.stat.camps >= 1, focus: () => 'world' },
  { title: '캐릭터 교체', text: () => '껍질 기사·바위엄니처럼 물리 방어가 높은 적은 ✨마법사가 강해요. 야영지에서 [🧙캐릭터]를 눌러 바꿔 보세요. 쉬는 캐릭터도 경험치를 절반 받아요.', done: (s) => s.heroId !== 'knight', focus: (s) => (onCamp(s) ? 'hero' : 'world') },
  { title: '보스', text: () => '길목의 보스 👑고목 골렘(🌿)! 🔥기술·🔥스피릿이 강해요. 보스를 이기면 다음 구역으로!', done: (s) => s.bossesDown.length >= 1, focus: () => 'world' },
];

/** 튜토리얼이 끝난 뒤의 상황 안내 */
function tipFor(s: RpgState): string | null {
  const h = s.heroes[s.heroId];
  if (h.hp < heroStats(s).hp * 0.3) return '체력이 위험해요! 적에게서 멀어지면 조금씩 회복, 🏕야영지에 가면 전부 회복.';
  if (s.spiritPoints > 0) return '✨ 스피릿 포인트가 있어요 — [스피릿]에서 키울 속성을 고르세요.';
  if (h.skillPts > 0) return '🌳 기술 포인트가 있어요 — [기술]에서 테크트리를 찍으세요.';
  const near = s.monsters.filter((m) => !m.dead && dist(m, s.pos) <= 3);
  const shell = near.find((m) => MONSTERS[m.def].def > MONSTERS[m.def].res * 2);
  if (shell && skillOf(s, HEROES[s.heroId].skills[0]).dmg === 'phys') return `${MONSTERS[shell.def].name}은 물리 방어가 높아요(막힘). 🏕야영지에서 ✨마법사로!`;
  const z = currentZone(s);
  if (!z.bossDown && z.bossRow - s.pos.r <= 3) return `👑 보스 ${MONSTERS[z.boss].name}(${EL_ICON[MONSTERS[z.boss].element]}). ${EL_ICON[beatsOf(MONSTERS[z.boss].element)]}기술·스피릿이 강해요.`;
  return null;
}
const beatsOf = (e: Element) => ELEMENTS[(ELEMENTS.indexOf(e) + 4) % 5];

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="rsheet-wrap" onClick={onClose}>
      <div className="rsheet" onClick={(e) => e.stopPropagation()}>
        <div className="rsheet-head">
          <b>{title}</b>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="rsheet-body">{children}</div>
      </div>
    </div>
  );
}

function HeroPanel({ state, onClose, onSwitch }: { state: RpgState; onClose: () => void; onSwitch: (id: string) => void }) {
  const camp = onCamp(state);
  return (
    <Sheet title="캐릭터" onClose={onClose}>
      <div className="muted small">{camp ? '🏕 야영지예요. 다른 캐릭터로 바꿀 수 있어요.' : '캐릭터는 🏕야영지에서만 바꿀 수 있어요. 쉬는 캐릭터도 경험치를 절반 받아요.'}</div>
      {Object.values(HEROES).map((d) => {
        const hh = state.heroes[d.id];
        const st = heroStats(state, d.id);
        const cur = state.heroId === d.id;
        return (
          <div key={d.id} className={`hero-card ${cur ? 'cur' : ''} ${hh.unlocked ? '' : 'locked'}`}>
            <img src={img('hero-p')} alt="" style={{ filter: `hue-rotate(${d.hue}deg)` }} />
            <div className="hc-body">
              <b>
                {d.name} {hh.unlocked ? `Lv${hh.level}` : '🔒'}
              </b>
              <div className="small muted">{d.title}</div>
              {hh.unlocked ? (
                <div className="small">
                  체력 {st.hp} · 공격 {Math.round(st.atk)} · 방어 {Math.round(st.def)} · 마법방어 {Math.round(st.res)} · 기술 포인트 {hh.skillPts}
                </div>
              ) : (
                <div className="small">합류: {d.unlock}</div>
              )}
              <div className="hc-skills">
                {d.skills.map((id) => {
                  const sk = skillOf({ ...state, heroId: d.id }, id);
                  return (
                    <div key={id} className="small">
                      {sk.icon} <b>{sk.name}</b> {sk.dmg === 'phys' ? '⚔️물리' : '✨마법'}
                      {sk.element ? ` ${EL_ICON[sk.element]}` : ''} · {sk.range}칸{sk.cd ? ` · ${sk.cd}턴` : ''} — {sk.desc}
                    </div>
                  );
                })}
              </div>
              {hh.unlocked && !cur && (
                <button className="cta small-cta" disabled={!camp} onClick={() => onSwitch(d.id)}>
                  {camp ? '이 캐릭터로 교체' : '야영지에서 교체 가능'}
                </button>
              )}
              {cur && <div className="small good">지금 모험 중</div>}
            </div>
          </div>
        );
      })}
    </Sheet>
  );
}

function TreePanel({ state, onClose, onLearn }: { state: RpgState; onClose: () => void; onLearn: (id: string) => void }) {
  const h = state.heroes[state.heroId];
  const tree = TREES[state.heroId];
  return (
    <Sheet title={`기술 테크트리 · ${HEROES[state.heroId].name}`} onClose={onClose}>
      <div className="tree-head">
        기술 포인트 <b className="gold">{h.skillPts}</b> <span className="muted small">— 레벨업마다 1개. 아래 단계는 위 단계를 배워야 열려요. 캐릭터마다 트리가 달라요.</span>
      </div>
      {[1, 2, 3].map((tier) => (
        <div key={tier} className="tree-tier">
          <div className="tier-label">
            {tier}단계 <span className="muted">Lv{tree.find((n) => n.tier === tier)!.level}+</span>
          </div>
          <div className="tier-row">
            {tree
              .filter((n) => n.tier === tier)
              .map((n) => {
                const got = h.nodes.includes(n.id);
                const preOk = !n.pre || h.nodes.includes(n.pre);
                const can = !got && preOk && h.level >= n.level && h.skillPts > 0;
                return (
                  <button key={n.id} className={`tnode ${got ? 'got' : ''} ${can ? 'can' : ''} ${!preOk || h.level < n.level ? 'locked' : ''}`} onClick={() => onLearn(n.id)}>
                    <span className="tn-icon">{n.icon}</span>
                    <b>{n.name}</b>
                    <small>{n.desc}</small>
                    {n.pre && <small className="muted">← {tree.find((x) => x.id === n.pre)!.name}</small>}
                    {got && <span className="tn-got">✔</span>}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </Sheet>
  );
}

function SpiritPanel({ state, onClose, onSpend }: { state: RpgState; onClose: () => void; onSpend: (el: Element) => void }) {
  const z = currentZone(state);
  const foes = [...new Set([...z.monsters.map((m) => MONSTERS[m].element), MONSTERS[z.boss].element])];
  return (
    <Sheet title="스피릿" onClose={onClose}>
      <div className="spirit-head">
        <div>
          스피릿 포인트 <b className="gold">{state.spiritPoints}</b>
        </div>
        <div className="bar xp">
          <i style={{ width: `${(state.spiritXp / spiritNeed(state.spiritEarned)) * 100}%` }} />
        </div>
        <div className="muted small">몬스터를 잡으면 쌓여요. 어떤 속성 스피릿을 키울지 직접 골라요. 키운 만큼 그 스피릿이 강해지고, 그 속성이 이기는 몬스터에게 캐릭터도 강해져요.</div>
      </div>
      <div className="elem-cycle small">💧물 → 🔥불 → 🌿숲 → ⛰️대지 → 🌪️바람 → 💧물 (화살표 쪽에 강함)</div>
      {ELEMENTS.map((e) => {
        const lv = state.spirits[e] ?? 0;
        const owned = !!state.spirits[e];
        const pet = state.pets.find((p) => p.element === e);
        const good = foes.includes(beats(e));
        const tree = SPIRIT_TREE[e];
        return (
          <div key={e} className={`spirit-card ${owned ? '' : 'locked'}`} style={{ borderColor: EL_COLOR[e] }}>
            <div className="sc-top">
              <img src={img(`${SPIRITS[e].art}-p${lv >= 20 ? 3 : lv >= 8 ? 2 : 1}`)} alt="" className={owned ? '' : 'silhouette'} />
              <div className="sc-body">
                <b>
                  {EL_ICON[e]} {SPIRITS[e].name} {owned ? `Lv${lv}` : '🔒'}
                  {good && <span className="rec-tag">이 구역 추천</span>}
                </b>
                {owned ? (
                  <div className="small">
                    {EL_ICON[beats(e)]}
                    {EL_NAME[beats(e)]} 몬스터에게 캐릭터 피해 <b className="adv">+{Math.round(lv * SPIRIT_BONUS_PER_LV * 100)}%</b>, 받는 피해 -{Math.round(Math.min(60, lv * SPIRIT_GUARD_PER_LV * 100))}%
                    <br />
                    스피릿 체력 {pet ? (pet.dead ? '💀 쓰러짐(야영지에서 부활)' : `${pet.hp}/${petStats(state, e).hp}`) : '-'} · 공격 {Math.round(petStats(state, e).atk)}
                  </div>
                ) : (
                  <div className="small muted">지도 어딘가의 {EL_NAME[e]} 제단에서 만날 수 있어요</div>
                )}
              </div>
              {owned && (
                <button className="cta small-cta" disabled={state.spiritPoints <= 0} onClick={() => onSpend(e)}>
                  ▲ 키우기
                </button>
              )}
            </div>
            <div className="spirit-tree">
              {(
                [
                  [3, tree.lv3],
                  [6, tree.lv6],
                  [10, tree.lv10],
                ] as [number, string][]
              ).map(([need, text]) => (
                <div key={need} className={`st-node ${lv >= need ? 'on' : ''}`}>
                  <b>Lv{need}</b> {text}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Sheet>
  );
}

function statLine(it: Item) {
  return [it.atk && `공격 +${it.atk}`, it.def && `방어 +${it.def}`, it.res && `마법방어 +${it.res}`, it.hp && `체력 +${it.hp}`, it.vs && `${EL_ICON[it.vs.element]}${EL_NAME[it.vs.element]} 몬스터에게 +${it.vs.pct}%`].filter(Boolean).join(' · ');
}

function EquipPanel({ state, onClose, onEquip, onUnequip, onSell }: { state: RpgState; onClose: () => void; onEquip: (uid: string) => void; onUnequip: (slot: Slot) => void; onSell: (uid: string) => void }) {
  const [slot, setSlot] = useState<Slot>('weapon');
  const [pick, setPick] = useState<string | null>(null);
  const h = state.heroes[state.heroId];
  const gear = h.gear;
  const st = heroStats(state);
  const items = state.bag.filter((it) => it.slot === slot).sort((a, b) => itemScore(b) - itemScore(a));
  const sel = state.bag.find((it) => it.uid === pick) ?? null;
  // 고른 장비를 끼면 능력치가 어떻게 바뀌나
  const preview = sel ? heroStats({ ...state, heroes: { ...state.heroes, [state.heroId]: { ...h, gear: { ...gear, [sel.slot]: sel } } } }) : null;
  const diff = (k: 'hp' | 'atk' | 'def' | 'res') => (preview ? Math.round(preview[k]) - Math.round(st[k]) : 0);
  const slotBox = (s: Slot, pos: string) => {
    const it = gear[s];
    return (
      <button key={s} className={`eq-slot ${pos} ${slot === s ? 'on' : ''}`} onClick={() => (setSlot(s), setPick(null))} style={{ borderColor: it ? RARITY_COLOR[it.rarity] : undefined }}>
        <span className="eq-ico">{s === 'weapon' ? '⚔️' : s === 'armor' ? '🛡️' : '💍'}</span>
        <small>{SLOT_NAME[s]}</small>
        <b style={{ color: it ? RARITY_COLOR[it.rarity] : '#8a9a92' }}>{it ? it.name : '비어 있음'}</b>
      </button>
    );
  };
  return (
    <Sheet title={`장비 · ${HEROES[state.heroId].name} Lv${h.level}`} onClose={onClose}>
      <div className="paperdoll">
        {slotBox('weapon', 'left')}
        <img className="pd-hero" src={img('hero-t')} alt="" style={{ filter: `hue-rotate(${HEROES[state.heroId].hue}deg)` }} />
        {slotBox('ring', 'right')}
        {slotBox('armor', 'bottom')}
      </div>
      <div className="pd-stats">
        {(
          [
            ['hp', '체력'],
            ['atk', '공격'],
            ['def', '방어'],
            ['res', '마법방어'],
          ] as ['hp' | 'atk' | 'def' | 'res', string][]
        ).map(([k, n]) => (
          <div key={k}>
            <small>{n}</small>
            <b>{Math.round(st[k])}</b>
            {preview && diff(k) !== 0 && <i className={diff(k) > 0 ? 'good' : 'bad'}>{diff(k) > 0 ? `+${diff(k)}` : diff(k)}</i>}
          </div>
        ))}
      </div>
      {gear[slot] && (
        <div className="eq-cur">
          <span>
            착용 중: <b style={{ color: RARITY_COLOR[gear[slot]!.rarity] }}>{gear[slot]!.name}</b> <small className="muted">{statLine(gear[slot]!)}</small>
          </span>
          <button className="ghost small-btn" onClick={() => onUnequip(slot)}>
            벗기
          </button>
        </div>
      )}
      <h4 className="sec-sm">
        가방의 {SLOT_NAME[slot]} ({items.length}) <span className="muted small">· 눌러서 비교</span>
      </h4>
      {!items.length && <div className="muted small">이 부위 장비가 없어요. 몬스터·보물 상자·보스에게서 얻어요.</div>}
      <div className="eq-list">
        {items.map((it) => {
          const better = itemScore(it) > itemScore(gear[slot]);
          return (
            <button key={it.uid} className={`eq-item ${pick === it.uid ? 'on' : ''}`} onClick={() => setPick(pick === it.uid ? null : it.uid)} style={{ borderColor: RARITY_COLOR[it.rarity] }}>
              <b style={{ color: RARITY_COLOR[it.rarity] }}>
                {it.name} <small className="muted">{RARITY_NAME[it.rarity]} · Lv{it.level}</small>
              </b>
              <small>{statLine(it)}</small>
              {better && <span className="eq-better">▲ 더 좋음</span>}
            </button>
          );
        })}
      </div>
      {sel && (
        <div className="eq-actions">
          <button className="cta" onClick={() => (onEquip(sel.uid), setPick(null))}>
            착용하기
          </button>
          <button className="ghost" onClick={() => (onSell(sel.uid), setPick(null))}>
            판매 🪙{itemPrice(sel)}
          </button>
        </div>
      )}
      <div className="muted small">
        다른 부위 가방:{' '}
        {(['weapon', 'armor', 'ring'] as Slot[])
          .filter((x) => x !== slot)
          .map((x) => `${SLOT_NAME[x]} ${state.bag.filter((it) => it.slot === x).length}`)
          .join(' · ')}
      </div>
    </Sheet>
  );
}

function Popup({ f, state, onClose, onGo }: { f: Fx; state: RpgState; onClose: () => void; onGo: (p: Panel) => void }) {
  let tag = '';
  let body: React.ReactNode = null;
  let picture: string | null = null;
  let go: { label: string; panel: Panel } | null = null;
  if (f.k === 'spirit') {
    tag = `${EL_ICON[f.element]} 스피릿 합류!`;
    picture = img(`${SPIRITS[f.element].art}-p1`);
    body = (
      <>
        <h2>{SPIRITS[f.element].name}</h2>
        <p>
          칸을 차지하고 함께 싸워요. 키울수록 <b>{EL_ICON[beats(f.element)]}{EL_NAME[beats(f.element)]} 몬스터</b>에게 캐릭터도 강해지고, Lv3·6·10에 새 능력이 열려요.
        </p>
        <p className="small muted">쓰러지면 🏕야영지에서 되살아나요.</p>
      </>
    );
    if (state.spiritPoints > 0) go = { label: '스피릿 키우러 가기', panel: 'spirit' };
  } else if (f.k === 'levelup') {
    tag = 'LEVEL UP!';
    picture = img('hero-p');
    body = (
      <>
        <h2>
          {HEROES[f.hero].name} Lv{f.level}
        </h2>
        <p>능력치가 오르고 체력이 가득 찼어요. 🌳기술 포인트 +1!</p>
      </>
    );
    go = { label: '기술 테크트리 보기', panel: 'tree' };
  } else if (f.k === 'boss') {
    tag = '👑 보스 격파!';
    body = (
      <>
        <h2>{f.name}</h2>
        <p>위쪽 새 구역으로 갈 수 있어요. 보스는 좋은 장비를 떨어뜨려요.</p>
      </>
    );
    go = { label: '장비 확인', panel: 'equip' };
  } else if (f.k === 'unlock') {
    tag = '새 동료!';
    picture = img('hero-p');
    body = (
      <>
        <h2>{HEROES[f.hero].name}</h2>
        <p>{HEROES[f.hero].title}. 🏕야영지에서 바꿀 수 있어요.</p>
      </>
    );
  } else if (f.k === 'death') {
    tag = '쓰러졌다…';
    body = <p>마지막 야영지에서 다시 시작해요. 레벨·장비·기술 트리를 올리거나, 상성이 맞는 캐릭터·스피릿을 키워 보세요.</p>;
  }
  const hue = f.k === 'levelup' || f.k === 'unlock' ? HEROES[f.hero].hue : 0;
  return (
    <div className="modal" onClick={onClose}>
      <div className="reveal">
        <div className="reveal-tag">{tag}</div>
        {picture && <img className="reveal-art" src={picture} alt="" style={{ filter: `hue-rotate(${hue}deg)` }} />}
        {body}
        {go && (
          <button className="ghost" onClick={(e) => (e.stopPropagation(), onGo(go!.panel))}>
            {go.label}
          </button>
        )}
        <button className="cta">확인</button>
      </div>
    </div>
  );
}
