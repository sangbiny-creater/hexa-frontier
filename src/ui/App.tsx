import { useEffect, useRef, useState } from 'react';
import type { ActionId } from '../core/analysis';
import { HOUR } from '../core/clock';
import {
  affordableLevelUps,
  availableTeam,
  currentObjective,
  enterTile,
  idlePreview,
  idleUnlocked,
  objectiveTile,
  reachableTiles,
  setFormation,
  summon,
  summonUnlocked,
  upgradeUnlocked,
  type BattleOutcome,
  type GameState,
} from '../core/game';
import { attackMatchup, difficulty, DIFFICULTY_LABEL, recommendedPower, suggestTeam, teamPower } from '../core/power';
import { BALANCE } from '../data/balance';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { REGION_NAME, TILE_BY_ID } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { asset, ELEMENT_ICON, ElementChart, ElementTag, enemyStage, GOLD, portrait, POWER, RoleTag, spiritStage, STONE } from './art';
import { ELEMENT_LABEL } from '../core/board';
import { DEFAULT_SLOT } from '../data/spirits';
import { BattleView } from './BattleView';
import { CampView } from './CampView';
import { SpiritView } from './SpiritView';
import { SummonView } from './SummonView';
import { DIFF_COLOR, MapView } from './MapView';
import { useGame } from './store';
import { computeGuide, GuideBar, Intro, type Tab } from './tutorial';

export function App() {
  const { state, now, act, dev, notice, clearNotice } = useGame();
  const [tab, setTab] = useState<Tab>('map');
  const [selected, setSelected] = useState<string | null>(null);
  const [battle, setBattle] = useState<BattleOutcome | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [evolve, setEvolve] = useState<{ id: string; stage: number } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [devOpen, setDevOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [focusLevel, setFocusLevel] = useState(false);
  const [elemOpen, setElemOpen] = useState(false);

  const tut = state.tutorial;
  const tutActive = tut.introSeen && !tut.done;
  const elemIntroDue = tut.introSeen && !tut.done && !tut.elementIntro && !!state.bossAttempts['b1'] && !battle && !joined;
  const [summoned, setSummoned] = useState(false);
  const guide = battle || joined || evolve || elemOpen || elemIntroDue ? null : computeGuide(state, { selected, tab });
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

  const toast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg((c) => (c === m ? null : c)), 2200);
  };

  const enter = (id: string) => {
    const r = act((s, t) => enterTile(s, id, t));
    setSelected(null);
    if (r.type === 'battle') setBattle(r.outcome);
    else if (r.type === 'spirit') setJoined(r.spiritId);
    else if (r.type === 'resource') toast(r.bonus.summon ? `🔮 소환석 +${r.bonus.summon}! 소환에 쓸 수 있어요` : `보물 상자! ${r.bonus.gold ? `${GOLD} +${r.bonus.gold}` : ''}${r.bonus.stones ? `${STONE} +${r.bonus.stones}` : ''}`);
    else if (r.type === 'gate') toast('다음 지역은 준비 중이에요.');
    else if (r.type === 'error') toast(r.message);
  };

  const tapTile = (id: string) => {
    if (tutActive && guide) {
      if (guide.target?.kind === 'tile' && id !== guide.target.id) return toast('먼저 ▼ 표시된 칸을 눌러 줘!');
      if (guide.target?.kind === 'tab' || guide.target?.kind === 'levelUp') return toast('아래 안내를 먼저 따라 줘!');
    }
    setSelected(id);
  };

  const goTab = (t: Tab) => {
    void canIdle;
    if (tutActive && guide?.target?.kind === 'tab' && guide.target.tab !== t) return toast('반짝이는 탭을 눌러 줘!');
    if (tutActive && guide?.target?.kind === 'levelUp' && t !== 'spirit') return toast('먼저 레벨업을 해 보자!');
    if (tutActive && guide?.target?.kind === 'altar' && t !== 'summon') return toast('먼저 소환을 해 보자!');
    setSelected(null);
    setTab(t);
  };

  const onAction = (id: ActionId, tileId?: string) => {
    setBattle(null);
    if ((id === 'farm' || id === 'recruit') && tileId) {
      setTab('map');
      enter(tileId);
    } else {
      if (id === 'summon') {
        setTab('summon');
        return;
      }
      setTab('spirit');
      setFocusLevel(true);
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
            <div className="region">{REGION_NAME}</div>
            <MapView state={state} selected={selected} target={mapTarget} onTap={tapTile} />
          </>
        )}
        {tab === 'spirit' && (
          <SpiritView
            state={state}
            act={act}
            toast={toast}
            focusLevel={focusLevel || guide?.target?.kind === 'levelUp'}
            goal={!state.cleared.includes('b1') ? recommendedPower('boss_treant') : !state.cleared.includes('b2') ? recommendedPower('boss_giant') : null}
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
            onSummon={(el) => {
              const r = act((s) => summon(s, el));
              if ('error' in r) return toast(r.error);
              setSummoned(true);
              setJoined(r.spiritId);
            }}
          />
        )}
        {tab === 'camp' && <CampView state={state} now={now} act={act} toast={toast} />}
      </main>

      {guide && <GuideBar guide={guide} onFinish={() => markTut((t) => (t.done = true))} onSkip={() => markTut((t) => (t.done = true))} />}

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
        <button className={`${tab === 'camp' ? 'on' : ''}`} onClick={() => goTab('camp')}>
          <span>🏕</span>캠프
          {canIdle && idle.gold > 0 && <i className="badge">!</i>}
        </button>
      </nav>

      {tile && tab === 'map' && (
        <TileSheet
          state={state}
          id={tile.id}
          now={now}
          power={power}
          focus={guide?.target?.kind === 'tileAction'}
          onGo={() => enter(tile.id)}
          onClose={() => setSelected(null)}
          onToggle={(sid) => {
            const deployed = state.formation[sid] !== undefined;
            if (!deployed && Object.keys(state.formation).length >= state.maxDeploy) return toast(`출전은 ${state.maxDeploy}명까지! 먼저 다른 스피릿을 빼세요`);
            if (deployed && Object.keys(state.formation).length <= 1) return toast('최소 1명은 출전해야 해요');
            act((s) => setFormation(s, sid, deployed ? null : DEFAULT_SLOT[sid]));
          }}
          onSuggest={(ids) =>
            act((s) => {
              for (const k of Object.keys(s.formation)) setFormation(s, k, null);
              for (const k of ids) setFormation(s, k, DEFAULT_SLOT[k]);
            })
          }
        />
      )}

      {battle && (
        <BattleView
          outcome={battle}
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
        <div className="modal" onClick={() => (setJoined(null), setSummoned(false))}>
          <div className="reveal">
            <div className="reveal-tag">{summoned ? '✨ 소환 성공!' : '새로운 동료!'}</div>
            <img className="reveal-art" src={portrait(SPIRITS[joined], 1)} alt="" />
            <h2>{SPIRITS[joined].stages?.[0] ?? SPIRITS[joined].name}</h2>
            <div className="muted">{SPIRITS[joined].title}</div>
            <div className="tags">
              <ElementTag element={SPIRITS[joined].element} /> <RoleTag role={SPIRITS[joined].role} />
            </div>
            <div className="reveal-power">
              팀 전투력 {POWER} <b>{power}</b>
            </div>
            {state.formation[joined] === undefined && (
              <div className="small">출전은 {state.maxDeploy}명까지! 칸을 누르면 상성에 맞게 출전 동료를 고를 수 있어요.</div>
            )}
            <button className="cta">함께 가자!</button>
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

      {(elemOpen || elemIntroDue) && (
        <div className="modal" onClick={() => (elemIntroDue ? null : setElemOpen(false))}>
          <div className="reveal elem-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reveal-tag">속성 상성</div>
            <ElementChart highlight={elemIntroDue ? ['fire', 'forest'] : undefined} />
            {elemIntroDue && <p className="elem-rule"><b>왜 졌을까?</b> 골렘은 🌿숲. 우리 팀 💧물·🌿숲은 숲을 상대로 <b>보통</b>이라 피해가 약했어.</p>}
            <p className="elem-rule">
              <b>화살표 방향으로 강해요.</b> 유리한 상대에게는 피해 <b className="adv">×1.3</b>, 불리한 상대에게는 <b className="dis">×0.75</b>.
            </p>
            <div className="elem-lines">
              💧물 → 🔥불 → 🌿숲 → ⛰️대지 → 🌪️바람 → 💧물
            </div>
            {elemIntroDue && (
              <p className="elem-rule">
                화살표를 봐: <b>🔥불 → 🌿숲</b>. 불 속성 스피릿을 데려오면 골렘에게 피해가 1.3배! ✨소환이 열렸어요.
              </p>
            )}
            <p className="muted small">칸을 누르면 어떤 동료가 유리한지 ▲▼로 보여 줘요. 위쪽 🔥💧 버튼으로 언제든 다시 볼 수 있어요.</p>
            <button
              className="cta"
              onClick={() => {
                if (elemIntroDue) markTut((t) => (t.elementIntro = true));
                setElemOpen(false);
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

/** 튜토리얼 전투 중 속성 설명 한 줄 */
function battleNote(tileId: string): string | undefined {
  if (tileId === 'a3') return '엠버윙(🔥불)이 🌿숲 적을 때리면 주황색 "유리!" 큰 숫자가 떠요. 상성이 맞으면 피해가 1.3배!';
  if (tileId === 's1') return '이번 적은 💧물. 물은 🔥불에 강해서 엠버윙 공격은 회색 "불리" 작은 숫자예요. 쉘나이트(💧)는 영향 없이 버텨요.';
  if (tileId === 'b1') return '고목 골렘은 🌿숲 속성! 🔥엠버윙의 공격이 가장 아파요.';
  return undefined;
}

const MATCH_LABEL = { adv: '▲ 유리', dis: '▼ 불리', even: '= 보통' } as const;

function TileSheet({
  state,
  id,
  now,
  power,
  focus,
  onGo,
  onClose,
  onToggle,
  onSuggest,
}: {
  state: GameState;
  id: string;
  now: number;
  power: number;
  focus: boolean;
  onGo: () => void;
  onClose: () => void;
  onToggle: (spiritId: string) => void;
  onSuggest: (ids: string[]) => void;
}) {
  const t = TILE_BY_ID[id];
  const cleared = state.cleared.includes(id);
  const reachable = reachableTiles(state).has(id);
  const canGo = reachable || (cleared && !!t.encounterId);
  const enc = t.encounterId ? ENCOUNTERS[t.encounterId] : null;
  const rec = enc ? recommendedPower(enc.id) : 0;
  const diff = rec ? difficulty(power, rec) : null;
  const gold = enc
    ? enc.enemies.reduce((a, e) => a + Math.round(ENEMIES[e.enemyId].gold * (1 + BALANCE.enemy.goldPerLevel * (e.level - 1))), 0) + (cleared ? 0 : enc.firstClear.gold)
    : 0;
  const team = availableTeam(state, now);
  const label = enc ? (cleared ? '다시 싸우기 (골드 벌기)' : t.kind === 'boss' ? '보스 도전' : '전투 시작') : t.kind === 'resource' ? (t.resource === 'summon' ? '결정 줍기' : '상자 열기') : '확인';

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <b>{t.name}</b>
          {t.kind === 'elite' && <span className="elite-badge">정예</span>}
          {t.kind === 'boss' && <span className="boss-badge">BOSS</span>}
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {enc && (
          <>
            <div className="enemy-row">
              {enc.enemies.map((e, i) => {
                const d = ENEMIES[e.enemyId];
                return (
                  <div key={i} className={`enemy-card ${d.isBoss ? 'boss' : ''}`}>
                    <img src={portrait(d, enemyStage(d, e.level))} alt="" />
                    <div className="ec-name">{d.name}</div>
                    <div className="ec-sub">
                      Lv.{e.level} <ElementTag element={d.element} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="power-compare">
              <div className="pc-row">
                <span>내 전투력</span>
                <b>
                  {POWER} {power}
                </b>
              </div>
              <div className="pc-track">
                <div className="pc-me" style={{ width: `${Math.min(100, (power / (rec * 1.4)) * 100)}%`, background: diff ? DIFF_COLOR[diff] : '#aaa' }} />
                <div className="pc-rec" style={{ left: `${(1 / 1.4) * 100}%` }} />
              </div>
              <div className="pc-row">
                <span>권장 전투력 {rec}</span>
                {diff && (
                  <b style={{ color: DIFF_COLOR[diff] }}>
                    {DIFFICULTY_LABEL[diff]} {diff === 'hard' ? '— 질 수 있어요' : diff === 'fair' ? '— 해볼 만해요' : '— 넉넉히 이겨요'}
                  </b>
                )}
              </div>
            </div>
            <div className="reward-line">
              승리 보상 {GOLD} 약 {gold}
              {!cleared && (enc.firstClear.stones > 0 ? ` · ${STONE} ${enc.firstClear.stones}` : '')}
              {!cleared && <small> (첫 승리 보너스 포함)</small>}
            </div>
            <div className="team-box">
              <div className="team-head">
                <b>
                  출전 {team.length}/{state.maxDeploy}
                </b>
                <span className="muted small">
                  적 속성: {[...new Set(enc.enemies.map((e) => ENEMIES[e.enemyId].element))].map((el) => `${ELEMENT_ICON[el]}${ELEMENT_LABEL[el]}`).join(' ')}
                </span>
              </div>
              <div className="team-row">
                {Object.keys(state.spirits).map((sid) => {
                  const d = SPIRITS[sid];
                  const m = attackMatchup(sid, enc.id);
                  const on = state.formation[sid] !== undefined;
                  const multi = Object.keys(state.spirits).length > state.maxDeploy;
                  return (
                    <button key={sid} className={`member ${on ? 'on' : ''} ${m}`} onClick={() => (multi ? onToggle(sid) : null)}>
                      <img src={portrait(d, spiritStage(state.spirits[sid].level))} alt="" />
                      <span className="m-el">{ELEMENT_ICON[d.element]}</span>
                      <span className={`m-match ${m}`}>{MATCH_LABEL[m]}</span>
                      {multi && <span className="m-on">{on ? '출전' : '대기'}</span>}
                    </button>
                  );
                })}
              </div>
              {Object.keys(state.spirits).length > state.maxDeploy && (() => {
                const best = suggestTeam(Object.keys(state.spirits), enc.id, state.maxDeploy);
                const same = best.every((b) => state.formation[b] !== undefined);
                return same ? (
                  <div className="muted small">상성이 좋은 동료로 출전 중이에요.</div>
                ) : (
                  <button className="suggest" onClick={() => onSuggest(best)}>
                    ✨ 상성 추천 편성으로 바꾸기
                  </button>
                );
              })()}
            </div>
          </>
        )}
        {t.kind === 'spirit' && t.spiritId && !cleared && (
          <div className="spirit-preview">
            <img src={portrait(SPIRITS[t.spiritId], 1)} alt="" />
            <div>
              <b>{SPIRITS[t.spiritId].stages?.[0]}</b>
              <div className="muted small">{SPIRITS[t.spiritId].title}</div>
              <div className="small">동료가 되면 함께 싸우고, 팀 전투력이 크게 올라요.</div>
            </div>
          </div>
        )}
        {t.kind === 'resource' && !cleared && (
          <div className="spirit-preview">
            <img src={asset(t.resource === 'summon' ? 'tile-crystal' : 'tile-treasure')} alt="" />
            <div className="small">
              {t.resource === 'summon'
                ? `🔮 소환석 ${BALANCE.summon.cost}개를 얻어요. ✨소환 탭에서 원하는 속성의 스피릿을 부를 수 있어요.`
                : `보물 상자예요. 열면 ${t.resource === 'stones' ? `${STONE} 성장석 (승급에 사용)` : `${GOLD} 골드`}을 얻어요.`}
            </div>
          </div>
        )}
        {t.kind === 'start' && <div className="muted">{t.hint}</div>}
        {t.kind === 'gate' && <div className="muted">테라스톤을 쓰러뜨리면 다음 지역으로 갈 수 있어요. (준비 중)</div>}
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
