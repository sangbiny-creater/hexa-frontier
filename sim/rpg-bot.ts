// RPG 밸런스 봇: 가까운 몬스터를 사냥하며 위로 올라간다. 체력이 낮으면 야영지로, 기술은 쿨타임마다.
// 실행: npx tsx sim/rpg-bot.ts
import { BAL, HEROES, MONSTERS, SKILLS, beatenBy, type Element } from '../src/rpg/data';
import { autoAct, equip, heroStats, itemScore, learnNode, move, newRpg, onCamp, spendSpiritPoint, switchHero, useSkill, wait, type RpgState } from '../src/rpg/game';
import { TREES } from '../src/rpg/data';
import { BOSS_ROWS, DIRS, WORLD, ZONES, cellAt, dist, isFloor, key, step, zoneOf, type Dir } from '../src/rpg/world';

function bfs(s: RpgState, goal: (c: number, r: number) => boolean, avoidMon = true): Dir | null {
  const start = key(s.pos.c, s.pos.r);
  const prev = new Map<string, [string, Dir]>();
  const q = [s.pos];
  const seen = new Set([start]);
  while (q.length) {
    const p = q.shift()!;
    if ((p.c !== s.pos.c || p.r !== s.pos.r) && goal(p.c, p.r)) {
      let k = key(p.c, p.r);
      let d: Dir | null = null;
      while (k !== start) {
        const [pk, pd] = prev.get(k)!;
        d = pd;
        k = pk;
      }
      return d;
    }
    for (const d of DIRS) {
      const n = step(p.c, p.r, d);
      const k = key(n.c, n.r);
      if (seen.has(k) || !isFloor(n.c, n.r)) continue;
      const mon = s.monsters.find((m) => !m.dead && m.c === n.c && m.r === n.r);
      if (mon && avoidMon && !goal(n.c, n.r)) continue;
      seen.add(k);
      prev.set(k, [key(p.c, p.r), d]);
      q.push(n);
    }
  }
  return null;
}

export function runRpgBot(maxTurns = 20000, log = false, trace?: string[]) {
  const s = newRpg();
  const at: Record<string, string> = {};
  let retreat = false;
  for (let t = 0; t < maxTurns; t++) {
    const h = s.heroes[s.heroId];
    const hs = heroStats(s);
    const z = zoneOf(s.pos.r);
    // 스피릿 포인트: 지금 구역 몬스터에게 강한 스피릿
    while (s.spiritPoints > 0) {
      // 지금 구역 보스 → 몬스터 순으로, 그 속성을 이기는 스피릿 중 레벨이 낮은 것
      const els = [MONSTERS[ZONES[z].boss].element, ...ZONES[z].monsters.map((m) => MONSTERS[m].element)].map(beatenBy).filter((e) => s.spirits[e]);
      const want = els.sort((a, b) => (s.spirits[a] ?? 0) - (s.spirits[b] ?? 0))[0] ?? (Object.keys(s.spirits)[0] as Element);
      if (spendSpiritPoint(s, want)) break;
    }
    // 장비: 더 좋으면 착용
    for (const it of [...s.bag]) if (itemScore(it) > itemScore(s.heroes[s.heroId].gear[it.slot])) equip(s, it.uid);
    // 야영지: 이 구역에 맞는 캐릭터 (물리 방어 높은 적이 많으면 마법사)
    if (onCamp(s)) {
      // 이 구역 몬스터 상대로 '때리는 힘 / 맞는 힘'이 가장 좋은 캐릭터
      const zm = ZONES[z].monsters.map((m) => MONSTERS[m]);
      const score = (id: string) => {
        const st = heroStats({ ...s, heroId: id }, id);
        const sk = SKILLS[HEROES[id].skills[0]];
        const atk = zm.reduce((a, m) => a + st.atk / (30 + (sk.dmg === 'phys' ? m.def : m.res)), 0);
        const taken = zm.reduce((a, m) => a + m.atk / (30 + (m.dmg === 'phys' ? st.def : st.res)), 0);
        return (atk * st.hp) / taken;
      };
      const want = Object.keys(HEROES).filter((id) => s.heroes[id].unlocked).sort((a, b) => score(b) - score(a))[0];
      if (want !== s.heroId) switchHero(s, want);
      if (h.hp >= hs.hp) retreat = false;
    }
    if (h.hp < hs.hp * 0.3) retreat = true;
    if (retreat) {
      const d = bfs(s, (c, r) => cellAt(c, r)?.feature?.kind === 'camp' && c === s.camp.c && r === s.camp.r, true);
      if (d) move(s, d);
      else wait(s);
      continue;
    }
    // 기술 포인트: 배울 수 있는 것부터
    for (const n of TREES[s.heroId]) if (!learnNode(s, n.id)) break;
    // 몬스터가 붙어 있으면 자동 전투 (화면과 같은 규칙)
    const acted = !!autoAct(s);
    if (acted) {
      trace?.push(`t${t} skill @${s.pos.c},${s.pos.r}`);
      continue;
    }
    // 사냥할 몬스터: 6칸 안 가장 가까운 것 (보스는 레벨이 되면)
    const z2 = ZONES[z];
    const bossOk = h.level >= z2.bossLv - 1;
    // 이 줄에 맞는 레벨보다 낮으면 멀리 있는 몬스터도 사냥, 충분하면 길을 막는 것만
    const zz = ZONES[zoneOf(Math.min(63, s.pos.r + 4))];
    const expect = zz.minLv + ((zz.maxLv - zz.minLv) * ((s.pos.r + 4) % 16)) / 16;
    const reach = h.level < expect + 1 ? 6 : 2;
    const target = s.monsters.filter((m) => !m.dead && dist(m, s.pos) <= reach && (!m.boss || bossOk)).sort((a, b) => dist(a, s.pos) - dist(b, s.pos))[0];
    let d: Dir | null = null;
    if (target) d = bfs(s, (c, r) => c === target.c && r === target.r);
    else {
      // 안 연 제단 → 위로 (보스 줄은 레벨이 되면)
      const shrine = [...WORLD.cells.values()].find((x) => x.feature?.kind === 'shrine' && !s.opened.includes(key(x.c, x.r)) && zoneOf(x.r) <= z);
      if (shrine) d = bfs(s, (c, r) => c === shrine.c && r === shrine.r);
      else {
        const limit = bossOk || s.bossesDown.includes(z2.boss) ? 999 : BOSS_ROWS[z] - 2;
        const goalRow = Math.min(limit, s.pos.r + 3);
        const up = (_c: number, r: number) => (goalRow > s.pos.r ? r >= goalRow : false);
        d = bfs(s, up) ?? bfs(s, up, false); // 몬스터가 길을 막으면 뚫고 간다
        if (!d) {
          // 막혔으면 아무 몬스터나 찾아 사냥
          const any = s.monsters.filter((m) => !m.dead && !m.boss && zoneOf(m.r) === z).sort((a, b) => dist(a, s.pos) - dist(b, s.pos))[0];
          if (any) d = bfs(s, (c, r) => c === any.c && r === any.r);
        }
      }
    }
    trace?.push(`t${t} @${s.pos.c},${s.pos.r} target=${target ? target.def + target.c + ',' + target.r : '-'} d=${d} retreat=${retreat}`);
    // 할 게 없으면 야영지 쪽으로 (멀어지면 몬스터가 다시 생긴다)
    if (!d && (s.pos.c !== s.camp.c || s.pos.r !== s.camp.r)) d = bfs(s, (c, r) => c === s.camp.c && r === s.camp.r, false);
    if (d) move(s, d);
    else wait(s);
    for (const b of ZONES.map((x) => x.boss)) if (s.bossesDown.includes(b) && !at[b]) at[b] = `턴${s.turn} Lv${s.heroes[s.heroId].level}(${s.heroId}) 사망${s.deaths}`;
    if (s.bossesDown.length === 4) break;
  }
  if (log) console.log(at, '턴', s.turn, '처치', s.kills, '사망', s.deaths, '스피릿', JSON.stringify(s.spirits), '레벨', Object.entries(s.heroes).map(([k, v]) => k + v.level).join(' '), 'row', s.pos.r);
  return { s, at };
}

if (process.argv[1]?.endsWith('rpg-bot.ts')) runRpgBot(20000, true);
void BAL;
void useSkill;
void SKILLS;
