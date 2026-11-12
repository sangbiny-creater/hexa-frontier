import { describe, expect, it } from 'vitest';
import { adjacentSlots, elementMultiplier, supports } from '../src/core/board';
import { simulateBattle } from '../src/core/battle';
import { HOUR } from '../src/core/clock';
import { conditionDelta, conditionMultiplier } from '../src/core/condition';
import {
  buildSetup,
  cancelActivity,
  claimActivity,
  claimIdle,
  enterTile,
  fatigueWarning,
  newGame,
  reachableTiles,
  setFormation,
  startActivity,
  tick,
  type GameState,
} from '../src/core/game';
import { grantXp, xpMultiplier } from '../src/core/growth';
import { deserialize, serialize } from '../src/core/save';
import { BALANCE } from '../src/data/balance';
import { TILE_BY_ID, TILES } from '../src/data/map';
import { neighborsOf } from '../src/core/game';
import type { OwnedSpirit } from '../src/core/types';

const T0 = 1_700_000_000_000;

function spirit(defId: string, level: number, rank = 0): OwnedSpirit {
  return { defId, level, xp: 0, rank, condition: 100, injured: false, injuryProgress: 0 };
}

function stateWith(party: OwnedSpirit[], slots: Record<string, number>): GameState {
  const s = newGame(T0);
  s.spirits = Object.fromEntries(party.map((p) => [p.defId, p]));
  s.formation = { ...slots };
  return s;
}

describe('속성 (D14·D15)', () => {
  it('물>불>숲>대지>전기>물 순환', () => {
    expect(elementMultiplier('water', 'fire')).toBe(1.3);
    expect(elementMultiplier('fire', 'forest')).toBe(1.3);
    expect(elementMultiplier('forest', 'earth')).toBe(1.3);
    expect(elementMultiplier('earth', 'electric')).toBe(1.3);
    expect(elementMultiplier('electric', 'water')).toBe(1.3);
    expect(elementMultiplier('fire', 'water')).toBe(0.75);
    expect(elementMultiplier('water', 'forest')).toBe(1);
  });
  it('상생: 물→숲, 불→대지, 숲→전기, 대지→물, 전기→불', () => {
    expect(supports('water', 'forest')).toBe(true);
    expect(supports('fire', 'earth')).toBe(true);
    expect(supports('forest', 'electric')).toBe(true);
    expect(supports('earth', 'water')).toBe(true);
    expect(supports('electric', 'fire')).toBe(true);
    expect(supports('forest', 'water')).toBe(false);
  });
  it('편성판 인접 관계는 대칭', () => {
    for (let a = 0; a < 9; a++) for (const b of adjacentSlots(a)) expect(adjacentSlots(b)).toContain(a);
  });
});

describe('전투 시뮬레이션', () => {
  const s = stateWith([spirit('tideshell', 5), spirit('igni', 5), spirit('sylphy', 5)], { tideshell: 1, igni: 7, sylphy: 6 });
  it('같은 시드 = 같은 결과 (결정론)', () => {
    const a = simulateBattle(buildSetup(s, 'boss_treant', 42, T0));
    const b = simulateBattle(buildSetup(s, 'boss_treant', 42, T0));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
  it('90초 안에 끝나고 스킬을 사용한다 (평타만 치지 않음)', () => {
    const r = simulateBattle(buildSetup(s, 'boss_treant', 7, T0));
    expect(r.duration).toBeLessThanOrEqual(BALANCE.battle.maxTime);
    const kinds = new Set(r.events.map((e) => e.skillKind));
    expect(kinds.has('active')).toBe(true);
    expect(kinds.has('ultimate')).toBe(true);
  });
  it('전열이 살아 있는 동안 후열은 근접 공격을 받지 않는다', () => {
    const r = simulateBattle(buildSetup(s, 'slimes_b', 3, T0));
    const tankKo = r.reports['a:tideshell'].koTime ?? Infinity;
    const meleeOnBack = r.events.filter(
      (e) => e.actor.includes('slime') && e.t < tankKo && e.targets.some((t) => t.uid !== 'a:tideshell' && t.kind === 'dmg'),
    );
    expect(meleeOnBack).toHaveLength(0);
  });
});

describe('온보딩 밸런스 (D28)', () => {
  it('2명 Lv4로는 고목 수호자에게 아깝게 진다 (HP 25% 이하 남김)', () => {
    const s2 = stateWith([spirit('tideshell', 4), spirit('igni', 4)], { tideshell: 1, igni: 7 });
    const r = simulateBattle(buildSetup(s2, 'boss_treant', 99, T0));
    expect(r.outcome).not.toBe('win');
    expect(r.enemyHpRatio).toBeLessThanOrEqual(0.25);
  });
  it('보스 패배 후 멧돼지 굴 → 실피 합류 → 재도전으로 돌파 가능', () => {
    const g = newGame(T0);
    for (const id of ['a1', 'a2', 'a3', 'b1']) enterTile(g, id, T0);
    const den = enterTile(g, 's1', T0);
    expect(den.type === 'battle' && den.outcome.won).toBe(true);
    expect(enterTile(g, 's2', T0).type).toBe('spirit');
    const again = enterTile(g, 'b1', T0);
    expect(again.type === 'battle' && again.outcome.won).toBe(true);
  });
  it('회복 담당이 합류하면 같은 레벨에서도 돌파 가능', () => {
    const s3 = stateWith([spirit('tideshell', 4), spirit('igni', 4), spirit('sylphy', 4)], { tideshell: 1, igni: 7, sylphy: 6 });
    expect(simulateBattle(buildSetup(s3, 'boss_treant', 99, T0)).outcome).toBe('win');
  });
  it('실제 첫 경로(a1→a2→a3→b1)에서 첫 보스는 패배하고 원인 분석이 나온다', () => {
    const g = newGame(T0);
    for (const id of ['a1', 'a2', 'a3']) enterTile(g, id, T0);
    const r = enterTile(g, 'b1', T0);
    expect(r.type).toBe('battle');
    if (r.type !== 'battle') return;
    expect(r.outcome.won).toBe(false);
    expect(r.outcome.analysis?.nearMiss).toBe(true);
    expect(r.outcome.analysis?.reasons.length).toBeGreaterThan(0);
    expect(r.outcome.analysis?.actions.some((a) => a.id === 'farm')).toBe(true);
  });
});

describe('맵 (D9)', () => {
  it('보스 칸을 지나지 않고는 보스 너머로 갈 수 없다', () => {
    const blocked = new Set(['b1', 'b2']);
    const seen = new Set(['start']);
    const q = ['start'];
    while (q.length) {
      const t = TILE_BY_ID[q.shift()!];
      for (const n of neighborsOf(t)) if (!seen.has(n.id) && !blocked.has(n.id)) (seen.add(n.id), q.push(n.id));
    }
    for (const id of ['c1', 'c2', 'b2', 'gate']) expect(seen.has(id)).toBe(false);
  });
  it('맵 크기 25~40칸', () => {
    expect(TILES.length).toBeGreaterThanOrEqual(25);
    expect(TILES.length).toBeLessThanOrEqual(40);
  });
  it('처음엔 인접 칸만 갈 수 있다', () => {
    const g = newGame(T0);
    expect([...reachableTiles(g)].sort()).toEqual(['a1', 'n1', 'w1'].sort());
    expect(enterTile(g, 'b1', T0).type).toBe('error');
  });
});

describe('컨디션 (D20)', () => {
  it('승리: 전투불능만 -10, 그 외 0', () => {
    expect(conditionDelta({ won: true, isBoss: true, minHpRatio: 0.1, ko: false })).toBe(0);
    expect(conditionDelta({ won: true, isBoss: false, minHpRatio: 0, ko: true })).toBe(-10);
  });
  it('패배: 상한 -15', () => {
    expect(conditionDelta({ won: false, isBoss: true, minHpRatio: 0, ko: true })).toBe(-15);
    expect(conditionDelta({ won: false, isBoss: false, minHpRatio: 0.5, ko: false })).toBe(-5);
  });
  it('컨디션 0이어도 출전 가능하고 효율은 80%', () => {
    const s = stateWith([spirit('tideshell', 3)], { tideshell: 1 });
    s.spirits.tideshell.condition = 0;
    s.spirits.tideshell.injured = true;
    s.cleared.push('a1');
    const r = enterTile(s, 'a1', T0);
    expect(r.type).toBe('battle');
    expect(conditionMultiplier(0)).toBe(0.8);
  });
  it('자연 회복 +5/h, 활동 중에는 회복 중단 (D23)', () => {
    const s = stateWith([spirit('tideshell', 3), spirit('igni', 3)], { tideshell: 1 });
    s.unlocked.training = true;
    s.spirits.tideshell.condition = 50;
    s.spirits.igni.condition = 50;
    startActivity(s, 'training', 'igni', T0);
    tick(s, T0 + HOUR / 2);
    expect(Math.round(s.spirits.tideshell.condition)).toBe(53);
    expect(Math.round(s.spirits.igni.condition)).toBe(50);
  });
  it('휴식소 +15/h, 경상은 휴식 2시간에 해제 (D26)', () => {
    const s = stateWith([spirit('tideshell', 3)], { tideshell: 1 });
    s.unlocked.rest = true;
    s.spirits.tideshell.condition = 10;
    s.spirits.tideshell.injured = true;
    startActivity(s, 'rest', 'tideshell', T0);
    tick(s, T0 + 2 * HOUR);
    expect(Math.round(s.spirits.tideshell.condition)).toBe(40);
    expect(s.spirits.tideshell.injured).toBe(false);
  });
});

describe('피로 대응 (D29·D30)', () => {
  it('일반 보스(고목 수호자)에서는 경상이 생기지 않는다', () => {
    for (let i = 0; i < 30; i++) {
      const g = newGame(T0 + i * 1013);
      for (const id of ['a1', 'a2', 'a3']) enterTile(g, id, T0);
      const r = enterTile(g, 'b1', T0);
      if (r.type === 'battle') expect(r.outcome.newInjuries).toEqual([]);
    }
  });
  it('지친 상태로 지면 패배 분석이 휴식을 가장 먼저 추천한다', () => {
    const g = newGame(T0);
    for (const id of ['a1', 'a2', 'a3']) enterTile(g, id, T0);
    for (const sp of Object.values(g.spirits)) sp.condition = 50;
    const r = enterTile(g, 'b1', T0);
    expect(r.type === 'battle' && r.outcome.analysis?.actions[0].id).toBe('rest');
    expect(r.type === 'battle' && r.outcome.analysis?.reasons[0].tag).toBe('fatigue');
  });
  it('컨디션 최상이면 경고 없음, 떨어지면 경고', () => {
    const g = newGame(T0);
    expect(fatigueWarning(g, T0)).toBeNull();
    g.spirits.tideshell.condition = 30;
    expect(fatigueWarning(g, T0)?.worstMul).toBe(0.87);
  });
});

describe('성장 보호 E+F (D25)', () => {
  it('최고 Lv30이면 Lv23까지 ×3, Lv24부터 정상', () => {
    const top = spirit('tideshell', 30);
    expect(xpMultiplier(spirit('igni', 1), [top, spirit('igni', 1)], 'battle')).toBe(3);
    expect(xpMultiplier(spirit('igni', 24), [top, spirit('igni', 24)], 'battle')).toBe(1);
  });
  it('훈련에서 E+F 중첩은 ×3.5에서 멈춘다', () => {
    const top = spirit('tideshell', 30);
    const rookie = spirit('igni', 1);
    expect(xpMultiplier(rookie, [top, rookie], 'training')).toBe(3.5);
  });
  it('레벨 상한을 넘지 않는다', () => {
    const sp = spirit('igni', 29);
    grantXp(sp, 1e9);
    expect(sp.level).toBe(30);
    expect(sp.xp).toBe(0);
  });
});

describe('활동·보상 중복 방지 (기획서 13장 8)', () => {
  function ready() {
    const s = stateWith([spirit('tideshell', 5), spirit('igni', 5)], { tideshell: 1 });
    s.unlocked = { training: true, gathering: true, rest: true };
    s.nodes = ['s3'];
    return s;
  }
  it('수령은 한 번만 된다', () => {
    const s = ready();
    expect(startActivity(s, 'gathering', 'igni', T0, 's3')).toBeNull();
    const id = s.activities[0].id;
    expect(claimActivity(s, id, T0 + HOUR)).toBeNull(); // 아직 미완료
    const first = claimActivity(s, id, T0 + 2 * HOUR);
    const second = claimActivity(s, id, T0 + 3 * HOUR);
    expect(first?.stones).toBe(BALANCE.activity.gatheringReward.stones);
    expect(second).toBeNull();
    expect(s.stones).toBe(BALANCE.activity.gatheringReward.stones);
  });
  it('중단 보상은 경과 시간 비례, 이후 수령 불가', () => {
    const s = ready();
    startActivity(s, 'gathering', 'igni', T0, 's3');
    const id = s.activities[0].id;
    const r = cancelActivity(s, id, T0 + HOUR);
    expect(r?.stones).toBe(Math.floor(BALANCE.activity.gatheringReward.stones / 2));
    expect(claimActivity(s, id, T0 + 5 * HOUR)).toBeNull();
    expect(cancelActivity(s, id, T0 + 5 * HOUR)).toBeNull();
  });
  it('활동 중인 스피릿은 전투에 나가지 않는다', () => {
    const s = ready();
    setFormation(s, 'igni', 7);
    startActivity(s, 'training', 'igni', T0);
    const setup = buildSetup(s, 'slimes_a', 1, T0 + 10);
    expect(setup.allies.map((a) => a.uid)).toEqual(['a:tideshell']);
  });
  it('슬롯 수 제한', () => {
    const s = ready();
    s.spirits.sylphy = spirit('sylphy', 5);
    startActivity(s, 'training', 'igni', T0);
    startActivity(s, 'training', 'sylphy', T0);
    expect(startActivity(s, 'training', 'tideshell', T0)).toBe('빈 슬롯이 없습니다.');
  });
  it('시계를 되돌려도 회복/방치 보상이 생기지 않는다', () => {
    const s = ready();
    s.spirits.tideshell.condition = 50;
    tick(s, T0 + HOUR);
    const c = s.spirits.tideshell.condition;
    tick(s, T0 - 10 * HOUR);
    tick(s, T0 + HOUR);
    expect(s.spirits.tideshell.condition).toBe(c);
    claimIdle(s, T0 + 3 * HOUR);
    const gold = s.gold;
    expect(claimIdle(s, T0 + HOUR).gold).toBe(0);
    expect(claimIdle(s, T0 + 3 * HOUR).gold).toBe(0);
    expect(s.gold).toBe(gold);
  });
  it('방치 보상은 최대 12시간치 (D21)', () => {
    const s = ready();
    const r = claimIdle(s, T0 + 100 * HOUR);
    expect(r.hours).toBe(12);
    expect(r.gold).toBe(12 * BALANCE.idle.goldPerHour);
  });
});

describe('저장', () => {
  it('직렬화 왕복', () => {
    const g = newGame(T0);
    enterTile(g, 'a1', T0);
    expect(deserialize(serialize(g))).toEqual(g);
  });
  it('미래 버전/깨진 데이터는 거부', () => {
    expect(deserialize('{"version":999}')).toBeNull();
    expect(deserialize('not json')).toBeNull();
  });
});
