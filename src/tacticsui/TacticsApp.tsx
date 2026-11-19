// 헥사 전술 전투 (D109 → D136 '탐험의 숲' UI): 처음 화면 → 주인공 → 아래 탭(원정·부대·스피릿·도감·상점) → 전투 → 결과.
import { useCallback, useEffect, useRef, useState } from 'react';
import { stepSide } from '../tactics/ai';
import { EL_NAME, ITEMS, ROLES, SKILLS, UNITS, unitArt, type SkillDef } from '../tactics/data';
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
import { chapterOf, sizeOf, STAGES, terrainAt } from '../tactics/stages';
import { BattleView, cellXY, viewSize, type Marks } from './BattleView';
import { HelpPanel } from './Panels';
import { DexTab, ExpeditionTab, goodScore, PartyTab, ResultView, ShopTab, SpiritTab, StageDetail, winText } from './Screens';
import { art, ElBadge, face, Modal, Ribbon, stageCode, TabBar, TopBar, ui, type Tab } from './ui';
import { useTactics } from './store';

type Screen = 'title' | 'choose' | 'main' | 'battle' | 'result';
type Mode = { k: 'idle' } | { k: 'select' } | { k: 'menu' } | { k: 'skills' } | { k: 'attack' } | { k: 'skill'; skill: string } | { k: 'item'; item: string } | { k: 'inspect' };
type Pending = { k: 'attack'; t: number } | { k: 'skill'; skill: string; at: Pos } | null;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const EMPTY: Marks = { move: new Set(), target: new Set(), area: new Set(), threat: new Set(), path: [] };

export function TacticsApp() {
  const { cp, battle: b, act, setBattle, reset, hasSave, ref } = useTactics();
  const [screen, setScreen] = useState<Screen>(() => 'title');
  const [panel, setPanel] = useState<'help' | null>(null);
  const [tab, setTab] = useState<Tab>('expedition');
  const [chapter, setChapter] = useState(() => chapterOf(Math.min(unlockedStage(cp), STAGES.length)));
  const [stageInfo, setStageInfo] = useState<number | null>(null);
  const [spiritPick, setSpiritPick] = useState<string | null>(null);
  const [pause, setPause] = useState(false);
  const [hero, setHero] = useState<'aren' | 'lia'>('aren');
  const [prep, setPrep] = useState(() => Math.min(unlockedStage(cp), STAGES.length));
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
  // D126: 자동 버튼 — 꺼짐 → 켜짐(1배) → 2배속 → 4배속 → 꺼짐
  const [auto, setAuto] = useState<0 | 1 | 2 | 4>(0);
  const autoRef = useRef(auto);
  autoRef.current = auto;
  const spd = () => autoRef.current || 1; // 화면 속도 배율
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
    const id = setTimeout(() => setBanner(null), 1300 / spd());
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
        await sleep((side === 'enemy' ? 520 : 450) / spd());
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
    await sleep(500 / spd());
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
      const id = setTimeout(() => void endTurn(), 450 / spd());
      return () => clearTimeout(id);
    }
    if (autoRef.current && mode.k === 'idle') {
      const id = setTimeout(() => void runAuto(), 300 / spd());
      return () => clearTimeout(id);
    }
  }, [b, busy, screen, endTurn, runAuto, mode.k, brief, auto]);

  // 승패가 나면 결과 화면
  useEffect(() => {
    if (!b?.result || screen !== 'battle') return;
    const id = setTimeout(() => {
      const r = act((c, bb) => finishBattle(c, bb!));
      setReward({ ...r, stage: b.stage });
      setBattle(null);
      setAuto(0);
      clearSel();
      setScreen('result');
      window.scrollTo(0, 0);
    }, 1300 / spd());
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

  /** 부대 탭(출전 준비)을 n판으로 연다 */
  const openPrep = (n: number) => {
    const c = ref.current.cp;
    setPrep(n);
    setParty([c.hero, ...c.party.filter((id) => c.roster[id] && id !== c.hero)].slice(0, maxParty(n)));
    setStageInfo(null);
    setTab('party');
    setScreen('main');
  };
  /** 상성 추천 편성: 탱커·힐러 하나씩, 그다음 상성 좋은 순 */
  const recommend = (n: number) => {
    const c = ref.current.cp;
    const max = maxParty(n);
    const pool = c.joined.filter((id) => id !== c.hero).sort((a, x) => goodScore(x, n) - goodScore(a, n) || c.roster[x].lv - c.roster[a].lv);
    const out: string[] = [c.hero];
    for (const need of ['tank', 'healer']) {
      const x = pool.find((id) => defOf(id).role === need && !out.includes(id));
      if (x && out.length < max) out.push(x);
    }
    for (const id of pool) if (out.length < max && !out.includes(id)) out.push(id);
    setParty(out);
    setToast('✨ 상성 추천 편성 완료');
  };
  const goTab = (t: Tab) => {
    if (t === 'party') return openPrep(tab === 'party' ? prep : Math.min(unlockedStage(ref.current.cp), STAGES.length));
    if (t === 'expedition') setChapter(chapterOf(Math.min(unlockedStage(ref.current.cp), STAGES.length)));
    if (t === 'spirit') setSpiritPick(null);
    setTab(t);
    setScreen('main');
  };
  const toastEl = toast && <div className="fx-toast">{toast}</div>;
  const helpEl = panel === 'help' && <HelpPanel onClose={() => setPanel(null)} />;

  // ── 처음 화면 ──
  if (screen === 'title')
    return (
      <div className="fx fx-title">
        <img className="fx-title-art" src={ui('title-art')} alt="헥사 프론티어" />
        <div className="fx-title-btns">
          <button
            className="fx-btn gold big"
            onClick={() => {
              if (!b) return hasSave ? (setChapter(chapterOf(Math.min(unlockedStage(cp), STAGES.length))), setTab('expedition'), setScreen('main')) : setScreen('choose');
              setScreen('battle');
              setBrief(false);
              setTimeout(() => focus(b.units.find((x) => x.side === 'ally' && !x.dead)?.uid ?? null, true), 60);
            }}
          >
            ⚔️ {b ? '전투 이어서' : hasSave ? '이어서 하기' : '모험 시작'}
          </button>
          {hasSave && (
            <button className="fx-btn cream" onClick={() => confirm('처음부터 다시 시작할까요? 지금 진행은 사라져요.') && setScreen('choose')}>
              처음부터
            </button>
          )}
          <small className="fx-title-sub">스피릿 부대를 이끄는 헥사 전술 전투</small>
        </div>
      </div>
    );

  // ── 주인공 고르기 (D119) ──
  if (screen === 'choose')
    return (
      <div className="fx fx-bg">
        <TopBar cp={{ ...cp, hero }} />
        <div className="fx-page">
          <div className="fx-panel fx-choose">
            <Ribbon>누구와 떠날까요?</Ribbon>
            <div className="fx-heroes">
              {(['aren', 'lia'] as const).map((id) => (
                <button key={id} className={`fx-herocard ${hero === id ? 'on' : ''}`} onClick={() => setHero(id)}>
                  <img src={ui(`hero-${id}`)} alt="" />
                  <Ribbon small>{UNITS[id].name}</Ribbon>
                  <span className="fx-herorole">
                    <i>{ROLES[UNITS[id].role].icon}</i> {ROLES[UNITS[id].role].name}
                  </span>
                  <small>{UNITS[id].desc}</small>
                </button>
              ))}
            </div>
            <div className="fx-note">ⓘ 고르지 않은 주인공은 먼 훗날 동료로 만나요.</div>
            <button className="fx-btn gold big" onClick={() => (reset(hero), setBattle(null), setChapter(0), setTab('expedition'), setScreen('main'))}>
              ✓ 이 주인공으로 시작
            </button>
          </div>
        </div>
      </div>
    );

  // ── 결과 ──
  if (screen === 'result' && reward)
    return (
      <div className="fx fx-bg">
        <TopBar cp={cp} />
        <ResultView
          cp={cp}
          reward={reward}
          onNext={() => openPrep(reward.stage + 1)}
          onRetry={() => openPrep(reward.stage)}
          onCamp={() => goTab('expedition')}
          onPrev={() => openPrep(Math.max(1, reward.stage - 1))}
          onRecommend={() => (openPrep(reward.stage), setTimeout(() => recommend(reward.stage)))}
          onEquip={() => (setSpiritPick(cp.hero), setTab('spirit'), setScreen('main'))}
          onSpirit={(id) => (setSpiritPick(id), setTab('spirit'), setScreen('main'))}
        />
        <TabBar tab={null} onTab={goTab} />
        {toastEl}
      </div>
    );

  // ── 아래 탭 화면 ──
  if (screen === 'main' || screen === 'result' || (screen === 'battle' && !b)) {
    if (screen !== 'main') setTimeout(() => setScreen('main'));
    const newJoin = cp.joined.filter((id) => !cp.party.includes(id)).length;
    return (
      <div className={`fx fx-bg tab-${tab}`}>
        <TopBar cp={cp} />
        {tab === 'expedition' && <ExpeditionTab cp={cp} chapter={chapter} setChapter={setChapter} onStage={(n) => setStageInfo(n)} onHelp={() => setPanel('help')} />}
        {tab === 'party' && (
          <PartyTab
            cp={cp}
            n={prep}
            party={party}
            setParty={setParty}
            max={maxParty(prep)}
            toast={setToast}
            onRecommend={() => recommend(prep)}
            onEquip={(id) => (setSpiritPick(id), setTab('spirit'))}
            onStart={() => startBattle(prep, party)}
            act={(fn) => act((c) => fn(c))}
          />
        )}
        {tab === 'spirit' && <SpiritTab cp={cp} act={(fn) => act((c) => fn(c))} toast={setToast} pick={spiritPick} setPick={setSpiritPick} />}
        {tab === 'dex' && <DexTab cp={cp} onPick={(id) => (setSpiritPick(id), setTab('spirit'))} />}
        {tab === 'shop' && <ShopTab cp={cp} act={(fn) => act((c) => fn(c))} toast={setToast} />}
        <TabBar tab={tab} onTab={goTab} badge={{ party: tab === 'party' ? 0 : Math.min(9, newJoin) }} />
        {stageInfo !== null && <StageDetail cp={cp} n={stageInfo} onClose={() => setStageInfo(null)} onGo={() => openPrep(stageInfo)} />}
        {helpEl}
        {toastEl}
      </div>
    );
  }

  // ── 전투 ──
  if (!b) return null;
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
      } else if (mode.k === 'menu' || mode.k === 'attack' || mode.k === 'skills') {
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
      if ((mode.k === 'select' || mode.k === 'menu' || mode.k === 'attack' || mode.k === 'skills') && u && u.side === 'enemy' && marks.target.has(key(c, r))) {
        if (mode.k !== 'menu') setMode({ k: 'menu' });
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
    if (mode.k !== 'menu' && mode.k !== 'skills') clearSel();
  };

  const cancel = () => {
    if (pending) return setPending(null);
    if (mode.k === 'skill') return setMode({ k: 'skills' });
    if (mode.k === 'attack' || mode.k === 'skills' || mode.k === 'item') return setMode({ k: 'menu' });
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

  const skillList = mine && su ? skillsOf(su) : [];
  const usable = skillList.filter((sk) => !canUseSkill(su!, sk) && skillTargets(b, su!, sk).length).length;
  const tgtN = mine && su ? attackTargets(b, su).length : 0;
  const tgt = pending?.k === 'attack' ? b.units[pending.t] : null;
  return (
    <div className="fx fx-battle" style={{ ['--spd' as string]: String(auto || 1) }}>
      <TopBar cp={cp} />
      <div className="fx-bpills">
        <span className="fx-bpill grow">⛰️ {stageCode(st.n)} · {st.name}</span>
        <span className={`fx-bpill ${b.turn >= st.turns - 2 ? 'warn' : ''}`}>⏳ {b.turn}/{st.turns}턴</span>
        <span className="fx-bpill">{st.win === 'boss' ? '👑 보스' : `⚔️ 남은 적 ${enemies}`}</span>
        <button className="fx-round sm" onClick={() => setPanel('help')}>
          ?
        </button>
        <button className="fx-round sm" onClick={() => setPause(true)}>
          ❚❚
        </button>
      </div>
      <div className={`fx-phase ${b.phase}`}>{b.phase === 'ally' ? `아군 차례 · 행동 남은 ${left}/${allies.length}` : '적군 차례…'}</div>
      <main className="t-map fx-bmap" ref={mapRef}>
        <BattleView b={b} marks={su ? marks : EMPTY} selected={sel} fx={fx} fxKey={fxKey} onTap={onTap} />
        {banner && (
          <div key={banner} className="t-banner">
            {banner}
          </div>
        )}
      </main>

      {/* 아래: 고른 유닛 · 행동 */}
      <section className="fx-bpanel">
        {su ? <UnitCard b={b} u={su} /> : <div className="fx-bhint">{b.phase === 'ally' ? '아군 스피릿을 누르면 이동할 수 있는 칸(파랑)과 공격할 수 있는 적(빨강)이 보여요. 적을 누르면 그 적이 닿는 범위가 보여요.' : '적이 움직이는 중…'}</div>}
        {mine && su && (
          <>
            <div className="fx-fc">
              {fc && tgt ? (
                <>
                  <img src={art(unitArt(defOf(tgt.def).art, 'p', tgt.lv))} alt="" />
                  <div>
                    {defOf(tgt.def).name}에게 <b className="dmg">{fc.dmg}</b>
                    {fc.mul > 1 ? <b className="good"> · ⇧유리!</b> : fc.mul < 1 ? <b className="bad"> · ⇩불리</b> : ''}
                    {fc.kills ? ' · 쓰러뜨림!' : ''} · {fc.counter ? `반격 ${fc.counter}` : '반격 없음'}
                  </div>
                  <button className="fx-btn gold" onClick={() => doAct((bb, me) => attack(bb, me, bb.units[pending!.k === 'attack' ? pending!.t : 0]))}>
                    ⚔️ 공격!
                  </button>
                  <button className="fx-mini-x" onClick={cancel}>
                    ✕
                  </button>
                </>
              ) : pending?.k === 'skill' && skillFc ? (
                <>
                  <span className="fx-fc-ic">{SKILLS[pending.skill].icon}</span>
                  <div>
                    <b>{SKILLS[pending.skill].name}</b> · {skillFc}
                  </div>
                  <button className="fx-btn gold" onClick={() => doAct((bb, me) => useSkill(bb, me, pending.skill, pending.at))}>
                    사용!
                  </button>
                  <button className="fx-mini-x" onClick={cancel}>
                    ✕
                  </button>
                </>
              ) : mode.k === 'skills' ? (
                <div className="fx-skillpick">
                  {skillList.map((sk) => {
                    const err = canUseSkill(su, sk);
                    const tg = skillTargets(b, su, sk);
                    return (
                      <button
                        key={sk.id}
                        disabled={!!err || !tg.length}
                        onClick={() => {
                          setMode({ k: 'skill', skill: sk.id });
                          if (sk.range[1] === 0) setPending({ k: 'skill', skill: sk.id, at: { c: su.c, r: su.r } });
                        }}
                      >
                        <span>{sk.icon}</span>
                        <b>{sk.name}</b>
                        <small>{err ? 'SP 부족' : !tg.length ? '대상 없음' : `SP ${sk.sp}`}</small>
                      </button>
                    );
                  })}
                  {!skillList.length && <small>아직 배운 기술이 없어요</small>}
                  <button className="fx-mini-x" onClick={cancel}>
                    ✕
                  </button>
                </div>
              ) : mode.k === 'skill' ? (
                <>
                  <span className="fx-fc-ic">{SKILLS[mode.skill].icon}</span>
                  <div>
                    <b>{SKILLS[mode.skill].name}</b> — 빨간 칸을 누르세요. <small>{SKILLS[mode.skill].desc}</small>
                  </div>
                  <button className="fx-mini-x" onClick={cancel}>
                    ✕
                  </button>
                </>
              ) : mode.k === 'item' ? (
                <div className="fx-skillpick">
                  {items.map((id) => (
                    <button key={id} className={mode.item === id ? 'on' : ''} onClick={() => setMode({ k: 'item', item: id })}>
                      <span>{ITEMS[id].icon}</span>
                      <b>{ITEMS[id].name}</b>
                      <small>×{b.bag[id]} · 아군을 누르세요</small>
                    </button>
                  ))}
                  <button className="fx-mini-x" onClick={cancel}>
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="fx-fc-hint">{mode.k === 'attack' ? '빨간 적을 눌러 공격할 대상을 고르세요' : su.moved ? '이동했어요. 행동을 고르세요' : '파란 칸으로 이동하거나, 빨간 적을 눌러 공격하세요'}</div>
                  {su.moved && (
                    <button className="fx-btn cream slim" onClick={cancel}>
                      ↩ 이동 취소
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="fx-acts">
              <button className={`fx-act ${mode.k === 'attack' || pending?.k === 'attack' ? 'on' : ''}`} disabled={!tgtN} onClick={() => setMode({ k: 'attack' })}>
                ⚔️ 공격
              </button>
              <button className={`fx-act ${mode.k === 'skills' || mode.k === 'skill' ? 'on' : ''}`} onClick={() => (setPending(null), setMode({ k: 'skills' }))}>
                🌀 기술{usable > 0 && <i className="fx-badge in">{usable}</i>}
              </button>
              <button className={`fx-act ${mode.k === 'item' ? 'on' : ''}`} disabled={!items.length} onClick={() => (setPending(null), setMode({ k: 'item', item: items[0] }))}>
                👝 아이템
              </button>
              <button className="fx-act" onClick={() => doAct((bb, me) => waitUnit(bb, me))}>
                ⏳ 대기
              </button>
            </div>
          </>
        )}
        <div className="fx-bfoot">
          <div className="fx-auto">
            <span>🤖 자동</span>
            {([0, 1, 2, 4] as const).map((a) => (
              <button
                key={a}
                className={auto === a ? 'on' : ''}
                onClick={() => {
                  if (a && su && su.moved && !su.acted) act((_c, bb) => undoMove(bb!, bb!.units[su.uid]));
                  if (a) clearSel();
                  setAuto(a);
                }}
              >
                {a === 0 ? '끄기' : `${a}배속`}
              </button>
            ))}
          </div>
          <button className="fx-btn gold" disabled={busy || b.phase !== 'ally'} onClick={() => void endTurn()}>
            턴 종료 ▶
          </button>
        </div>
      </section>

      {brief && (
        <Modal className="fx-stage">
          <Ribbon>
            {stageCode(st.n)} · {st.name}
          </Ribbon>
          <p className="fx-story">{st.story}</p>
          <div className="fx-row-box">
            <span className="fx-label">승리 조건</span>
            <b>⚔️ {winText(st.n)}</b>
          </div>
          <div className="fx-tipbox">💡 {st.tip}</div>
          <div className="fx-tipbox warn">💀 {UNITS[cp.hero].name}이(가) 쓰러지면 패배해요</div>
          <button className="fx-btn gold big" onClick={() => (setBrief(false), setBanner('1턴 · 아군 차례'), focus(b.units.find((x) => x.side === 'ally')?.uid ?? null, true))}>
            ⚔️ 전투 시작
          </button>
        </Modal>
      )}
      {pause && (
        <Modal onClose={() => setPause(false)} className="fx-pause">
          <Ribbon>일시 정지</Ribbon>
          <button className="fx-btn gold big" onClick={() => setPause(false)}>
            ▶ 계속하기
          </button>
          <button className="fx-btn cream" onClick={() => (setPause(false), setPanel('help'))}>
            ❔ 전투 규칙
          </button>
          <button className="fx-btn cream" onClick={() => (setPause(false), setScreen('title'))}>
            🏠 처음 화면 (전투는 저장돼요)
          </button>
          <button className="fx-btn grey" onClick={() => confirm('전투를 포기하고 나갈까요? (얻은 경험치는 남아요)') && (setPause(false), act((_c, bb) => void (bb!.result = 'lose')))}>
            🏳 포기하기
          </button>
        </Modal>
      )}
      {helpEl}
      {toastEl}
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
    <div className={`fx-ucard ${u.side}`}>
      <img className="fx-uc-img" src={u.side === 'ally' && d.hero ? face(u.def) : art(unitArt(d.art, 'p', u.lv))} alt="" />
      <div className="fx-uc-main">
        <div className="fx-uc-name">
          <b>
            {u.boss ? '👑' : ''}
            {d.name}
          </b>
        </div>
        <div className="fx-uc-sub">
          <span className="fx-lv">Lv.{u.lv}</span>
          {d.element && (
            <span>
              <ElBadge el={d.element} size={18} /> {EL_NAME[d.element]}
            </span>
          )}
          <span className="fx-muted">{ROLES[d.role].icon}</span>
        </div>
        <div className="fx-uc-bar">
          <span>❤️ HP</span>
          <div className="fx-bar hp">
            <i style={{ width: `${(u.hp / s.hp) * 100}%` }} />
            <em>
              {u.hp} / {s.hp}
            </em>
          </div>
        </div>
        <div className="fx-uc-bar">
          <span>💧 SP</span>
          <div className="fx-bar sp">
            <i style={{ width: `${(u.sp / s.spMax) * 100}%` }} />
            <em>
              {u.sp} / {s.spMax}
            </em>
          </div>
        </div>
      </div>
      <div className="fx-uc-stats">
        <span>{s.dmg === 'phys' ? '⚔️ 공격' : '🔮 마공'}</span>
        <b>{Math.round(s.atk)}</b>
        <span>🛡️ 방어</span>
        <b>{Math.round(s.def)}</b>
        <span>🔰 마방</span>
        <b>{Math.round(s.res)}</b>
        <span>👣 이동</span>
        <b>
          {s.move} · 🎯{s.range[0] === s.range[1] ? s.range[0] : `${s.range[0]}~${s.range[1]}`}
        </b>
        <small>
          {t ? `${{ plain: '평지', forest: '숲', hill: '언덕', water: '물', rock: '바위', camp: '야영지' }[t]}` : ''}
          {u.acted && u.side === b.phase ? ' · 행동 끝' : ''}
        </small>
      </div>
    </div>
  );
}
