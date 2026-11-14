// 헥사 전술 전투 (D109): 처음 화면 → 스테이지 목록 → 출전 준비 → 전투(턴제) → 결과 → 다음 스테이지.
import { useCallback, useEffect, useRef, useState } from 'react';
import { stepSide } from '../tactics/ai';
import { EL_COLOR, EL_ICON, EL_NAME, elMul, ITEMS, ROLES, SKILLS, UNITS, unitArt, type SkillDef } from '../tactics/data';
import {
  attack,
  attackTargets,
  canUseSkill,
  createBattle,
  defOf,
  endAllyPhase,
  endEnemyPhase,
  finishBattle,
  forecast,
  itemTargets,
  key,
  maxParty,
  moveRange,
  moveUnit,
  neighbors,
  skillsOf,
  skillTargets,
  undoMove,
  unitAt,
  unitStats,
  unlockedStage,
  useItem,
  useSkill,
  waitUnit,
  alive,
  type Battle,
  type BattleReward,
  type Ev,
  type Pos,
  type Unit,
} from '../tactics/engine';
import { CHAPTERS, chapterOf, ENEMIES, sizeOf, STAGES, terrainAt } from '../tactics/stages';
import { BattleView, cellXY, viewSize, type Marks } from './BattleView';
import { HelpPanel, img, RosterPanel, ShopPanel, UnitChip } from './Panels';
import { useTactics } from './store';

type Screen = 'title' | 'choose' | 'camp' | 'prep' | 'battle' | 'result';
type Mode = { k: 'idle' } | { k: 'select' } | { k: 'menu' } | { k: 'attack' } | { k: 'skill'; skill: string } | { k: 'item'; item: string } | { k: 'inspect' };
type Pending = { k: 'attack'; t: number } | { k: 'skill'; skill: string; at: Pos } | null;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const EMPTY: Marks = { move: new Set(), target: new Set(), area: new Set(), threat: new Set(), path: [] };

export function TacticsApp() {
  const { cp, battle: b, act, setBattle, reset, hasSave, ref } = useTactics();
  const [screen, setScreen] = useState<Screen>(() => 'title');
  const [panel, setPanel] = useState<'roster' | 'shop' | 'help' | null>(null);
  const [prep, setPrep] = useState(1);
  const [party, setParty] = useState<string[]>(cp.party);
  const [toast, setToast] = useState<string | null>(null);
  const [reward, setReward] = useState<(BattleReward & { stage: number }) | null>(null);
  // 전투 조작
  const [sel, setSel] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>({ k: 'idle' });
  const [pending, setPending] = useState<Pending>(null);
  const [fx, setFx] = useState<Ev[]>([]);
  const [fxKey, setFxKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [brief, setBrief] = useState(false);
  const [auto, setAuto] = useState(false);
  const autoRef = useRef(auto);
  autoRef.current = auto;
  // D117: 지도는 위아래로 스크롤 — 고른 유닛·움직이는 적을 따라간다
  const mapRef = useRef<HTMLDivElement>(null);
  const focus = useCallback(
    (uid: number | null, instant = false) => {
      const el = mapRef.current;
      const bb = ref.current.battle;
      if (!el || !bb || uid === null) return;
      const u = bb.units[uid];
      const svg = el.querySelector('svg');
      if (!u || !svg) return;
      const vs = viewSize(STAGES[bb.stage - 1]);
      const p = cellXY(u.c, u.r);
      const y = (p.y / vs.h) * svg.clientHeight;
      const x = (p.x / vs.w) * svg.clientWidth;
      const visY = y > el.scrollTop + el.clientHeight * 0.15 && y < el.scrollTop + el.clientHeight * 0.85;
      const visX = x > el.scrollLeft + el.clientWidth * 0.12 && x < el.scrollLeft + el.clientWidth * 0.88;
      if (!visY || !visX || instant) el.scrollTo({ top: y - el.clientHeight * 0.55, left: x - el.clientWidth / 2, behavior: instant ? 'auto' : 'smooth' });
    },
    [ref],
  );

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    if (!banner) return;
    const id = setTimeout(() => setBanner(null), 1300);
    return () => clearTimeout(id);
  }, [banner]);

  const show = useCallback((ev: Ev[]) => {
    setFx(ev);
    setFxKey((k) => k + 1);
  }, []);
  const clearSel = () => {
    setSel(null);
    setMode({ k: 'idle' });
    setPending(null);
  };

  // ── 전투 진행 ──
  const runSide = useCallback(
    async (side: 'ally' | 'enemy') => {
      for (let i = 0; i < 40; i++) {
        await sleep(side === 'enemy' ? 520 : 450);
        const r = act((_c, bb) => (bb ? stepSide(bb, side) : null));
        if (!r) break;
        focus(r.uid);
        show(r.ev);
        if (ref.current.battle?.result) return;
      }
    },
    [act, show, ref, focus],
  );
  const endTurn = useCallback(async () => {
    if (busy || !ref.current.battle || ref.current.battle.result) return;
    clearSel();
    setBusy(true);
    show(act((_c, bb) => endAllyPhase(bb!)));
    setBanner('적군 차례');
    await sleep(500);
    await runSide('enemy');
    if (ref.current.battle && !ref.current.battle.result) {
      show(act((_c, bb) => endEnemyPhase(bb!)));
      const nb = ref.current.battle;
      if (nb && !nb.result) {
        setBanner(`${nb.turn}턴 · 아군 차례`);
        focus(nb.units.find((x) => x.side === 'ally' && !x.dead)?.uid ?? null);
      }
    }
    setBusy(false);
  }, [busy, act, show, runSide, ref, focus]);
  const runAuto = useCallback(async () => {
    if (busy) return;
    clearSel();
    setBusy(true);
    await runSide('ally');
    setBusy(false);
  }, [busy, runSide]);

  // 아군이 모두 행동하면 자동으로 턴 종료, 자동 진행이면 아군도 인공지능이
  useEffect(() => {
    if (screen !== 'battle' || !b || b.result || busy || b.phase !== 'ally' || brief) return;
    const left = alive(b, 'ally').filter((u) => !u.acted);
    if (left.length === 0) {
      const id = setTimeout(() => void endTurn(), 450);
      return () => clearTimeout(id);
    }
    if (autoRef.current && mode.k === 'idle') {
      const id = setTimeout(() => void runAuto(), 300);
      return () => clearTimeout(id);
    }
  }, [b, busy, screen, endTurn, runAuto, mode.k, brief, auto]);

  // 스테이지 목록을 열면 다음 판이 보이게
  useEffect(() => {
    if (screen !== 'camp') return;
    const id = setTimeout(() => document.querySelector('.stage-card.next')?.scrollIntoView({ block: 'center' }), 30);
    return () => clearTimeout(id);
  }, [screen]);

  // 승패가 나면 결과 화면
  useEffect(() => {
    if (!b?.result || screen !== 'battle') return;
    const id = setTimeout(() => {
      const r = act((c, bb) => finishBattle(c, bb!));
      setReward({ ...r, stage: b.stage });
      setBattle(null);
      setAuto(false);
      clearSel();
      setScreen('result');
    }, 1300);
    return () => clearTimeout(id);
  }, [b?.result, screen, act, setBattle, b?.stage]);

  const startBattle = (n: number, p: string[]) => {
    act((c) => void (c.party = p));
    setBattle(createBattle(ref.current.cp, n, p, (Date.now() % 100000) + n));
    clearSel();
    setFx([]);
    setBrief(true);
    setScreen('battle');
  };

  // ── 처음 화면 ──
  if (screen === 'title')
    return (
      <div className="tac title">
        <img className="t-hero" src={img('hero-t')} alt="" />
        <div className="t-logo">
          헥사 <span>프론티어</span>
        </div>
        <div className="t-sub">스피릿 부대를 이끄는 헥사 전술 전투</div>
        <ul className="t-list">
          <li>⬡ 헥사 전장에서 차례대로 이동하고 공격해요</li>
          <li>🛡⚔️🔮🏹✨💚📯 7가지 역할의 스피릿</li>
          <li>💧🔥🌿⛰️🌪️ 속성 상성과 물리·마법</li>
          <li>🏆 이기면 새 스피릿과 장비, 다음 판으로</li>
        </ul>
        <button
          className="cta"
          onClick={() => {
            if (!b) return setScreen(hasSave ? 'camp' : 'choose');
            setScreen('battle');
            setBrief(false);
            // 이어서 할 때도 아군 쪽을 보여 준다
            setTimeout(() => focus(b.units.find((x) => x.side === 'ally' && !x.dead)?.uid ?? null, true), 60);
          }}
        >
          {b ? '전투 이어서' : hasSave ? '이어서 하기' : '모험 시작'}
        </button>
        {hasSave && (
          <button className="ghost" onClick={() => confirm('처음부터 다시 시작할까요?') && setScreen('choose')}>
            처음부터
          </button>
        )}
      </div>
    );

  // ── 주인공 고르기 (D119) ──
  if (screen === 'choose')
    return (
      <div className="tac title">
        <div className="t-logo">
          누구와 <span>떠날까요?</span>
        </div>
        <div className="t-sub">고른 주인공이 부대의 지도자예요. 고르지 않은 쪽은 먼 훗날 동료로 만나게 돼요.</div>
        <div className="hero-pick">
          {(['aren', 'lia'] as const).map((id) => (
            <button key={id} className="hero-card" onClick={() => (reset(id), setBattle(null), setScreen('camp'))}>
              <img className="face" src={img(unitArt(UNITS[id].art, 'p'))} alt="" />
              <img className="tile" src={img(unitArt(UNITS[id].art, 't'))} alt="" />
              <b>{UNITS[id].name}</b>
              <small>
                {ROLES[UNITS[id].role].icon} {ROLES[UNITS[id].role].name}
                <br />
                {UNITS[id].desc}
              </small>
            </button>
          ))}
        </div>
      </div>
    );

  const panels = (
    <>
      {panel === 'roster' && <RosterPanel cp={cp} act={(fn) => act((c) => fn(c))} onClose={() => setPanel(null)} toast={setToast} />}
      {panel === 'shop' && <ShopPanel cp={cp} act={(fn) => act((c) => fn(c))} onClose={() => setPanel(null)} toast={setToast} />}
      {panel === 'help' && <HelpPanel onClose={() => setPanel(null)} />}
      {toast && <div className="t-toast">{toast}</div>}
    </>
  );
  const nav = (
    <nav className="t-nav">
      <button onClick={() => setPanel('roster')}>
        <span>🛡</span>부대
      </button>
      <button onClick={() => setPanel('shop')}>
        <span>🏪</span>상점
      </button>
      <button onClick={() => setPanel('help')}>
        <span>❔</span>규칙
      </button>
    </nav>
  );

  // ── 스테이지 목록 ──
  if (screen === 'camp') {
    const open = unlockedStage(cp);
    return (
      <div className="tac camp">
        <header className="t-head">
          <b>⚔️ 원정</b>
          <span>
            🪙 {cp.gold} · 스피릿 {cp.joined.length} · 클리어 {cp.cleared.length}/{STAGES.length}
          </span>
        </header>
        <div className="stage-list">
          {STAGES.map((st) => {
            const head = (st.n - 1) % 10 === 0 ? CHAPTERS[chapterOf(st.n)] : null;
            const done = cp.cleared.includes(st.n);
            const locked = st.n > open;
            const els = [...new Set(st.enemies.map((e) => ENEMIES[`e_${e.id}`].element).filter(Boolean))];
            const lv = Math.round(st.enemies.reduce((a, e) => a + e.lv, 0) / st.enemies.length);
            return (
              <div key={st.n} className="stage-wrap">
              {head && (
                <div className="chap-head">
                  {head.name}
                  <small>{head.els ? head.els.map((e) => EL_ICON[e]).join('') + ' 속성 적이 많아요' : '여러 속성'}</small>
                </div>
              )}
              <div className={`stage-card ${done ? 'cleared' : ''} ${locked ? 'locked' : ''} ${st.n === open && !done ? 'next' : ''}`}>
                <div className="sc-num">{st.n}</div>
                <div className="sc-info">
                  <b>
                    {st.name} {done && '✅'}
                  </b>
                  <small>
                    {st.win === 'boss' ? '👑 보스 격파' : '⚔️ 적 전멸'} · 적 {st.enemies.length} · 평균 {lv}레벨 · {els.map((e) => EL_ICON[e!]).join('')}
                  </small>
                </div>
                <button className="cta small-cta" disabled={locked} onClick={() => (setPrep(st.n), setParty([cp.hero, ...cp.party.filter((id) => cp.roster[id] && id !== cp.hero)].slice(0, maxParty(st.n))), setScreen('prep'))}>
                  {locked ? '🔒' : done ? '다시' : '출전'}
                </button>
              </div>
              </div>
            );
          })}
        </div>
        {nav}
        {panels}
      </div>
    );
  }

  // ── 출전 준비 ──
  if (screen === 'prep') {
    const st = STAGES[prep - 1];
    const max = maxParty(prep);
    const foes = st.enemies.map((e) => ({ ...e, d: ENEMIES[`e_${e.id}`] }));
    const els = [...new Set(foes.map((f) => f.d.element).filter(Boolean))] as NonNullable<(typeof foes)[0]['d']['element']>[];
    const good = (id: string) => {
      const e = defOf(id).element;
      return els.reduce((a, x) => a + (elMul(e, x) > 1 ? 1 : 0) - (elMul(x, e) > 1 ? 0.5 : 0), 0);
    };
    const toggle = (id: string) => {
      if (id === cp.hero) return setToast(`${UNITS[cp.hero].name}은(는) 늘 출전해요 (지도자)`);
      setParty((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= max ? (setToast(`이번 판은 ${max}명까지`), p) : [...p, id]));
    };
    const recommend = () => {
      const pool = cp.joined.filter((id) => id !== cp.hero).sort((a, c) => good(c) - good(a) || cp.roster[c].lv - cp.roster[a].lv);
      const out: string[] = [cp.hero];
      const roles = new Set<string>();
      // 탱커·힐러 하나씩은 꼭, 그다음 상성 좋은 순
      for (const need of ['tank', 'healer']) {
        const x = pool.find((id) => defOf(id).role === need && !out.includes(id));
        if (x && out.length < max) out.push(x), roles.add(need);
      }
      for (const id of pool) if (out.length < max && !out.includes(id)) out.push(id);
      setParty(out);
    };
    return (
      <div className="tac prep">
        <header className="t-head">
          <button className="link" onClick={() => setScreen('camp')}>
            ‹ 목록
          </button>
          <b>
            {st.n}. {st.name}
          </b>
          <span>🪙 {cp.gold}</span>
        </header>
        <div className="prep-body">
          <p className="tac-story">{st.story}</p>
          <div className="tac-goal">
            🏆 {st.win === 'boss' ? '👑 보스를 쓰러뜨리면 승리' : '적을 모두 쓰러뜨리면 승리'} · ⏳ {st.turns}턴 안에 · 💀 {UNITS[cp.hero].name}이(가) 쓰러지면 패배
          </div>
          <div className="prep-sec">적</div>
          <div className="foe-row">
            {foes.map((f, i) => (
              <div key={i} className={`foe ${f.boss ? 'boss' : ''}`}>
                <img src={img(unitArt(f.d.art, 'p', f.lv))} alt="" />
                <small>
                  {f.boss ? '👑' : ''}
                  {f.d.name}
                </small>
                <small>
                  {f.d.element ? EL_ICON[f.d.element] : ''}
                  {ROLES[f.d.role].icon} {f.lv}
                </small>
              </div>
            ))}
          </div>
          <div className="tac-tip">💡 {st.tip}</div>
          <div className="prep-sec">
            출전 {party.length}/{max}{' '}
            <button className="link" onClick={recommend}>
              ✨ 상성 추천 편성
            </button>
          </div>
          <div className="roster-row">
            {cp.joined.map((id) => (
              <div key={id} className="pick-wrap">
                <UnitChip id={id} cp={cp} on={party.includes(id)} onClick={() => toggle(id)} />
                {good(id) > 0 && <i className="pick-good">▲유리</i>}
                {good(id) < 0 && <i className="pick-bad">▼불리</i>}
              </div>
            ))}
          </div>
        </div>
        <div className="prep-foot">
          <button className="ghost" onClick={() => setPanel('roster')}>
            🛡 장비
          </button>
          <button className="ghost" onClick={() => setPanel('shop')}>
            🏪 상점
          </button>
          <button className="cta" disabled={!party.includes(cp.hero)} onClick={() => startBattle(prep, party)}>
            ⚔️ 전투 시작
          </button>
        </div>
        {panels}
      </div>
    );
  }

  // ── 결과 ──
  if (screen === 'result' && reward) {
    const st = STAGES[reward.stage - 1];
    const next = reward.win && reward.stage < STAGES.length;
    return (
      <div className="tac result">
        <div className={`res-card ${reward.win ? 'win' : 'lose'}`}>
          <div className="res-tag">{reward.win ? '🏆 승리!' : '패배…'}</div>
          <h2>
            {st.n}. {st.name}
          </h2>
          <div>🪙 +{reward.gold}</div>
          {reward.items.length > 0 && <div>🎁 {reward.items.map((id) => `${ITEMS[id].icon} ${ITEMS[id].name}`).join(', ')}</div>}
          {reward.levels.map((l) => (
            <div key={l.id} className="small">
              ⬆ {defOf(l.id).name} {l.from} → {l.to}레벨
            </div>
          ))}
          {reward.joins.map((id) => (
            <div key={id} className="tac-join">
              <img src={img(unitArt(defOf(id).art, 't', ref.current.cp.roster[id]?.lv ?? 1))} alt="" />
              <div>
                <b>✨ {defOf(id).name} 합류!</b>
                <small>
                  {ROLES[defOf(id).role].icon} {ROLES[defOf(id).role].name} · {defOf(id).element ? `${EL_ICON[defOf(id).element!]} ${EL_NAME[defOf(id).element!]}` : ''}
                </small>
              </div>
            </div>
          ))}
          {!reward.win && <p className="small muted">얻은 경험치는 남아요. 레벨을 올리거나(앞 판 다시 하기), 장비를 바꾸거나, 상성 좋은 스피릿으로 바꿔 보세요.</p>}
          <div className="res-btns">
            {next && (
              <button className="cta" onClick={() => (setPrep(reward.stage + 1), setParty(ref.current.cp.party.slice(0, maxParty(reward.stage + 1))), setScreen('prep'))}>
                ▶ 다음: {STAGES[reward.stage].name}
              </button>
            )}
            {!reward.win && (
              <button className="cta" onClick={() => (setPrep(reward.stage), setScreen('prep'))}>
                다시 도전
              </button>
            )}
            <button className="ghost" onClick={() => setScreen('camp')}>
              스테이지 목록
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 전투 ──
  if (!b) {
    setTimeout(() => setScreen('camp'));
    return null;
  }
  const st = STAGES[b.stage - 1];
  const su = sel !== null ? b.units[sel] : null;
  const mine = su && su.side === 'ally' && b.phase === 'ally' && !su.acted && !busy;

  // 범위 표시
  const marks: Marks = { move: new Set(), target: new Set(), area: new Set(), threat: new Set(), path: [] };
  if (su && !su.dead) {
    if (su.side === 'enemy' || mode.k === 'inspect') {
      const mr = moveRange(b, su);
      for (const v of mr.values()) {
        marks.threat.add(key(v.c, v.r));
        const rg = unitStats(su).range;
        const dim = sizeOf(STAGES[b.stage - 1]);
        for (let r = 0; r < dim.rows; r++) for (let c = 0; c < dim.cols; c++) {
          const dd = Math.max(0, hexDist({ c, r }, v));
          if (dd >= rg[0] && dd <= rg[1]) marks.threat.add(key(c, r));
        }
      }
    } else if (mine) {
      if (mode.k === 'select') {
        for (const v of moveRange(b, su).values()) marks.move.add(key(v.c, v.r));
        for (const t of attackTargets(b, su)) marks.target.add(key(t.c, t.r));
      } else if (mode.k === 'menu' || mode.k === 'attack') {
        for (const t of attackTargets(b, su)) marks.target.add(key(t.c, t.r));
      } else if (mode.k === 'skill') {
        for (const p of skillTargets(b, su, SKILLS[mode.skill])) marks.target.add(key(p.c, p.r));
      } else if (mode.k === 'item') {
        for (const t of itemTargets(b, su)) marks.target.add(key(t.c, t.r));
      }
      if (pending?.k === 'skill') {
        const sk = SKILLS[pending.skill];
        const cells = sk.area === 'target+adj' ? [pending.at, ...neighbors(pending.at.c, pending.at.r)] : sk.area === 'self+adj' ? neighbors(su.c, su.r) : sk.area === 'allies2' ? alive(b, su.side).filter((x) => hexDist(x, su) <= 2) : [pending.at];
        for (const p of cells) marks.area.add(key(p.c, p.r));
      }
      if (pending?.k === 'attack') marks.area.add(key(b.units[pending.t].c, b.units[pending.t].r));
    }
  }

  const doAct = (fn: (bb: Battle, u: Unit) => Ev[] | string) => {
    if (sel === null) return;
    const r = act((_c, bb) => fn(bb!, bb!.units[sel]));
    if (typeof r === 'string') return setToast(r);
    show(r);
    clearSel();
  };

  const onTap = (c: number, r: number) => {
    if (busy || b.result || brief) return;
    const u = unitAt(b, c, r);
    // 기술·공격 대상 고르기
    if (mine && su) {
      if (mode.k === 'item' && u && itemTargets(b, su).includes(u)) return doAct((bb, me) => useItem(bb, me, mode.item, bb.units[u.uid]));
      if (mode.k === 'skill' && marks.target.has(key(c, r))) return setPending({ k: 'skill', skill: mode.skill, at: { c, r } });
      if ((mode.k === 'select' || mode.k === 'menu' || mode.k === 'attack') && u && u.side === 'enemy' && marks.target.has(key(c, r))) {
        if (mode.k === 'select') setMode({ k: 'menu' });
        return setPending({ k: 'attack', t: u.uid });
      }
      if (mode.k === 'select' && marks.move.has(key(c, r)) && !(u && u.uid !== su.uid)) {
        if (u && u.uid === su.uid) return setMode({ k: 'menu' });
        const res = act((_c, bb) => moveUnit(bb!, bb!.units[su.uid], c, r));
        if (typeof res === 'string') return setToast(res);
        show(res);
        setMode({ k: 'menu' });
        setPending(null);
        return;
      }
    }
    if (u) {
      if (u.side === 'ally' && b.phase === 'ally' && !u.acted) {
        // 다른 아군을 고르면 이동 취소 후 바꾼다
        if (su && su.uid !== u.uid && su.moved && !su.acted) act((_c, bb) => undoMove(bb!, bb!.units[su.uid]));
        setSel(u.uid);
        setMode({ k: 'select' });
        setPending(null);
        return;
      }
      setSel(u.uid);
      setMode({ k: 'inspect' });
      setPending(null);
      return;
    }
    if (mode.k !== 'menu') clearSel();
  };

  const cancel = () => {
    if (pending) return setPending(null);
    if (mode.k === 'attack' || mode.k === 'skill' || mode.k === 'item') return setMode({ k: 'menu' });
    if (su && su.moved && !su.acted) {
      act((_c, bb) => undoMove(bb!, bb!.units[su.uid]));
      return setMode({ k: 'select' });
    }
    clearSel();
  };

  const allies = alive(b, 'ally');
  const left = allies.filter((u) => !u.acted).length;
  const enemies = alive(b, 'enemy').length;
  const fc = pending?.k === 'attack' && su ? forecast(b, su, b.units[pending.t]) : null;
  const skillFc = pending?.k === 'skill' && su ? skillPreview(b, su, SKILLS[pending.skill], pending.at) : null;
  const items = Object.keys(b.bag).filter((id) => (b.bag[id] ?? 0) > 0 && ITEMS[id].use);

  return (
    <div className="tac battle">
      <header className="t-bhead">
        <b>
          {st.n}. {st.name}
        </b>
        <span className={b.turn >= st.turns - 2 ? 'warn' : ''}>
          ⏳ {b.turn}/{st.turns}턴
        </span>
        <span>{st.win === 'boss' ? '👑 보스 격파' : `⚔️ 남은 적 ${enemies}`}</span>
        <button className="link" onClick={() => setPanel('help')}>
          ❔
        </button>
        <button className="link" onClick={() => confirm('전투를 포기하고 나갈까요? (얻은 경험치는 남아요)') && act((_c, bb) => void (bb!.result = 'lose'))}>
          🏳
        </button>
      </header>
      <div className={`t-phase ${b.phase}`}>{b.phase === 'ally' ? `🔵 아군 차례 · 행동 남은 ${left}/${allies.length}` : '🔴 적군 차례…'}</div>
      <main className="t-map" ref={mapRef}>
        <BattleView b={b} marks={su ? marks : EMPTY} selected={sel} fx={fx} fxKey={fxKey} onTap={onTap} />
        {banner && (
          <div key={banner} className="t-banner">
            {banner}
          </div>
        )}
      </main>

      {/* 아래: 고른 유닛 · 행동 */}
      <section className="t-panel">
        {su ? <UnitCard b={b} u={su} /> : <div className="t-hint">{b.phase === 'ally' ? '아군 유닛을 누르면 이동할 수 있는 칸(파랑)과 공격할 수 있는 적(빨강)이 보여요. 적을 누르면 그 적이 닿는 범위가 보여요.' : '적이 움직이는 중…'}</div>}
        {mine && su && (
          <div className="t-actions">
            {fc && pending?.k === 'attack' ? (
              <div className="forecast">
                <div>
                  ⚔️ {defOf(b.units[pending.t].def).name}에게 <b className={fc.mul > 1 ? 'strong' : fc.mul < 1 ? 'weak' : ''}>{fc.dmg}</b>
                  {fc.mul > 1 ? ' 유리!' : fc.mul < 1 ? ' 불리' : ''}
                  {fc.kills ? ' → 쓰러뜨림!' : ` (남은 체력 ${Math.max(0, b.units[pending.t].hp - fc.dmg)})`}
                  {fc.counter ? ` · 반격 ${fc.counter}` : ' · 반격 없음'}
                </div>
                <button className="cta small-cta" onClick={() => doAct((bb, me) => attack(bb, me, bb.units[pending.t]))}>
                  공격!
                </button>
                <button className="ghost" onClick={cancel}>
                  취소
                </button>
              </div>
            ) : pending?.k === 'skill' && skillFc ? (
              <div className="forecast">
                <div>
                  {SKILLS[pending.skill].icon} {SKILLS[pending.skill].name}: {skillFc}
                </div>
                <button className="cta small-cta" onClick={() => doAct((bb, me) => useSkill(bb, me, pending.skill, pending.at))}>
                  사용!
                </button>
                <button className="ghost" onClick={cancel}>
                  취소
                </button>
              </div>
            ) : mode.k === 'skill' ? (
              <div className="forecast">
                <div>
                  {SKILLS[mode.skill].icon} {SKILLS[mode.skill].name} — 빨간 칸을 누르세요. <small className="muted">{SKILLS[mode.skill].desc}</small>
                </div>
                <button className="ghost" onClick={cancel}>
                  취소
                </button>
              </div>
            ) : mode.k === 'item' ? (
              <div className="forecast">
                <div>
                  {ITEMS[mode.item].icon} {ITEMS[mode.item].name} — 자기나 옆 아군을 누르세요.
                </div>
                <button className="ghost" onClick={cancel}>
                  취소
                </button>
              </div>
            ) : mode.k === 'menu' || mode.k === 'select' ? (
              <div className="act-grid">
                <button className="act" disabled={!attackTargets(b, su).length} onClick={() => setMode({ k: 'attack' })}>
                  ⚔️<b>공격</b>
                  <small>{attackTargets(b, su).length ? `닿는 적 ${attackTargets(b, su).length}` : '닿는 적 없음'}</small>
                </button>
                {skillsOf(su).map((sk) => {
                  const err = canUseSkill(su, sk);
                  const tg = skillTargets(b, su, sk);
                  return (
                    <button
                      key={sk.id}
                      className="act"
                      disabled={!!err || !tg.length}
                      onClick={() => {
                        setMode({ k: 'skill', skill: sk.id });
                        if (sk.range[1] === 0) setPending({ k: 'skill', skill: sk.id, at: { c: su.c, r: su.r } });
                      }}
                    >
                      {sk.icon}
                      <b>{sk.name}</b>
                      <small>{err ? 'SP 부족' : !tg.length ? '대상 없음' : `SP ${sk.sp}`}</small>
                    </button>
                  );
                })}
                <button className="act" disabled={!items.length} onClick={() => setMode({ k: 'item', item: items[0] })}>
                  🎒<b>아이템</b>
                  <small>{items.map((id) => `${ITEMS[id].icon}${b.bag[id]}`).join(' ') || '없음'}</small>
                </button>
                <button className="act" onClick={() => doAct((bb, me) => waitUnit(bb, me))}>
                  ⏸<b>대기</b>
                  <small>행동 끝</small>
                </button>
                {mode.k === 'menu' && su.moved && (
                  <button className="act" onClick={cancel}>
                    ↩<b>이동 취소</b>
                  </button>
                )}
              </div>
            ) : null}
            {mode.k === 'item' && items.length > 1 && (
              <div className="item-pick">
                {items.map((id) => (
                  <button key={id} className={mode.item === id ? 'on' : ''} onClick={() => setMode({ k: 'item', item: id })}>
                    {ITEMS[id].icon} {ITEMS[id].name} ×{b.bag[id]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="t-foot">
          <button className={`ghost ${auto ? 'on' : ''}`} onClick={() => setAuto((a) => !a)} disabled={b.phase !== 'ally'}>
            🤖 자동 {auto ? '켜짐' : '꺼짐'}
          </button>
          <button className="cta small-cta" disabled={busy || b.phase !== 'ally'} onClick={() => void endTurn()}>
            턴 종료 ▶
          </button>
        </div>
      </section>

      {brief && (
        <div className="t-modal">
          <div className="t-brief">
            <div className="res-tag">
              {st.n}. {st.name}
            </div>
            <p>{st.story}</p>
            <div className="tac-goal">
              🏆 {st.win === 'boss' ? '👑 보스를 쓰러뜨리면 승리' : '적을 모두 쓰러뜨리면 승리'} · ⏳ {st.turns}턴 · 💀 {UNITS[cp.hero].name}이(가) 쓰러지면 패배
            </div>
            <div className="tac-tip">💡 {st.tip}</div>
            <button className="cta" onClick={() => (setBrief(false), setBanner('1턴 · 아군 차례'), focus(b.units.find((x) => x.side === 'ally')?.uid ?? null, true))}>
              전투 시작
            </button>
          </div>
        </div>
      )}
      {panels}
    </div>
  );
}

function hexDist(a: Pos, b2: Pos) {
  const cube = (p: Pos) => {
    const x = p.c - (p.r - (p.r & 1)) / 2;
    return { x, z: p.r, y: -x - p.r };
  };
  const A = cube(a);
  const B = cube(b2);
  return Math.max(Math.abs(A.x - B.x), Math.abs(A.y - B.y), Math.abs(A.z - B.z));
}

/** 기술 미리보기 문장 */
function skillPreview(b: Battle, u: Unit, sk: SkillDef, at: Pos): string {
  if (sk.kind === 'attack') {
    const cells = sk.area === 'target+adj' ? [at, ...neighbors(at.c, at.r)] : sk.area === 'self+adj' ? neighbors(u.c, u.r) : [at];
    const hits = cells.map((p) => unitAt(b, p.c, p.r)).filter((x): x is Unit => !!x && x.side !== u.side);
    if (!hits.length) return '맞을 적이 없어요';
    return hits
      .map((t) => {
        const f = forecast(b, u, t, sk);
        return `${defOf(t.def).name} ${f.dmg}${f.mul > 1 ? '(유리)' : f.mul < 1 ? '(불리)' : ''}${f.kills ? '💀' : ''}`;
      })
      .join(', ');
  }
  if (sk.kind === 'heal') return sk.area ? '2칸 안 아군 모두 회복' : `${defOf(unitAt(b, at.c, at.r)!.def).name} 회복`;
  return sk.desc;
}

function UnitCard({ b, u }: { b: Battle; u: Unit }) {
  const d = defOf(u.def);
  const s = unitStats(u);
  const t = terrainAt(STAGES[b.stage - 1], u.c, u.r);
  return (
    <div className={`ucard ${u.side}`}>
      <img src={img(unitArt(d.art, 'p', u.lv))} alt="" />
      <div className="uc-main">
        <div className="uc-name">
          <b>
            {u.boss ? '👑' : ''}
            {d.name}
          </b>
          <span>{u.lv}레벨</span>
          <span>
            {ROLES[d.role].icon} {ROLES[d.role].name}
          </span>
          {d.element && (
            <span style={{ color: EL_COLOR[d.element] }}>
              {EL_ICON[d.element]}
              {EL_NAME[d.element]}
            </span>
          )}
        </div>
        <div className="bar hp">
          <i style={{ width: `${(u.hp / s.hp) * 100}%` }} />
          <span>
            체력 {u.hp}/{s.hp}
          </span>
        </div>
        <div className="bar sp">
          <i style={{ width: `${(u.sp / s.spMax) * 100}%` }} />
          <span>
            SP {u.sp}/{s.spMax}
          </span>
        </div>
        <div className="uc-stats">
          {s.dmg === 'phys' ? '⚔️' : '🔮'}
          {Math.round(s.atk)} 🛡{Math.round(s.def)} 🔰{Math.round(s.res)} 👣{s.move} 🎯{s.range[0] === s.range[1] ? s.range[0] : `${s.range[0]}~${s.range[1]}`} · {t ? `${{ plain: '평지', forest: '숲', hill: '언덕', water: '물', rock: '바위', camp: '야영지' }[t]}` : ''}
          {u.acted && u.side === b.phase ? ' · 행동 끝' : ''}
        </div>
      </div>
    </div>
  );
}
