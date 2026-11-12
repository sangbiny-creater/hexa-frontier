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
  upgradeUnlocked,
  type BattleOutcome,
  type GameState,
} from '../core/game';
import { difficulty, DIFFICULTY_LABEL, recommendedPower, teamPower } from '../core/power';
import { BALANCE } from '../data/balance';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { REGION_NAME, TILE_BY_ID } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { asset, ElementTag, enemyStage, GOLD, portrait, POWER, RoleTag, STONE } from './art';
import { BattleView } from './BattleView';
import { IdleView } from './IdleView';
import { DIFF_COLOR, MapView } from './MapView';
import { useGame } from './store';
import { computeGuide, GuideBar, Intro, type Tab } from './tutorial';
import { UpgradeView } from './UpgradeView';

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

  const tut = state.tutorial;
  const tutActive = tut.introSeen && !tut.done;
  const guide = battle || joined || evolve ? null : computeGuide(state, { selected, tab });
  const objTile = objectiveTile(state);
  const mapTarget = guide ? (guide.target?.kind === 'tile' ? guide.target.id : null) : objTile;
  const markTut = (f: (t: GameState['tutorial']) => void) => act((s) => f(s.tutorial));
  const power = teamPower(state);
  const canUpgrade = upgradeUnlocked(state);
  const canIdle = idleUnlocked(state);
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
    else if (r.type === 'resource') toast(`보물 상자! ${r.bonus.gold ? `${GOLD} +${r.bonus.gold}` : ''}${r.bonus.stones ? `${STONE} +${r.bonus.stones}` : ''}`);
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
    if (t === 'upgrade' && !canUpgrade) return toast('🔒 첫 보스(고목 골렘)에 도전하면 열려요');
    if (t === 'idle' && !canIdle) return toast('🔒 고목 골렘을 쓰러뜨리면 열려요');
    if (tutActive && guide?.target?.kind === 'tab' && guide.target.tab !== t) return toast('반짝이는 탭을 눌러 줘!');
    if (tutActive && guide?.target?.kind === 'levelUp' && t !== 'upgrade') return toast('먼저 레벨업을 해 보자!');
    setSelected(null);
    setTab(t);
  };

  const onAction = (id: ActionId, tileId?: string) => {
    setBattle(null);
    if ((id === 'farm' || id === 'recruit') && tileId) {
      setTab('map');
      enter(tileId);
    } else {
      setTab('upgrade');
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
            {STONE} {state.stones}
          </span>
        </div>
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
        {tab === 'upgrade' && (
          <UpgradeView
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
        {tab === 'idle' && <IdleView state={state} now={now} act={act} toast={toast} />}
      </main>

      {guide && <GuideBar guide={guide} onFinish={() => markTut((t) => (t.done = true))} onSkip={() => markTut((t) => (t.done = true))} />}

      <nav className="tabbar">
        <button className={`${tab === 'map' ? 'on' : ''} ${guide?.target?.kind === 'tab' && guide.target.tab === 'map' ? 'pulse' : ''}`} onClick={() => goTab('map')}>
          <span>🗺</span>탐험
        </button>
        <button
          className={`${tab === 'upgrade' ? 'on' : ''} ${!canUpgrade ? 'locked' : ''} ${guide?.target?.kind === 'tab' && guide.target.tab === 'upgrade' ? 'pulse' : ''}`}
          onClick={() => goTab('upgrade')}
        >
          <span>{canUpgrade ? '⬆' : '🔒'}</span>강화
          {ups > 0 && <i className="badge">{ups}</i>}
        </button>
        <button className={`${tab === 'idle' ? 'on' : ''} ${!canIdle ? 'locked' : ''}`} onClick={() => goTab('idle')}>
          <span>{canIdle ? '🏕' : '🔒'}</span>자동 사냥
          {canIdle && idle.gold > 0 && <i className="badge">!</i>}
        </button>
      </nav>

      {tile && tab === 'map' && (
        <TileSheet state={state} id={tile.id} now={now} power={power} focus={guide?.target?.kind === 'tileAction'} onGo={() => enter(tile.id)} onClose={() => setSelected(null)} />
      )}

      {battle && (
        <BattleView
          outcome={battle}
          tips={tutActive ? { battle: !tut.battleTip, win: !tut.winTip, defeat: !tut.defeatTip } : null}
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
        <div className="modal" onClick={() => setJoined(null)}>
          <div className="reveal">
            <div className="reveal-tag">새로운 동료!</div>
            <img className="reveal-art" src={portrait(SPIRITS[joined], 1)} alt="" />
            <h2>{SPIRITS[joined].stages?.[0] ?? SPIRITS[joined].name}</h2>
            <div className="muted">{SPIRITS[joined].title}</div>
            <div className="tags">
              <ElementTag element={SPIRITS[joined].element} /> <RoleTag role={SPIRITS[joined].role} />
            </div>
            <div className="reveal-power">
              팀 전투력 {POWER} <b>{power}</b>
            </div>
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

function TileSheet({ state, id, now, power, focus, onGo, onClose }: { state: GameState; id: string; now: number; power: number; focus: boolean; onGo: () => void; onClose: () => void }) {
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
  const label = enc ? (cleared ? '다시 싸우기 (골드 벌기)' : t.kind === 'boss' ? '보스 도전' : '전투 시작') : t.kind === 'spirit' ? '동료 만나기' : t.kind === 'resource' ? '상자 열기' : '확인';

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
            <div className="muted small">출전: {team.map((x) => SPIRITS[x].stages?.[0] ?? SPIRITS[x].name).join(', ')}</div>
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
            <img src={asset('tile-treasure')} alt="" />
            <div className="small">보물 상자예요. 열면 {t.resource === 'stones' ? `${STONE} 성장석 (승급에 사용)` : `${GOLD} 골드`}을 얻어요.</div>
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
