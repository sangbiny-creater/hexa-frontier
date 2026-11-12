// 소환 탭: 속성별 제단에서 🔮소환석으로 그 속성의 스피릿을 불러온다 (무엇이 나올지 미리 보이는 소환).
import { ELEMENT_LABEL } from '../core/board';
import { elementMultiplier } from '../core/board';
import { SUMMON_POOL, summonUnlocked, type GameState } from '../core/game';
import type { Element } from '../core/types';
import { BALANCE } from '../data/balance';
import { SPIRITS } from '../data/spirits';
import { ELEMENT_COLOR, ELEMENT_ICON, portrait, RoleTag } from './art';

const ORDER: Element[] = ['fire', 'water', 'forest', 'electric', 'earth'];
const ELEMENTS: Element[] = ['water', 'fire', 'forest', 'earth', 'electric'];

export function SummonView({ state, onSummon, focus }: { state: GameState; onSummon: (el: Element) => void; focus: Element | null }) {
  const open = summonUnlocked(state);
  return (
    <div className="page">
      <div className="summon-head">
        <div>
          <h2>소환의 제단</h2>
          <div className="muted small">속성을 고르면 그 속성의 스피릿이 나와요. 상대 보스에게 강한 속성을 고르세요!</div>
        </div>
        <div className="summon-stones">
          🔮 <b>{state.summonStones}</b>
        </div>
      </div>
      {!open && <div className="locked-banner">🔒 첫 보스(고목 골렘)에 도전하면 열려요</div>}
      <div className="altars">
        {ORDER.map((el) => {
          const id = SUMMON_POOL[el];
          const d = id ? SPIRITS[id] : null;
          const owned = id ? !!state.spirits[id] : false;
          const strong = ELEMENTS.filter((e) => elementMultiplier(el, e) > 1);
          const can = open && d && !owned && state.summonStones >= BALANCE.summon.cost;
          return (
            <div key={el} className={`altar ${!d ? 'locked' : ''} ${focus === el ? 'pulse' : ''}`} style={{ borderColor: ELEMENT_COLOR[el] }}>
              <div className="altar-el" style={{ background: ELEMENT_COLOR[el] + '33' }}>
                <span>{ELEMENT_ICON[el]}</span>
                <b>{ELEMENT_LABEL[el]}의 제단</b>
              </div>
              {d ? (
                <>
                  <img className={owned ? '' : 'silhouette-soft'} src={portrait(d, 1)} alt="" />
                  <div className="altar-name">{d.stages?.[0]}</div>
                  <div>
                    <RoleTag role={d.role} />
                  </div>
                  <div className="small">
                    강함: {strong.map((e) => `${ELEMENT_ICON[e]}${ELEMENT_LABEL[e]}`).join(' ')}
                  </div>
                  <button className={`altar-btn ${can ? 'can' : ''}`} disabled={!can} onClick={() => onSummon(el)}>
                    {owned ? '함께하는 중' : !open ? '🔒' : `소환 🔮${BALANCE.summon.cost}`}
                  </button>
                </>
              ) : (
                <>
                  <div className="altar-q">?</div>
                  <div className="altar-name">🔒 준비 중</div>
                  <div className="small muted">다음 지역에서 열려요</div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <p className="explain small">🔮소환석은 지도의 결정 칸과 정예 전투에서 얻어요. 이미 함께하는 스피릿의 제단은 쉬어요.</p>
    </div>
  );
}
