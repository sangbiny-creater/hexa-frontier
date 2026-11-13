// HEXA FRONTIER RPG (D72) 화면: 위 HUD, 가운데 헥사 월드, 아래 방향키 + 기술 버튼.
import { useCallback, useEffect, useState } from 'react';
import { BAL, beats, EL_COLOR, EL_ICON, EL_NAME, ELEMENTS, HEROES, MONSTERS, RARITY_COLOR, SKILLS, SLOT_NAME, SPIRIT_BONUS_PER_LV, SPIRIT_GUARD_PER_LV, SPIRITS, type Element, type Item } from '../rpg/data';
import {
  currentZone,
  equip,
  estimateHit,
  heroStats,
  itemScore,
  move,
  nearestTarget,
  onCamp,
  sellItem,
  spendSpiritPoint,
  spiritNeed,
  switchHero,
  useSkill,
  wait,
  xpToNext,
  type Fx,
  type RpgState,
} from '../rpg/game';
import { dist, isFloor, step, WORLD, type Dir } from '../rpg/world';
import { useRpg } from './store';
import { WorldView } from './WorldView';

const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;

type Panel = 'hero' | 'spirit' | 'bag' | null;

export function RpgApp() {
  const { state, act, reset, hasSave } = useRpg();
  const [started, setStarted] = useState(false);
  const [fx, setFx] = useState<Fx[]>([]);
  const [fxKey, setFxKey] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [popup, setPopup] = useState<Fx[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const hero = HEROES[state.heroId];
  const hs = heroStats(state);
  const h = state.heroes[state.heroId];

  const show = useCallback((list: Fx[]) => {
    setFx(list);
    setFxKey((k) => k + 1);
    const big = list.filter((f) => f.k === 'spirit' || f.k === 'boss' || f.k === 'unlock' || f.k === 'death' || f.k === 'levelup');
    if (big.length) setPopup((p) => [...p, ...big]);
    const drop = list.find((f) => f.k === 'drop');
    const msg = list.filter((f) => f.k === 'msg').map((f) => (f as { text: string }).text);
    if (drop && drop.k === 'drop') setToast(`🎁 ${drop.item.name} 획득! (가방)`);
    else if (list.some((f) => f.k === 'point')) setToast('✨ 스피릿 포인트 +1 — 스피릿 창에서 키울 속성을 고르세요');
    else if (msg.length && !big.length) setToast(msg[0]);
    if (list.some((f) => f.k === 'dmg' && f.onHero)) {
      setShake(true);
      setTimeout(() => setShake(false), 250);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  const blocked = (d: Dir) => {
    const t = step(state.pos.c, state.pos.r, d);
    return !isFloor(t.c, t.r);
  };
  const doMove = (d: Dir) => {
    if (panel || popup.length) return;
    if (blocked(d)) return setToast('바위로 막혀 있어요');
    show(act((s) => move(s, d)));
  };
  const doSkill = (i: number) => !panel && !popup.length && show(act((s) => useSkill(s, i)));

  // 키보드 (PC): Q W E / A S D 대신 헥사 방향 — Q:왼위 E:오른위 A:왼쪽 D:오른쪽 Z:왼아래 C:오른아래, 1·2·3 기술, 스페이스 쉬기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { q: 'NW', e: 'NE', a: 'W', d: 'E', z: 'SW', c: 'SE', w: 'NE', s: 'SW' };
      const k = e.key.toLowerCase();
      if (map[k]) doMove(map[k]);
      else if (k === '1' || k === '2' || k === '3') doSkill(Number(k) - 1);
      else if (k === ' ') show(act((s) => wait(s)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!started)
    return (
      <div className="rpg intro-screen">
        <img className="intro-hero" src={img('hero-t')} alt="" />
        <div className="intro-logo">
          HEXA <span>FRONTIER</span>
        </div>
        <div className="intro-sub">헥사 들판을 누비는 사냥 RPG</div>
        <ul className="intro-list">
          <li>⬡ 아래 방향키로 한 칸씩 이동, 몬스터 칸으로 가면 공격</li>
          <li>⚔️ 캐릭터마다 기술이 달라요 — 상성이 안 맞으면 야영지에서 교체</li>
          <li>✨ 5속성 스피릿을 찾아 모으고, 키울 속성을 직접 골라요</li>
          <li>🎁 사냥하며 레벨업·장비 파밍, 맨 위 폭풍 언덕까지!</li>
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
  const tip = tipFor(state);
  const skills = hero.skills.map((id) => SKILLS[id]);

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
            {ELEMENTS.map((e) => (
              <i key={e} style={{ background: state.spirits[e] ? EL_COLOR[e] : '#ffffff22' }} title={EL_NAME[e]}>
                {state.spirits[e] ?? ''}
              </i>
            ))}
          </span>
        </div>
      </header>

      <main className="rworld">
        <WorldView state={state} fx={fx} fxKey={fxKey} heroHue={hero.hue} />
        {tip && <div className="rtip">{tip}</div>}
        {toast && <div className="rtoast">{toast}</div>}
        <div className="row-indicator">
          ▲ {zone.bossDown ? '다음 구역' : `BOSS ${MONSTERS[zone.boss].name}`} · {Math.max(0, zone.bossRow - state.pos.r)}줄 위
        </div>
      </main>

      <div className="rmenu">
        <button onClick={() => setPanel('hero')}>
          🧙 캐릭터{onCamp(state) && <i className="badge">교체</i>}
        </button>
        <button onClick={() => setPanel('spirit')} className={state.spiritPoints ? 'pulse' : ''}>
          ✨ 스피릿{state.spiritPoints > 0 && <i className="badge">{state.spiritPoints}</i>}
        </button>
        <button onClick={() => setPanel('bag')}>
          🎒 가방{state.bag.some((it) => itemScore(it) > itemScore(h.gear[it.slot])) && <i className="badge">!</i>}
        </button>
      </div>

      <footer className="rcontrols">
        <div className="dpad">
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
            <button key={d} className={`dkey ${blocked(d) ? 'blocked' : ''} ${monAhead(state, d) ? 'attack' : ''}`} style={{ left: `${18 + x * 50}px`, top: `${y * 44}px` }} onClick={() => doMove(d)}>
              {ch}
            </button>
          ))}
          <button className="dkey wait" style={{ left: '43px', top: '44px' }} onClick={() => show(act((s) => wait(s)))}>
            ⏸
          </button>
        </div>
        <div className="skills">
          {skills.map((sk, i) => {
            const cd = state.cds[sk.id] ?? 0;
            const target = sk.shape === 'around' ? state.monsters.find((m) => !m.dead && dist(m, state.pos) === 1) : nearestTarget(state, sk.range);
            const est = target ? estimateHit(state, sk, target) : null;
            return (
              <button key={sk.id} className={`skill ${i === 0 ? 'basic' : ''} ${target && !cd ? 'ready' : ''}`} disabled={cd > 0} onClick={() => doSkill(i)} style={{ borderColor: sk.element ? EL_COLOR[sk.element] : '#9aa5a0' }}>
                <span className="sk-icon">{sk.icon}</span>
                <span className="sk-name">{sk.name}</span>
                <span className="sk-meta">
                  {sk.dmg === 'phys' ? '⚔️' : '✨'} {sk.range}칸
                </span>
                {est && !cd && est.type > 1 && <span className="sk-tag adv">유리</span>}
                {est && !cd && (est.type < 1 || est.blocked) && <span className="sk-tag dis">{est.blocked ? '막힘' : '불리'}</span>}
                {cd > 0 && <span className="sk-cd">{cd}</span>}
              </button>
            );
          })}
        </div>
      </footer>

      {panel === 'hero' && <HeroPanel state={state} onClose={() => setPanel(null)} onSwitch={(id) => { const e = act((s) => switchHero(s, id)); setToast(e ?? `${HEROES[id].name}(으)로 교체!`); }} />}
      {panel === 'spirit' && <SpiritPanel state={state} onClose={() => setPanel(null)} onSpend={(el) => { const e = act((s) => spendSpiritPoint(s, el)); if (e) setToast(e); }} />}
      {panel === 'bag' && (
        <BagPanel
          state={state}
          onClose={() => setPanel(null)}
          onEquip={(uid) => act((s) => equip(s, uid))}
          onSell={(uid) => {
            const g = act((s) => sellItem(s, uid));
            setToast(`판매: 🪙 +${g}`);
          }}
        />
      )}

      {popup.length > 0 && <Popup f={popup[0]} state={state} onClose={() => setPopup((p) => p.slice(1))} onSpirit={() => (setPopup([]), setPanel('spirit'))} />}
    </div>
  );
}

/** 그 방향에 몬스터가 있으면 방향키가 공격 표시 */
function monAhead(s: RpgState, d: Dir) {
  const t = step(s.pos.c, s.pos.r, d);
  return s.monsters.some((m) => !m.dead && m.c === t.c && m.r === t.r);
}

/** 지금 상황에 맞는 안내 한 줄 (처음 하는 사람용) */
function tipFor(s: RpgState): string | null {
  const near = s.monsters.filter((m) => !m.dead && dist(m, s.pos) <= 3);
  if (s.turn < 3) return '⬡ 아래 방향키로 움직여요. 목표는 맨 위! 몬스터 칸으로 가면 공격해요.';
  if (s.kills === 0 && near.length) return '몬스터에게 다가가 그 칸으로 이동하면 공격! 오른쪽 기술 버튼도 눌러 보세요.';
  if (s.spiritPoints > 0) return '✨ 스피릿 포인트가 생겼어요! [스피릿]에서 어떤 속성을 키울지 골라요.';
  const shrine = [...WORLD.cells.values()].find((x) => x.feature?.kind === 'shrine' && !s.opened.includes(`${x.c},${x.r}`) && x.r <= s.pos.r + 8);
  if (shrine && Object.keys(s.spirits).length < 5 && s.kills >= 2 && dist(shrine, s.pos) <= 8) {
    const f = shrine.feature as { element: Element };
    const v = shrine.r > s.pos.r ? '위' : shrine.r < s.pos.r ? '아래' : '';
    const hz = shrine.c > s.pos.c ? '오른쪽' : shrine.c < s.pos.c ? '왼쪽' : '';
    return `반짝이는 ${EL_ICON[f.element]}제단이 ${hz}${hz && v ? ' ' : ''}${v}에 있어요! 가면 ${EL_NAME[f.element]} 스피릿이 동료가 돼요.`;
  }
  const shell = near.find((m) => MONSTERS[m.def].def > MONSTERS[m.def].res * 2);
  if (shell && SKILLS[HEROES[s.heroId].skills[0]].dmg === 'phys') return `${MONSTERS[shell.def].name}은 물리 방어가 높아요(막힘). 🏕야영지에서 ✨마법사로 바꿔 보세요.`;
  const magicy = near.find((m) => MONSTERS[m.def].res > MONSTERS[m.def].def * 2);
  if (magicy && SKILLS[HEROES[s.heroId].skills[0]].dmg === 'magic') return `${MONSTERS[magicy.def].name}은 마법 방어가 높아요. 물리 공격 캐릭터가 좋아요.`;
  const h = s.heroes[s.heroId];
  if (h.hp < heroStats(s).hp * 0.3) return '체력이 위험해요! 적에게서 멀어지면 조금씩 회복하고, 🏕야영지에 가면 전부 회복해요.';
  if (s.bag.length && s.tips.length === 0 && s.bag.some((it) => itemScore(it) > itemScore(h.gear[it.slot]))) return '🎁 더 좋은 장비가 있어요! [가방]에서 장착하세요.';
  const z = currentZone(s);
  if (!z.bossDown && z.bossRow - s.pos.r <= 3) return `👑 보스 ${MONSTERS[z.boss].name}(${EL_ICON[MONSTERS[z.boss].element]}). ${EL_ICON[beatsOf(MONSTERS[z.boss].element)]}스피릿·기술이 강해요. 보스는 자리에서 2칸까지만 쫓아와요 — 원거리 캐릭터로 거리를 두면 유리!`;
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
                  체력 {st.hp} · 공격 {Math.round(st.atk)} · 방어 {Math.round(st.def)} · 마법방어 {Math.round(st.res)}
                </div>
              ) : (
                <div className="small">합류: {d.unlock}</div>
              )}
              <div className="hc-skills">
                {d.skills.map((id) => {
                  const sk = SKILLS[id];
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

function SpiritPanel({ state, onClose, onSpend }: { state: RpgState; onClose: () => void; onSpend: (el: Element) => void }) {
  return (
    <Sheet title="스피릿" onClose={onClose}>
      <div className="spirit-head">
        <div>
          스피릿 포인트 <b className="gold">{state.spiritPoints}</b>
        </div>
        <div className="bar xp">
          <i style={{ width: `${(state.spiritXp / spiritNeed(state.spiritEarned)) * 100}%` }} />
        </div>
        <div className="muted small">몬스터를 잡으면 쌓여요. 포인트로 어떤 속성 스피릿을 키울지 직접 골라요.</div>
      </div>
      <div className="elem-cycle small">💧물 → 🔥불 → 🌿숲 → ⛰️대지 → 🌪️바람 → 💧물 (화살표 쪽에 강함)</div>
      {ELEMENTS.map((e) => {
        const lv = state.spirits[e] ?? 0;
        const owned = !!state.spirits[e];
        const z = currentZone(state);
        const foes = [...new Set([...z.monsters.map((m) => MONSTERS[m].element), MONSTERS[z.boss].element])];
        const good = foes.includes(beats(e));
        return (
          <div key={e} className={`spirit-card ${owned ? '' : 'locked'}`} style={{ borderColor: EL_COLOR[e] }}>
            <img src={img(`${SPIRITS[e].art}-p${lv >= 20 ? 3 : lv >= 8 ? 2 : 1}`)} alt="" className={owned ? '' : 'silhouette'} />
            <div className="sc-body">
              <b>
                {EL_ICON[e]} {SPIRITS[e].name} {owned ? `Lv${lv}` : '🔒'}
                {good && <span className="rec-tag">이 구역 추천</span>}
              </b>
              {owned ? (
                <div className="small">
                  {EL_ICON[beats(e)]}
                  {EL_NAME[beats(e)]} 몬스터에게 피해 <b className="adv">+{Math.round(lv * SPIRIT_BONUS_PER_LV * 100)}%</b>, 받는 피해 <b>-{Math.round(Math.min(60, lv * SPIRIT_GUARD_PER_LV * 100))}%</b>
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
        );
      })}
    </Sheet>
  );
}

function ItemLine({ it, cur }: { it: Item; cur?: Item }) {
  const diff = itemScore(it) - itemScore(cur);
  return (
    <div className="item-line">
      <b style={{ color: RARITY_COLOR[it.rarity] }}>
        [{SLOT_NAME[it.slot]}] {it.name}
      </b>{' '}
      <small className="muted">Lv{it.level}</small>
      <div className="small">
        {it.atk ? `공격 +${it.atk} ` : ''}
        {it.def ? `방어 +${it.def} ` : ''}
        {it.res ? `마법방어 +${it.res} ` : ''}
        {it.hp ? `체력 +${it.hp} ` : ''}
        {it.vs ? `${EL_ICON[it.vs.element]}${EL_NAME[it.vs.element]} 몬스터에게 +${it.vs.pct}%` : ''}
        {cur !== undefined || diff ? <b className={diff > 0 ? 'good' : 'bad'}> {diff > 0 ? '▲ 더 좋음' : diff < 0 ? '▼' : ''}</b> : null}
      </div>
    </div>
  );
}

function BagPanel({ state, onClose, onEquip, onSell }: { state: RpgState; onClose: () => void; onEquip: (uid: string) => void; onSell: (uid: string) => void }) {
  const gear = state.heroes[state.heroId].gear;
  const items = [...state.bag].sort((a, b) => itemScore(b) - itemScore(gear[b.slot]) - (itemScore(a) - itemScore(gear[a.slot])));
  return (
    <Sheet title={`가방 · ${HEROES[state.heroId].name}`} onClose={onClose}>
      <h4 className="sec-sm">장착 중</h4>
      {(['weapon', 'armor', 'ring'] as const).map((slot) => (
        <div key={slot} className="equip-slot">{gear[slot] ? <ItemLine it={gear[slot]!} /> : <span className="muted small">[{SLOT_NAME[slot]}] 없음</span>}</div>
      ))}
      <h4 className="sec-sm">가방 ({items.length})</h4>
      {!items.length && <div className="muted small">몬스터를 잡으면 가끔 장비가 떨어져요. 보물 상자와 보스는 좋은 장비를 줘요.</div>}
      {items.map((it) => (
        <div key={it.uid} className="bag-row">
          <ItemLine it={it} cur={gear[it.slot]} />
          <div className="bag-btns">
            <button className="cta small-cta" onClick={() => onEquip(it.uid)}>
              장착
            </button>
            <button className="ghost small-btn" onClick={() => onSell(it.uid)}>
              판매
            </button>
          </div>
        </div>
      ))}
    </Sheet>
  );
}

function Popup({ f, state, onClose, onSpirit }: { f: Fx; state: RpgState; onClose: () => void; onSpirit: () => void }) {
  let tag = '';
  let body: React.ReactNode = null;
  let picture: string | null = null;
  if (f.k === 'spirit') {
    tag = `${EL_ICON[f.element]} 스피릿 합류!`;
    picture = img(`${SPIRITS[f.element].art}-p1`);
    body = (
      <>
        <h2>{SPIRITS[f.element].name}</h2>
        <p>
          {EL_NAME[f.element]} 스피릿이 따라다녀요. 레벨마다 <b>{EL_ICON[beats(f.element)]}{EL_NAME[beats(f.element)]} 몬스터</b>에게 주는 피해 +{SPIRIT_BONUS_PER_LV * 100}%, 받는 피해 -{SPIRIT_GUARD_PER_LV * 100}%.
        </p>
        <p className="small muted">몬스터를 잡아 스피릿 포인트를 모으고, 어떤 속성을 키울지 골라요. 앞으로 만날 몬스터 속성을 생각해서!</p>
      </>
    );
  } else if (f.k === 'levelup') {
    tag = 'LEVEL UP!';
    picture = img('hero-p');
    body = (
      <>
        <h2>
          {HEROES[f.hero].name} Lv{f.level}
        </h2>
        <p>체력·공격·방어가 올랐어요. 체력도 가득 찼어요!</p>
      </>
    );
  } else if (f.k === 'boss') {
    tag = '👑 보스 격파!';
    body = (
      <>
        <h2>{f.name}</h2>
        <p>위쪽 새 구역으로 갈 수 있어요. 보스는 좋은 장비를 떨어뜨려요 — 가방을 확인하세요.</p>
      </>
    );
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
    body = (
      <>
        <p>마지막 야영지에서 다시 시작해요. 레벨을 더 올리거나, 장비를 바꾸거나, 상성이 맞는 캐릭터·스피릿을 키워 보세요.</p>
        <p className="small muted">몬스터 체력·위치도 처음으로 돌아갔어요.</p>
      </>
    );
  }
  return (
    <div className="modal" onClick={onClose}>
      <div className="reveal">
        <div className="reveal-tag">{tag}</div>
        {picture && <img className="reveal-art" src={picture} alt="" style={f.k === 'levelup' || f.k === 'unlock' ? { filter: `hue-rotate(${HEROES[f.k === 'levelup' ? f.hero : (f as { hero: string }).hero].hue}deg)` } : undefined} />}
        {body}
        {f.k === 'spirit' && state.spiritPoints > 0 ? (
          <button className="cta" onClick={(e) => (e.stopPropagation(), onSpirit())}>
            스피릿 키우러 가기
          </button>
        ) : (
          <button className="cta">확인</button>
        )}
      </div>
    </div>
  );
}

void BAL;
