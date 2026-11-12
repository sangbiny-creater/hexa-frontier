import { describe, expect, it } from 'vitest';
import { enterTile, levelUp, newGame, reachableTiles, upgradeUnlocked } from '../src/core/game';
import { levelUpCost } from '../src/core/growth';
import { recommendedPower, teamPower } from '../src/core/power';
import { computeGuide, type Tab } from '../src/ui/tutorial';

const T0 = 1_700_000_000_000;

describe('튜토리얼: 한 줄 길 (D37)', () => {
  it('튜토리얼 구간에서는 갈 수 있는 칸이 항상 하나뿐이다', () => {
    const g = newGame(T0);
    for (const id of ['a1', 'a2', 'a3', 's1', 's2']) {
      expect([...reachableTiles(g)]).toEqual([id]);
      enterTile(g, id, T0);
    }
    expect([...reachableTiles(g)]).toEqual(['b1']);
  });

  it('흐름: 칸 → 버튼 … → 보스 패배 → 강화 탭 → 레벨업 → 지도 → 재도전 승리 → 마무리', () => {
    const g = newGame(T0);
    g.tutorial.introSeen = true;
    let tab: Tab = 'map';
    const at = (selected: string | null) => computeGuide(g, { selected, tab })!;
    const go = (id: string) => {
      expect(at(null).target).toEqual({ kind: 'tile', id });
      expect(at(id).target).toEqual({ kind: 'tileAction' });
      return enterTile(g, id, T0);
    };
    for (const id of ['a1', 'a2', 'a3', 's1', 's2']) go(id);
    expect(upgradeUnlocked(g)).toBe(false);
    const boss = go('b1');
    expect(boss.type === 'battle' && boss.outcome.won).toBe(false);
    expect(boss.type === 'battle' && boss.outcome.analysis?.nearMiss).toBe(true);
    expect(upgradeUnlocked(g)).toBe(true);
    expect(at(null).target).toEqual({ kind: 'tab', tab: 'upgrade' });
    tab = 'upgrade';
    expect(at(null).target).toEqual({ kind: 'levelUp' });
    for (let i = 0; i < 100; i++) {
      const id = Object.keys(g.formation).sort((a, b) => g.spirits[a].level - g.spirits[b].level)[0];
      if (g.gold < levelUpCost(g.spirits[id].level)) break;
      levelUp(g, id);
    }
    expect(teamPower(g)).toBeGreaterThanOrEqual(recommendedPower('boss_treant'));
    expect(at(null).target).toEqual({ kind: 'tab', tab: 'map' });
    tab = 'map';
    const again = go('b1');
    expect(again.type === 'battle' && again.outcome.won).toBe(true);
    expect(at(null).finish).toBe(true);
    // 보스를 넘으면 길이 여러 갈래
    expect(reachableTiles(g).size).toBeGreaterThan(1);
  });
});

import { attackMatchup, suggestTeam } from '../src/core/power';
import { ENCOUNTERS, ENEMIES } from '../src/data/enemies';
import { TILE_BY_ID } from '../src/data/map';

describe('속성 학습 단계 (D42)', () => {
  it('3번째 칸은 숲 적만 → 엠버윙(불) 유리, 4번째 칸은 물 적 → 엠버윙 불리', () => {
    const a3 = ENCOUNTERS[TILE_BY_ID.a3.encounterId!];
    expect(a3.enemies.every((e) => ENEMIES[e.enemyId].element === 'forest')).toBe(true);
    expect(attackMatchup('igni', a3.id)).toBe('adv');
    const s1 = ENCOUNTERS[TILE_BY_ID.s1.encounterId!];
    expect(s1.enemies.every((e) => ENEMIES[e.enemyId].element === 'water')).toBe(true);
    expect(attackMatchup('igni', s1.id)).toBe('dis');
    expect(attackMatchup('igni', 'boss_treant')).toBe('adv');
  });
  it('고목 골렘 너머에 바람 동료가 있고, 물 적에게는 바람 동료를 추천한다', () => {
    expect(TILE_BY_ID.c3.spiritId).toBe('galewing');
    const best = suggestTeam(['tideshell', 'igni', 'sylphy', 'galewing'], 'mist_ford', 3);
    expect(best).toContain('galewing');
    expect(best).not.toContain('igni');
  });
});
