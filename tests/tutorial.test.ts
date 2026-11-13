import { describe, expect, it } from 'vitest';
import { enterTile, levelUp, newGame, reachableTiles, setFormation, summon, summonUnlocked } from '../src/core/game';
import { effectivePower, recommendedPower } from '../src/core/power';
import { DEFAULT_SLOT } from '../src/data/spirits';
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
    expect(reachableTiles(g).size).toBeGreaterThan(1);

    // ── 2단계 ① 물안개 여울: 불 편성으론 지고 → 바람 결정 → 🌪️소환 → 상성 추천 편성 → 승리 ──
    expect(at(null).target).toEqual({ kind: 'tile', id: 'c1' });
    const l1 = enterTile(g, 'c1', T0);
    expect(l1.type === 'battle' && l1.outcome.won).toBe(false);
    expect(at(null).target).toEqual({ kind: 'tile', id: 'c2' });
    enterTile(g, 'c2', T0);
    expect(at(null).target).toEqual({ kind: 'tile', id: 'c5' });
    enterTile(g, 'c5', T0);
    expect(g.summonStones).toBe(10);
    expect(at(null).target).toEqual({ kind: 'tab', tab: 'summon' });
    tab = 'summon';
    expect(at(null).target).toEqual({ kind: 'altar', element: 'electric' });
    summon(g, 'electric');
    expect(g.formation.galewing).toBeUndefined(); // 출전 3명이 꽉 차 있음
    expect(at(null).target).toEqual({ kind: 'tab', tab: 'map' });
    tab = 'map';
    expect(at('c1').target).toEqual({ kind: 'suggest' });
    const best = suggestTeam(Object.keys(g.spirits), 'mist_ford', 3);
    for (const k of Object.keys(g.formation)) setFormation(g, k, null);
    for (const k of best) setFormation(g, k, DEFAULT_SLOT[k]);
    expect(g.formation.galewing).toBeDefined();
    const w1 = enterTile(g, 'c1', T0);
    expect(w1.type === 'battle' && w1.outcome.won).toBe(true);

    // ── 2단계 ② 바위엄니 떼: 지고 → 레벨업 → 승리 ──
    expect(at(null).target).toEqual({ kind: 'tile', id: 'c4' });
    const l2 = enterTile(g, 'c4', T0);
    expect(l2.type === 'battle' && l2.outcome.won).toBe(false);
    expect(at(null).target).toEqual({ kind: 'tab', tab: 'spirit' });
    tab = 'spirit';
    expect(at(null).target).toEqual({ kind: 'levelUp' });
    for (let i = 0; i < 300 && effectivePower(g, 'boar_herd') < recommendedPower('boar_herd'); i++) {
      const id = Object.keys(g.formation).sort((a, b) => g.spirits[a].level - g.spirits[b].level)[0];
      if (levelUp(g, id)) break;
    }
    expect(effectivePower(g, 'boar_herd')).toBeGreaterThanOrEqual(recommendedPower('boar_herd'));
    tab = 'map';
    const w2 = enterTile(g, 'c4', T0);
    expect(w2.type === 'battle' && w2.outcome.won).toBe(true);
    expect(at(null).finish).toBe(true);
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

  it('소환은 소환석이 필요하고, 같은 스피릿이 또 나오면 진화 재료가 된다 (D60)', () => {
    const g = newGame(T0);
    g.bossAttempts.b1 = 1;
    expect('error' in summon(g, 'fire')).toBe(true);
    g.summonStones = 30;
    expect(summon(g, 'fire')).toEqual({ spiritId: 'igni', duplicate: false });
    expect(summon(g, 'fire')).toEqual({ spiritId: 'igni', duplicate: true });
    expect(g.spirits.igni.copies).toBe(1);
    expect(summon(g, 'earth')).toEqual({ spiritId: 'rocky', duplicate: false });
    expect(g.summonStones).toBe(0);
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
