import { describe, expect, it } from 'vitest';
import { MONSTERS, SKILLS, typeMul } from '../src/rpg/data';
import { buy, equip, equipBest, estimateHit, heroStats, makeItem, move, newRpg, spendSpiritPoint, spiritBonus, startStage, unlockedStage, usePotion, useSkill, wait } from '../src/rpg/game';
import { active, buildStage, cellAt, COLS, dist, key, neighbors, STAGES, step } from '../src/rpg/world';
import { runRpgBot } from '../sim/rpg-bot';

describe('스테이지 (D82)', () => {
  it('10판, 판마다 시작 야영지에서 출구까지 이어지고 중간 야영지가 있다', () => {
    expect(STAGES).toHaveLength(10);
    for (const st of STAGES) {
      const w = buildStage(st.n);
      const seen = new Set([key(w.start.c, w.start.r)]);
      const q = [w.start];
      while (q.length) {
        const p = q.shift()!;
        for (const n of neighbors(p.c, p.r)) if (w.cells.get(key(n.c, n.r))?.floor && !seen.has(key(n.c, n.r))) (seen.add(key(n.c, n.r)), q.push(n));
      }
      expect(seen.has(key(w.exit.c, w.exit.r))).toBe(true);
      expect(w.camps).toHaveLength(2);
      expect([...w.cells.values()].filter((x) => !x.floor).length).toBeGreaterThan(0); // 장애물
      expect(w.cells.size).toBe(COLS * st.rows);
    }
  });
  it('앞 판을 깨야 다음 판이 열리고, 깬 판은 다시 할 수 있다', () => {
    const s = newRpg();
    expect(unlockedStage(s)).toBe(1);
    expect(startStage(s, 2)).not.toBeNull();
    s.cleared.push(1);
    expect(startStage(s, 2)).toBeNull();
    expect(startStage(s, 1)).toBeNull();
  });
  it('출구는 보스를 쓰러뜨려야 열린다', () => {
    const s = newRpg();
    startStage(s, 1);
    const ex = active().exit;
    s.pos = step(ex.c, ex.r, 'SW');
    const dir = (['NE', 'NW', 'E', 'W'] as const).find((d) => {
      const t = step(s.pos.c, s.pos.r, d);
      return t.c === ex.c && t.r === ex.r;
    })!;
    move(s, dir);
    expect(s.stageClear).toBe(false);
    s.pos = step(ex.c, ex.r, 'SW');
    s.bossDown = true;
    move(s, dir);
    expect(s.stageClear).toBe(true);
    expect(s.cleared).toContain(1);
  });
  it('야영지는 한 번 쉬면 15턴 뒤에 다시 회복된다', () => {
    const s = newRpg();
    startStage(s, 1);
    const camp = active().camps[0];
    s.pos = step(camp.c, camp.r, 'NE');
    s.heroes.knight.hp = 10;
    const back = (['SW', 'SE', 'W', 'E'] as const).find((d) => {
      const t = step(s.pos.c, s.pos.r, d);
      return t.c === camp.c && t.r === camp.r;
    })!;
    move(s, back);
    expect(s.heroes.knight.hp).toBe(heroStats(s).hp);
    s.heroes.knight.hp = 10;
    move(s, 'NE');
    move(s, back);
    expect(s.heroes.knight.hp).toBeLessThan(heroStats(s).hp);
  });
  it('앞으로 못 가고 머뭇거리면 몬스터 무리가 몰려온다', () => {
    const s = newRpg();
    startStage(s, 1);
    for (const m of s.monsters) m.dead = true; // 다 잡았다고 치고 제자리에서 버티기
    const before = s.monsters.length;
    for (let i = 0; i < 25; i++) wait(s);
    expect(s.monsters.length).toBeGreaterThan(before);
    expect(s.monsters.some((m) => m.extra && m.aggro)).toBe(true);
  });
});

describe('전투·성장', () => {
  it('상성 ×1.5 / ×0.67, 스피릿 보너스', () => {
    expect(typeMul('fire', 'forest')).toBe(1.5);
    expect(typeMul('fire', 'water')).toBe(0.67);
    const s = newRpg();
    s.spirits.fire = 3;
    expect(spiritBonus(s, MONSTERS.leafpup.element).atk).toBeGreaterThan(1);
    s.spiritPoints = 1;
    expect(spendSpiritPoint(s, 'water')).not.toBeNull();
    expect(spendSpiritPoint(s, 'fire')).toBeNull();
  });
  it('기술 쿨타임과 물약·상점', () => {
    const s = newRpg();
    startStage(s, 1);
    const m = s.monsters.find((x) => !x.boss)!;
    s.pos = neighbors(m.c, m.r).find((n) => cellAt(n.c, n.r)?.floor)!;
    expect(dist(s.pos, m)).toBe(1);
    useSkill(s, 2);
    expect(s.cds.bash).toBeGreaterThan(0);
    expect(estimateHit(s, SKILLS.slash, m).dmg).toBeGreaterThan(0);
    s.heroes.knight.hp = 5;
    expect(usePotion(s, 'small')).toBeNull();
    expect(s.heroes.knight.hp).toBeGreaterThan(5);
    s.gold = 1000;
    const r = buy(s, 'box');
    expect('item' in r && r.item).toBeTruthy();
  });
  it('장비는 능력치를 올린다', () => {
    const s = newRpg();
    const it = makeItem(s, 10, 'epic');
    s.bag.push(it);
    const a = heroStats(s);
    equip(s, it.uid);
    const b = heroStats(s);
    expect(b.atk + b.def + b.res + b.hp).toBeGreaterThan(a.atk + a.def + a.res + a.hp);
  });
  it('원버튼으로 부위마다 가장 좋은 장비를 착용한다', () => {
    const s = newRpg();
    const a = makeItem(s, 3, 'common');
    const b = makeItem(s, 12, 'epic');
    s.bag.push(a, b);
    expect(equipBest(s)).toBeGreaterThan(0);
    expect(Object.values(s.heroes.knight.gear).map((x) => x!.uid)).toContain(b.uid);
    expect(equipBest(s)).toBe(0);
  });
  it('봇이 10판을 모두 깬다', () => {
    const { s } = runRpgBot(10);
    expect(s.cleared.length).toBe(10);
  });
});
