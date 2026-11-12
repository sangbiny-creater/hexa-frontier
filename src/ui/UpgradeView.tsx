// 강화 화면: 골드로 레벨업 → 전투력 상승, Lv.10/25에 진화(그림이 바뀜).
import { affordableLevelUps, canRankUp, levelUp, rankUp, type GameState } from '../core/game';
import { levelUpCost, rankUpCost } from '../core/growth';
import { spiritPower, spiritPowerAt } from '../core/power';
import { BALANCE } from '../data/balance';
import { SPIRITS } from '../data/spirits';
import { Bar, ElementTag, GOLD, portrait, POWER, RoleTag, spiritStage, stageName, STONE } from './art';

type Act = <T>(fn: (s: GameState, now: number) => T) => T;

export function UpgradeView({
  state,
  act,
  toast,
  focusLevel,
  onLeveled,
  onEvolve,
  goal,
}: {
  state: GameState;
  act: Act;
  toast: (m: string) => void;
  focusLevel: boolean;
  onLeveled: () => void;
  onEvolve: (spiritId: string, stage: number) => void;
  goal: number | null;
}) {
  const ups = affordableLevelUps(state);
  const team = Object.keys(state.spirits);
  const total = team.reduce((a, id) => a + spiritPower(state, id), 0);

  const one = (id: string) => {
    const sp = state.spirits[id];
    const before = spiritStage(sp.level);
    const gain = spiritPowerAt(id, sp.level + 1, sp.rank) - spiritPower(state, id);
    const err = act((s) => levelUp(s, id));
    if (err) return toast(err);
    toast(`${stageName(SPIRITS[id], sp.level + 1)} Lv.${sp.level + 1}  ${POWER} +${gain}`);
    const after = spiritStage(sp.level + 1);
    if (after > before) onEvolve(id, after);
    onLeveled();
  };

  const all = () => {
    const before = Object.fromEntries(team.map((id) => [id, spiritStage(state.spirits[id].level)]));
    const res = act((s) => {
      let n = 0;
      for (let g = 0; g < 400; g++) {
        const id = Object.keys(s.formation).sort((a, b) => s.spirits[a].level - s.spirits[b].level)[0];
        if (!id || s.spirits[id].level >= BALANCE.growth.maxLevel || s.gold < levelUpCost(s.spirits[id].level) || levelUp(s, id)) break;
        n++;
      }
      return { n, levels: Object.fromEntries(Object.entries(s.spirits).map(([k, v]) => [k, v.level])) };
    });
    if (!res.n) return;
    toast(`레벨업 ${res.n}번!`);
    for (const id of team) if (spiritStage(res.levels[id]) > before[id]) onEvolve(id, spiritStage(res.levels[id]));
    onLeveled();
  };

  return (
    <div className="page">
      <div className="up-head">
        <div>
          <div className="muted small">팀 전투력</div>
          <div className="big-power">
            {POWER} {total.toLocaleString()}
          </div>
          {goal && (
            <div className="goal">
              다음 보스 목표 {POWER} {goal} {total >= goal ? <b className="good">✓ 달성!</b> : <span className="bad">({goal - total} 부족)</span>}
            </div>
          )}
        </div>
        <button className={`cta small-cta ${focusLevel && ups ? 'pulse' : ''}`} disabled={!ups} onClick={all}>
          모두 레벨업
          <small>{ups ? `${ups}번 가능` : '골드 부족'}</small>
        </button>
      </div>
      <p className="explain">
        전투에서 번 {GOLD}골드로 <b>레벨업</b> → 스피릿의 공격·체력·방어가 오르고 {POWER}전투력이 올라가요. <b>Lv.10, Lv.25</b>에 진화해서 모습이 바뀌어요!
      </p>
      {team.map((id) => {
        const def = SPIRITS[id];
        const sp = state.spirits[id];
        const stage = spiritStage(sp.level);
        const cost = levelUpCost(sp.level);
        const power = spiritPower(state, id);
        const gain = spiritPowerAt(id, sp.level + 1, sp.rank) - power;
        const nextEvo = sp.level < 10 ? 10 : sp.level < 25 ? 25 : null;
        const prevEvo = sp.level < 10 ? 1 : sp.level < 25 ? 10 : 25;
        const can = state.gold >= cost && sp.level < BALANCE.growth.maxLevel;
        const rc = rankUpCost(sp);
        return (
          <div key={id} className="scard">
            <div className="scard-art">
              <img src={portrait(def, stage)} alt={def.name} />
              <div className="lv">Lv.{sp.level}</div>
              {sp.rank > 0 && <div className="stars">{'★'.repeat(sp.rank)}</div>}
            </div>
            <div className="scard-body">
              <div className="scard-name">
                <b>{stageName(def, sp.level)}</b>
                <span className="muted small"> {def.name}</span>
              </div>
              <div className="tags">
                <ElementTag element={def.element} /> <RoleTag role={def.role} />
              </div>
              <div className="scard-power">
                {POWER} {power}
              </div>
              {nextEvo && (
                <div className="evo">
                  <small>Lv.{nextEvo}에 진화 → {(def.stages as string[] | undefined)?.[stage]}</small>
                  <Bar value={sp.level - prevEvo} max={nextEvo - prevEvo} color="#b48cff" h={5} />
                </div>
              )}
              <button className={`lv-btn ${can ? 'can' : ''} ${focusLevel && can ? 'pulse' : ''}`} disabled={!can} onClick={() => one(id)}>
                {can ? (
                  <>
                    <b>▲ 레벨업</b>
                    <span>
                      {GOLD}
                      {cost} → {POWER}+{gain}
                    </span>
                  </>
                ) : sp.level >= BALANCE.growth.maxLevel ? (
                  <b>최대 레벨</b>
                ) : (
                  <>
                    <b>레벨업</b>
                    <span>
                      {GOLD}
                      {cost} 필요 ({cost - state.gold} 부족)
                    </span>
                  </>
                )}
              </button>
              {rc && sp.level >= rc.minLevel && (
                <button
                  className={`rank-btn ${canRankUp(state, id) ? 'can' : ''}`}
                  disabled={!canRankUp(state, id)}
                  onClick={() => {
                    const err = act((s) => rankUp(s, id));
                    toast(err ?? `승급! ★${sp.rank + 1} 능력치 +12%`);
                  }}
                >
                  ★ 승급 {STONE}
                  {rc.stones} {GOLD}
                  {rc.gold} <small>(능력치 +12%)</small>
                </button>
              )}
            </div>
          </div>
        );
      })}
      <p className="explain small">
        {STONE} 성장석은 보물 상자와 <b>정예</b> 칸에서 얻어요. 승급하면 능력치가 크게 올라요.
      </p>
    </div>
  );
}
