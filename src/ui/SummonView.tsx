// 소환 탭 (D60): 속성 소환(그 속성 스피릿 중 하나) + 전체 랜덤 소환. 등급은 없고, 같은 스피릿이 또 나오면 진화 재료.
import { ELEMENT_LABEL } from '../core/board';
import { elementMultiplier } from '../core/board';
import { ALL_SUMMONABLE, evolveNeed, SUMMON_POOL, summonCost, summonUnlocked, type GameState, type SummonMode } from '../core/game';
import type { Element } from '../core/types';
import { SPIRITS } from '../data/spirits';
import { ELEMENT_COLOR, ELEMENT_ICON, portrait, RoleTag } from './art';

const ORDER: Element[] = ['fire', 'water', 'forest', 'electric', 'earth'];
const ELEMENTS: Element[] = ['water', 'fire', 'forest', 'earth', 'electric'];

export function SummonView({ state, onSummon, focus }: { state: GameState; onSummon: (mode: SummonMode) => void; focus: Element | null }) {
  const open = summonUnlocked(state);
  const anyCost = summonCost('any');
  const canAny = open && state.summonStones >= anyCost;
  return (
    <div className="page">
      <div className="summon-head">
        <div>
          <h2>소환의 제단</h2>
          <div className="muted small">등급은 없어요. 같은 스피릿이 다시 나오면 진화 재료가 돼요.</div>
        </div>
        <div className="summon-stones">
          🔮 <b>{state.summonStones}</b>
        </div>
      </div>
      {!open && <div className="locked-banner">🔒 첫 보스(고목 골렘)에 도전하면 열려요</div>}

      <div className="altar random-altar">
        <div className="altar-el">
          <span>🎲</span>
          <b>전체 랜덤 소환</b>
        </div>
        <div className="random-faces">
          {ALL_SUMMONABLE.map((id) => (
            <img key={id} className={state.spirits[id] ? '' : 'silhouette-soft'} src={portrait(SPIRITS[id], 1)} alt="" />
          ))}
        </div>
        <div className="small">5속성 스피릿 중 하나. 더 싸지만 무엇이 나올지 몰라요.</div>
        <button className={`altar-btn ${canAny ? 'can' : ''}`} disabled={!canAny} onClick={() => onSummon('any')}>
          {!open ? '🔒' : `랜덤 소환 🔮${anyCost}`}
        </button>
      </div>

      <div className="altars">
        {ORDER.map((el) => {
          const pool = SUMMON_POOL[el];
          const cost = summonCost(el);
          const strong = ELEMENTS.filter((e) => elementMultiplier(el, e) > 1);
          const can = open && pool.length > 0 && state.summonStones >= cost;
          return (
            <div key={el} className={`altar ${focus === el ? 'pulse' : ''}`} style={{ borderColor: ELEMENT_COLOR[el] }}>
              <div className="altar-el" style={{ background: ELEMENT_COLOR[el] + '33' }}>
                <span>{ELEMENT_ICON[el]}</span>
                <b>{ELEMENT_LABEL[el]} 소환</b>
              </div>
              {pool.map((id) => {
                const d = SPIRITS[id];
                const sp = state.spirits[id];
                const need = sp ? evolveNeed(sp) : null;
                return (
                  <div key={id}>
                    <img className={sp ? '' : 'silhouette-soft'} src={portrait(d, sp?.stage ?? 1)} alt="" />
                    <div className="altar-name">{d.stages?.[(sp?.stage ?? 1) - 1]}</div>
                    <div>
                      <RoleTag role={d.role} />
                    </div>
                    <div className="small">{sp ? (need ? `진화 재료 ${sp.copies}/${need.copies}` : '최종 진화') : '새 동료!'}</div>
                  </div>
                );
              })}
              <div className="small">
                강함: {strong.map((e) => `${ELEMENT_ICON[e]}${ELEMENT_LABEL[e]}`).join(' ')}
              </div>
              <button className={`altar-btn ${can ? 'can' : ''}`} disabled={!can} onClick={() => onSummon(el)}>
                {!open ? '🔒' : `소환 🔮${cost}`}
              </button>
            </div>
          );
        })}
      </div>
      <p className="explain small">
        🔮소환석은 지도의 결정 칸, 정예·보스 첫 승리에서 얻어요. 스피릿은 단계마다 최대 레벨이 있고(Lv.10 → 25 → 30), <b>같은 스피릿을 또 소환</b>해 진화하면 더 올릴 수 있어요.
      </p>
    </div>
  );
}
