import { describe, expect, it } from 'vitest';
import { stepSide } from '../src/tactics/ai';
import { elMul, ITEMS, ROLES, SKILLS, UNITS } from '../src/tactics/data';
import { attack, attackTargets, autoEquip, buyItem, calcHit, createBattle, dist, endAllyPhase, endEnemyPhase, finishBattle, forecast, moveRange, moveUnit, newCampaign, unitStats, useSkill, type Battle } from '../src/tactics/engine';
import { COLS, ENEMIES, ROWS, STAGES, terrainAt } from '../src/tactics/stages';
import { runTacticsBot } from '../sim/tactics-bot';

const place = (b: Battle, uid: number, c: number, r: number) => Object.assign(b.units[uid], { c, r });

describe('전술 전투 데이터', () => {
  it('스테이지 지도는 9×12, 배치·적 칸이 바위가 아니다', () => {
    for (const st of STAGES) {
      expect(st.map.length).toBe(ROWS);
      for (const row of st.map) expect(row.length).toBe(COLS);
      for (const [c, r] of st.deploy) expect(terrainAt(st, c, r)).not.toBe('rock');
      for (const e of st.enemies) {
        expect(ENEMIES[`e_${e.id}`]).toBeTruthy();
        expect(terrainAt(st, e.c, e.r)).not.toBe('rock');
      }
      for (const id of st.joins) expect(UNITS[id]).toBeTruthy();
      for (const id of st.items) expect(ITEMS[id]).toBeTruthy();
    }
  });
  it('7가지 역할과 기술이 모두 있다', () => {
    expect(Object.keys(ROLES)).toHaveLength(7);
    for (const r of Object.values(ROLES)) for (const s of r.skills) expect(SKILLS[s]).toBeTruthy();
    expect(Object.keys(UNITS).length).toBeGreaterThanOrEqual(15);
  });
  it('상성: 유리 ×1.3, 불리 ×0.75', () => {
    expect(elMul('water', 'fire')).toBe(1.3);
    expect(elMul('fire', 'water')).toBe(0.75);
    expect(elMul('wind', 'water')).toBe(1.3);
    expect(elMul(null, 'water')).toBe(1);
  });
});

describe('전술 전투 규칙', () => {
  it('이동: 이동력만큼, 적은 지나갈 수 없다', () => {
    const b = createBattle(newCampaign(), 1, ['aren', 'shellknight', 'emberwing', 'bloomel']);
    const u = b.units[0];
    const range = moveRange(b, u);
    for (const v of range.values()) expect(dist(u, v)).toBeLessThanOrEqual(unitStats(u).move);
    expect(typeof moveUnit(b, u, 0, 0)).toBe('string'); // 너무 멀다
  });
  it('물리는 방어로, 마법은 마법방어로 줄어든다', () => {
    const b = createBattle(newCampaign(), 1, ['aren', 'shellknight', 'emberwing', 'bloomel']);
    const knight = b.units.find((u) => u.def === 'aren')!;
    const foe = b.units.find((u) => u.side === 'enemy')!;
    const hi = calcHit(b, knight, foe, 1, 'phys').amount;
    foe.st.defDown = { pct: 50, turns: 2 };
    expect(calcHit(b, knight, foe, 1, 'phys').amount).toBeGreaterThan(hi);
  });
  it('근접 공격은 반격을 받고, 2칸 밖 활은 반격받지 않는다', () => {
    const cp = newCampaign();
    cp.roster.galewing = { lv: 1, xp: 0, equip: {} };
    const b = createBattle(cp, 1, ['aren', 'galewing', 'shellknight', 'bloomel']);
    const aren = b.units.find((u) => u.def === 'aren')!;
    const gale = b.units.find((u) => u.def === 'galewing')!;
    const foe = b.units.find((u) => u.side === 'enemy')!;
    place(b, aren.uid, 4, 7);
    place(b, foe.uid, 4, 6);
    foe.hp = 999;
    expect(forecast(b, aren, foe).counter).toBeGreaterThan(0);
    place(b, gale.uid, 4, 8);
    expect(dist(gale, foe)).toBe(2);
    expect(forecast(b, gale, foe).counter).toBe(0);
    const hp = aren.hp;
    attack(b, aren, foe);
    expect(aren.hp).toBeLessThan(hp);
  });
  it('기술은 SP를 쓰고, 기절한 적은 다음 차례에 쉰다', () => {
    const b = createBattle(newCampaign(), 1, ['aren', 'shellknight', 'emberwing', 'bloomel']);
    const tank = b.units.find((u) => u.def === 'shellknight')!;
    tank.lv = 5;
    const foe = b.units.find((u) => u.side === 'enemy')!;
    place(b, tank.uid, 4, 7);
    place(b, foe.uid, 4, 6);
    foe.hp = 999;
    tank.sp = 30;
    const r = useSkill(b, tank, 'shieldbash', { c: 4, r: 6 });
    expect(typeof r).not.toBe('string');
    expect(tank.sp).toBe(30 - SKILLS.shieldbash.sp);
    expect(foe.st.stun).toBe(1);
    endAllyPhase(b);
    expect(foe.acted).toBe(true);
  });
  it('아렌이 쓰러지면 패배, 적이 모두 쓰러지면 승리', () => {
    const b = createBattle(newCampaign(), 1, ['aren', 'shellknight', 'emberwing', 'bloomel']);
    for (const u of b.units) if (u.side === 'enemy') u.dead = true;
    const aren = b.units[0];
    const foe = b.units.find((u) => u.side === 'enemy')!;
    foe.dead = false;
    foe.hp = 1;
    place(b, aren.uid, 4, 7);
    place(b, foe.uid, 4, 6);
    attack(b, aren, foe);
    expect(b.result).toBe('win');
    const b2 = createBattle(newCampaign(), 1, ['aren', 'shellknight', 'emberwing', 'bloomel']);
    b2.units[0].dead = true;
    endAllyPhase(b2);
    while (stepSide(b2, 'enemy'));
    endEnemyPhase(b2);
    expect(b2.result).toBe('lose');
  });
  it('적 인공지능은 닿는 아군을 공격한다', () => {
    const b = createBattle(newCampaign(), 1, ['aren', 'shellknight', 'emberwing', 'bloomel']);
    const foe = b.units.find((u) => u.side === 'enemy' && u.ai === 'charge')!;
    place(b, foe.uid, 3, 9);
    endAllyPhase(b);
    const hp = b.units.filter((u) => u.side === 'ally').reduce((a, u) => a + u.hp, 0);
    while (stepSide(b, 'enemy'));
    expect(b.units.filter((u) => u.side === 'ally').reduce((a, u) => a + u.hp, 0)).toBeLessThan(hp);
  });
  it('이기면 보상·합류, 장비를 사서 끼면 강해진다', () => {
    const cp = newCampaign();
    const b = createBattle(cp, 1, cp.party);
    b.result = 'win';
    const r = finishBattle(cp, b);
    expect(r.joins).toContain('galewing');
    expect(cp.cleared).toContain(1);
    cp.gold = 1000;
    const before = unitStats(createBattle(cp, 1, ['aren']).units[0]).atk;
    expect(buyItem(cp, 'sword1')).toBeNull();
    expect(autoEquip(cp)).toBeGreaterThan(0);
    expect(unitStats(createBattle(cp, 1, ['aren']).units[0]).atk).toBeGreaterThan(before);
    expect(attackTargets).toBeTruthy();
  });
  it('인공지능 부대가 (가끔 앞 판에서 경험치를 벌며) 10판을 모두 깬다', () => {
    const { rows } = runTacticsBot();
    expect(rows).toHaveLength(10);
    expect(rows.every((r) => r.includes('승리'))).toBe(true);
  }, 60000);
});
