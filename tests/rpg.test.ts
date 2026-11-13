import { describe, expect, it } from 'vitest';
import { HEROES, MONSTERS, SKILLS, typeMul } from '../src/rpg/data';
import { equip, estimateHit, heroStats, makeItem, move, newRpg, spendSpiritPoint, spiritBonus, switchHero, useSkill, xpToNext } from '../src/rpg/game';
import { BOSS_ROWS, COLS, WORLD, cellAt, dist, key, neighbors, step } from '../src/rpg/world';
import { runRpgBot } from '../sim/rpg-bot';

describe('월드 (D72)', () => {
  it('시작점에서 모든 바닥 칸에 갈 수 있고, 보스 줄은 보스 칸 하나뿐', () => {
    for (const r of BOSS_ROWS) {
      const floors = Array.from({ length: COLS }, (_, c) => cellAt(c, r)!).filter((x) => x.floor);
      expect(floors).toHaveLength(1);
      expect(floors[0].feature?.kind).toBe('boss');
    }
    const seen = new Set([key(4, 0)]);
    const q = [{ c: 4, r: 0 }];
    while (q.length) {
      const p = q.shift()!;
      for (const n of neighbors(p.c, p.r)) if (cellAt(n.c, n.r)?.floor && !seen.has(key(n.c, n.r))) (seen.add(key(n.c, n.r)), q.push(n));
    }
    expect(seen.size).toBe([...WORLD.cells.values()].filter((x) => x.floor).length);
    expect([...WORLD.cells.values()].filter((x) => x.feature?.kind === 'shrine')).toHaveLength(5);
  });
  it('방향 이동과 거리', () => {
    expect(step(4, 0, 'NE')).toEqual({ c: 4, r: 1 });
    expect(step(4, 1, 'NE')).toEqual({ c: 5, r: 2 });
    for (const n of neighbors(3, 7)) expect(dist(n, { c: 3, r: 7 })).toBe(1);
  });
});

describe('전투·상성', () => {
  it('속성 상성 ×1.5 / ×0.67', () => {
    expect(typeMul('fire', 'forest')).toBe(1.5);
    expect(typeMul('fire', 'water')).toBe(0.67);
    expect(typeMul(null, 'water')).toBe(1);
  });
  it('물리 방어가 높은 적은 마법이 잘 듣고, 기술 속성이 맞으면 더 세다', () => {
    const s = newRpg();
    const shell = { ...s.monsters[0], def: 'shell', level: 5 };
    s.heroId = 'knight';
    const phys = estimateHit(s, SKILLS.slash, shell);
    s.heroId = 'mage';
    const magic = estimateHit(s, SKILLS.bolt, shell);
    expect(phys.blocked).toBe(true);
    expect(magic.dmg).toBeGreaterThan(phys.dmg);
    const leaf = { ...s.monsters[0], def: 'leafpup', level: 5 };
    expect(estimateHit(s, SKILLS.fireball, leaf).type).toBe(1.5);
  });
  it('스피릿: 이기는 속성 몬스터에게 피해↑·받는 피해↓, 포인트로 직접 키운다', () => {
    const s = newRpg();
    s.spirits.fire = 1;
    s.spiritPoints = 2;
    expect(spendSpiritPoint(s, 'water')).not.toBeNull(); // 아직 없음
    expect(spendSpiritPoint(s, 'fire')).toBeNull();
    expect(s.spirits.fire).toBe(2);
    const b = spiritBonus(s, MONSTERS.leafpup.element);
    expect(b.atk).toBeGreaterThan(1);
    expect(b.guard).toBeLessThan(1);
    expect(spiritBonus(s, 'water').lv).toBe(0);
  });
  it('몬스터 칸으로 이동하면 공격, 기술은 쿨타임', () => {
    const s = newRpg();
    const m = s.monsters.find((x) => !x.boss)!;
    s.pos = step(m.c, m.r, 'SW').c >= 0 ? step(m.c, m.r, 'SW') : step(m.c, m.r, 'W');
    const before = m.hp;
    const dir = (['NE', 'E', 'W', 'NW', 'SE', 'SW'] as const).find((d) => {
      const t = step(s.pos.c, s.pos.r, d);
      return t.c === m.c && t.r === m.r;
    })!;
    move(s, dir);
    expect(s.monsters.find((x) => x.id === m.id)!.hp).toBeLessThan(before);
    useSkill(s, 2);
    expect(s.cds.bash).toBeGreaterThan(0);
  });
});

describe('성장', () => {
  it('장비는 능력치를 올리고, 캐릭터는 야영지에서만 바꾼다', () => {
    const s = newRpg();
    const it = makeItem(s, 10, 'epic');
    s.bag.push(it);
    const before = heroStats(s);
    equip(s, it.uid);
    const after = heroStats(s);
    expect(after.atk + after.def + after.res + after.hp).toBeGreaterThan(before.atk + before.def + before.res + before.hp);
    s.pos = { c: 4, r: 1 };
    expect(switchHero(s, 'mage')).toMatch('야영지');
    s.pos = { c: 4, r: 0 };
    expect(switchHero(s, 'mage')).toBeNull();
    expect(switchHero(s, 'archer')).toMatch('합류');
    expect(xpToNext(5)).toBeGreaterThan(xpToNext(1));
    expect(Object.keys(HEROES)).toHaveLength(3);
  });
  it('봇이 사냥·스피릿·장비·캐릭터 교체로 보스 4마리를 모두 잡는다', () => {
    const { s } = runRpgBot(8000);
    expect(s.bossesDown).toHaveLength(4);
    expect(Object.keys(s.spirits)).toHaveLength(5);
  });
});
