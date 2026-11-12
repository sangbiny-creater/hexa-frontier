// 패배 원인 분석 (기획서 2장 필수 UX).
// 같은 시드로 조건을 하나씩 바꾼 '반사실' 전투를 돌려, 무엇이 승패를 갈랐는지 찾는다.
import { BALANCE } from '../data/balance';
import { SPIRITS } from '../data/spirits';
import { elementMultiplier, ELEMENT_LABEL } from './board';
import { simulateBattle, type BattleResult, type BattleSetup, type BattleUnitInput } from './battle';
import type { GameState } from './game';
import { canRankUp, isBusy } from './game';

export type ReasonTag = 'attack' | 'survival' | 'fatigue' | 'element' | 'healing' | 'timeout';
export type ActionId = 'farm' | 'rankup' | 'train' | 'gather' | 'rest' | 'formation' | 'explore';

export interface DefeatAnalysis {
  nearMiss: boolean;
  enemyHpPct: number;
  facts: string[];
  reasons: { tag: ReasonTag; label: string; detail: string }[];
  actions: { id: ActionId; label: string; why: string }[];
  variants: { key: string; label: string; won: boolean; enemyHpPct: number }[];
}

const REASON_LABEL: Record<ReasonTag, string> = {
  attack: '공격 부족',
  survival: '생존 부족',
  fatigue: '피로',
  element: '상성 불리',
  healing: '회복 부족',
  timeout: '시간 초과',
};

function variant(setup: BattleSetup, f: (u: BattleUnitInput) => BattleUnitInput): BattleResult {
  return simulateBattle({ ...setup, allies: setup.allies.map(f) });
}

export function analyzeDefeat(s: GameState, setup: BattleSetup, result: BattleResult, now: number): DefeatAnalysis {
  const pct = (r: BattleResult) => Math.round(r.enemyHpRatio * 100);
  const variants = [
    { key: 'atk', label: '공격 +15%', r: variant(setup, (u) => ({ ...u, mods: { atk: 1.15 } })) },
    { key: 'surv', label: 'HP·방어 +15%', r: variant(setup, (u) => ({ ...u, mods: { hp: 1.15, def: 1.15 } })) },
    { key: 'cond', label: '컨디션 최상', r: variant(setup, (u) => ({ ...u, condition: 100, injured: false })) },
    { key: 'lv', label: '레벨 +2', r: variant(setup, (u) => ({ ...u, level: u.level + 2 })) },
  ];
  const base = result.enemyHpRatio;
  const gain = (k: string) => {
    const v = variants.find((x) => x.key === k)!.r;
    return (v.outcome === 'win' ? 1 : 0) + (base - v.enemyHpRatio);
  };

  const reasons: DefeatAnalysis['reasons'] = [];
  const add = (tag: ReasonTag, detail: string) => reasons.push({ tag, label: REASON_LABEL[tag], detail });

  if (result.outcome === 'timeout') add('timeout', `${BALANCE.battle.maxTime}초 안에 쓰러뜨리지 못했습니다. 화력이 더 필요합니다.`);
  const fatigued = setup.allies.filter((u) => (u.condition ?? 100) < 80 || u.injured);
  // 이번 패배로 더 떨어진 '지금' 컨디션 (다음 도전에 영향)
  const tired = Object.keys(s.formation)
    .map((id) => s.spirits[id])
    .filter((sp) => sp && (sp.condition < BALANCE.condition.tiers[0].min || sp.injured));
  const fatigueMatters = (fatigued.length > 0 && gain('cond') > 0.05) || tired.some((sp) => sp.condition < 60 || sp.injured);
  if (fatigueMatters) {
    const names = tired.map((sp) => `${SPIRITS[sp.defId].name}(${Math.floor(sp.condition)}${sp.injured ? '·경상' : ''})`).join(', ');
    add('fatigue', `지친 스피릿: ${names}. 이대로 다시 도전하면 공격·방어가 더 낮은 상태로 싸웁니다. 먼저 쉬게 하세요.`);
  }
  if (gain('atk') >= gain('surv')) {
    if (result.outcome !== 'timeout') add('attack', '적을 쓰러뜨리기 전에 아군이 버티지 못했습니다. 공격력을 올리면 효과가 가장 큽니다.');
  } else {
    add('survival', '아군이 너무 빨리 쓰러졌습니다. HP·방어를 올리거나 회복 담당을 넣으면 효과가 큽니다.');
  }
  const hasHealer = setup.allies.some((u) => u.def.role === 'healer');
  const anyKo = Object.values(result.reports).some((r) => r.uid.startsWith('a:') && r.koTime !== null);
  if (!hasHealer && anyKo) add('healing', '회복 담당 스피릿이 없습니다.');
  const boss = setup.enemies.find((e) => e.isBoss) ?? setup.enemies[0];
  const avgElem = setup.allies.reduce((a, u) => a + elementMultiplier(u.def.element, boss.def.element), 0) / setup.allies.length;
  if (avgElem < 1) add('element', `${boss.def.name}(${ELEMENT_LABEL[boss.def.element]})에게 상성이 불리한 스피릿이 많습니다.`);

  // 사실 정보
  const facts: string[] = [];
  facts.push(`${boss.def.name}의 남은 HP: ${Math.round((result.bossHpRatio ?? result.enemyHpRatio) * 100)}%`);
  const firstKo = setup.allies
    .map((u) => ({ u, r: result.reports[u.uid] }))
    .filter((x) => x.r.koTime !== null)
    .sort((a, b) => a.r.koTime! - b.r.koTime!)[0];
  if (firstKo) facts.push(`${firstKo.u.def.name}이(가) ${firstKo.r.koTime!.toFixed(0)}초에 가장 먼저 쓰러졌습니다.`);
  const winVariants = variants.filter((v) => v.r.outcome === 'win').map((v) => v.label);
  if (winVariants.length) facts.push(`모의 전투: ${winVariants.join(', ')}이면 이겼습니다.`);

  // 행동 경로
  const actions: DefeatAnalysis['actions'] = [];
  const ownedIds = Object.keys(s.spirits);
  if (ownedIds.some((id) => canRankUp(s, id))) actions.push({ id: 'rankup', label: '지금 승급', why: '승급 재료가 모였습니다. 능력치 +12%.' });
  actions.push({ id: 'farm', label: '지금 파밍', why: '탐험한 전투 칸을 반복해 경험치·성장석을 모읍니다.' });
  if (s.unlocked.training) actions.push({ id: 'train', label: '1시간 훈련', why: '자리를 비운 동안 경험치를 얻습니다.' });
  if (s.unlocked.gathering && s.nodes.length) actions.push({ id: 'gather', label: '2시간 채집', why: '성장석·골드를 모아 승급합니다.' });
  if (fatigueMatters) {
    const worst = Math.min(...tired.map((sp) => sp.condition));
    const need = Math.max(0, BALANCE.condition.tiers[0].min - worst);
    const hours = s.unlocked.rest ? need / BALANCE.condition.restPerHour : need / BALANCE.condition.naturalPerHour;
    const where = s.unlocked.rest ? '휴식처에서' : '자연 회복으로';
    // 피로가 원인이면 휴식을 가장 먼저 추천 (D: 피로 하향 나선 방지)
    actions.unshift({ id: 'rest', label: '휴식 (추천)', why: `${where} 약 ${Math.ceil(hours * 10) / 10}시간이면 컨디션 '최상'으로 돌아옵니다.` });
    facts.push(`지금 컨디션: ${tired.map((sp) => `${SPIRITS[sp.defId].name} ${Math.floor(sp.condition)}`).join(', ')}`);
  }
  const benched = ownedIds.filter((id) => s.formation[id] === undefined && !isBusy(s, id, now));
  if (benched.length || avgElem < 1) {
    actions.push({
      id: 'formation',
      label: '편성 변경',
      why: benched.length ? `${benched.map((id) => SPIRITS[id].name).join(', ')}이(가) 쉬고 있습니다.` : '상성이 유리한 배치를 찾아보세요.',
    });
  }
  if (!hasHealer && !s.spirits.sylphy) actions.push({ id: 'explore', label: '동료 찾기', why: '아직 가 보지 않은 칸에 새 동료가 있을지도 모릅니다.' });

  reasons.sort((a, b) => (a.tag === 'fatigue' ? -1 : 0) - (b.tag === 'fatigue' ? -1 : 0));
  return {
    nearMiss: result.enemyHpRatio <= 0.2,
    enemyHpPct: pct(result),
    facts,
    reasons,
    actions,
    variants: variants.map((v) => ({ key: v.key, label: v.label, won: v.r.outcome === 'win', enemyHpPct: pct(v.r) })),
  };
}
