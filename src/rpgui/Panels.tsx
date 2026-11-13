// 스피릿·기술 테크트리·장비·상점 창과 알림 팝업
import { useState } from 'react';
import { beats, EL_COLOR, EL_ICON, EL_NAME, ELEMENTS, HEROES, MONSTERS, RARITY_COLOR, RARITY_NAME, SLOT_NAME, SPIRIT_BONUS_PER_LV, SPIRIT_GUARD_PER_LV, SPIRIT_TREE, SPIRITS, TREES, type Element, type Item, type Slot } from '../rpg/data';
import { buy, heroStats, itemPrice, itemScore, petStats, shopPrice, spiritNeed, type Fx, type RpgState, type ShopItem } from '../rpg/game';
import { active } from '../rpg/world';

const BASE = (import.meta.env?.BASE_URL ?? '/') + 'assets/';
const img = (n: string) => `${BASE}${n}.webp`;
export type Panel = 'tree' | 'spirit' | 'equip' | 'shop' | null;

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="rsheet-wrap" onClick={onClose}>
      <div className="rsheet" onClick={(e) => e.stopPropagation()}>
        <div className="rsheet-head">
          <b>{title}</b>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="rsheet-body">{children}</div>
      </div>
    </div>
  );
}

export function TreePanel({ state, onClose, onLearn }: { state: RpgState; onClose: () => void; onLearn: (id: string) => void }) {
  const h = state.heroes[state.heroId];
  const tree = TREES[state.heroId];
  const spent = Object.values(h.nodes).reduce((a, b) => a + b, 0);
  return (
    <Sheet title="🌳 기술 테크트리" onClose={onClose}>
      <div className="tree-head">
        남은 포인트 <b className="gold">{h.skillPts}</b> · 쓴 포인트 {spent}
        <div className="muted small">레벨업마다 1포인트. 노드를 누를 때마다 1랭크씩 올라가요(최대 5~10). 윗 노드에 3포인트를 넣으면 아래 노드가 열려요.</div>
      </div>
      {[1, 2, 3].map((tier) => (
        <div key={tier} className="tree-tier">
          <div className="tier-label">
            {tier}단계 <span className="muted">· Lv{tree.find((n) => n.tier === tier)!.level}부터</span>
          </div>
          <div className="tier-row">
            {tree
              .filter((n) => n.tier === tier)
              .map((n) => {
                const rank = h.nodes[n.id] ?? 0;
                const pre = n.pre ? tree.find((x) => x.id === n.pre)! : null;
                const preOk = !pre || (h.nodes[pre.id] ?? 0) >= (n.preRanks ?? 1);
                const lvOk = h.level >= n.level;
                const can = preOk && lvOk && rank < n.maxRank && h.skillPts > 0;
                return (
                  <button key={n.id} className={`tnode ${rank > 0 ? 'got' : ''} ${can ? 'can' : ''} ${!preOk || !lvOk ? 'locked' : ''}`} onClick={() => onLearn(n.id)}>
                    <span className="tn-icon">{n.icon}</span>
                    <b>{n.name}</b>
                    <span className="tn-rank">
                      {rank}/{n.maxRank}
                    </span>
                    <small>{n.desc}</small>
                    {!preOk && pre && <small className="tn-need">🔒 {pre.name} {h.nodes[pre.id] ?? 0}/{n.preRanks}</small>}
                    {preOk && !lvOk && <small className="tn-need">🔒 Lv{n.level}</small>}
                    {can && <small className="tn-plus">＋ 찍기</small>}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </Sheet>
  );
}

export function SpiritPanel({ state, onClose, onSpend }: { state: RpgState; onClose: () => void; onSpend: (el: Element) => void }) {
  const z = active().stage;
  const foes = [...new Set([...z.monsters.map((m) => MONSTERS[m].element), MONSTERS[z.boss].element])];
  return (
    <Sheet title="스피릿" onClose={onClose}>
      <div className="spirit-head">
        <div>
          스피릿 포인트 <b className="gold">{state.spiritPoints}</b>
        </div>
        <div className="bar xp">
          <i style={{ width: `${(state.spiritXp / spiritNeed(state.spiritEarned)) * 100}%` }} />
        </div>
        <div className="muted small">몬스터를 잡으면 쌓여요. 어떤 속성 스피릿을 키울지 직접 골라요. 키운 만큼 그 스피릿이 강해지고, 그 속성이 이기는 몬스터에게 캐릭터도 강해져요.</div>
      </div>
      <div className="elem-cycle small">💧물 → 🔥불 → 🌿숲 → ⛰️대지 → 🌪️바람 → 💧물 (화살표 쪽에 강함)</div>
      {ELEMENTS.map((e) => {
        const lv = state.spirits[e] ?? 0;
        const owned = !!state.spirits[e];
        const pet = state.pets.find((p) => p.element === e);
        const good = foes.includes(beats(e));
        const tree = SPIRIT_TREE[e];
        return (
          <div key={e} className={`spirit-card ${owned ? '' : 'locked'}`} style={{ borderColor: EL_COLOR[e] }}>
            <div className="sc-top">
              <img src={img(`${SPIRITS[e].art}-p${lv >= 20 ? 3 : lv >= 8 ? 2 : 1}`)} alt="" className={owned ? '' : 'silhouette'} />
              <div className="sc-body">
                <b>
                  {EL_ICON[e]} {SPIRITS[e].name} {owned ? `Lv${lv}` : '🔒'}
                  {good && <span className="rec-tag">이 판 추천</span>}
                </b>
                {owned ? (
                  <div className="small">
                    {EL_ICON[beats(e)]}
                    {EL_NAME[beats(e)]} 몬스터에게 캐릭터 피해 <b className="adv">+{Math.round(lv * SPIRIT_BONUS_PER_LV * 100)}%</b>, 받는 피해 -{Math.round(Math.min(60, lv * SPIRIT_GUARD_PER_LV * 100))}%
                    <br />
                    스피릿 체력 {pet ? (pet.dead ? '💀 쓰러짐(야영지에서 부활)' : `${pet.hp}/${petStats(state, e).hp}`) : '-'} · 공격 {Math.round(petStats(state, e).atk)}
                  </div>
                ) : (
                  <div className="small muted">지도 어딘가의 {EL_NAME[e]} 제단에서 만날 수 있어요</div>
                )}
              </div>
              {owned && (
                <button className="cta small-cta" disabled={state.spiritPoints <= 0} onClick={() => onSpend(e)}>
                  ▲ 키우기
                </button>
              )}
            </div>
            <div className="spirit-tree">
              {(
                [
                  [3, tree.lv3],
                  [6, tree.lv6],
                  [10, tree.lv10],
                ] as [number, string][]
              ).map(([need, text]) => (
                <div key={need} className={`st-node ${lv >= need ? 'on' : ''}`}>
                  <b>Lv{need}</b> {text}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </Sheet>
  );
}

function statLine(it: Item) {
  return [it.atk && `공격 +${it.atk}`, it.def && `방어 +${it.def}`, it.res && `마법방어 +${it.res}`, it.hp && `체력 +${it.hp}`, it.vs && `${EL_ICON[it.vs.element]}${EL_NAME[it.vs.element]} 몬스터에게 +${it.vs.pct}%`].filter(Boolean).join(' · ');
}

export function EquipPanel({ state, onClose, onEquip, onUnequip, onSell, onBest }: { state: RpgState; onClose: () => void; onEquip: (uid: string) => void; onUnequip: (slot: Slot) => void; onSell: (uid: string) => void; onBest: () => void }) {
  const [slot, setSlot] = useState<Slot>('weapon');
  const [pick, setPick] = useState<string | null>(null);
  const h = state.heroes[state.heroId];
  const gear = h.gear;
  const st = heroStats(state);
  const items = state.bag.filter((it) => it.slot === slot).sort((a, b) => itemScore(b) - itemScore(a));
  const sel = state.bag.find((it) => it.uid === pick) ?? null;
  // 고른 장비를 끼면 능력치가 어떻게 바뀌나
  const preview = sel ? heroStats({ ...state, heroes: { ...state.heroes, [state.heroId]: { ...h, gear: { ...gear, [sel.slot]: sel } } } }) : null;
  const diff = (k: 'hp' | 'atk' | 'def' | 'res') => (preview ? Math.round(preview[k]) - Math.round(st[k]) : 0);
  const slotBox = (s: Slot, pos: string) => {
    const it = gear[s];
    return (
      <button key={s} className={`eq-slot ${pos} ${slot === s ? 'on' : ''}`} onClick={() => (setSlot(s), setPick(null))} style={{ borderColor: it ? RARITY_COLOR[it.rarity] : undefined }}>
        <span className="eq-ico">{s === 'weapon' ? '⚔️' : s === 'armor' ? '🛡️' : '💍'}</span>
        <small>{SLOT_NAME[s]}</small>
        <b style={{ color: it ? RARITY_COLOR[it.rarity] : '#8a9a92' }}>{it ? it.name : '비어 있음'}</b>
      </button>
    );
  };
  return (
    <Sheet title={`장비 · ${HEROES[state.heroId].name} Lv${h.level}`} onClose={onClose}>
      <button className="cta best-btn" disabled={!state.bag.some((it) => itemScore(it) > itemScore(gear[it.slot]))} onClick={onBest}>
        ✨ 가장 좋은 장비 한 번에 착용
      </button>
      <div className="paperdoll">
        {slotBox('weapon', 'left')}
        <img className="pd-hero" src={img('hero-t')} alt="" style={{ filter: `hue-rotate(${HEROES[state.heroId].hue}deg)` }} />
        {slotBox('ring', 'right')}
        {slotBox('armor', 'bottom')}
      </div>
      <div className="pd-stats">
        {(
          [
            ['hp', '체력'],
            ['atk', '공격'],
            ['def', '방어'],
            ['res', '마법방어'],
          ] as ['hp' | 'atk' | 'def' | 'res', string][]
        ).map(([k, n]) => (
          <div key={k}>
            <small>{n}</small>
            <b>{Math.round(st[k])}</b>
            {preview && diff(k) !== 0 && <i className={diff(k) > 0 ? 'good' : 'bad'}>{diff(k) > 0 ? `+${diff(k)}` : diff(k)}</i>}
          </div>
        ))}
      </div>
      {gear[slot] && (
        <div className="eq-cur">
          <span>
            착용 중: <b style={{ color: RARITY_COLOR[gear[slot]!.rarity] }}>{gear[slot]!.name}</b> <small className="muted">{statLine(gear[slot]!)}</small>
          </span>
          <button className="ghost small-btn" onClick={() => onUnequip(slot)}>
            벗기
          </button>
        </div>
      )}
      <h4 className="sec-sm">
        가방의 {SLOT_NAME[slot]} ({items.length}) <span className="muted small">· 눌러서 비교</span>
      </h4>
      {!items.length && <div className="muted small">이 부위 장비가 없어요. 몬스터·보물 상자·보스에게서 얻어요.</div>}
      <div className="eq-list">
        {items.map((it) => {
          const better = itemScore(it) > itemScore(gear[slot]);
          return (
            <button key={it.uid} className={`eq-item ${pick === it.uid ? 'on' : ''}`} onClick={() => setPick(pick === it.uid ? null : it.uid)} style={{ borderColor: RARITY_COLOR[it.rarity] }}>
              <b style={{ color: RARITY_COLOR[it.rarity] }}>
                {it.name} <small className="muted">{RARITY_NAME[it.rarity]} · Lv{it.level}</small>
              </b>
              <small>{statLine(it)}</small>
              {better && <span className="eq-better">▲ 더 좋음</span>}
            </button>
          );
        })}
      </div>
      {sel && (
        <div className="eq-actions">
          <button className="cta" onClick={() => (onEquip(sel.uid), setPick(null))}>
            착용하기
          </button>
          <button className="ghost" onClick={() => (onSell(sel.uid), setPick(null))}>
            판매 🪙{itemPrice(sel)}
          </button>
        </div>
      )}
      <div className="muted small">
        다른 부위 가방:{' '}
        {(['weapon', 'armor', 'ring'] as Slot[])
          .filter((x) => x !== slot)
          .map((x) => `${SLOT_NAME[x]} ${state.bag.filter((it) => it.slot === x).length}`)
          .join(' · ')}
      </div>
    </Sheet>
  );
}

export function Popup({ f, state, onClose, onGo }: { f: Fx; state: RpgState; onClose: () => void; onGo: (p: Panel) => void }) {
  let tag = '';
  let body: React.ReactNode = null;
  let picture: string | null = null;
  let go: { label: string; panel: Panel } | null = null;
  if (f.k === 'spirit') {
    tag = `${EL_ICON[f.element]} 스피릿 합류!`;
    picture = img(`${SPIRITS[f.element].art}-p1`);
    body = (
      <>
        <h2>{SPIRITS[f.element].name}</h2>
        <p>
          칸을 차지하고 함께 싸워요. 키울수록 <b>{EL_ICON[beats(f.element)]}{EL_NAME[beats(f.element)]} 몬스터</b>에게 캐릭터도 강해지고, Lv3·6·10에 새 능력이 열려요.
        </p>
        <p className="small muted">쓰러지면 🏕야영지에서 되살아나요.</p>
      </>
    );
    if (state.spiritPoints > 0) go = { label: '스피릿 키우러 가기', panel: 'spirit' };
  } else if (f.k === 'levelup') {
    tag = 'LEVEL UP!';
    picture = img('hero-p');
    body = (
      <>
        <h2>
          {HEROES[f.hero].name} Lv{f.level}
        </h2>
        <p>능력치가 오르고 체력이 가득 찼어요. 🌳기술 포인트 +1!</p>
      </>
    );
    go = { label: '기술 테크트리 보기', panel: 'tree' };
  } else if (f.k === 'boss') {
    tag = '👑 보스 격파!';
    body = (
      <>
        <h2>{f.name}</h2>
        <p>위쪽 새 구역으로 갈 수 있어요. 보스는 좋은 장비를 떨어뜨려요.</p>
      </>
    );
    go = { label: '장비 확인', panel: 'equip' };
  } else if (f.k === 'unlock') {
    tag = '새 동료!';
    picture = img('hero-p');
    body = (
      <>
        <h2>{HEROES[f.hero].name}</h2>
        <p>{HEROES[f.hero].title}. 🏕야영지에서 바꿀 수 있어요.</p>
      </>
    );
  } else if (f.k === 'death') {
    tag = '쓰러졌다…';
    body = <p>마지막 야영지에서 다시 시작해요. 레벨·장비·기술 트리를 올리거나, 상성이 맞는 캐릭터·스피릿을 키워 보세요.</p>;
  }
  const hue = f.k === 'levelup' || f.k === 'unlock' ? HEROES[f.hero].hue : 0;
  return (
    <div className="modal" onClick={onClose}>
      <div className="reveal">
        <div className="reveal-tag">{tag}</div>
        {picture && <img className="reveal-art" src={picture} alt="" style={{ filter: `hue-rotate(${hue}deg)` }} />}
        {body}
        {go && (
          <button className="ghost" onClick={(e) => (e.stopPropagation(), onGo(go!.panel))}>
            {go.label}
          </button>
        )}
        <button className="cta">확인</button>
      </div>
    </div>
  );
}


export function ShopPanel({ state, onClose, onBuy }: { state: RpgState; onClose: () => void; onBuy: (it: ShopItem) => void }) {
  const items: [ShopItem, string, string, string][] = [
    ['small', '💊', '회복 물약', '체력 40% 회복 (전투 중에도 바로)'],
    ['big', '🧪', '큰 회복 물약', '체력 100% 회복'],
    ['box', '🎁', '장비 상자', `지금 열린 스테이지 수준의 장비 1개 (희귀 이상 확률 높음)`],
  ];
  return (
    <Sheet title="🏪 상점" onClose={onClose}>
      <div className="muted small">
        가진 것: 🪙 {state.gold} · 💊 {state.potions.small} · 🧪 {state.potions.big}
      </div>
      {items.map(([id, icon, name, desc]) => (
        <div key={id} className="shop-item">
          <span className="si-icon">{icon}</span>
          <div className="si-body">
            <b>{name}</b>
            <small className="muted">{desc}</small>
          </div>
          <button className="cta small-cta" disabled={state.gold < shopPrice(state, id)} onClick={() => onBuy(id)}>
            🪙 {shopPrice(state, id)}
          </button>
        </div>
      ))}
      <div className="muted small">장비는 [🛡장비]에서 팔 수 있어요. 골드는 몬스터·스테이지 클리어로 얻어요.</div>
    </Sheet>
  );
}
void buy;
