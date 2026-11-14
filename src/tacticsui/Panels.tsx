// 전술 전투 (D109) 창들: 부대(능력치·기술·장비), 상점, 도움말.
import { useState } from 'react';
import { EL_COLOR, EL_ICON, EL_NAME, ELEMENTS, ITEMS, ROLES, unitArt, type ItemSlot } from '../tactics/data';
import { buyItem, canEquip, defOf, equipItem, itemScore, rosterStats, sellItem, shopStock, unequipItem, autoEquip, type Campaign } from '../tactics/engine';
import { ROLE_ORDER } from '../tactics/stages';

const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
export const img = (n: string) => `${BASE}${n}.webp`;
type Act = <T>(fn: (cp: Campaign) => T) => T;
export const SLOT_NAME: Record<ItemSlot, string> = { weapon: '무기', armor: '갑옷', charm: '장신구' };

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="tsheet-wrap" onClick={onClose}>
      <div className="tsheet" onClick={(e) => e.stopPropagation()}>
        <div className="tsheet-head">
          <b>{title}</b>
          <button className="t-x" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="tsheet-body">{children}</div>
      </div>
    </div>
  );
}

export function UnitChip({ id, cp, on, onClick }: { id: string; cp: Campaign; on?: boolean; onClick?: () => void }) {
  const d = defOf(id);
  return (
    <button className={`uchip ${on ? 'on' : ''}`} onClick={onClick}>
      <img src={img(unitArt(d.art, 'p'))} alt="" />
      <span className="uc-lv">{cp.roster[id].lv}</span>
      {d.element && <i className="uc-el" style={{ background: EL_COLOR[d.element] }} />}
      <b>{d.name}</b>
      <small>
        {ROLES[d.role].icon} {ROLES[d.role].name}
      </small>
    </button>
  );
}

/** 부대: 유닛 목록 → 자세히(능력치·기술·장비) */
export function RosterPanel({ cp, act, onClose, toast }: { cp: Campaign; act: Act; onClose: () => void; toast: (t: string) => void }) {
  const [pick, setPick] = useState(cp.joined[0]);
  const [slot, setSlot] = useState<ItemSlot | null>(null);
  const { u, s, skills } = rosterStats(cp, pick);
  const d = defOf(pick);
  const role = ROLES[d.role];
  const ro = cp.roster[pick];
  const all = (defOf(pick).skills ?? role.skills).map((id) => id);
  return (
    <Sheet title="🛡 부대" onClose={onClose}>
      <div className="roster-row">
        {[...cp.joined]
          .sort((a, b) => ROLE_ORDER.indexOf(defOf(a).role) - ROLE_ORDER.indexOf(defOf(b).role))
          .map((id) => (
            <UnitChip key={id} id={id} cp={cp} on={id === pick} onClick={() => (setPick(id), setSlot(null))} />
          ))}
      </div>
      <div className="unit-detail">
        <div className="ud-top">
          <img src={img(unitArt(d.art, 't'))} alt="" />
          <div>
            <h3>
              {d.name} <span className="muted">{u.lv}레벨</span>
            </h3>
            <div>
              {role.icon} {role.name} · {d.element ? `${EL_ICON[d.element]} ${EL_NAME[d.element]}` : '속성 없음'}
              {d.leader && <b className="leader"> · 👑 지도자(쓰러지면 패배)</b>}
            </div>
            <div className="bar xp">
              <i style={{ width: `${ro.xp}%` }} />
              <span>경험치 {ro.xp} / 100</span>
            </div>
            <small className="muted">{d.desc}</small>
          </div>
        </div>
        <div className="ud-stats">
          <span>❤️ 체력 {s.hp}</span>
          <span>
            {s.dmg === 'phys' ? '⚔️ 물리 공격' : '🔮 마법 공격'} {Math.round(s.atk)}
          </span>
          <span>🛡 방어 {Math.round(s.def)}</span>
          <span>🔰 마법방어 {Math.round(s.res)}</span>
          <span>👣 이동력 {s.move}</span>
          <span>
            🎯 사거리 {s.range[0] === s.range[1] ? s.range[0] : `${s.range[0]}~${s.range[1]}`}칸
          </span>
          <span>🔷 SP {s.spMax}</span>
        </div>
        <div className="ud-sec">기술</div>
        {all.map((id, i) => {
          const sk = skills.find((x) => x.id === id);
          return (
            <div key={id} className={`ud-skill ${sk ? '' : 'locked'}`}>
              <b>
                {sk ? '' : '🔒 '}
                {sk?.icon ?? ''} {sk?.name ?? '5레벨에 배움'}
              </b>
              {sk && <small>SP {sk.sp} · {sk.desc}</small>}
              {!sk && i === 1 && <small>5레벨이 되면 두 번째 기술을 배워요</small>}
            </div>
          );
        })}
        <div className="ud-sec">
          장비{' '}
          <button
            className="link"
            onClick={() => {
              const n = act((c) => autoEquip(c));
              toast(n ? `✨ 장비 ${n}개를 더 좋은 것으로` : '이미 가장 좋은 장비예요');
            }}
          >
            ✨ 모두 가장 좋은 장비로
          </button>
        </div>
        <div className="ud-equip">
          {(['weapon', 'armor', 'charm'] as ItemSlot[]).map((sl) => {
            const it = ro.equip[sl] ? ITEMS[ro.equip[sl]!] : null;
            return (
              <button key={sl} className={`eq-slot ${slot === sl ? 'on' : ''}`} onClick={() => setSlot(slot === sl ? null : sl)}>
                <small>{SLOT_NAME[sl]}</small>
                <b>{it ? `${it.icon} ${it.name}` : '비어 있음'}</b>
                {it && <small className="muted">{it.desc}</small>}
              </button>
            );
          })}
        </div>
        {slot && (
          <div className="eq-pick">
            {ro.equip[slot] && (
              <button className="eq-item" onClick={() => act((c) => unequipItem(c, pick, slot))}>
                빼기
              </button>
            )}
            {Object.keys(cp.bag)
              .filter((id) => (cp.bag[id] ?? 0) > 0 && ITEMS[id].slot === slot)
              .sort((a, b) => itemScore(b) - itemScore(a))
              .map((id) => {
                const ok = canEquip(pick, id);
                return (
                  <button
                    key={id}
                    className={`eq-item ${ok ? '' : 'no'}`}
                    onClick={() => {
                      const e = act((c) => equipItem(c, pick, id));
                      if (e) toast(e);
                    }}
                  >
                    {ITEMS[id].icon} {ITEMS[id].name} ×{cp.bag[id]} <small>{ok ? ITEMS[id].desc : '이 역할은 못 껴요'}</small>
                  </button>
                );
              })}
            {!Object.keys(cp.bag).some((id) => (cp.bag[id] ?? 0) > 0 && ITEMS[id].slot === slot) && <small className="muted">가방에 {SLOT_NAME[slot]}가 없어요 — 🏪상점에서 사요</small>}
          </div>
        )}
      </div>
    </Sheet>
  );
}

export function ShopPanel({ cp, act, onClose, toast }: { cp: Campaign; act: Act; onClose: () => void; toast: (t: string) => void }) {
  const stock = shopStock(cp);
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const mine = Object.keys(cp.bag).filter((id) => (cp.bag[id] ?? 0) > 0);
  return (
    <Sheet title={`🏪 상점 · 🪙 ${cp.gold}`} onClose={onClose}>
      <div className="tabs">
        <button className={tab === 'buy' ? 'on' : ''} onClick={() => setTab('buy')}>
          사기
        </button>
        <button className={tab === 'sell' ? 'on' : ''} onClick={() => setTab('sell')}>
          팔기
        </button>
      </div>
      {tab === 'buy' && <div className="muted small">스테이지를 깰수록 좋은 물건이 들어와요.</div>}
      <div className="shop-list">
        {(tab === 'buy' ? stock : mine).map((id) => {
          const it = ITEMS[id];
          return (
            <div key={id} className="shop-item">
              <span className="si-icon">{it.icon}</span>
              <div>
                <b>{it.name}</b> <small className="muted">{it.slot ? SLOT_NAME[it.slot] : '소모품'} · 가진 것 {cp.bag[id] ?? 0}</small>
                <div className="small">
                  {it.desc}
                  {it.roles ? ` · ${it.roles.map((r) => ROLES[r].name).join('·')}` : ''}
                </div>
              </div>
              {tab === 'buy' ? (
                <button
                  className="t-btn"
                  disabled={cp.gold < it.price}
                  onClick={() => {
                    const e = act((c) => buyItem(c, id));
                    toast(e ?? `${it.icon} ${it.name} 샀어요`);
                  }}
                >
                  🪙 {it.price}
                </button>
              ) : (
                <button className="t-btn" onClick={() => toast(`🪙 +${act((c) => sellItem(c, id))}`)}>
                  팔기 {Math.floor(it.price / 2)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

export function HelpPanel({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title="❔ 전투 규칙" onClose={onClose}>
      <div className="help">
        <p>
          <b>차례</b>: 아군 차례에 유닛마다 한 번씩 <b>이동 → 행동</b>(공격·기술·아이템·대기). 다 하면 [턴 종료] → 적군 차례.
        </p>
        <p>
          <b>속성</b>: 💧물 → 🔥불 → 🌿숲 → ⛰️대지 → 🌪️바람 → 💧물. 화살표 쪽에 <b>유리 ×1.3</b>, 반대는 <b>불리 ×0.75</b>.
        </p>
        <p>
          <b>물리와 마법</b>: ⚔️물리 공격은 🛡방어로, 🔮마법 공격은 🔰마법방어로 줄어요. 단단한 적은 마법으로, 마법에 강한 적은 물리로.
        </p>
        <p>
          <b>반격</b>: 기본 공격을 받은 적이 살아 있고 사거리가 닿으면 70%로 반격해요. 기술은 반격을 받지 않아요.
        </p>
        <p>
          <b>지형</b>: 🌲숲 받는 피해 -15%(이동 2) · ⛰언덕 -20%(이동 2) · 🌊물 +10%(이동 3) · 🏕야영지 차례마다 체력 20% 회복. 같은 속성 지형은 이동 1, 피해 +10%.
        </p>
        <p>
          <b>SP</b>: 기술에 드는 힘. 차례마다 +5, 기본 공격이 맞으면 +3.
        </p>
        <div className="role-list">
          {ROLE_ORDER.map((r) => (
            <div key={r}>
              <b>
                {ROLES[r].icon} {ROLES[r].name}
              </b>{' '}
              <small>
                이동 {ROLES[r].move} · 사거리 {ROLES[r].range[0] === ROLES[r].range[1] ? ROLES[r].range[0] : `${ROLES[r].range[0]}~${ROLES[r].range[1]}`} · {ROLES[r].dmg === 'phys' ? '물리' : '마법'} — {ROLES[r].desc}
              </small>
            </div>
          ))}
        </div>
        <div className="el-row">
          {ELEMENTS.map((e) => (
            <span key={e} style={{ color: EL_COLOR[e] }}>
              {EL_ICON[e]}
              {EL_NAME[e]}
            </span>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
