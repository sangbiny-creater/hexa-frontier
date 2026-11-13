// 전투 시작 화면 (D61): 적 배치도 + 내 편성 편집 + 상성 확인 + 바로 결과 보기.
// 위쪽 3×3이 적(전열이 가운데 쪽), 아래쪽 3×3이 아군. 전투 화면과 같은 배치다.
import { useRef, useState } from 'react';
import { ELEMENT_LABEL, ROLE_LABEL, ROW_LABEL, rowName } from '../core/board';
import { availableTeam, respawnLeft, setFormation, type GameState } from '../core/game';
import { hexCorners } from '../core/hex';
import { armorMatchup, attackMatchup, difficulty, DIFFICULTY_LABEL, effectivePower, recommendedPower, suggestTeam } from '../core/power';
import type { Element } from '../core/types';
import { BALANCE } from '../data/balance';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { stageCode, TILE_BY_ID } from '../data/map';
import { DEFAULT_SLOT, SPIRITS } from '../data/spirits';
import { ELEMENT_COLOR, ELEMENT_ICON, enemyStage, GOLD, portrait, POWER, stageName, STONE } from './art';
import { DIFF_COLOR } from './MapView';
import { fmtDuration } from './store';

type Act = <T>(fn: (s: GameState, now: number) => T) => T;

const MATCH_LABEL = { adv: '▲ 유리', dis: '▼ 불리', even: '= 보통' } as const;
const R = 29;

function slotXY(slot: number, side: 'ally' | 'enemy') {
  const r = Math.floor(slot / 3);
  const l = slot % 3;
  return { x: 84 + l * 66 + (r % 2 ? 33 : 0), y: side === 'enemy' ? [150, 98, 46][r] : [224, 276, 328][r] };
}

/** 길게 누르기 / 짧게 누르기를 구분하는 핸들러 */
function usePress() {
  const timer = useRef<number | null>(null);
  const fired = useRef(false);
  const clear = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  };
  return (onLong: () => void, onTap?: () => void) => ({
    onPointerDown: () => {
      fired.current = false;
      clear();
      timer.current = window.setTimeout(() => {
        fired.current = true;
        onLong();
      }, 450);
    },
    onPointerUp: () => {
      const wasPending = timer.current !== null;
      clear();
      if (wasPending && !fired.current) onTap?.();
    },
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
  });
}

export function BattlePrep({
  state,
  tileId,
  now,
  power,
  guideText,
  focus,
  focusSuggest,
  act,
  toast,
  onGo,
  onClose,
  onElement,
}: {
  state: GameState;
  tileId: string;
  now: number;
  power: number;
  guideText?: string | null;
  focus: boolean;
  focusSuggest: boolean;
  act: Act;
  toast: (m: string) => void;
  onGo: () => void;
  onClose: () => void;
  onElement: (el: Element) => void;
}) {
  const t = TILE_BY_ID[tileId];
  const enc = ENCOUNTERS[t.encounterId!];
  const [picked, setPicked] = useState<string | null>(null);
  const press = usePress();
  const cleared = state.cleared.includes(tileId);
  const left = cleared ? respawnLeft(state, tileId, now) : 0;
  const rec = recommendedPower(enc.id);
  const eff = effectivePower(state, enc.id);
  const diff = difficulty(eff, rec);
  const team = availableTeam(state, now);
  const owned = Object.keys(state.spirits);
  const bySlot = Object.fromEntries(Object.entries(state.formation).map(([id, slot]) => [slot, id]));
  const elements = [...new Set(enc.enemies.map((e) => ENEMIES[e.enemyId].element))];
  // 물리/마법 방어 특징 (D63)
  const guards = [
    ...new Set(
      enc.enemies.map((e) => {
        const b = ENEMIES[e.enemyId].base;
        const res = b.res ?? b.def;
        return res > b.def * 2 ? 'magic' : b.def > res * 2 ? 'phys' : null;
      }),
    ),
  ].filter((x): x is 'magic' | 'phys' => !!x);
  const gold =
    enc.enemies.reduce((a, e) => a + Math.round(ENEMIES[e.enemyId].gold * (1 + BALANCE.enemy.goldPerLevel * (e.level - 1))), 0) + (cleared ? 0 : enc.firstClear.gold);
  const best = suggestTeam(owned, enc.id, state.maxDeploy);
  const bestIsOn = best.every((b) => state.formation[b] !== undefined);
  const code = stageCode(t);

  const tapSlot = (slot: number) => {
    const occ = bySlot[slot];
    if (!picked) {
      if (occ) setPicked(occ);
      return;
    }
    const err = act((s) => setFormation(s, picked, slot));
    if (err) toast(err);
    setPicked(null);
  };

  const bench = (id: string) => {
    if (Object.keys(state.formation).length <= 1) return toast('최소 1명은 출전해야 해요');
    act((s) => setFormation(s, id, null));
    setPicked(null);
  };

  const enemyInfo = (i: number) => {
    const e = enc.enemies[i];
    const d = ENEMIES[e.enemyId];
    const res = d.base.res ?? d.base.def;
    const guard = res > d.base.def * 2 ? ' · ✨마법에 강함(⚔️물리로!)' : d.base.def > res * 2 ? ' · ⚔️물리에 강함(✨마법으로!)' : '';
    toast(`${d.name} Lv.${e.level} · ${ELEMENT_ICON[d.element]}${ELEMENT_LABEL[d.element]} · ${ROLE_LABEL[d.role]} · ${d.range === 'melee' ? '근접' : '원거리'} · ${d.dmg === 'magic' ? '✨마법' : '⚔️물리'} 공격 · 방어 ${d.base.def}/마법방어 ${res}${guard}`);
  };

  return (
    <div className="screen prep">
      <div className="prep-top">
        <div className="prep-title">
          {code && <small className="stage-code">{code}</small>}
          <b>{t.name}</b>
          {t.kind === 'elite' && <span className="elite-badge">정예</span>}
          {t.kind === 'boss' && <span className="boss-badge">BOSS</span>}
        </div>
        <button className="icon-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </div>

      <div className="prep-body">
        {guideText && <div className="prep-guide">{guideText}</div>}
        <div className="prep-elems">
          <span className="muted small">적 속성</span>
          {elements.map((el) => (
            <button key={el} className="elem-chip" style={{ borderColor: ELEMENT_COLOR[el], color: ELEMENT_COLOR[el] }} {...press(() => onElement(el), () => onElement(el))}>
              {ELEMENT_ICON[el]} {ELEMENT_LABEL[el]}
            </button>
          ))}
          <span className="muted tiny">길게 누르면 상성표</span>
        </div>
        {guards.map((g) => (
          <div key={g} className="guard-line small">
            {g === 'magic' ? '🛡 이 적은 ✨마법 방어가 높아요 → ⚔️물리 공격 동료가 유리' : '🛡 이 적은 ⚔️물리 방어가 높아요 → ✨마법 공격 동료가 유리'}
          </div>
        ))}

        <svg viewBox="0 0 340 362" className="prep-board">
          <rect x={0} y={186} width={340} height={1.5} fill="#ffffff22" />
          <text x={170} y={190} textAnchor="middle" className="prep-vs">
            VS
          </text>
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <text x={6} y={[150, 98, 46][r] + 4} className="frow">
                {ROW_LABEL[(['front', 'mid', 'back'] as const)[r]]}
              </text>
              <text x={6} y={[224, 276, 328][r] + 4} className="frow">
                {ROW_LABEL[(['front', 'mid', 'back'] as const)[r]]}
              </text>
            </g>
          ))}
          {/* 적 배치 */}
          {Array.from({ length: 9 }, (_, slot) => {
            const p = slotXY(slot, 'enemy');
            const i = enc.enemies.findIndex((e) => e.slot === slot);
            const e = enc.enemies[i];
            const d = e ? ENEMIES[e.enemyId] : null;
            return (
              <g key={`e${slot}`} className={d ? 'eslot' : ''} {...(d ? press(() => onElement(d.element), () => enemyInfo(i)) : {})}>
                <polygon
                  points={hexCorners(p.x, p.y, R)}
                  fill={d ? ELEMENT_COLOR[d.element] + '38' : '#ffffff06'}
                  stroke={d ? (d.isBoss ? '#ff5a5a' : ELEMENT_COLOR[d.element]) : '#ffffff1c'}
                  strokeWidth={d?.isBoss ? 3.5 : 2}
                />
                {d && e && (
                  <>
                    <image href={portrait(d, enemyStage(d, e.level))} x={p.x - 23} y={p.y - 25} width={46} height={46} clipPath="circle(23px)" />
                    <text x={p.x - 22} y={p.y - 12} className="slot-el">
                      {ELEMENT_ICON[d.element]}
                    </text>
                    <rect x={p.x - 17} y={p.y + 13} width={34} height={13} rx={6} fill="#000b" />
                    <text x={p.x} y={p.y + 23} textAnchor="middle" className="slot-lv">
                      Lv.{e.level}
                    </text>
                  </>
                )}
              </g>
            );
          })}
          {/* 아군 배치 */}
          {Array.from({ length: 9 }, (_, slot) => {
            const p = slotXY(slot, 'ally');
            const id = bySlot[slot];
            const d = id ? SPIRITS[id] : null;
            const m = id ? attackMatchup(id, enc.id) : null;
            return (
              <g key={`a${slot}`} onClick={() => tapSlot(slot)} className={`fslot ${picked ? 'target' : ''}`}>
                <polygon
                  points={hexCorners(p.x, p.y, R)}
                  fill={d ? ELEMENT_COLOR[d.element] + '40' : picked ? '#ffe08a22' : '#ffffff0a'}
                  stroke={id && id === picked ? '#ffe08a' : d ? ELEMENT_COLOR[d.element] : picked ? '#ffe08a88' : '#ffffff30'}
                  strokeWidth={id && id === picked ? 4 : 2}
                />
                {d && id && (
                  <>
                    <image href={portrait(d, state.spirits[id].stage)} x={p.x - 23} y={p.y - 25} width={46} height={46} clipPath="circle(23px)" />
                    <rect x={p.x - 17} y={p.y + 13} width={34} height={13} rx={6} fill="#000b" />
                    <text x={p.x} y={p.y + 23} textAnchor="middle" className="slot-lv">
                      Lv.{state.spirits[id].level}
                    </text>
                    {m !== 'even' && (
                      <text x={p.x + 14} y={p.y - 12} className={`slot-match ${m}`}>
                        {m === 'adv' ? '▲' : '▼'}
                      </text>
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <div className="chip-row prep-chips">
          {owned.map((sid) => {
            const d = SPIRITS[sid];
            const on = state.formation[sid] !== undefined;
            const m = attackMatchup(sid, enc.id);
            const am = armorMatchup(sid, enc.id);
            return (
              <button key={sid} className={`member ${on ? 'on' : ''} ${picked === sid ? 'picked' : ''}`} onClick={() => setPicked(picked === sid ? null : sid)}>
                <img src={portrait(d, state.spirits[sid].stage)} alt="" />
                <span className="m-el">{ELEMENT_ICON[d.element]}</span>
                <span className={`m-match ${m}`}>{MATCH_LABEL[m]}</span>
                {am !== 'even' && <span className={`m-armor ${am}`}>{am === 'bad' ? '🛡막힘' : '약점!'}</span>}
                <span className="m-on">{on ? ROW_LABEL[rowName(state.formation[sid])] : '대기'}</span>
              </button>
            );
          })}
        </div>
        <div className="prep-help small">
          {picked ? (
            <>
              <b>{stageName(SPIRITS[picked], state.spirits[picked].stage)}</b> → 아래 칸을 누르면 그 자리로 (자리에 있던 동료와 바뀜){' '}
              {state.formation[picked] !== undefined && (
                <button className="link-btn" onClick={() => bench(picked)}>
                  대기로 빼기
                </button>
              )}
            </>
          ) : (
            <>
              동료를 누르고 칸을 누르면 배치돼요. 출전 {team.length}/{state.maxDeploy}명. <b>전열</b>: 받는 피해 -10%, 근접·기본 공격은 맨 앞 열부터 맞아요 · <b>후열</b>: 원거리·회복 +10%
            </>
          )}
        </div>
        {owned.length > 1 &&
          (bestIsOn ? (
            <div className="muted small center">상성이 좋은 동료로 출전 중이에요.</div>
          ) : (
            <button
              className={`suggest ${focusSuggest ? 'pulse' : ''}`}
              onClick={() =>
                act((s) => {
                  for (const k of Object.keys(s.formation)) setFormation(s, k, null);
                  for (const k of best) setFormation(s, k, DEFAULT_SLOT[k] ?? 4);
                })
              }
            >
              ✨ 상성 추천 편성으로 바꾸기
            </button>
          ))}

        <div className="power-compare">
          <div className="pc-row">
            <span>내 전투력 {power} → 상성 보정</span>
            <b>
              {POWER} {eff}
            </b>
          </div>
          <div className="pc-track">
            <div className="pc-me" style={{ width: `${Math.min(100, (eff / (rec * 1.4)) * 100)}%`, background: DIFF_COLOR[diff] }} />
            <div className="pc-rec" style={{ left: `${(1 / 1.4) * 100}%` }} />
          </div>
          <div className="pc-row">
            <span>권장 전투력 {rec}</span>
            <b style={{ color: DIFF_COLOR[diff] }}>
              {DIFFICULTY_LABEL[diff]} {diff === 'hard' ? '— 질 수 있어요' : diff === 'fair' ? '— 해볼 만해요' : '— 넉넉히 이겨요'}
            </b>
          </div>
        </div>
        <div className="reward-line">
          승리 보상 {GOLD} 약 {gold}
          {!cleared && enc.firstClear.stones > 0 && ` · ${STONE} ${enc.firstClear.stones}`}
          {!cleared && enc.firstClear.summon ? ` · 🔮 ${enc.firstClear.summon}` : ''}
          {!cleared && <small> (첫 승리 보너스 포함)</small>}
        </div>
      </div>

      <div className="prep-foot">
        <label className="skip-check">
          <input type="checkbox" checked={state.settings.skipBattle} onChange={(e) => act((s) => (s.settings.skipBattle = e.target.checked))} />
          바로 결과 보기
        </label>
        <button className={`cta ${focus && !left ? 'pulse' : ''}`} disabled={left > 0} onClick={onGo}>
          {left > 0 ? `⏳ 다시 나타나기까지 ${fmtDuration(left)}` : cleared ? '다시 싸우기 (골드 벌기)' : t.kind === 'boss' ? '보스 도전' : '전투 시작'}
        </button>
      </div>
    </div>
  );
}
