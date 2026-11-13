// 패배 원인 분석 (기획서 2장 필수 UX).
// 같은 시드로 조건을 하나씩 바꾼 '반사실' 전투를 돌려, 무엇이 승패를 갈랐는지 찾는다.
import { BALANCE } from '../data/balance';
import { SPIRITS } from '../data/spirits';
import { elementMultiplier, ELEMENT_LABEL } from './board';
import { simulateBattle, type BattleResult, type BattleSetup, type BattleUnitInput } from './battle';
import type { GameState } from './game';
import { affordableLevelUps, bestFarmTile, canEvolve, canRankUp, idlePreview, idleUnlocked, isBusy, objectiveTile, reachableSpiritTile, respawnLeft, SUMMON_POOL, summonUnlocked } from './game';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import type { Element } from './types';
import { armorMatchup, effectivePower, recommendedPower, suggestTeam } from './power';
import { TILE_BY_ID } from '../data/map';

export type ReasonTag = 'attack' | 'survival' | 'fatigue' | 'element' | 'armor' | 'healing' | 'timeout';
export type ActionId = 'farm' | 'rankup' | 'levelup' | 'recruit' | 'formation' | 'summon' | 'idle' | 'evolve' | 'train' | 'gather' | 'rest' | 'explore';

export interface DefeatAnalysis {
  nearMiss: boolean;
  enemyHpPct: number;
  facts: string[];
  reasons: { tag: ReasonTag; label: string; detail: string }[];
  actions: { id: ActionId; label: string; why: string; tileId?: string }[];
  teamPower: number;
  recommended: number;
  variants: { key: string; label: string; won: boolean; enemyHpPct: number }[];
}

const REASON_LABEL: Record<ReasonTag, string> = {
  attack: '공격 부족',
  survival: '생존 부족',
  fatigue: '피로',
  element: '상성 불리',
  armor: '공격이 막힘',
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
  const encId = encounterIdOf(setup);
  const blocked = setup.allies.filter((u) => armorMatchup(u.def.id, encId) === 'bad');
  if (blocked.length) {
    const magic = blocked[0].def.dmg === 'magic';
    add('armor', `${blocked.map((u) => u.def.name).join(', ')}의 ${magic ? '✨마법' : '⚔️물리'} 공격이 막혔어요. 이 적은 ${magic ? '마법 방어' : '물리 방어'}가 높아요. ${magic ? '⚔️물리' : '✨마법'} 공격 동료를 쓰세요.`);
  }

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

  // 행동 경로: 누르면 바로 실행되는 것만 (D32)
  const actions: DefeatAnalysis['actions'] = [];
  // 상성 좋은 스피릿을 소환할 수 있으면 가장 먼저 (D47)
  if (summonUnlocked(s) && s.summonStones >= BALANCE.summon.cost) {
    const counter = (Object.entries(SUMMON_POOL) as [Element, string[]][]).find(
      ([el, ids]) => ids.some((id) => !s.spirits[id]) && elementMultiplier(el, boss.def.element) > 1,
    );
    if (counter) {
      const [el, ids] = counter;
      const id = ids.find((x) => !s.spirits[x])!;
      actions.push({ id: 'summon', label: `${ELEMENT_LABEL[el]} 속성 스피릿 소환하기`, why: `${boss.def.name}은(는) ${ELEMENT_LABEL[boss.def.element]} 속성! ${ELEMENT_LABEL[el]} 속성 ${SPIRITS[id].stages?.[0]}이(가) 강해요.` });
    } else if (blocked.length) {
      const good = (Object.entries(SUMMON_POOL) as [Element, string[]][]).flatMap(([, ids]) => ids).find((id) => !s.spirits[id] && armorMatchup(id, encId) === 'good');
      if (good) actions.push({ id: 'summon', label: `${SPIRITS[good].dmg === 'magic' ? '✨마법' : '⚔️물리'} 공격 스피릿 소환하기`, why: `${SPIRITS[good].stages?.[0]}(${ELEMENT_LABEL[SPIRITS[good].element]})는 ${SPIRITS[good].dmg === 'magic' ? '마법' : '물리'} 공격이라 이 적에게 잘 들어요.` });
    }
  }
  const ownedIds = Object.keys(s.spirits);
  const recruit = reachableSpiritTile(s);
  const objective = objectiveTile(s);
  if (recruit) actions.push({ id: 'recruit', label: '동료 데리러 가기', why: `"${TILE_BY_ID[recruit].name}"에 새 동료가 있어요. 동료가 늘면 전투력이 크게 오릅니다.`, tileId: recruit });
  else if (objective && TILE_BY_ID[objective].kind !== 'boss' && Object.keys(s.spirits).length < 3) {
    actions.push({ id: 'recruit', label: '동료 찾으러 가기', why: `"${TILE_BY_ID[objective].name}" 너머에 새 동료가 있어요. 바로 출발합니다.`, tileId: objective });
  }
  const ups = affordableLevelUps(s);
  if (ups > 0) actions.push({ id: 'levelup', label: `레벨업 하기 (${ups}번 가능)`, why: `지금 가진 골드로 레벨업을 ${ups}번 할 수 있어요.` });
  if (ownedIds.some((id) => canEvolve(s, id))) actions.push({ id: 'evolve', label: '진화 하기', why: '진화 조건(최대 레벨 + 같은 스피릿)이 모였어요. 진화하면 능력치가 오르고 최대 레벨이 늘어나요.' });
  if (ownedIds.some((id) => canRankUp(s, id))) actions.push({ id: 'rankup', label: '승급 하기', why: '성장석이 모였어요. 승급하면 능력치 +12%.' });
  const farm = bestFarmTile(s, now);
  if (farm) {
    const fenc = ENCOUNTERS[TILE_BY_ID[farm].encounterId!];
    const gain = fenc.enemies.reduce((a, e) => a + Math.round(ENEMIES[e.enemyId].gold * (1 + BALANCE.enemy.goldPerLevel * (e.level - 1))), 0);
    actions.push({ id: 'farm', label: `골드 벌러 가기 (${TILE_BY_ID[farm].name})`, why: `이미 이긴 칸에서 다시 싸워 골드 약 ${gain}을 벌어요. 이긴 칸은 ⏳쿨타임이 지나면 몬스터가 다시 나타나요. 번 골드로 레벨업!`, tileId: farm });
  } else {
    const waits = s.cleared
      .map((id) => TILE_BY_ID[id])
      .filter((t) => t && t.map === s.map && t.kind === 'battle')
      .map((t) => respawnLeft(s, t.id, now))
      .filter((x) => x > 0);
    if (waits.length) actions.push({ id: 'explore', label: `골드 벌기: ${Math.ceil(Math.min(...waits) / 60_000)}분 뒤 가능`, why: '이긴 칸이 모두 ⏳쿨타임 중이에요. 몬스터가 다시 나타나면 또 싸워서 골드를 벌 수 있어요.' });
  }
  if (idleUnlocked(s) && idlePreview(s, now).gold > 0) actions.push({ id: 'idle', label: `자동 사냥 보상 받기 (${idlePreview(s, now).gold})`, why: '🏕캠프에 쌓인 골드를 받아 레벨업에 써요.' });
  const benched = ownedIds.filter((id) => s.formation[id] === undefined && !isBusy(s, id, now));
  const full = Object.keys(s.formation).length >= s.maxDeploy;
  if (benched.length && !full) actions.push({ id: 'formation', label: '편성에 넣기', why: `출전 자리가 ${s.maxDeploy - Object.keys(s.formation).length}칸 비어 있어요. ${benched.map((id) => SPIRITS[id].name).join(', ')}을(를) 넣으세요.` });
  else if (benched.length && full) {
    // 출전이 꽉 찼으면 '추가'가 아니라 '교체'를 제안 (폭풍 둥지 버그 수정)
    const best = suggestTeam(ownedIds, encId, s.maxDeploy);
    const swapIn = best.filter((id) => s.formation[id] === undefined);
    if (swapIn.length) actions.push({ id: 'formation', label: '출전 동료 바꾸기', why: `출전은 ${s.maxDeploy}명까지. ${swapIn.map((id) => SPIRITS[id].name).join(', ')}을(를) 넣고 상성이 나쁜 동료를 빼면 더 강해요.` });
  }

  reasons.sort((a, b) => (a.tag === 'fatigue' ? -1 : 0) - (b.tag === 'fatigue' ? -1 : 0));
  return {
    teamPower: effectivePower(s, encounterIdOf(setup), setup.allies.map((u) => u.uid.slice(2))),
    recommended: recommendedPower(encounterIdOf(setup)),
    nearMiss: result.enemyHpRatio <= 0.25,
    enemyHpPct: pct(result),
    facts,
    reasons,
    actions,
    variants: variants.map((v) => ({ key: v.key, label: v.label, won: v.r.outcome === 'win', enemyHpPct: pct(v.r) })),
  };
}

function encounterIdOf(setup: BattleSetup): string {
  return setup.encounterId ?? '';
}
