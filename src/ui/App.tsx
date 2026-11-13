import { useEffect, useRef, useState } from 'react';
import type { ActionId } from '../core/analysis';
import { HOUR } from '../core/clock';
import {
  applyBattle,
  prepareBattle,
  walkPath,
  affordableLevelUps,
  currentObjective,
  enterTile,
  evolveNeed,
  idlePreview,
  idleUnlocked,
  mapUnlocked,
  objectiveTile,
  reachableTiles,
  stageProgress,
  summon,
  summonUnlocked,
  travel,
  upgradeUnlocked,
  type BattleOutcome,
  type GameState,
} from '../core/game';
import { recommendedPower, teamPower } from '../core/power';
import type { Element } from '../core/types';
import { BALANCE } from '../data/balance';
import { MAP_ORDER, MAPS, TILE_BY_ID } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { asset, ELEMENT_ICON, ElementChart, ElementTag, GOLD, portrait, POWER, RoleTag, STONE } from './art';
import { elementMultiplier, ELEMENT_LABEL } from '../core/board';
import { BattlePrep } from './BattlePrep';
import { BattleView } from './BattleView';
import { LiveBattleView } from './LiveBattle';
import type { BattleSetup } from '../core/battle';
import { CampView } from './CampView';
import { SpiritView } from './SpiritView';
import { SummonView } from './SummonView';
import { MapView } from './MapView';
import { useGame } from './store';
import { computeGuide, GuideBar, Intro, type Tab } from './tutorial';

export function App() {
  const { state, now, act, dev, notice, clearNotice } = useGame();
  const [tab, setTab] = useState<Tab>('map');
  const [selected, setSelected] = useState<string | null>(null);
  const [battle, setBattle] = useState<BattleOutcome | null>(null);
  const [live, setLive] = useState<{ tileId: string; setup: BattleSetup } | null>(null);
  const [walk, setWalk] = useState<string | null>(null);
  const walkTimer = useRef<number | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [evolve, setEvolve] = useState<{ id: string; stage: number } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [devOpen, setDevOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [focusLevel, setFocusLevel] = useState(false);
  const [elemOpen, setElemOpen] = useState(false);
  const [elemFocus, setElemFocus] = useState<Element | null>(null);
  const [dup, setDup] = useState(false);

  const tut = state.tutorial;
  const tutActive = tut.introSeen && !tut.done;
  // 튜토리얼 설명 팝업 (D63): 그 칸을 이기거나 진 직후 한 번씩
  const cl = (id: string) => state.cleared.includes(id);
  const free = tutActive && !battle && !joined && !evolve && state.map === 'P00';
  const elemIntroDue = free && !tut.elementIntro && cl('a5');
  const golemLossDue = free && !elemIntroDue && !tut.golemLoss && !!state.bossAttempts['b1'] && !cl('b1');
  const golemWinDue = free && !tut.golemWin && cl('b1');
  const magicDue = free && !tut.magicIntro && !!state.attempts['c2'] && !cl('c2');
  const evoDue = free && !tut.evoIntro && !!state.bossAttempts['b2'] && !cl('b2');
  const tutModal = elemIntroDue || golemLossDue || golemWinDue || magicDue || evoDue;
  const [summoned, setSummoned] = useState(false);
  const guide = battle || joined || evolve || elemOpen || elemFocus || tutModal ? null : computeGuide(state, { selected, tab, now });
  const objTile = objectiveTile(state);
  const mapTarget = guide ? (guide.target?.kind === 'tile' ? guide.target.id : null) : objTile;
  const markTut = (f: (t: GameState['tutorial']) => void) => act((s) => f(s.tutorial));
  const power = teamPower(state);
  const canUpgrade = upgradeUnlocked(state);
  const canIdle = idleUnlocked(state);
  const canSummon = summonUnlocked(state);
  const ups = canUpgrade ? affordableLevelUps(state) : 0;
  const idle = idlePreview(state, now);

  // 전투력 숫자 강조
  const prev = useRef(power);
  const [bump, setBump] = useState(false);
  useEffect(() => {
    const up = power > prev.current;
    prev.current = power;
    if (!up) return;
    setBump(true);
    const id = setTimeout(() => setBump(false), 600);
    return () => clearTimeout(id);
  }, [power]);

  // 캠프 자동 사냥 소개: 골렘을 넘고 캠프 탭을 처음 열면 완료
  useEffect(() => {
    if (tutActive && tab === 'camp' && state.cleared.includes('b1') && !tut.campTip) markTut((t) => (t.campTip = true));
  }, [tab, tutActive, state.cleared, tut.campTip]);

  const toast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg((c) => (c === m ? null : c)), 2200);
  };

  const enter = (id: string) => {
    // 전투 칸: '바로 결과 보기'가 아니면 실시간 전투 (D69)
    const tt = TILE_BY_ID[id];
    if (tt.encounterId && !state.settings.skipBattle) {
      const p = act((s, t) => prepareBattle(s, id, t));
      setSelected(null);
      if ('error' in p) return toast(p.error);
      setLive({ tileId: id, setup: p.setup });
      return;
    }
    const r = act((s, t) => enterTile(s, id, t));
    setSelected(null);
    if (r.type === 'battle') setBattle(r.outcome);
    else if (r.type === 'spirit') setJoined(r.spiritId);
    else if (r.type === 'resource') toast(r.bonus.summon ? `🔮 소환석 +${r.bonus.summon}! 소환에 쓸 수 있어요` : `보물 상자! ${r.bonus.gold ? `${GOLD} +${r.bonus.gold}` : ''}${r.bonus.stones ? `${STONE} +${r.bonus.stones}` : ''}`);
    else if (r.type === 'gate') toast('다음 지역은 준비 중이에요.');
    else if (r.type === 'travel') toast(`${r.map} ${MAPS[r.map].name}에 들어섰어요!`);
    else if (r.type === 'error') toast(r.message);
  };

  /** 칸 누르기: 주인공이 길을 따라 한 칸씩 걸어간 뒤 칸 정보를 연다 */
  const tapTile = (id: string) => {
    if (walk) return;
    if (tutActive && guide) {
      if (guide.target?.kind === 'tile' && id !== guide.target.id) return toast('먼저 ▼ 표시된 칸을 눌러 줘!');
      if (guide.target?.kind === 'tab' || guide.target?.kind === 'levelUp' || guide.target?.kind === 'evolve' || guide.target?.kind === 'altar') return toast('아래 안내를 먼저 따라 줘!');
    }
    const cleared = state.cleared.includes(id);
    if (!cleared && !reachableTiles(state).has(id)) return setSelected(id);
    const path = walkPath(state, id);
    const steps = cleared ? path.slice(1) : path.slice(1, -1); // 아직 안 간 칸은 바로 앞까지 걷는다
    if (!steps.length) return setSelected(id);
    if (walkTimer.current) clearInterval(walkTimer.current);
    let i = 0;
    setWalk(steps[0]);
    walkTimer.current = window.setInterval(() => {
      i++;
      if (i >= steps.length) {
        clearInterval(walkTimer.current!);
        walkTimer.current = null;
        const last = steps[steps.length - 1];
        act((s) => void (s.lastTile = last));
        setWalk(null);
        setSelected(id);
        return;
      }
      setWalk(steps[i]);
    }, 170);
  };

  const goTab = (t: Tab) => {
    void canIdle;
    if (tutActive && guide?.target?.kind === 'tab' && guide.target.tab !== t) return toast('반짝이는 탭을 눌러 줘!');
    if (tutActive && (guide?.target?.kind === 'levelUp' || guide?.target?.kind === 'evolve') && t !== 'spirit') return toast('먼저 🐾스피릿 탭에서 해 보자!');
    if (tutActive && guide?.target?.kind === 'altar' && t !== 'summon') return toast('먼저 소환을 해 보자!');
    setSelected(null);
    setTab(t);
  };

  const onAction = (id: ActionId, tileId?: string) => {
    const from = battle?.tileId ?? null;
    setBattle(null);
    if ((id === 'farm' || id === 'recruit') && tileId) {
      setTab('map');
      enter(tileId);
    } else if (id === 'summon') setTab('summon');
    else if (id === 'idle') setTab('camp');
    else if (id === 'explore') setTab('map');
    else if (id === 'formation' && from) {
      // 출전 동료 바꾸기: 그 칸의 전투 시작 화면을 다시 연다
      setTab('map');
      setSelected(from);
    } else {
      setTab('spirit');
      setFocusLevel(id === 'levelup');
    }
  };

  const tile = selected ? TILE_BY_ID[selected] : null;

  return (
    <div className="app">
      <header className="hud">
        <img className="hud-face" src={asset('hero-p')} alt="" onClick={() => setHelp(true)} />
        <div className={`hud-power ${bump ? 'bump' : ''}`}>
          <small>전투력</small>
          <b>
            {POWER} {power.toLocaleString()}
          </b>
        </div>
        <div className="hud-res">
          <span>
            {GOLD} {state.gold.toLocaleString()}
          </span>
          <span>
            {STONE} {state.stones} 🔮 {state.summonStones}
          </span>
        </div>
        <button className="icon-btn elem-btn" onClick={() => setElemOpen(true)} aria-label="속성표">
          🔥💧
        </button>
        <button className="icon-btn" onClick={() => setDevOpen(!devOpen)} aria-label="설정">
          ⚙
        </button>
      </header>
      {devOpen && (
        <div className="devbar">
          <span>개발 도구</span>
          <button onClick={() => dev.advance(HOUR)}>+1시간</button>
          <button onClick={() => dev.advance(8 * HOUR)}>+8시간</button>
          <button onClick={() => act((s) => (s.gold += 1000))}>{GOLD}+1000</button>
          <button onClick={() => act((s) => (s.summonStones += 10))}>🔮+10</button>
          <button onClick={() => act((s) => (s.stones += 50))}>{STONE}+50</button>
          <button onClick={() => setHelp(true)}>게임 방법</button>
          <button
            className="danger"
            onClick={() => {
              if (confirm('처음부터 다시 시작할까요?')) {
                dev.resetSave();
                setTab('map');
              }
            }}
          >
            새 게임
          </button>
        </div>
      )}
      <button
        className="objective"
        onClick={() => {
          if (objTile) {
            setTab('map');
            setSelected(objTile);
          }
        }}
      >
        <span className="obj-label">목표</span>
        {currentObjective(state)}
      </button>

      <main className="content">
        {tab === 'map' && (
          <>
            <div className="region">
              <b>{state.map}</b> {MAPS[state.map].name}
              {state.map !== 'P00' && (() => {
                const p = stageProgress(state, state.map);
                return <span className="region-prog"> {p.cleared}/{p.total}</span>;
              })()}
              {MAP_ORDER.filter((m) => m !== state.map && mapUnlocked(state, m)).map((m) => (
                <button
                  key={m}
                  className="region-go"
                  onClick={() => {
                    if (tutActive) return toast('튜토리얼을 먼저 끝내 줘!');
                    const err = act((s) => travel(s, m));
                    if (err) return toast(err);
                    setSelected(null);
                  }}
                >
                  {m} ▸
                </button>
              ))}
            </div>
            <MapView key={state.map} state={state} now={now} selected={selected} target={mapTarget} heroTile={walk} onTap={tapTile} />
          </>
        )}
        {tab === 'spirit' && (
          <SpiritView
            state={state}
            act={act}
            toast={toast}
            focusLevel={focusLevel || guide?.target?.kind === 'levelUp'}
            focusSpirit={guide?.target?.kind === 'evolve' ? guide.target.id : null}
            goal={nextBossGoal(state)}
            onLeveled={() => {
              setFocusLevel(false);
              if (tutActive && !tut.levelTip) markTut((t) => (t.levelTip = true));
            }}
            onEvolve={(id, stage) => setEvolve({ id, stage })}
          />
        )}
        {tab === 'summon' && (
          <SummonView
            state={state}
            focus={guide?.target?.kind === 'altar' ? guide.target.element : null}
            onSummon={(mode) => {
              const r = act((s) => summon(s, mode));
              if ('error' in r) return toast(r.error);
              setSummoned(true);
              setDup(r.duplicate);
              setJoined(r.spiritId);
            }}
          />
        )}
        {tab === 'camp' && <CampView state={state} now={now} act={act} toast={toast} />}
      </main>

      {guide && <GuideBar over={guide.target?.kind === 'evolve' && tab === 'spirit'} guide={guide} onFinish={() => markTut((t) => (t.done = true))} onSkip={() => markTut((t) => (t.done = true))} />}

      <nav className="tabbar">
        <button className={`${tab === 'map' ? 'on' : ''} ${guide?.target?.kind === 'tab' && guide.target.tab === 'map' ? 'pulse' : ''}`} onClick={() => goTab('map')}>
          <span>🗺</span>탐험
        </button>
        <button className={`${tab === 'spirit' ? 'on' : ''} ${guide?.target?.kind === 'tab' && guide.target.tab === 'spirit' ? 'pulse' : ''}`} onClick={() => goTab('spirit')}>
          <span>🐾</span>스피릿
          {ups > 0 && <i className="badge">{ups}</i>}
        </button>
        <button className={`${tab === 'summon' ? 'on' : ''} ${!canSummon ? 'locked' : ''} ${guide?.target?.kind === 'tab' && guide.target.tab === 'summon' ? 'pulse' : ''}`} onClick={() => goTab('summon')}>
          <span>{canSummon ? '✨' : '🔒'}</span>소환
          {canSummon && state.summonStones >= BALANCE.summon.cost && <i className="badge">!</i>}
        </button>
        <button className={`${tab === 'camp' ? 'on' : ''} ${guide?.target?.kind === 'tab' && guide.target.tab === 'camp' ? 'pulse' : ''}`} onClick={() => goTab('camp')}>
          <span>🏕</span>캠프
          {canIdle && idle.gold > 0 && <i className="badge">!</i>}
        </button>
      </nav>

      {tile && tab === 'map' && tile.encounterId && (
        <BattlePrep
          state={state}
          tileId={tile.id}
          now={now}
          power={power}
          guideText={guide && (guide.target?.kind === 'tileAction' || guide.target?.kind === 'suggest') ? guide.text : null}
          focus={guide?.target?.kind === 'tileAction'}
          focusSuggest={guide?.target?.kind === 'suggest'}
          act={act}
          toast={toast}
          onGo={() => enter(tile.id)}
          onClose={() => setSelected(null)}
          onElement={(el) => setElemFocus(el)}
        />
      )}
      {tile && tab === 'map' && !tile.encounterId && (
        <TileSheet state={state} id={tile.id} focus={guide?.target?.kind === 'tileAction'} onGo={() => enter(tile.id)} onClose={() => setSelected(null)} />
      )}

      {live && (
        <LiveBattleView
          tileId={live.tileId}
          setup={live.setup}
          autoDefault={!!state.settings.autoUlt}
          onAuto={(on) => act((s) => (s.settings.autoUlt = on))}
          tips={tutActive ? { note: battleNote(live.tileId), ultGuide: true } : null}
          onDone={(result) => {
            const outcome = act((s, t) => applyBattle(s, live.tileId, live.setup, result, t));
            setLive(null);
            setBattle(outcome);
          }}
        />
      )}

      {battle && (
        <BattleView
          outcome={battle}
          instant
          tips={tutActive ? { battle: !tut.battleTip, win: !tut.winTip, defeat: !tut.defeatTip, note: battleNote(battle.tileId) } : null}
          onClose={() => {
            if (tutActive) markTut((t) => ((t.battleTip = true), battle.won ? (t.winTip = true) : (t.defeatTip = true)));
            setBattle(null);
          }}
          onAction={(id, tileId) => {
            if (tutActive) markTut((t) => ((t.battleTip = true), (t.defeatTip = true)));
            onAction(id, tileId);
          }}
        />
      )}

      {joined && (
        <div className="modal" onClick={() => (setJoined(null), setSummoned(false), setDup(false))}>
          <div className="reveal">
            <div className="reveal-tag">{dup ? '✨ 같은 스피릿!' : summoned ? '✨ 소환 성공!' : '새로운 동료!'}</div>
            <img className="reveal-art" src={portrait(SPIRITS[joined], state.spirits[joined]?.stage ?? 1)} alt="" />
            <h2>{SPIRITS[joined].stages?.[(state.spirits[joined]?.stage ?? 1) - 1] ?? SPIRITS[joined].name}</h2>
            {dup && (() => {
              const sp = state.spirits[joined];
              const need = evolveNeed(sp);
              return (
                <div className="dup-box">
                  진화 재료 +1 → <b>{sp.copies}</b>
                  {need ? ` / ${need.copies}` : ''}
                  <div className="small">{need ? (sp.copies >= need.copies ? (sp.level >= need.level ? '지금 진화할 수 있어요! 🐾스피릿에서 진화' : `Lv.${need.level}이 되면 진화할 수 있어요`) : `같은 스피릿이 ${need.copies - sp.copies}번 더 나오면 진화 재료가 다 모여요`) : '최종 진화 완료!'}</div>
                </div>
              );
            })()}
            <div className="muted">{SPIRITS[joined].title}</div>
            <div className="tags">
              <ElementTag element={SPIRITS[joined].element} /> <RoleTag role={SPIRITS[joined].role} />
            </div>
            <div className="reveal-power">
              팀 전투력 {POWER} <b>{power}</b>
            </div>
            {!dup && state.formation[joined] === undefined && (
              <div className="small">출전은 {state.maxDeploy}명까지! 칸을 누르면 상성에 맞게 출전 동료를 고를 수 있어요.</div>
            )}
            <button className="cta">{dup ? '좋아!' : '함께 가자!'}</button>
          </div>
        </div>
      )}

      {evolve && (
        <div className="modal" onClick={() => setEvolve(null)}>
          <div className="reveal evo">
            <div className="reveal-tag">진화!</div>
            <div className="evo-row">
              <img src={portrait(SPIRITS[evolve.id], evolve.stage - 1)} alt="" />
              <span>➜</span>
              <img className="reveal-art" src={portrait(SPIRITS[evolve.id], evolve.stage)} alt="" />
            </div>
            <h2>{SPIRITS[evolve.id].stages?.[evolve.stage - 1]}</h2>
            <div className="muted">모습이 바뀌고 더 강해졌어요!</div>
            <button className="cta">멋져!</button>
          </div>
        </div>
      )}

      {golemLossDue && (
        <div className="modal">
          <div className="reveal elem-modal">
            <div className="reveal-tag">왜 졌을까? — 속성 상성</div>
            <ElementChart highlight={['fire', 'forest']} />
            <MatchTable state={state} enemyEl="forest" enemyName="고목 골렘" />
            <p className="elem-rule">
              고목 골렘은 <b>🌿숲</b>. 우리 팀 💧물·🌿숲은 숲을 상대로 <b>보통</b>이라 아무리 때려도 골렘의 체력 1180을 다 깎지 못했어.
            </p>
            <p className="elem-rule big-rule">
              화살표를 봐: <b>🔥불 → 🌿숲</b>. 🔥불 스피릿은 골렘에게 <b className="adv">피해 ×1.3</b>!
            </p>
            <p className="muted small">레벨업만으로는 안 되는 적도 있어. 그럴 땐 상성이 맞는 동료를 ✨소환해서 출전시키자.</p>
            <button className="cta" onClick={() => markTut((t) => (t.golemLoss = true))}>
              🔥불 스피릿을 소환하러!
            </button>
          </div>
        </div>
      )}

      {golemWinDue && (
        <div className="modal">
          <div className="reveal elem-modal">
            <div className="reveal-tag">상성 승리!</div>
            <div className="evo-row">
              <img src={portrait(SPIRITS.igni, state.spirits.igni?.stage ?? 1)} alt="" />
              <span>▶</span>
              <img src={asset('grovegolem-p2')} alt="" />
            </div>
            <p className="elem-rule big-rule">
              🔥엠버윙의 공격은 <b className="adv">"유리!" ×1.3</b>. 아까는 못 이긴 골렘을 이겼어!
            </p>
            <div className="lesson-list">
              <div>✔ 칸을 누르면 동료마다 <b className="adv">▲유리</b> / = 보통 / <b className="dis">▼불리</b>가 보여</div>
              <div>✔ 유리하면 주는 피해 ×1.3, 불리하면 ×0.75</div>
              <div>✔ 출전은 {state.maxDeploy}명! 적에 맞춰 <b>✨상성 추천 편성</b>으로 바꿔</div>
            </div>
            <button className="cta" onClick={() => markTut((t) => (t.golemWin = true))}>
              알겠어!
            </button>
          </div>
        </div>
      )}

      {magicDue && (
        <div className="modal">
          <div className="reveal elem-modal">
            <div className="reveal-tag">물리 ⚔️ / 마법 ✨</div>
            <p className="elem-rule">
              <b>왜 졌을까?</b> 물안개 여우는 💧물이라 🔥엠버윙이 ▼불리하기도 하지만, 진짜 이유는 따로 있어. 물안개가 <b>✨마법을 흩어 버려</b>(마법 방어가 아주 높아).
            </p>
            <div className="lesson-list">
              <div>⚔️ <b>물리 공격</b>은 적의 <b>방어</b>로 막혀요</div>
              <div>✨ <b>마법 공격</b>은 적의 <b>마법 방어</b>로 막혀요</div>
              <div>전투 중 회색 <b>"막힘"</b>이 뜨면 공격 방식이 맞지 않는 거예요</div>
            </div>
            <AttackTypes state={state} />
            <p className="elem-rule big-rule">
              여우는 물리 방어가 약해! <b>⚔️물리 공격수</b>를 데려오자. ⛰️락터스크(물리·근접)를 소환해서 엠버윙 대신 출전!
            </p>
            <p className="muted small">근접 동료는 전열, 원거리·회복은 후열이 좋아요. 추천 편성이 알아서 맞춰 줘요.</p>
            <button className="cta" onClick={() => markTut((t) => (t.magicIntro = true))}>
              물리 공격수를 부르자!
            </button>
          </div>
        </div>
      )}

      {evoDue && (
        <div className="modal">
          <div className="reveal elem-modal">
            <div className="reveal-tag">진화</div>
            <div className="evo-row three">
              {[1, 2, 3].map((st) => (
                <span key={st} className="evo-step">
                  {st > 1 && <span className="evo-arrow">➜</span>}
                  <img src={portrait(SPIRITS.rocky, st)} alt="" />
                  <small>{SPIRITS.rocky.stages?.[st - 1]}</small>
                </span>
              ))}
            </div>
            <p className="elem-rule">
              <b>왜 졌을까?</b> 스피릿은 단계마다 <b>최대 레벨</b>이 있어. 1단계는 <b>Lv.{BALANCE.evolution.levelCap[0]}</b>까지라 레벨업만으로는 한계가 와.
            </p>
            <div className="lesson-list">
              <div>① 같은 스피릿을 <b>한 번 더 소환</b> → 진화 재료 +1 (등급 없음, 같은 카드를 먹는 방식)</div>
              <div>② 그 스피릿을 <b>Lv.{BALANCE.evolution.levelCap[0]}</b>까지 레벨업</div>
              <div>③ 🐾스피릿 → 카드 → <b>[✨ 진화]</b>: 모습이 바뀌고 능력치 ×1.15, 최대 Lv.{BALANCE.evolution.levelCap[1]}로!</div>
              <div className="muted">3단계 진화는 Lv.{BALANCE.evolution.levelCap[1]} + 같은 스피릿 {BALANCE.evolution.copies[1]}장</div>
            </div>
            <p className="elem-rule big-rule">아까 주운 🔮진화의 결정으로 ⛰️락터스크를 한 번 더 소환하자!</p>
            <button className="cta" onClick={() => markTut((t) => (t.evoIntro = true))}>
              진화하러 가자!
            </button>
          </div>
        </div>
      )}

      {(elemOpen || elemFocus || elemIntroDue) && (
        <div className="modal" onClick={() => (elemIntroDue ? null : (setElemOpen(false), setElemFocus(null)))}>
          <div className="reveal elem-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reveal-tag">속성 상성</div>
            <ElementChart highlight={elemIntroDue ? ['water', 'fire'] : undefined} focus={elemIntroDue ? undefined : elemFocus ?? undefined} />
            {elemFocus && !elemIntroDue && <FocusLines el={elemFocus} />}
            {elemIntroDue && (
              <p className="elem-rule big-rule">
                방금 💧쉘나이트가 🔥불씨 둥지를 때릴 때 주황색 <b className="adv">"유리!"</b>가 떴지? <b>💧물 → 🔥불</b>, 물은 불에 강해!
              </p>
            )}
            <p className="elem-rule">
              <b>화살표 방향으로 강해요.</b> 유리한 상대에게는 피해 <b className="adv">×1.3</b>, 불리한 상대에게는 <b className="dis">×0.75</b>.
            </p>
            <div className="elem-lines">💧물 → 🔥불 → 🌿숲 → ⛰️대지 → 🌪️바람 → 💧물</div>
            {elemIntroDue && <p className="elem-rule">반대로 화살표를 거꾸로 맞으면 불리해. 다음 돌풍 언덕엔 🌪️바람 늑대가 있어. 🌪️바람 → 💧물이니까 쉘나이트가 불리할 거야!</p>}
            <p className="muted small">칸을 누르면 어떤 동료가 유리한지 ▲▼로 보여 줘요. 적 속성을 길게 누르거나 위쪽 🔥💧 버튼으로 언제든 다시 볼 수 있어요.</p>
            <button
              className="cta"
              onClick={() => {
                if (elemIntroDue) markTut((t) => (t.elementIntro = true));
                setElemOpen(false);
                setElemFocus(null);
              }}
            >
              알겠어!
            </button>
          </div>
        </div>
      )}

      {!tut.introSeen && (
        <Intro
          hasProgress={state.cleared.length > 1}
          onStart={() => {
            dev.resetSave((s) => (s.tutorial.introSeen = true));
            setTab('map');
            setSelected(null);
          }}
          onContinue={() => markTut((t) => ((t.introSeen = true), (t.done = true)))}
        />
      )}
      {help && <Intro hasProgress={false} onStart={() => {}} onClose={() => setHelp(false)} />}

      {notice && (
        <div className="notice" onClick={clearNotice}>
          ⚠ {notice}
        </div>
      )}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}

/** 튜토리얼 전투 중 설명 한 줄 */
function battleNote(tileId: string): string | undefined {
  const notes: Record<string, string> = {
    a1: '동료들은 알아서 싸워요. 아래 초상화의 노란 게이지가 꽉 차면 빛나요 → 눌러서 필살기!',
    a4: '필살기는 아껴 뒀다가 쓰면 더 좋아요. 🌿블루멜의 [숲의 축복]은 아군이 다쳤을 때 눌러야 회복이 커요.',
    a3: '적 바위엄니가 우리보다 강해. 이길 수 없으면 골드로 레벨업하면 돼!',
    a5: '💧쉘나이트가 🔥적을 때리면 주황색 "유리!" 큰 숫자! 물은 불에 강해서 피해 ×1.3.',
    a6: '🌪️바람 늑대에게 💧쉘나이트 공격은 회색 "불리" 작은 숫자. 바람은 물에 강해서 피해 ×0.75.',
    b1: '고목 골렘은 🌿숲! 🔥엠버윙의 [불꽃 폭풍]이 "유리!". 골렘의 큰 공격 뒤 체력이 줄면 [숲의 축복]으로 회복!',
    c2: '회색 "막힘"을 봐! 물안개가 ✨마법을 막아. ⚔️물리 공격은 잘 들어가.',
    b2: '바위엄니 대장은 단단해. 진화로 최대 레벨을 넘어서자!',
  };
  return notes[tileId];
}

/** 우리 팀 각 스피릿이 이 속성의 적에게 유리/보통/불리 */
function MatchTable({ state, enemyEl, enemyName }: { state: GameState; enemyEl: Element; enemyName: string }) {
  return (
    <div className="match-table">
      {Object.keys(state.spirits).map((id) => {
        const m = elementMultiplier(SPIRITS[id].element, enemyEl);
        return (
          <div key={id}>
            <img src={portrait(SPIRITS[id], state.spirits[id].stage)} alt="" />
            <span>{ELEMENT_ICON[SPIRITS[id].element]}</span>
            <b className={m > 1 ? 'adv' : m < 1 ? 'dis' : ''}>{m > 1 ? '▲유리' : m < 1 ? '▼불리' : '=보통'}</b>
          </div>
        );
      })}
      <div className="muted small">vs {ELEMENT_ICON[enemyEl]} {enemyName}</div>
    </div>
  );
}

/** 우리 팀의 공격 방식 (물리/마법) */
function AttackTypes({ state }: { state: GameState }) {
  return (
    <div className="match-table">
      {Object.keys(state.spirits).map((id) => (
        <div key={id}>
          <img src={portrait(SPIRITS[id], state.spirits[id].stage)} alt="" />
          <b className={SPIRITS[id].dmg === 'magic' ? 'dis' : 'adv'}>{SPIRITS[id].dmg === 'magic' ? '✨마법' : '⚔️물리'}</b>
        </div>
      ))}
    </div>
  );
}

const ELEMENTS: Element[] = ['water', 'fire', 'forest', 'earth', 'electric'];

/** 적 속성 하나에 대한 상성 요약 (전투 시작 화면에서 길게 눌렀을 때) */
function FocusLines({ el }: { el: Element }) {
  const strongVs = ELEMENTS.filter((e) => elementMultiplier(e, el) > 1);
  const weakVs = ELEMENTS.filter((e) => elementMultiplier(e, el) < 1);
  const name = (e: Element) => `${ELEMENT_ICON[e]}${ELEMENT_LABEL[e]}`;
  return (
    <div className="focus-lines">
      <div>
        {name(el)} 적에게 <b className="adv">강한</b> 동료: <b>{strongVs.map(name).join(' ')}</b> (주는 피해 ×1.3)
      </div>
      <div>
        {name(el)} 적에게 <b className="dis">약한</b> 동료: <b>{weakVs.map(name).join(' ')}</b> (주는 피해 ×0.75)
      </div>
    </div>
  );
}

/** 스피릿 탭 목표: 지금 지도의 다음 보스 권장 전투력 */
function nextBossGoal(s: GameState): number | null {
  const boss = MAPS[s.map].tiles.find((t) => t.kind === 'boss' && !s.cleared.includes(t.id));
  return boss?.encounterId ? recommendedPower(boss.encounterId) : null;
}

function TileSheet({ state, id, focus, onGo, onClose }: { state: GameState; id: string; focus: boolean; onGo: () => void; onClose: () => void }) {
  const t = TILE_BY_ID[id];
  const cleared = state.cleared.includes(id);
  const canGo = reachableTiles(state).has(id) || (t.kind === 'gate' && cleared);
  const label = t.kind === 'resource' ? (t.resource === 'summon' ? '결정 줍기' : '상자 열기') : t.kind === 'gate' ? '다음 지역으로' : '확인';

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <b>{t.name}</b>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {t.kind === 'resource' && !cleared && (
          <div className="spirit-preview">
            <img src={asset(t.resource === 'summon' ? 'tile-crystal' : 'tile-treasure')} alt="" />
            <div className="small">
              {t.resource === 'summon'
                ? `🔮 소환석 ${t.amount ?? BALANCE.summon.cost}개를 얻어요. ✨소환 탭에서 원하는 속성의 스피릿을 부를 수 있어요.`
                : `보물 상자예요. 열면 ${t.resource === 'stones' ? `${STONE} 성장석 (승급에 사용)` : `${GOLD} 골드`}을 얻어요.`}
            </div>
          </div>
        )}
        {t.kind === 'start' && <div className="muted">{t.hint}</div>}
        {t.kind === 'gate' && (
          <div className="muted">
            {t.map === 'P00' ? (mapUnlocked(state, 'P01') ? '튜토리얼 끝! 본편 P01(스테이지 100개)로 출발해요.' : '바위엄니 대장을 물리치면(튜토리얼 끝) 열려요.') : '다음 지역은 준비 중이에요.'}
          </div>
        )}
        {canGo && t.kind !== 'start' ? (
          <button className={`cta ${focus ? 'pulse' : ''}`} onClick={onGo}>
            {label}
          </button>
        ) : (
          t.kind !== 'start' && <div className="muted small center">{cleared ? '이미 연 칸이에요' : '아래쪽 칸을 먼저 이겨야 갈 수 있어요'}</div>
        )}
      </div>
    </div>
  );
}
