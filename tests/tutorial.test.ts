import { describe, expect, it } from 'vitest';
import { enterTile, newGame, reachableTiles, summon, summonUnlocked } from '../src/core/game';
import { attackMatchup, suggestTeam } from '../src/core/power';
import { ENCOUNTERS, ENEMIES } from '../src/data/enemies';
import { TILE_BY_ID } from '../src/data/map';
import { computeGuide, type Tab } from '../src/ui/tutorial';

const T0 = 1_700_000_000_000;

describe('튜토리얼: 한 줄 길', () => {
  it('튜토리얼 구간에서는 갈 수 있는 칸이 항상 하나뿐이다', () => {
    const g = newGame(T0);
    for (const id of ['a1', 'a2', 'a3', 's1', 's2']) {
      expect([...reachableTiles(g)]).toEqual([id]);
      enterTile(g, id, T0);
    }
    expect([...reachableTiles(g)]).toEqual(['b1']);
  });
});

describe('튜토리얼: 조합의 중요성 (D47)', () => {
  it('시작 팀(💧+🌿)은 첫 보스에 지고 → 소환 열림 → 🔥소환 → 출전 → 승리', () => {
    const g = newGame(T0);
    g.tutorial.introSeen = true;
    let tab: Tab = 'map';
    const at = (selected: string | null) => computeGuide(g, { selected, tab })!;
    expect(Object.keys(g.spirits).sort()).toEqual(['sylphy', 'tideshell']);
    for (const id of ['a1', 'a2', 'a3', 's1', 's2']) {
      expect(at(null).target).toEqual({ kind: 'tile', id });
      enterTile(g, id, T0);
    }
    expect(g.summonStones).toBe(10);
    expect(summonUnlocked(g)).toBe(false);
    const lose = enterTile(g, 'b1', T0);
    expect(lose.type === 'battle' && lose.outcome.won).toBe(false);
    expect(lose.type === 'battle' && lose.outcome.analysis?.actions[0].id).toBe('summon');
    expect(summonUnlocked(g)).toBe(true);
    expect(at(null).target).toEqual({ kind: 'tab', tab: 'summon' });
    tab = 'summon';
    expect(at(null).target).toEqual({ kind: 'altar', element: 'fire' });
    const r = summon(g, 'fire');
    expect('spiritId' in r && r.spiritId).toBe('igni');
    expect(g.formation.igni).toBeDefined();
    expect(at(null).target).toEqual({ kind: 'tab', tab: 'map' });
    tab = 'map';
    const win = enterTile(g, 'b1', T0);
    expect(win.type === 'battle' && win.outcome.won).toBe(true);
    expect(at(null).finish).toBe(true);
    expect(reachableTiles(g).size).toBeGreaterThan(1);
  });

  it('시작 팀은 레벨을 올려도(Lv.7) 첫 보스를 못 이긴다 — 상성이 핵심', async () => {
    const { simulateBattle } = await import('../src/core/battle');
    const { buildSetup } = await import('../src/core/game');
    const g = newGame(T0);
    for (const sp of Object.values(g.spirits)) sp.level = 7;
    for (let i = 0; i < 5; i++) expect(simulateBattle(buildSetup(g, 'boss_treant', 300 + i, T0)).outcome).not.toBe('win');
  });

  it('🔥소환 후 재도전은 어떤 시드에서도 이긴다 (튜토리얼 보장)', () => {
    for (let i = 0; i < 60; i++) {
      const g = newGame(T0 + i * 977_131);
      for (const id of ['a1', 'a2', 'a3', 's1', 's2', 'b1']) enterTile(g, id, T0);
      summon(g, 'fire');
      const r = enterTile(g, 'b1', T0);
      expect(r.type === 'battle' && r.outcome.won).toBe(true);
    }
  });

  it('소환은 소환석이 필요하고, 같은 스피릿은 두 번 소환할 수 없다', () => {
    const g = newGame(T0);
    g.bossAttempts.b1 = 1;
    expect('error' in summon(g, 'fire')).toBe(true);
    g.summonStones = 20;
    expect('spiritId' in summon(g, 'fire')).toBe(true);
    expect('error' in summon(g, 'fire')).toBe(true);
    expect('error' in summon(g, 'earth')).toBe(true);
    expect(g.summonStones).toBe(10);
  });
});

describe('속성 학습 (D42)', () => {
  it('두 번째 칸은 물 적, 네 번째 칸은 숲 적, 보스는 숲 → 불이 유리', () => {
    const a2 = ENCOUNTERS[TILE_BY_ID.a2.encounterId!];
    expect(a2.enemies.every((e) => ENEMIES[e.enemyId].element === 'water')).toBe(true);
    const s1 = ENCOUNTERS[TILE_BY_ID.s1.encounterId!];
    expect(s1.enemies.every((e) => ENEMIES[e.enemyId].element === 'forest')).toBe(true);
    expect(attackMatchup('igni', 'boss_treant')).toBe('adv');
    expect(attackMatchup('tideshell', 'boss_treant')).toBe('even');
  });
  it('물 적에게는 바람 동료를 추천한다', () => {
    const best = suggestTeam(['tideshell', 'igni', 'sylphy', 'galewing'], 'mist_ford', 3);
    expect(best).toContain('galewing');
    expect(best).not.toContain('igni');
  });
});
