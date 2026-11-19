// '탐험의 숲' 화면들 (D136): 원정(장 지도) · 판 정보 · 월드맵 · 부대(편성) · 스피릿 · 도감 · 상점 · 결과.
import { useState } from 'react';
import { EL_ICON, EL_NAME, ELEMENTS, ITEMS, ROLES, SPIRIT_IDS, UNITS, elMul, unitArt, type Element, type ItemSlot } from '../tactics/data';
import { autoEquip, buyItem, canEquip, defOf, equipItem, itemScore, rosterStats, sellItem, shopStock, unequipItem, unlockedStage, useCrystal, type BattleReward, type Campaign } from '../tactics/engine';
import { CHAPTERS, chapterOf, ENEMIES, START_SPIRITS, STAGES } from '../tactics/stages';
import { art, COUNTER, ElBadge, face, Label, Modal, Ribbon, ROLE_GROUPS, SpiritCard, stageCode, Stars, tierStars, ui } from './ui';

type Act = <T>(fn: (cp: Campaign) => T) => T;
const SLOT_NAME: Record<ItemSlot, string> = { weapon: '무기', armor: '갑옷', charm: '장신구' };

// ── 장 지도 ──
/** 장 지도 그림 위 10칸 위치 (%, 그림 492×610 기준 — 그림 속 칸 자리에 맞춤) */
const NODE_XY: [number, number][] = [
  [75.6, 85.2], [51.6, 88.0], [26.8, 86.4], [55.9, 73.8], [30.9, 69.7], [24.8, 57.7], [52.2, 58.2], [49.8, 37.7], [62.4, 27.9], [68.1, 17.2],
];
/** 장마다 지도 그림과 색조 */
const CH_LOOK: { map: 'forest' | 'volcano'; filter: string; island: number }[] = [
  { map: 'forest', filter: 'none', island: 1 },
  { map: 'forest', filter: 'hue-rotate(95deg) saturate(1.05)', island: 2 },
  { map: 'volcano', filter: 'none', island: 3 },
  { map: 'forest', filter: 'saturate(0.75) brightness(1.12)', island: 4 },
  { map: 'volcano', filter: 'sepia(0.6) saturate(0.85) brightness(1.15)', island: 5 },
  { map: 'forest', filter: 'brightness(0.85) saturate(1.25)', island: 1 },
  { map: 'volcano', filter: 'hue-rotate(160deg) saturate(0.7)', island: 3 },
  { map: 'volcano', filter: 'sepia(0.85) brightness(1.2)', island: 5 },
  { map: 'forest', filter: 'hue-rotate(220deg) saturate(0.8)', island: 1 },
  { map: 'forest', filter: 'hue-rotate(40deg) saturate(0.6) brightness(1.1)', island: 4 },
];
const chName = (ch: number) => CHAPTERS[ch].name.replace(' · ', ' ');

export function ExpeditionTab({ cp, chapter, setChapter, onStage, onHelp }: { cp: Campaign; chapter: number; setChapter: (c: number) => void; onStage: (n: number) => void; onHelp: () => void }) {
  const open = unlockedStage(cp);
  const [world, setWorld] = useState(false);
  const look = CH_LOOK[chapter];
  const first = chapter * 10 + 1;
  const cur = Math.min(Math.max(open, first), first + 9);
  return (
    <div className="fx-exp">
      <div className="fx-map-wrap">
        <div className="fx-map-box">
          <img className="fx-map-img" src={ui(`map-${look.map}`)} style={{ filter: look.filter }} alt="" />
          {NODE_XY.map(([x, y], i) => {
            const n = first + i;
            const done = cp.cleared.includes(n);
            const locked = n > open;
            const now = n === open && !done;
            const boss = n % 10 === 0;
            const node = locked ? 'node-lock' : boss ? 'node-boss' : now ? 'node-now' : done ? 'node-done' : 'node-open';
            return (
              <button key={n} className={`fx-node ${locked ? 'locked' : ''} ${now ? 'now' : ''} ${boss ? 'boss' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => !locked && onStage(n)}>
                <img src={ui(node)} alt="" />
                <span className="fx-node-tag">
                  <b>{stageCode(n)}</b>
                  <Stars n={done ? 3 : 0} size={11} />
                </span>
              </button>
            );
          })}
        </div>
        <div className="fx-chap">
          <Ribbon small>{chName(chapter)}</Ribbon>
        </div>
        <div className="fx-side">
          <button className="fx-round" onClick={() => setWorld(true)} title="월드맵">
            🗺️
          </button>
          <button className="fx-round" onClick={onHelp} title="전투 규칙">
            ❔
          </button>
        </div>
        <div className="fx-exp-foot">
          <button className="fx-btn cream fx-where" onClick={() => setWorld(true)}>
            <small>원정</small>
            <b>{stageCode(cur)}</b>
            <i>›</i>
          </button>
          <button className="fx-btn gold big" onClick={() => onStage(Math.min(open, STAGES.length))}>
            ⚔️ 출전
          </button>
        </div>
      </div>
      {world && (
        <Modal onClose={() => setWorld(false)} className="fx-world">
          <Ribbon>월드맵</Ribbon>
          <div className="fx-islands">
            {CHAPTERS.map((c, i) => {
              const lockedCh = i * 10 + 1 > open;
              const img = lockedCh ? (i >= 5 ? `island-${i + 1}` : `island-${CH_LOOK[i].island}`) : `island-${i < 5 ? i + 1 : CH_LOOK[i].island}`;
              const cleared = STAGES.slice(i * 10, i * 10 + 10).filter((s) => cp.cleared.includes(s.n)).length;
              return (
                <button key={i} className={`fx-island ${lockedCh ? 'locked' : ''} ${i === chapter ? 'on' : ''}`} disabled={lockedCh} onClick={() => (setChapter(i), setWorld(false))}>
                  <img src={ui(img)} alt="" style={{ filter: !lockedCh && i >= 5 ? CH_LOOK[i].filter : lockedCh && i < 5 ? 'grayscale(0.85) brightness(0.8)' : undefined }} />
                  {lockedCh && i < 5 && <i className="fx-lock">🔒</i>}
                  <span>
                    <b>{i + 1}장</b>
                    {c.name.split(' · ')[1]}
                    {!lockedCh && <small>{cleared}/10</small>}
                  </span>
                </button>
              );
            })}
          </div>
          <button className="fx-btn cream" onClick={() => setWorld(false)}>
            닫기
          </button>
        </Modal>
      )}
    </div>
  );
}

/** 판의 적 속성 중 가장 많은 것 */
export function mainEnemyEl(n: number): Element | null {
  const cnt = new Map<Element, number>();
  for (const e of STAGES[n - 1].enemies) {
    const el = ENEMIES[`e_${e.id}`].element;
    if (el) cnt.set(el, (cnt.get(el) ?? 0) + 1);
  }
  return [...cnt.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
export function Advice({ n }: { n: number }) {
  const el = mainEnemyEl(n);
  if (!el) return <div className="fx-advice">여러 속성이 섞여 있어요 · 고르게 편성하세요</div>;
  const c = COUNTER[el];
  return (
    <div className="fx-advice">
      <span className={`t-${el}`}>
        {EL_ICON[el]} {EL_NAME[el]} 속성 적이 많아요
      </span>
      <i>➜</i>
      <span className={`t-${c}`}>
        {EL_ICON[c]} {EL_NAME[c]} 스피릿 추천
      </span>
    </div>
  );
}
export const winText = (n: number) => {
  const st = STAGES[n - 1];
  return `${st.win === 'boss' ? '보스 격파' : '적 전멸'} · ${st.turns}턴`;
};

export function StageDetail({ cp, n, onClose, onGo }: { cp: Campaign; n: number; onClose: () => void; onGo: () => void }) {
  const st = STAGES[n - 1];
  const first = !cp.cleared.includes(n);
  return (
    <Modal onClose={onClose} className="fx-stage">
      <Ribbon>
        {stageCode(n)} · {st.name}
      </Ribbon>
      <Advice n={n} />
      <p className="fx-story">{st.story}</p>
      <div className="fx-box">
        <Label>출현 적</Label>
        <div className="fx-foes">
          {st.enemies.map((e, i) => {
            const d = ENEMIES[`e_${e.id}`];
            return (
              <div key={i} className={`fx-foe ${e.boss ? 'boss' : ''}`}>
                <img src={art(unitArt(d.art, 'p', e.lv))} alt="" />
                {e.boss && <i className="fx-crown">👑</i>}
                <span>
                  <ElBadge el={d.element} size={15} />
                  Lv.{e.lv}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="fx-row-box">
        <Label>승리 조건</Label>
        <b>⚔️ {winText(n)}</b>
      </div>
      <div className="fx-box">
        <Label>{first ? '첫 클리어 보상' : '다시 깨면'}</Label>
        <div className="fx-rewards">
          <div className="fx-reward">
            <img src={ui('coin')} alt="" />
            <b>×{first ? st.gold : Math.round(st.gold * 0.4)}</b>
          </div>
          {first &&
            st.items.map((id, i) => (
              <div key={i} className="fx-reward">
                <span className="fx-emoji">{ITEMS[id].icon}</span>
                <b>{ITEMS[id].name}</b>
              </div>
            ))}
          {first &&
            st.joins.map((id) => (
              <div key={id} className="fx-reward join">
                <img src={art(unitArt(defOf(id).art, 'p', 1))} alt="" />
                <b>합류!</b>
              </div>
            ))}
        </div>
      </div>
      <button className="fx-btn gold big" onClick={onGo}>
        ⚔️ 출전 준비
      </button>
    </Modal>
  );
}

// ── 부대 (편성) ──
/** 편성 칸 6개 위치 (육각 꽃 모양, 가운데는 비움): 위(리더) · 왼위 · 오른위 · 왼아래 · 오른아래 · 아래 */
const SLOT_XY: [number, number][] = [
  [0, -1], [-0.75, -0.5], [0.75, -0.5], [-0.75, 0.5], [0.75, 0.5], [0, 1],
];
export const goodScore = (id: string, n: number) => {
  const e = defOf(id).element;
  const els = [...new Set(STAGES[n - 1].enemies.map((x) => ENEMIES[`e_${x.id}`].element).filter(Boolean))] as Element[];
  return els.reduce((a, x) => a + (elMul(e, x) > 1 ? 1 : 0) - (elMul(x, e) > 1 ? 0.5 : 0), 0);
};
export const partyPower = (cp: Campaign, ids: string[]) =>
  Math.round(
    ids.reduce((a, id) => {
      if (!cp.roster[id]) return a;
      const { s } = rosterStats(cp, id);
      return a + s.hp * 3 + s.atk * 12 + s.def * 8 + s.res * 8;
    }, 0) * 10,
  );

export function PartyTab({ cp, n, party, setParty, max, toast, onRecommend, onEquip, onStart, act }: { cp: Campaign; n: number; party: string[]; setParty: (p: string[]) => void; max: number; toast: (t: string) => void; onRecommend: () => void; onEquip: (id: string) => void; onStart: () => void; act: Act }) {
  const st = STAGES[n - 1];
  const [elF, setElF] = useState<Element | null>(null);
  const [roleF, setRoleF] = useState<number | null>(null);
  const toggle = (id: string) => {
    if (id === cp.hero) return toast(`${UNITS[cp.hero].name}은(는) 늘 출전해요 (리더)`);
    if (party.includes(id)) return setParty(party.filter((x) => x !== id));
    if (party.length >= max) return toast(`이번 판은 ${max}명까지`);
    setParty([...party, id]);
  };
  const list = cp.joined
    .filter((id) => !elF || defOf(id).element === elF)
    .filter((id) => roleF === null || ROLE_GROUPS[roleF].roles.includes(defOf(id).role))
    .sort((a, b) => goodScore(b, n) - goodScore(a, n) || cp.roster[b].lv - cp.roster[a].lv);
  const rec = mainEnemyEl(n);
  const ordered = [cp.hero, ...party.filter((x) => x !== cp.hero)];
  return (
    <div className="fx-party">
      <div className="fx-party-head">
        <Ribbon small>
          {stageCode(n)} · {st.name}
        </Ribbon>
        <div className="fx-cond">⚔️ 승리 조건 : {winText(n)}</div>
        <Advice n={n} />
      </div>
      <div className="fx-formation">
        <div className="fx-side-l">
          <div className="fx-mini">
            <small>⚔️ 편성 전투력</small>
            <b>{partyPower(cp, party).toLocaleString()}</b>
          </div>
          <div className="fx-mini cream">
            <small>추천 속성</small>
            {rec ? (
              <span className={`fx-chip t-${COUNTER[rec]}`}>
                {EL_ICON[COUNTER[rec]]} {EL_NAME[COUNTER[rec]]} 속성
              </span>
            ) : (
              <span className="fx-chip">골고루</span>
            )}
            <small className="fx-count">
              출전 {party.length}/{max}
            </small>
          </div>
        </div>
        <div className="fx-hexes">
          {SLOT_XY.map(([x, y], i) => {
            const id = ordered[i];
            const locked = i >= max;
            const d = id ? defOf(id) : null;
            return (
              <button
                key={i}
                className={`fx-hex ${locked ? 'locked' : ''} ${id ? 'has' : ''} ${i === 0 ? 'leader' : ''}`}
                style={{ left: `calc(50% + ${x * 88}px)`, top: `calc(50% + ${y * 78}px)` }}
                onClick={() => id && toggle(id)}
              >
                <span className="fx-hex-in">{id ? <img src={art(unitArt(d!.art, 't', cp.roster[id].lv))} alt="" /> : locked ? '🔒' : '+'}</span>
                {i === 0 && <i className="fx-leader">👑 리더</i>}
                {id && (
                  <span className="fx-hex-lv">
                    <ElBadge el={d!.element} size={16} />
                    Lv.{cp.roster[id].lv}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="fx-side-r">
          <button className="fx-sq" onClick={() => (act((c) => void (c.party = [...party])), toast('편성을 저장했어요'))}>
            <span>💾</span>편성 저장
          </button>
          <button className="fx-sq" onClick={() => setParty([cp.hero, ...cp.party.filter((x) => x !== cp.hero && cp.roster[x])].slice(0, max))}>
            <span>📥</span>불러오기
          </button>
          <button className="fx-sq" onClick={() => setParty([cp.hero])}>
            <span>🔄</span>전체 해제
          </button>
        </div>
      </div>
      <div className="fx-panel fx-own">
        <div className="fx-own-head">
          <Ribbon small>보유 스피릿</Ribbon>
          <div className="fx-filters">
            <button className={!elF && roleF === null ? 'on' : ''} onClick={() => (setElF(null), setRoleF(null))}>
              전체
            </button>
            <button className={elF ? 'on' : ''} onClick={() => setElF(elF === null ? ELEMENTS[0] : ELEMENTS[ELEMENTS.indexOf(elF) + 1] ?? null)}>
              {elF ? `${EL_ICON[elF]} ${EL_NAME[elF]}` : '속성'} ▾
            </button>
            <button className={roleF !== null ? 'on' : ''} onClick={() => setRoleF(roleF === null ? 0 : roleF + 1 < ROLE_GROUPS.length ? roleF + 1 : null)}>
              {roleF !== null ? ROLE_GROUPS[roleF].name : '역할'} ▾
            </button>
          </div>
        </div>
        <div className="fx-grid5">
          {list.map((id) => {
            const g = goodScore(id, n);
            return (
              <SpiritCard
                key={id}
                id={id}
                cp={cp}
                on={party.includes(id)}
                check={party.includes(id)}
                tag={g > 0 ? <i className="fx-tag good">▲유리</i> : g < 0 ? <i className="fx-tag bad">▼불리</i> : id === cp.hero ? <i className="fx-tag lead">리더</i> : null}
                onClick={() => toggle(id)}
              />
            );
          })}
          {!list.length && <p className="fx-empty">조건에 맞는 스피릿이 없어요</p>}
        </div>
        <div className="fx-party-foot">
          <button className="fx-btn cream" onClick={onRecommend}>
            ✨ 상성 추천 편성
          </button>
          <button className="fx-btn cream" onClick={() => onEquip(party[1] ?? cp.hero)}>
            🦺 장비
          </button>
          <button className="fx-btn gold" disabled={!party.includes(cp.hero)} onClick={onStart}>
            ⚔️ 전투 시작
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 스피릿 ──
export function SpiritTab({ cp, act, toast, pick, setPick }: { cp: Campaign; act: Act; toast: (t: string) => void; pick: string | null; setPick: (id: string | null) => void }) {
  const [elF, setElF] = useState<Element | null>(null);
  const [roleF, setRoleF] = useState<number | null>(null);
  const [byLv, setByLv] = useState(true);
  if (pick && cp.roster[pick]) return <SpiritDetail cp={cp} id={pick} act={act} toast={toast} onBack={() => setPick(null)} />;
  const list = cp.joined
    .filter((id) => !elF || defOf(id).element === elF)
    .filter((id) => roleF === null || ROLE_GROUPS[roleF].roles.includes(defOf(id).role))
    .sort((a, b) => (byLv ? cp.roster[b].lv - cp.roster[a].lv : cp.joined.indexOf(a) - cp.joined.indexOf(b)));
  return (
    <div className="fx-page">
      <div className="fx-panel fx-full">
        <Ribbon>스피릿</Ribbon>
        <div className="fx-chips">
          <span className="fx-chip-label">속성</span>
          <button className={!elF ? 'on' : ''} onClick={() => setElF(null)}>
            전체
          </button>
          {ELEMENTS.map((e) => (
            <button key={e} className={elF === e ? 'on' : ''} onClick={() => setElF(e)}>
              {EL_ICON[e]} {EL_NAME[e]}
            </button>
          ))}
        </div>
        <div className="fx-chips">
          <span className="fx-chip-label">역할</span>
          <button className={roleF === null ? 'on' : ''} onClick={() => setRoleF(null)}>
            전체
          </button>
          {ROLE_GROUPS.map((g, i) => (
            <button key={g.id} className={roleF === i ? 'on' : ''} onClick={() => setRoleF(i)}>
              {g.icon} {g.name}
            </button>
          ))}
        </div>
        <div className="fx-sortbar">
          <button className="fx-btn cream slim" onClick={() => setByLv(!byLv)}>
            {byLv ? '레벨순' : '합류순'} ▾
          </button>
          <span>
            보유 <b>{cp.joined.length}</b> / {SPIRIT_IDS.length + 2}
          </span>
        </div>
        <div className="fx-grid4">
          {list.map((id) => (
            <SpiritCard key={id} id={id} cp={cp} stars tag={cp.party.includes(id) ? <i className="fx-tag go">출전</i> : null} onClick={() => setPick(id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpiritDetail({ cp, id, act, toast, onBack }: { cp: Campaign; id: string; act: Act; toast: (t: string) => void; onBack: () => void }) {
  const [slot, setSlot] = useState<ItemSlot | null>(null);
  const { u, s, skills } = rosterStats(cp, id);
  const d = defOf(id);
  const role = ROLES[d.role];
  const ro = cp.roster[id];
  const all = d.skills ?? role.skills;
  const evo = d.art === 'hero' || d.art === 'heroine' || d.art.includes('-') ? null : [1, 10, 25];
  return (
    <div className="fx-page">
      <div className="fx-panel fx-full fx-detail">
        <button className="fx-back" onClick={onBack}>
          ‹
        </button>
        <Ribbon>스피릿 정보</Ribbon>
        <div className="fx-dtop">
          <div className="fx-stage-art">
            <img src={art(unitArt(d.art, 't', u.lv))} alt="" />
          </div>
          <div className="fx-dinfo">
            <h3>
              <ElBadge el={d.element} size={26} /> {d.name}
            </h3>
            <div className="fx-dchips">
              {d.element && (
                <span className={`fx-chip t-${d.element}`}>
                  {EL_ICON[d.element]} {EL_NAME[d.element]} 속성
                </span>
              )}
              <span className="fx-chip">
                {role.icon} {role.name}
              </span>
            </div>
            <Stars n={tierStars(u.lv)} max={4} size={20} />
            {id === cp.hero && <b className="fx-leadnote">👑 리더 · 쓰러지면 패배</b>}
            <div className="fx-stat-table">
              <span>❤️ 체력</span>
              <b>{s.hp}</b>
              <span>{s.dmg === 'phys' ? '⚔️ 물리 공격' : '🔮 마법 공격'}</span>
              <b>{Math.round(s.atk)}</b>
              <span>🛡️ 방어</span>
              <b>{Math.round(s.def)}</b>
              <span>🔰 마법방어</span>
              <b>{Math.round(s.res)}</b>
              <span>👣 이동력</span>
              <b>{s.move}</b>
              <span>🎯 사거리</span>
              <b>{s.range[0] === s.range[1] ? s.range[0] : `${s.range[0]}~${s.range[1]}`}</b>
              <span>💧 SP</span>
              <b>{s.spMax}</b>
            </div>
          </div>
        </div>
        {evo && (
          <div className="fx-evo">
            {evo.map((lv, i) => (
              <div key={lv} className={`fx-evo-step ${u.lv >= lv ? 'on' : ''} ${(i === 2 ? u.lv >= 25 : u.lv >= lv && u.lv < evo[i + 1]) ? 'now' : ''}`}>
                <img src={art(unitArt(d.art, 't', lv))} alt="" />
                <b>Lv.{lv}</b>
                {i < 2 && <i>➜</i>}
              </div>
            ))}
          </div>
        )}
        <p className="fx-desc">{d.desc}</p>
        <div className="fx-box">
          <Label>스킬</Label>
          <div className="fx-skills">
            {all.map((sid, i) => {
              const sk = skills.find((x) => x.id === sid);
              return (
                <div key={sid} className={`fx-skill ${sk ? '' : 'locked'}`}>
                  <span className="fx-skill-ic">{sk ? sk.icon : '🔒'}</span>
                  <div>
                    <b>{sk ? sk.name : `Lv.5 해금`}</b>
                    <small>{sk ? `SP ${sk.sp} · ${sk.desc}` : i === 1 ? '5레벨이 되면 배워요' : ''}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="fx-box">
          <Label>장비</Label>
          <button
            className="fx-link"
            onClick={() => {
              const k = act((c) => autoEquip(c));
              toast(k ? `✨ 장비 ${k}개를 더 좋은 것으로` : '이미 가장 좋은 장비예요');
            }}
          >
            ✨ 모두 가장 좋은 장비로
          </button>
          <div className="fx-equip">
            <div className="fx-slots">
              {(['weapon', 'armor', 'charm'] as ItemSlot[]).map((sl) => {
                const it = ro.equip[sl] ? ITEMS[ro.equip[sl]!] : null;
                return (
                  <button key={sl} className={`fx-slot ${slot === sl ? 'on' : ''}`} onClick={() => setSlot(slot === sl ? null : sl)}>
                    <span>{it ? it.icon : '+'}</span>
                    <small>{it ? it.name : SLOT_NAME[sl]}</small>
                  </button>
                );
              })}
            </div>
            <div className="fx-grow">
              <div className="fx-exp-row">
                <b>Lv.{u.lv}</b>
                <div className="fx-bar xp">
                  <i style={{ width: `${ro.xp}%` }} />
                  <span>EXP {ro.xp} / 100</span>
                </div>
              </div>
              <button
                className="fx-btn gold"
                disabled={(cp.bag.crystal ?? 0) <= 0}
                onClick={() => {
                  const e = act((c) => useCrystal(c, id));
                  toast(e ?? `💎 ${d.name} 경험치 +100`);
                }}
              >
                <img src={ui('gem')} alt="" className="fx-ic" /> 성장의 결정 쓰기 ({cp.bag.crystal ?? 0})
              </button>
            </div>
          </div>
          {slot && (
            <div className="fx-eqpick">
              {ro.equip[slot] && (
                <button className="fx-eqitem" onClick={() => act((c) => unequipItem(c, id, slot))}>
                  빼기
                </button>
              )}
              {Object.keys(cp.bag)
                .filter((k) => (cp.bag[k] ?? 0) > 0 && ITEMS[k].slot === slot)
                .sort((a, b) => itemScore(b) - itemScore(a))
                .map((k) => {
                  const ok = canEquip(id, k);
                  return (
                    <button
                      key={k}
                      className={`fx-eqitem ${ok ? '' : 'no'}`}
                      onClick={() => {
                        const e = act((c) => equipItem(c, id, k));
                        if (e) toast(e);
                      }}
                    >
                      {ITEMS[k].icon} {ITEMS[k].name} ×{cp.bag[k]} <small>{ok ? ITEMS[k].desc : '이 역할은 못 껴요'}</small>
                    </button>
                  );
                })}
              {!Object.keys(cp.bag).some((k) => (cp.bag[k] ?? 0) > 0 && ITEMS[k].slot === slot) && <small className="fx-muted">가방에 {SLOT_NAME[slot]}가 없어요 — 상점에서 사요</small>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 도감 ──
/** 이 스피릿을 만나는 판 (0 = 처음부터) */
function metAt(id: string): number {
  if (START_SPIRITS.includes(id) || UNITS[id].hero) return UNITS[id].hero ? 98 : 0;
  return STAGES.find((s) => s.joins.includes(id))?.n ?? 0;
}
export function DexTab({ cp, onPick }: { cp: Campaign; onPick: (id: string) => void }) {
  const [el, setEl] = useState<Element>('water');
  const ids = SPIRIT_IDS;
  const have = ids.filter((id) => cp.roster[id]).length;
  const mine = ids.filter((id) => UNITS[id].element === el);
  return (
    <div className="fx-page">
      <div className="fx-panel fx-full">
        <Ribbon>
          📖 스피릿 도감 {have}/{ids.length}
        </Ribbon>
        <div className="fx-eltabs">
          {ELEMENTS.map((e) => (
            <button key={e} className={el === e ? 'on' : ''} onClick={() => setEl(e)}>
              {EL_ICON[e]} {EL_NAME[e]} {ids.filter((id) => UNITS[id].element === e && cp.roster[id]).length}/{ids.filter((id) => UNITS[id].element === e).length}
            </button>
          ))}
        </div>
        <div className="fx-dex">
          {ROLE_GROUPS.map((g) => {
            const row = mine.filter((id) => g.roles.includes(UNITS[id].role));
            return (
              <div key={g.id} className="fx-dex-row">
                <div className="fx-dex-role">
                  <span>{g.icon}</span>
                  <b>{g.name}</b>
                  <small>
                    ({row.filter((id) => cp.roster[id]).length}/{row.length})
                  </small>
                </div>
                <div className="fx-dex-cards">
                  {row.map((id) => {
                    const ok = !!cp.roster[id];
                    const d = UNITS[id];
                    return ok ? (
                      <button key={id} className={`fx-dcard el-bg-${d.element}`} onClick={() => onPick(id)}>
                        <img src={art(unitArt(d.art, 'p', cp.roster[id].lv))} alt="" />
                        <ElBadge el={d.element} size={18} />
                        <b>{d.name}</b>
                      </button>
                    ) : (
                      <div key={id} className="fx-dcard unknown">
                        <img src={art(unitArt(d.art, 'p', 1))} alt="" />
                        <i>?</i>
                        <b>{metAt(id) ? `${stageCode(metAt(id))}을 깨면 만나요` : '곧 만나요'}</b>
                      </div>
                    );
                  })}
                  {!row.length && <span className="fx-dex-none">❦</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="fx-collect">
          <Label>수집 현황</Label>
          <div className="fx-bar big">
            <i style={{ width: `${(have / ids.length) * 100}%` }} />
            <span>
              도감 수집 {have} / {ids.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 상점 ──
export function ShopTab({ cp, act, toast }: { cp: Campaign; act: Act; toast: (t: string) => void }) {
  const [tab, setTab] = useState<'use' | 'gear' | 'sell'>('use');
  const stock = shopStock(cp);
  const list = tab === 'sell' ? Object.keys(cp.bag).filter((id) => (cp.bag[id] ?? 0) > 0) : stock.filter((id) => (tab === 'use' ? !ITEMS[id].slot : !!ITEMS[id].slot));
  const newest = new Set(stock.filter((id) => ITEMS[id].price > 160 + Math.max(0, cp.cleared.length - 1) * 130));
  return (
    <div className="fx-page fx-shop">
      <img className="fx-stall" src={ui('shop-stall')} alt="" />
      <div className="fx-panel fx-full">
        <Ribbon>🏪 상점</Ribbon>
        <div className="fx-shoptabs">
          <button className={tab === 'use' ? 'on' : ''} onClick={() => setTab('use')}>
            소모품
          </button>
          <button className={tab === 'gear' ? 'on' : ''} onClick={() => setTab('gear')}>
            장비
          </button>
          <button className={tab === 'sell' ? 'on' : ''} onClick={() => setTab('sell')}>
            팔기
          </button>
          <span className="fx-pill dark">
            <img src={ui('coin')} alt="" />
            {cp.gold.toLocaleString()}
          </span>
        </div>
        <div className="fx-goods">
          {list.map((id) => {
            const it = ITEMS[id];
            return (
              <div key={id} className="fx-good">
                {tab !== 'sell' && newest.has(id) && <i className="fx-new">새 물건!</i>}
                <div className="fx-good-ic">
                  <span>{it.icon}</span>
                  <small>보유 {cp.bag[id] ?? 0}</small>
                </div>
                <div className="fx-good-main">
                  <b>{it.name}</b>
                  <small>
                    {it.desc}
                    {it.roles ? ` (${it.roles.map((r) => ROLES[r].name).join('·')})` : ''}
                  </small>
                  {tab === 'sell' ? (
                    <button className="fx-price" onClick={() => toast(`골드 +${act((c) => sellItem(c, id))}`)}>
                      팔기 <img src={ui('coin')} alt="" />
                      {Math.floor(it.price / 2)}
                    </button>
                  ) : (
                    <button
                      className="fx-price"
                      disabled={cp.gold < it.price}
                      onClick={() => {
                        const e = act((c) => buyItem(c, id));
                        toast(e ?? `${it.icon} ${it.name} 샀어요`);
                      }}
                    >
                      <img src={ui('coin')} alt="" />
                      {it.price.toLocaleString()}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {!list.length && <p className="fx-empty">{tab === 'sell' ? '팔 물건이 없어요' : '아직 들어온 물건이 없어요'}</p>}
        </div>
        <div className="fx-info">ⓘ 스테이지를 깰수록 물건이 늘어나요.</div>
      </div>
    </div>
  );
}

// ── 결과 ──
export function ResultView({ cp, reward, onNext, onRetry, onCamp, onPrev, onRecommend, onEquip, onSpirit }: { cp: Campaign; reward: BattleReward & { stage: number }; onNext: () => void; onRetry: () => void; onCamp: () => void; onPrev: () => void; onRecommend: () => void; onEquip: () => void; onSpirit: (id: string) => void }) {
  const [step, setStep] = useState(0); // 0 결과, 1.. 합류
  const st = STAGES[reward.stage - 1];
  const joinId = step > 0 ? reward.joins[step - 1] : null;
  const next = reward.win && reward.stage < STAGES.length;
  if (joinId) {
    const d = defOf(joinId);
    return (
      <div className="fx-result">
        <div className="fx-join">
          <Ribbon>{d.name} 합류!</Ribbon>
          <div className="fx-rays">
            <img src={art(unitArt(d.art, 't', cp.roster[joinId]?.lv ?? 1))} alt="" />
          </div>
          <div className="fx-dchips">
            {d.element && (
              <span className={`fx-chip big t-${d.element}`}>
                <ElBadge el={d.element} size={22} /> {EL_NAME[d.element]} 속성
              </span>
            )}
            <span className="fx-chip big">
              {ROLES[d.role].icon} {ROLES[d.role].name}
            </span>
          </div>
          <p className="fx-desc light">{d.desc}</p>
          <button className="fx-btn gold big" onClick={() => onSpirit(joinId)}>
            스피릿 보기
          </button>
          <button className="fx-btn cream" onClick={() => (step < reward.joins.length ? setStep(step + 1) : next ? onNext() : onCamp())}>
            {step < reward.joins.length ? '다음 합류 보기' : next ? `다음: ${stageCode(reward.stage + 1)}` : '원정으로'}
          </button>
        </div>
      </div>
    );
  }
  if (!reward.win)
    return (
      <div className="fx-result">
        <div className="fx-res-card lose">
          <div className="fx-res-ribbon grey">패배…</div>
          <img className="fx-lose-art" src={ui('lose-spirit')} alt="" />
          <div className="fx-res-msg">
            {stageCode(st.n)} · {st.name}
            <br />
            <small>얻은 경험치는 남아요. 골드 +{reward.gold}</small>
          </div>
          <button className="fx-btn cream" disabled={reward.stage <= 1} onClick={onPrev}>
            앞 판에서 경험치 벌기
          </button>
          <button className="fx-btn cream" onClick={onRecommend}>
            상성 추천 편성
          </button>
          <button className="fx-btn cream" onClick={onEquip}>
            장비 바꾸기
          </button>
          <button className="fx-btn gold big" onClick={onRetry}>
            다시 도전
          </button>
        </div>
      </div>
    );
  return (
    <div className="fx-result">
      <div className="fx-res-card win">
        <div className="fx-res-ribbon">
          <i>👑</i>승리!
        </div>
        <Ribbon small>
          {stageCode(st.n)} · {st.name}
        </Ribbon>
        <Stars n={3} size={44} />
        <Label>획득 보상</Label>
        <div className="fx-rewards">
          <div className="fx-reward">
            <img src={ui('coin')} alt="" />
            <b>+{reward.gold}</b>
          </div>
          {reward.items.map((id, i) => (
            <div key={i} className="fx-reward">
              <span className="fx-emoji">{ITEMS[id].icon}</span>
              <b>{ITEMS[id].name}</b>
            </div>
          ))}
        </div>
        {reward.levels.length > 0 && (
          <>
            <Label>레벨 업!</Label>
            <div className="fx-lvups">
              {reward.levels.slice(0, 4).map((l) => (
                <div key={l.id} className="fx-lvup">
                  <img src={face(l.id, l.to)} alt="" />
                  <div>
                    <b>{defOf(l.id).name}</b>
                    <span>
                      Lv.{l.from} <i>▶</i> <em>Lv.{l.to}</em>
                    </span>
                  </div>
                </div>
              ))}
              {reward.levels.length > 4 && <small className="fx-muted">외 {reward.levels.length - 4}명</small>}
            </div>
          </>
        )}
        <button className="fx-btn gold big" onClick={() => (reward.joins.length ? setStep(1) : next ? onNext() : onCamp())}>
          {reward.joins.length ? '다음' : next ? `다음: ${stageCode(reward.stage + 1)}` : '원정으로'}
        </button>
        <button className="fx-btn cream slim" onClick={onCamp}>
          원정 지도로
        </button>
      </div>
    </div>
  );
}

export { chapterOf };
