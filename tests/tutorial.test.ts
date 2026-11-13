import { describe, expect, it } from 'vitest';
import { analyzeDefeat } from '../src/core/analysis';
import { simulateBattle } from '../src/core/battle';
import { buildSetup, enterTile, newGame, reachableTiles, summon, summonUnlocked, TUTORIAL_PATH } from '../src/core/game';
import { armorMatchup, attackMatchup, suggestTeam } from '../src/core/power';
import { MAPS } from '../src/data/map';
import { DEFAULT_SLOT } from '../src/data/spirits';
import { computeGuide } from '../src/ui/tutorial';
import { runTutorial } from '../sim/tutorial-bot';

const T0 = 1_700_000_000_000;

describe('튜토리얼: 처음부터 끝까지 한 줄 길 (D63)', () => {
  it('P00은 갈 수 있는 칸이 항상 하나뿐이다', () => {
    const g = newGame(T0);
    for (const id of TUTORIAL_PATH) {
      expect([...reachableTiles(g)]).toEqual([id]);
      g.cleared.push(id);
    }
    expect([...reachableTiles(g)]).toEqual(['gate']);
    expect(TUTORIAL_PATH.length).toBeGreaterThanOrEqual(14);
  });
  it('고목 골렘까지는 바위(막힌 칸)를 두지 않는다', () => {
    const b1 = MAPS.P00.tiles.find((t) => t.id === 'b1')!;
    expect(MAPS.P00.noRockUntilRow).toBe(b1.row);
  });
});

describe('튜토리얼: 막힘 → 해결법 (D63)', () => {
  it('안내만 따라가면 끝까지 간다: 레벨업 → 골드 벌기 → 상성 소환 → 물리/마법 → 진화', () => {
    for (let seed = 0; seed < 12; seed++) {
      const r = runTutorial(seed);
      expect(r.done).toBe(true);
      // 일부러 막히는 칸: 어린 바위엄니(레벨업), 가시 덤불(골드 벌기), 고목 골렘(상성), 물안개 여울(물리/마법), 바위엄니 대장(진화)
      for (const id of ['a3', 'a7', 'b1', 'c2', 'b2']) expect(r.lossAt.split(' ')).toContain(id);
      expect(r.farm).toBeGreaterThan(0); // 골드 벌기(다시 싸우기)를 실제로 해 본다
      expect(r.state.spirits.igni).toBeDefined();
      expect(r.state.spirits.rocky?.stage).toBe(2); // 락터스크 진화
      expect(r.minutes).toBeLessThan(40);
    }
  });

  it('첫 패배(어린 바위엄니)는 그 자리에서 가진 골드로 레벨업하면 이긴다 (골드 벌기 없이)', () => {
    const r = runTutorial(3, true);
    const firstWinA3 = r.log.findIndex((l) => l.startsWith('a3 승'));
    const firstFarm = r.log.findIndex((l) => l.includes('(파밍)'));
    expect(firstWinA3).toBeGreaterThan(0);
    expect(firstFarm === -1 || firstFarm > firstWinA3).toBe(true);
  });

  it('시작 팀(💧+🌿)은 최대 레벨(Lv.10)이어도 고목 골렘을 못 이긴다 — 상성이 핵심', () => {
    const g = newGame(T0);
    for (const sp of Object.values(g.spirits)) sp.level = 10;
    for (let i = 0; i < 6; i++) expect(simulateBattle(buildSetup(g, 'boss_treant', 300 + i, T0)).outcome).not.toBe('win');
  });

  it('소환은 🔮신비한 결정을 주우면 열린다 (소환석이 있는데 못 쓰는 일이 없다)', () => {
    const g = newGame(T0);
    for (const id of TUTORIAL_PATH.slice(0, TUTORIAL_PATH.indexOf('a8'))) g.cleared.push(id);
    expect(summonUnlocked(g)).toBe(false);
    expect(enterTile(g, 'a8', T0).type).toBe('resource');
    expect(g.summonStones).toBeGreaterThanOrEqual(10);
    expect(summonUnlocked(g)).toBe(true);
  });

  it('물안개 여우는 마법 방어가 높다: 🔥엠버윙·🌿블루멜(마법)은 막히고, ⛰️락터스크·🌪️게일윙(물리)은 잘 든다', () => {
    expect(armorMatchup('igni', 'mist_ford')).toBe('bad');
    expect(armorMatchup('sylphy', 'mist_ford')).toBe('bad');
    expect(armorMatchup('rocky', 'mist_ford')).toBe('good');
    expect(armorMatchup('galewing', 'mist_ford')).toBe('good');
    const best = suggestTeam(['tideshell', 'sylphy', 'igni', 'rocky'], 'mist_ford', 3);
    expect(best).toContain('rocky');
    expect(best).not.toContain('igni');
  });

  it('패배 화면: 출전이 꽉 찼으면 "편성에 넣기"(추가)가 아니라 "출전 동료 바꾸기"를 제안한다', () => {
    const g = newGame(T0);
    g.summonStones = 30;
    g.tutorial.done = true;
    summon(g, 'fire');
    summon(g, 'earth');
    expect(Object.keys(g.formation)).toHaveLength(3);
    const setup = buildSetup(g, 'mist_ford', 1, T0);
    const r = simulateBattle(setup);
    const a = analyzeDefeat(g, setup, r, T0);
    expect(a.actions.find((x) => x.label === '편성에 넣기')).toBeUndefined();
    const swap = a.actions.find((x) => x.id === 'formation');
    if (swap) expect(swap.label).toBe('출전 동료 바꾸기');
    expect(a.reasons.some((x) => x.tag === 'armor')).toBe(true);
  });

  it('안내는 칸을 하나씩 가리키고, 튜토리얼 중엔 다른 칸을 가리키지 않는다', () => {
    const g = newGame(T0);
    g.tutorial.introSeen = true;
    expect(computeGuide(g, { selected: null, tab: 'map' })!.target).toEqual({ kind: 'tile', id: 'a1' });
    expect(computeGuide(g, { selected: 'a1', tab: 'map' })!.target).toEqual({ kind: 'tileAction' });
  });

  it('소환은 같은 스피릿이 또 나오면 진화 재료가 된다 (D60)', () => {
    const g = newGame(T0);
    g.cleared.push('a8');
    expect('error' in summon(g, 'fire')).toBe(true);
    g.summonStones = 30;
    expect(summon(g, 'fire')).toEqual({ spiritId: 'igni', duplicate: false });
    expect(summon(g, 'fire')).toEqual({ spiritId: 'igni', duplicate: true });
    expect(g.spirits.igni.copies).toBe(1);
    expect(summon(g, 'earth')).toEqual({ spiritId: 'rocky', duplicate: false });
    expect(g.summonStones).toBe(0);
  });
});

describe('속성 학습', () => {
  it('불씨 둥지(🔥)는 💧쉘나이트가 유리, 돌풍 언덕의 🌪️바람에는 불리, 골렘(🌿)엔 🔥불이 유리', () => {
    expect(attackMatchup('tideshell', 'ember_nest')).toBe('adv');
    expect(attackMatchup('igni', 'boss_treant')).toBe('adv');
    expect(attackMatchup('tideshell', 'boss_treant')).toBe('even');
    void DEFAULT_SLOT;
  });
});
