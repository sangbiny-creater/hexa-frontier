import { useState } from 'react';
import { cancelActivity, claimActivity, claimIdle, idlePreview, isBusy, startActivity, type GameState } from '../core/game';
import { trainingXp } from '../core/growth';
import type { ActivityType } from '../core/types';
import { BALANCE } from '../data/balance';
import { TILE_BY_ID } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { Bar } from './common';
import { fmtDuration } from './store';

type Act = <T>(fn: (s: GameState, now: number) => T) => T;

const TYPE_INFO: Record<ActivityType, { title: string; desc: string; lock: string }> = {
  training: { title: '훈련장 · 1시간', desc: '스피릿이 경험치를 얻습니다. 짧게 자리를 비울 때.', lock: '고목 수호자를 쓰러뜨리면 열립니다.' },
  gathering: { title: '채집 · 2시간', desc: '발견한 자원 헥사에서 성장석·골드를 모읍니다.', lock: '고목 수호자를 쓰러뜨리면 열립니다.' },
  rest: { title: '휴식처', desc: '컨디션 +15/시간, 경상 2시간에 회복. 언제든 중단 가능.', lock: '이끼 휴식처를 발견하면 열립니다.' },
};

export function ActivityPanel({ state, now, act, toast, highlightTraining }: { state: GameState; now: number; act: Act; toast: (m: string) => void; highlightTraining?: boolean }) {
  const idle = idlePreview(state, now);
  return (
    <div className="panel">
      <div className="idle-box">
        <div>
          <b>방치 보상</b> <span className="muted">(최대 {BALANCE.idle.capHours}시간)</span>
          <div className="muted small">
            {idle.hours.toFixed(1)}시간 누적 · 💰{idle.gold} 🔷{idle.stones}
          </div>
          <Bar value={idle.hours} max={BALANCE.idle.capHours} color="#b48cff" />
        </div>
        <button
          disabled={idle.gold === 0 && idle.stones === 0}
          onClick={() => {
            const r = act((s, t) => claimIdle(s, t));
            toast(`방치 보상: 💰${r.gold} 🔷${r.stones}`);
          }}
        >
          받기
        </button>
      </div>
      <p className="hint">활동은 성장을 '더해 주는' 보너스입니다. 직접 파밍만으로도 모든 보스를 돌파할 수 있습니다. 활동 중인 스피릿은 전투에 나가지 않고, 컨디션도 회복되지 않습니다(휴식 제외).</p>
      {(['training', 'gathering', 'rest'] as ActivityType[]).map((type) => (
        <Facility key={type} type={type} state={state} now={now} act={act} toast={toast} highlight={highlightTraining && type === 'training'} />
      ))}
    </div>
  );
}

function Facility({ type, state, now, act, toast, highlight }: { type: ActivityType; state: GameState; now: number; act: Act; toast: (m: string) => void; highlight?: boolean }) {
  const info = TYPE_INFO[type];
  const unlocked = state.unlocked[type];
  const runs = state.activities.filter((a) => a.type === type && a.status === 'running');
  const free = Object.keys(state.spirits).filter((id) => !isBusy(state, id, now) && !state.activities.some((a) => a.spiritId === id && a.status === 'running' && a.completesAt === null));
  const [spirit, setSpirit] = useState('');
  const [node, setNode] = useState('');
  const slots = BALANCE.activity.slots[type];
  const pickSpirit = spirit && free.includes(spirit) ? spirit : free[0] ?? '';
  const pickNode = node && state.nodes.includes(node) ? node : state.nodes[0] ?? '';

  return (
    <div className={`facility ${unlocked ? '' : 'locked'}`}>
      <div className="fac-head">
        <b>{info.title}</b>
        <span className="muted">
          {runs.length}/{slots} 슬롯
        </span>
      </div>
      <div className="muted small">{unlocked ? info.desc : `🔒 ${info.lock}`}</div>
      {runs.map((a) => {
        const def = SPIRITS[a.spiritId];
        const doneAt = a.completesAt;
        const remain = doneAt === null ? null : doneAt - now;
        const ready = remain !== null && remain <= 0;
        const sp = state.spirits[a.spiritId];
        return (
          <div key={a.id} className={`run ${ready ? 'ready' : ''}`}>
            <div className="run-main">
              <b>{def.name}</b>
              <span className="muted small">
                {a.type === 'gathering' && a.nodeTileId ? ` @ ${TILE_BY_ID[a.nodeTileId].name}` : ''}
                {a.type === 'rest' && ` 컨디션 ${Math.floor(sp.condition)}${sp.injured ? ' · 경상 치료 중' : ''}`}
              </span>
              {doneAt !== null && <Bar value={now - a.startedAt} max={doneAt - a.startedAt} color={ready ? '#6fdc8c' : '#8ab4ff'} />}
              <span className="small">{remain === null ? `휴식 ${fmtDuration(now - a.startedAt)} 경과` : ready ? '완료! 보상을 받으세요' : `남은 시간 ${fmtDuration(remain)}`}</span>
            </div>
            {ready ? (
              <button
                className="primary"
                onClick={() => {
                  const r = act((s, t) => claimActivity(s, a.id, t));
                  if (r) toast(rewardText(r, def.name));
                }}
              >
                받기
              </button>
            ) : (
              <button
                className="ghost"
                onClick={() => {
                  const r = act((s, t) => cancelActivity(s, a.id, t));
                  if (r) toast(a.type === 'rest' ? `${def.name} 휴식 종료` : `중단: ${rewardText(r, def.name)} (경과 시간 비례)`);
                }}
              >
                {a.type === 'rest' ? '그만 쉬기' : '중단'}
              </button>
            )}
          </div>
        );
      })}
      {unlocked && runs.length < slots && (
        <div className="start-row">
          <select value={pickSpirit} onChange={(e) => setSpirit(e.target.value)}>
            {free.length === 0 && <option value="">쉬는 스피릿 없음</option>}
            {free.map((id) => (
              <option key={id} value={id}>
                {SPIRITS[id].name} Lv.{state.spirits[id].level}
                {type === 'training' ? ` (+${trainingXp(state.spirits[id].level)}XP~)` : ''}
                {type === 'rest' ? ` (컨디션 ${Math.floor(state.spirits[id].condition)})` : ''}
              </option>
            ))}
          </select>
          {type === 'gathering' && (
            <select value={pickNode} onChange={(e) => setNode(e.target.value)}>
              {state.nodes.length === 0 && <option value="">발견한 자원 헥사 없음</option>}
              {state.nodes.map((id) => (
                <option key={id} value={id}>
                  {TILE_BY_ID[id].name} ({TILE_BY_ID[id].resource === 'stones' ? `🔷${BALANCE.activity.gatheringReward.stones}` : `💰${BALANCE.activity.gatheringReward.gold}`})
                </option>
              ))}
            </select>
          )}
          <button
            className={highlight ? 'primary tut-focus' : ''}
            disabled={!pickSpirit || (type === 'gathering' && !pickNode)}
            onClick={() => {
              const err = act((s, t) => startActivity(s, type, pickSpirit, t, type === 'gathering' ? pickNode : undefined));
              toast(err ?? `${SPIRITS[pickSpirit].name}: ${type === 'training' ? '훈련 시작' : type === 'gathering' ? '채집 시작' : '휴식 시작'}`);
            }}
          >
            시작
          </button>
        </div>
      )}
    </div>
  );
}

function rewardText(r: { gold: number; stones: number; xp: number; levelUps: number }, name: string) {
  const parts = [];
  if (r.xp) parts.push(`${name} +${r.xp}XP${r.levelUps ? ' 레벨 업!' : ''}`);
  if (r.gold) parts.push(`💰${r.gold}`);
  if (r.stones) parts.push(`🔷${r.stones}`);
  return parts.join(' ') || '보상 없음';
}
