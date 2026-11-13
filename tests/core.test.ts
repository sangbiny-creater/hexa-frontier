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
  evolve,
  respawnMs,
  fatigueWarning,
  levelUp,
  newGame,
  summon,
  reachableTiles,
  setFormation,
  startActivity,
  tick,
  travel,
  type GameState,
} from '../src/core/game';
import { grantXp, levelUpCost, xpMultiplier } from '../src/core/growth';
import { effectivePower, recommendedPower, teamPower } from '../src/core/power';
import { deserialize, serialize } from '../src/core/save';
import { BALANCE } from '../src/data/balance';
import { MAPS, TILE_BY_ID, TILES } from '../src/data/map';
import { neighborsOf } from '../src/core/game';
import type { OwnedSpirit } from '../src/core/types';

const T0 = 1_700_000_000_000;

function spirit(defId: string, level: number, rank = 0): OwnedSpirit {
  return { defId, level, xp: 0, rank, stage: 1, copies: 0, condition: 100, injured: false, injuryProgress: 0 };
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
      (e) => e.actor.includes('boar') && e.t < tankKo && e.targets.some((t) => t.uid !== 'a:tideshell' && t.kind === 'dmg'),
    );
    expect(meleeOnBack).toHaveLength(0);
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
    for (const id of ['c1', 'c2', 'c4', 'gate']) expect(seen.has(id)).toBe(false);
  });
  it('P00은 튜토리얼 전용으로 작고, P01은 10배 크기에 스테이지 100개 (D57)', () => {
    const p00 = MAPS.P00.tiles.length;
    expect(p00).toBeLessThanOrEqual(20);
    expect(MAPS.P01.tiles.length).toBeGreaterThanOrEqual(p00 * 10);
    const stages = MAPS.P01.tiles.filter((t) => t.stage).map((t) => t.stage!).sort((a, b) => a - b);
    expect(stages).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
    expect(TILES.length).toBe(new Set(TILES.map((t) => t.id)).size);
  });
  it('P01: 보스(025·050·075·100)를 지나지 않고는 그 너머로 갈 수 없다', () => {
    const t = (n: number) => MAPS.P01.tiles.find((x) => x.stage === n)!;
    for (const n of [25, 50, 75, 100]) {
      expect(t(n).kind).toBe('boss');
      const seen = new Set(['p01-start']);
      const q = ['p01-start'];
      while (q.length) {
        const cur = TILE_BY_ID[q.shift()!];
        for (const nb of neighborsOf(cur)) if (!seen.has(nb.id) && nb.id !== t(n).id) (seen.add(nb.id), q.push(nb.id));
      }
      expect(seen.has(t(n + 1)?.id ?? 'p01-gate')).toBe(false);
      for (const x of MAPS.P01.tiles) if (x.stage && x.stage < n) expect(seen.has(x.id)).toBe(true);
    }
  });
  it('P01 첫 칸은 P01-001 하나뿐이고, P01은 튜토리얼(바위엄니 대장)을 끝내야 열린다', () => {
    const g = newGame(T0);
    expect(travel(g, 'P01')).toMatch('튜토리얼');
    g.cleared.push('b2');
    expect(travel(g, 'P01')).toBeNull();
    expect([...reachableTiles(g)]).toEqual(['p01-001']);
    travel(g, 'P00');
    expect(reachableTiles(g).has('p01-001')).toBe(false);
  });
  it('처음엔 인접 칸만 갈 수 있다', () => {
    const g = newGame(T0);
    expect([...reachableTiles(g)]).toEqual(['a1']);
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
  it('컨디션 효과가 꺼져 있으면(D32) 피로 경고가 없다', () => {
    const g = newGame(T0);
    g.spirits.tideshell.condition = 30;
    expect(fatigueWarning(g, T0)).toBeNull();
  });
});

describe('골드 레벨업·전투력 (D32)', () => {
  it('레벨업은 골드를 쓰고 전투력을 올린다', () => {
    const g = newGame(T0);
    const before = teamPower(g);
    expect(levelUp(g, 'tideshell')).toMatch('골드가 부족');
    g.gold = 1000;
    expect(levelUp(g, 'tideshell')).toBeNull();
    expect(g.spirits.tideshell.level).toBe(2);
    expect(g.gold).toBe(1000 - levelUpCost(1));
    expect(teamPower(g)).toBeGreaterThan(before);
  });
  it('소환한 동료는 최고 레벨의 80%로 합류', () => {
    const g = newGame(T0);
    g.spirits.tideshell.level = 10;
    g.cleared.push('a8');
    g.summonStones = 10;
    summon(g, 'fire');
    expect(g.spirits.igni.level).toBe(8);
  });
  it('상성 보정 전투력이 권장보다 20% 이상 높으면 실제로 거의 이긴다', () => {
    const g = newGame(T0);
    g.spirits = { tideshell: spirit('tideshell', 1), igni: spirit('igni', 1), sylphy: spirit('sylphy', 1) };
    g.formation = { tideshell: 1, igni: 7, sylphy: 6 };
    for (const enc of ['slimes_b', 'boss_treant', 'p01_010', 'p01_025']) {
      const rec = recommendedPower(enc);
      while (effectivePower(g, enc) < rec * 1.2) for (const sp of Object.values(g.spirits)) sp.level++;
      let wins = 0;
      for (let i = 0; i < 10; i++) if (simulateBattle(buildSetup(g, enc, 500 + i, T0)).outcome === 'win') wins++;
      expect(wins).toBeGreaterThanOrEqual(8);
    }
  });
  it('패배 화면의 버튼은 바로 실행할 수 있는 행동이다', () => {
    const g = newGame(T0);
    g.cleared.push('a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8');
    const r = enterTile(g, 'b1', T0);
    if (r.type !== 'battle') throw new Error();
    const acts = r.outcome.analysis!.actions;
    expect(acts.length).toBeGreaterThan(0);
    for (const a of acts) expect(['levelup', 'farm', 'recruit', 'rankup', 'formation', 'summon', 'idle', 'evolve', 'explore']).toContain(a.id);
    expect(r.outcome.analysis!.teamPower).toBeLessThan(r.outcome.analysis!.recommended);
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
    s.nodes = ['p01-r1'];
    return s;
  }
  it('수령은 한 번만 된다', () => {
    const s = ready();
    expect(startActivity(s, 'gathering', 'igni', T0, 'p01-r1')).toBeNull();
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
    startActivity(s, 'gathering', 'igni', T0, 'p01-r1');
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

describe('리스폰 (D59)', () => {
  it('이긴 칸은 바로 다시 싸울 수 없고, 시간이 지나면 다시 열린다', () => {
    const g = newGame(T0);
    expect(enterTile(g, 'a1', T0).type).toBe('battle');
    const again = enterTile(g, 'a1', T0 + 20_000);
    expect(again.type === 'error' && again.message).toMatch('다시 나타나기까지');
    // 튜토리얼(P00) 일반 칸은 1분, 본편은 10분 (D63)
    expect(respawnMs(TILE_BY_ID.a1)).toBe(BALANCE.respawn.tutorialBattleMin * 60_000);
    expect(respawnMs(TILE_BY_ID['p01-001'])).toBe(BALANCE.respawn.battleMin * 60_000);
    expect(enterTile(g, 'a1', T0 + BALANCE.respawn.tutorialBattleMin * 60_000).type).toBe('battle');
  });
  it('중간 보스 이상은 리스폰이 길다', () => {
    expect(respawnMs(TILE_BY_ID['p01-025'])).toBe(BALANCE.respawn.bossMin * 60_000);
    expect(respawnMs(TILE_BY_ID['p01-100'])).toBe(BALANCE.respawn.regionBossMin * 60_000);
    expect(respawnMs(TILE_BY_ID['p01-010'])).toBe(BALANCE.respawn.eliteMin * 60_000);
    expect(BALANCE.respawn.bossMin).toBeGreaterThanOrEqual(BALANCE.respawn.battleMin * 10);
  });
  it('진 칸은 리스폰 없이 바로 재도전할 수 있다', () => {
    const g = newGame(T0);
    g.cleared.push('a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8');
    const r = enterTile(g, 'b1', T0);
    expect(r.type === 'battle' && r.outcome.won).toBe(false);
    expect(enterTile(g, 'b1', T0 + 1000).type).toBe('battle');
  });
});

describe('진화 = 같은 스피릿 중복 소환 (D60)', () => {
  it('단계 최대 레벨에서 멈추고, 중복 소환 재료로 진화하면 더 오른다', () => {
    const g = newGame(T0);
    g.gold = 1e7;
    const sp = g.spirits.tideshell;
    sp.level = BALANCE.evolution.levelCap[0];
    expect(levelUp(g, 'tideshell')).toMatch('진화');
    expect(evolve(g, 'tideshell')).toMatch('같은 스피릿');
    g.cleared.push('a8');
    g.summonStones = 100;
    const r = summon(g, 'water');
    expect('duplicate' in r && r.duplicate).toBe(true);
    expect(sp.copies).toBe(1);
    const before = teamPower(g);
    expect(evolve(g, 'tideshell')).toBeNull();
    expect(sp.stage).toBe(2);
    expect(sp.copies).toBe(0);
    expect(teamPower(g)).toBeGreaterThan(before);
    expect(levelUp(g, 'tideshell')).toBeNull();
  });
  it('전체 랜덤 소환은 더 싸고, 5속성 스피릿 중 하나가 나온다', () => {
    const g = newGame(T0);
    g.cleared.push('a8');
    g.summonStones = 1000;
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const r = summon(g, 'any');
      if ('spiritId' in r) seen.add(r.spiritId);
    }
    expect(seen.size).toBe(5);
    expect(g.summonStones).toBe(1000 - 60 * BALANCE.summon.randomCost);
    expect(BALANCE.summon.randomCost).toBeLessThan(BALANCE.summon.cost);
  });
});

describe('저장', () => {
  it('v6 저장은 옮겨진다 (튜토리얼을 끝낸 저장: 사라진 칸 정리, 레벨에 맞는 진화 단계)', () => {
    const g: any = newGame(T0);
    g.version = 6;
    g.cleared.push('c4', 'zz9', 'c12');
    delete g.map;
    delete g.respawnAt;
    delete g.settings;
    for (const sp of Object.values(g.spirits) as any[]) (delete sp.stage, delete sp.copies);
    g.spirits.tideshell.level = 14;
    const m = deserialize(JSON.stringify(g))!;
    expect(m.version).toBe(8);
    expect(m.cleared).not.toContain('zz9');
    expect(m.cleared).toContain('b2'); // 새 튜토리얼은 끝낸 것으로 친다 (D63)
    expect(m.tutorial.done).toBe(true);
    expect(m.map).toBe('P00');
    expect(m.spirits.tideshell.stage).toBe(2);
    expect(m.spirits.sylphy.stage).toBe(1);
  });
  it('튜토리얼 도중의 v7 저장은 새 튜토리얼로 다시 시작한다 (D63)', () => {
    const g: any = newGame(T0);
    g.version = 7;
    g.cleared.push('a1', 'a2');
    expect(deserialize(JSON.stringify(g))).toBeNull();
  });
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

describe('실시간 전투 (D69: 필살기 직접 누르기)', () => {
  it('AUTO가 꺼져 있으면 아군 필살기는 저절로 나가지 않고, castUlt로 쓴다', async () => {
    const { createLive, stepLive, castUlt, ultReady } = await import('../src/core/battle');
    const { buildSetup, newGame: ng } = await import('../src/core/game');
    const g = ng(T0);
    for (const sp of Object.values(g.spirits)) sp.level = 10;
    const b = createLive(buildSetup(g, 'boss_treant', 5, T0), false);
    let readySeen = false;
    for (let i = 0; i < 900 && !b.outcome; i++) {
      stepLive(b);
      const allyUlts = b.events.filter((e) => e.actor.startsWith('a:') && e.skillKind === 'ultimate');
      expect(allyUlts).toHaveLength(readySeen ? allyUlts.length : 0);
      const ready = b.units.find((u) => u.snap.side === 'ally' && ultReady(b, u.snap.uid));
      if (ready && !readySeen) {
        readySeen = true;
        const ev = castUlt(b, ready.snap.uid);
        expect(ev?.skillKind).toBe('ultimate');
        expect(ultReady(b, ready.snap.uid)).toBe(false); // 게이지가 비워짐
      }
    }
    expect(readySeen).toBe(true);
  });
  it('AUTO 실시간 전투 = 바로 결과 보기(simulateBattle)와 같은 결과', async () => {
    const { createLive, stepLive, finishLive, simulateBattle } = await import('../src/core/battle');
    const { buildSetup, newGame: ng } = await import('../src/core/game');
    const g = ng(T0);
    const setup = buildSetup(g, 'slimes_b', 9, T0);
    const b = createLive(setup, true);
    while (!b.outcome) stepLive(b);
    expect(JSON.stringify(finishLive(b))).toBe(JSON.stringify(simulateBattle(setup)));
  });
});
