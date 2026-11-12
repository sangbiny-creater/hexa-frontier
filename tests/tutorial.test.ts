import { describe, expect, it } from 'vitest';
import { enterTile, newGame, startActivity } from '../src/core/game';
import { migrate } from '../src/core/save';
import { computeGuide } from '../src/ui/tutorial';

const T0 = 1_700_000_000_000;

describe('튜토리얼 안내 흐름', () => {
  it('시작 화면을 보기 전·튜토리얼 종료 후에는 안내 없음', () => {
    const g = newGame(T0);
    expect(computeGuide(g, { selected: null, tab: 'spirits' })).toBeNull();
    g.tutorial.introSeen = true;
    g.tutorial.done = true;
    expect(computeGuide(g, { selected: null, tab: 'spirits' })).toBeNull();
  });

  it('첫 10분 동안 매 단계 가리키는 곳이 있다: 칸 → 버튼 → … → 훈련 → 마무리', () => {
    const g = newGame(T0);
    g.tutorial.introSeen = true;
    const at = (selected: string | null, tab = 'spirits') => computeGuide(g, { selected, tab })!;
    const steps: string[] = [];
    const go = (tile: string) => {
      const before = at(null);
      expect(before.target).toEqual({ kind: 'tile', id: tile });
      expect(at(tile).target).toEqual({ kind: 'tileAction' });
      steps.push(tile);
      return enterTile(g, tile, T0);
    };
    go('a1');
    go('a2');
    go('a3');
    const boss = go('b1');
    expect(boss.type === 'battle' && boss.outcome.won).toBe(false);
    go('s1');
    go('s2');
    const again = go('b1');
    expect(again.type === 'battle' && again.outcome.won).toBe(true);
    expect(at(null).target).toEqual({ kind: 'activityTab' });
    expect(at(null, 'activity').target).toEqual({ kind: 'trainingStart' });
    expect(startActivity(g, 'training', 'tideshell', T0)).toBeNull();
    expect(at(null, 'activity').finish).toBe(true);
    expect(steps).toEqual(['a1', 'a2', 'a3', 'b1', 's1', 's2', 'b1']);
  });
});

describe('저장 v1 → v2', () => {
  it('튜토리얼 필드를 채우고 시작 화면을 다시 보여 준다', () => {
    const v1: any = { ...newGame(T0), version: 1 };
    delete v1.tutorial;
    const m = migrate(v1)!;
    expect(m.version).toBe(2);
    expect(m.tutorial.introSeen).toBe(false);
  });
});
