import { useState } from 'react';
import type { ActionId } from '../core/analysis';
import { HOUR } from '../core/clock';
import { availableTeam, currentObjective, enterTile, fatigueWarning, objectiveTile, reachableTiles, type BattleOutcome, type GameState } from '../core/game';
import { REGION_NAME, TILE_BY_ID } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { ActivityPanel } from './ActivityPanel';
import { BattleView } from './BattleView';
import { ElementBadge, Portrait, RoleBadge } from './common';
import { HexMap, tileColor, tileSummary } from './HexMap';
import { SpiritPanel } from './SpiritPanel';
import { useGame } from './store';
import { computeGuide, GuideBubble, IntroModal } from './tutorial';

type Tab = 'spirits' | 'activity';

export function App() {
  const { state, now, act, dev, notice, clearNotice } = useGame();
  const [selected, setSelected] = useState<string | null>(null);
  const [battle, setBattle] = useState<BattleOutcome | null>(null);
  const [joined, setJoined] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('spirits');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [farmHint, setFarmHint] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const guide = battle || joined ? null : computeGuide(state, { selected, tab });
  const tut = state.tutorial;
  const tutActive = tut.introSeen && !tut.done;
  const markTut = (f: (t: GameState['tutorial']) => void) => act((s) => f(s.tutorial));
  const objTile = objectiveTile(state);

  const toast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg((cur) => (cur === m ? null : cur)), 2600);
  };

  const enter = (id: string) => {
    const r = act((s, t) => enterTile(s, id, t));
    setFarmHint(false);
    if (r.type === 'battle') setBattle(r.outcome);
    else if (r.type === 'spirit') setJoined(r.spiritId);
    else if (r.type === 'resource') toast(`자원 헥사 발견! 💰${r.bonus.gold} 🔷${r.bonus.stones} · 채집 목적지로 등록`);
    else if (r.type === 'facility') toast(r.facility === 'training' ? '훈련장 발견!' : '휴식처 발견! 이제 휴식으로 컨디션을 빠르게 회복할 수 있습니다.');
    else if (r.type === 'gate') toast('다음 지역은 준비 중입니다 (P0 범위 밖).');
    else toast(r.message);
  };

  const onAction = (id: ActionId) => {
    setBattle(null);
    if (id === 'farm') {
      setFarmHint(true);
      toast('밝게 빛나는 칸(탐험한 전투 칸)을 다시 눌러 파밍하세요.');
    } else if (id === 'rankup' || id === 'formation') setTab('spirits');
    else if (id === 'train' || id === 'gather') setTab('activity');
    else if (id === 'rest') {
      setTab('activity');
      if (!state.unlocked.rest) toast('휴식처를 아직 못 찾았습니다. 시간이 지나면 자연 회복됩니다(+5/시간). 이끼 휴식처를 찾아보세요.');
    }
    else if (id === 'explore') toast('안개 가장자리의 빛나는 칸을 탐험해 보세요.');
  };

  const tile = selected ? TILE_BY_ID[selected] : null;
  const reach = reachableTiles(state);
  const readyCount = state.activities.filter((a) => a.status === 'running' && a.completesAt !== null && now >= a.completesAt).length;
  const team = availableTeam(state, now);
  const fatigue = fatigueWarning(state, now);

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">
          HEXA <span>FRONTIER</span>
        </div>
        <button className="objective" onClick={() => objTile && setSelected(objTile)} title="눌러서 목표 칸 보기">
          <span className="obj-label">목표</span> {currentObjective(state)}
        </button>
        <div className="wallet">
          <span title="골드">💰 {state.gold}</span>
          <span title="성장석">🔷 {state.stones}</span>
          <button className="ghost small" onClick={() => setHelpOpen(true)} title="게임 방법">
            ?
          </button>
          <button className="ghost small" onClick={() => setDevOpen(!devOpen)} title="개발자 도구">
            ⚙
          </button>
        </div>
      </header>

      {devOpen && (
        <div className="devbar">
          <b>개발자 시간</b>
          <span className="muted">
            {new Date(now).toLocaleString('ko-KR')} (오프셋 {(dev.offset / HOUR).toFixed(1)}시간)
          </span>
          {[0.25, 1, 2, 8, 12].map((h) => (
            <button key={h} onClick={() => dev.advance(h * HOUR)}>
              +{h < 1 ? `${h * 60}분` : `${h}시간`}
            </button>
          ))}
          {[1, 60, 600].map((x) => (
            <button key={x} className={dev.speed === x ? 'on' : ''} onClick={() => dev.setSpeed(x)}>
              ×{x}
            </button>
          ))}
          <button onClick={dev.resetClock}>시간 초기화</button>
          <button
            className="danger"
            onClick={() => {
              if (confirm('저장 데이터를 지우고 처음부터 시작할까요?')) dev.resetSave();
            }}
          >
            새 게임
          </button>
        </div>
      )}

      <main className="layout">
        <section className="map-area">
          {guide ? (
            <GuideBubble guide={guide} onFinish={() => markTut((t) => (t.done = true))} onSkip={() => markTut((t) => (t.done = true))} />
          ) : (
            <div className="map-title">
              <b>{REGION_NAME}</b>
              <span className="muted"> · 빛나는 칸을 눌러 탐험 · 탐험한 전투 칸은 다시 눌러 파밍 · ▼는 목표</span>
            </div>
          )}
          <HexMap
            state={state}
            selected={selected}
            onSelect={setSelected}
            highlightFarm={farmHint}
            targetTile={guide ? (guide.target?.kind === 'tile' ? guide.target.id : null) : objTile}
          />
          {tile && (
            <div className="tile-card">
              <div className="tc-head">
                <b style={{ color: tileColor(tile) }}>{tile.name}</b>
                <button className="ghost small" onClick={() => setSelected(null)}>
                  ✕
                </button>
              </div>
              <TileBody id={tile.id} />
              {(() => {
                const cleared = state.cleared.includes(tile.id);
                const canGo = reach.has(tile.id) || (cleared && !!tile.encounterId);
                if (tile.kind === 'start') return <div className="muted small">{tile.hint}</div>;
                if (!canGo) return <div className="muted small">{cleared ? '탐험 완료' : '인접한 칸을 먼저 탐험하세요.'}</div>;
                const label = tile.encounterId ? (cleared ? '파밍 (다시 싸우기)' : tile.kind === 'boss' ? '보스 도전' : '전투 시작') : tile.kind === 'gate' ? '확인' : '탐험';
                return (
                  <>
                    {tile.encounterId && <div className="muted small">출전: {team.map((id) => SPIRITS[id].name).join(', ') || '없음'}</div>}
                    {tile.kind === 'boss' && fatigue && (
                      <div className="fatigue-warn">
                        <b>⚠ 피로 상태로 도전합니다</b>
                        <span>
                          {fatigue.names.join(', ')} — 공격·방어 최저 {Math.round(fatigue.worstMul * 100)}%
                        </span>
                        <span className="muted">지면 컨디션이 더 떨어집니다. 먼저 쉬게 하는 것을 추천합니다.</span>
                        <button className="small" onClick={() => setTab('activity')}>
                          휴식하러 가기
                        </button>
                      </div>
                    )}
                    <button className={`primary ${guide?.target?.kind === 'tileAction' ? 'tut-focus' : ''}`} onClick={() => enter(tile.id)}>
                      {label}
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </section>

        <aside className="side">
          <nav className="tabs">
            <button className={tab === 'spirits' ? 'on' : ''} onClick={() => setTab('spirits')}>
              스피릿·편성
            </button>
            <button className={`${tab === 'activity' ? 'on' : ''} ${guide?.target?.kind === 'activityTab' ? 'tut-focus' : ''}`} onClick={() => setTab('activity')}>
              활동 {readyCount > 0 && <span className="dot">{readyCount}</span>}
            </button>
          </nav>
          {tab === 'spirits' ? <SpiritPanel state={state} now={now} act={act} toast={toast} /> : <ActivityPanel state={state} now={now} act={act} toast={toast} highlightTraining={guide?.target?.kind === 'trainingStart'} />}
          <div className="msglog">
            {state.messages.slice(0, 5).map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </div>
        </aside>
      </main>

      {battle && (
        <BattleView
          outcome={battle}
          tips={tutActive ? { battle: !tut.battleTip, win: !tut.winTip, defeat: !tut.defeatTip } : null}
          onClose={() => {
            if (tutActive) markTut((t) => ((t.battleTip = true), battle.won ? (t.winTip = true) : (t.defeatTip = true)));
            setBattle(null);
          }}
          onAction={(id) => {
            if (tutActive) markTut((t) => ((t.battleTip = true), (t.defeatTip = true)));
            onAction(id);
          }}
        />
      )}

      {!tut.introSeen && (
        <IntroModal
          hasProgress={state.cleared.length > 1}
          onTutorial={() => {
            dev.resetSave((s) => (s.tutorial.introSeen = true));
            setSelected(null);
            setTab('spirits');
          }}
          onContinue={() => markTut((t) => ((t.introSeen = true), (t.done = true)))}
          onSkipTutorial={() => markTut((t) => ((t.introSeen = true), (t.done = true)))}
        />
      )}
      {helpOpen && <IntroModal isHelp hasProgress={false} onTutorial={() => {}} onContinue={() => {}} onSkipTutorial={() => {}} onClose={() => setHelpOpen(false)} />}

      {joined && (
        <div className="modal-backdrop" onClick={() => setJoined(null)}>
          <div className="join-card">
            <div className="muted">새로운 동료</div>
            <Portrait name={SPIRITS[joined].name} element={SPIRITS[joined].element} size={96} />
            <h2>{SPIRITS[joined].name}</h2>
            <div className="muted">{SPIRITS[joined].title}</div>
            <div>
              <ElementBadge element={SPIRITS[joined].element} /> <RoleBadge role={SPIRITS[joined].role} />
            </div>
            <ul>
              {SPIRITS[joined].skills.map((k) => (
                <li key={k.id}>
                  <b>{k.name}</b> <span className="muted">{k.desc}</span>
                </li>
              ))}
            </ul>
            <div className="muted small">{state.formation[joined] !== undefined ? '자동으로 편성에 추가되었습니다.' : '편성 탭에서 배치할 수 있습니다.'}</div>
            <button className="primary">좋아!</button>
          </div>
        </div>
      )}

      {notice && (
        <div className="notice" onClick={clearNotice}>
          ⚠ {notice}
        </div>
      )}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}

function TileBody({ id }: { id: string }) {
  const t = TILE_BY_ID[id];
  const enemies = tileSummary(t);
  if (enemies) {
    return (
      <div className="enemy-list">
        {enemies.map((e, i) => (
          <div key={i} className={e.boss ? 'boss' : ''}>
            {e.boss ? '☠ ' : ''}
            {e.name} Lv.{e.level} <ElementBadge element={e.element} />
          </div>
        ))}
      </div>
    );
  }
  if (t.kind === 'spirit' && t.spiritId) return <div className="small">무언가의 기척이 느껴진다… ({SPIRITS[t.spiritId].title})</div>;
  if (t.kind === 'resource') return <div className="small">{t.resource === 'stones' ? '성장석' : '골드'} 자원 헥사. 발견하면 채집 목적지가 됩니다.</div>;
  if (t.kind === 'facility') return <div className="small">{t.facility === 'training' ? '훈련장' : '휴식처'}</div>;
  if (t.kind === 'gate') return <div className="small">다음 지역으로 이어지는 길 (준비 중)</div>;
  return null;
}
