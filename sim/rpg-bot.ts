// RPG 밸런스 봇 (D82~): 1판부터 차례로 스테이지를 깬다. 실행: npx tsx sim/rpg-bot.ts
// 판 안에서: 붙으면 자동 전투, 체력이 낮으면 물약/야영지, 레벨이 모자라면 제자리에서 몰려오는 몬스터로 경험치 벌기.
import { beatenBy, MONSTERS, TREES, type Element } from '../src/rpg/data';
import { autoAct, buy, engaged, equip, heroStats, itemScore, learnNode, move, newRpg, spendSpiritPoint, startStage, stageInfo, usePotion, wait, type RpgState } from '../src/rpg/game';
import { active, cellAt, DIRS, dist, isFloor, key, STAGES, step, type Dir } from '../src/rpg/world';

function bfs(s: RpgState, goal: (c: number, r: number) => boolean, through = false): Dir | null {
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
      if (mon && !through && !goal(n.c, n.r)) continue;
      seen.add(k);
      prev.set(k, [key(p.c, p.r), d]);
      q.push(n);
    }
  }
  return null;
}

function manage(s: RpgState) {
  const st = STAGES[s.stage - 1];
  while (s.spiritPoints > 0) {
    const els = [MONSTERS[st.boss].element, ...st.monsters.map((m) => MONSTERS[m].element)].map(beatenBy).filter((e) => s.spirits[e]);
    const want = els.sort((a, b) => (s.spirits[a] ?? 0) - (s.spirits[b] ?? 0))[0] ?? (Object.keys(s.spirits)[0] as Element);
    if (spendSpiritPoint(s, want)) break;
  }
  for (const n of TREES.knight) if (!learnNode(s, n.id)) break;
  for (const it of [...s.bag]) if (itemScore(it) > itemScore(s.heroes.knight.gear[it.slot])) equip(s, it.uid);
}

/** 한 판 플레이. 깨면 true */
export function playStage(s: RpgState, n: number, maxTurns = 4000) {
  startStage(s, n);
  const st = STAGES[n - 1];
  let retreat = false;
  for (let t = 0; t < maxTurns && !s.stageClear; t++) {
    manage(s);
    const h = s.heroes.knight;
    const max = heroStats(s).hp;
    if (h.hp < max * 0.35) (usePotion(s, 'big') && usePotion(s, 'small')) ?? null;
    if (engaged(s) && autoAct(s)) continue;
    if (h.hp < max * 0.3) retreat = true;
    if (retreat) {
      if (h.hp >= max * 0.95) retreat = false;
      const ready = (s.campReady[key(s.camp.c, s.camp.r)] ?? 0) <= s.turn;
      const d = ready ? bfs(s, (c, r) => c === s.camp.c && r === s.camp.r) : null;
      if (d) move(s, d);
      else wait(s);
      continue;
    }
    const info = stageInfo(s);
    const shrine = [...active().cells.values()].find((x) => x.feature?.kind === 'shrine' && !s.spirits[x.feature.element]);
    const bossOk = h.level >= st.bossLv - 1 || s.bossDown;
    const target = s.monsters.filter((m) => !m.dead && (!m.boss || bossOk) && dist(m, s.pos) <= 7).sort((a, b) => dist(a, s.pos) - dist(b, s.pos))[0];
    let d: Dir | null = null;
    if (shrine) d = bfs(s, (c, r) => c === shrine.c && r === shrine.r, true);
    else if (target) d = bfs(s, (c, r) => c === target.c && r === target.r, true);
    else if (s.bossDown) d = bfs(s, (c, r) => cellAt(c, r)?.feature?.kind === 'exit', true);
    else if (bossOk) {
      const boss = s.monsters.find((m) => m.boss && !m.dead)!;
      d = bfs(s, (c, r) => c === boss.c && r === boss.r, true);
    } else {
      // 남은 일반 몬스터를 찾아가고, 없으면 제자리에서 몰려오는 몬스터를 기다린다(경험치 벌기)
      const any = s.monsters.filter((m) => !m.dead && !m.boss).sort((a, b) => dist(a, s.pos) - dist(b, s.pos))[0];
      if (any) d = bfs(s, (c, r) => c === any.c && r === any.r, true);
    }
    void info;
    if (d) move(s, d);
    else wait(s);
  }
  return s.stageClear;
}

export function runRpgBot(stages = 10, log = false) {
  const s = newRpg();
  s.tut = 99;
  const at: Record<number, string> = {};
  let totalTurns = 0;
  for (let n = 1; n <= stages; n++) {
    // 상점: 물약 3개 유지, 골드가 많으면 장비 상자
    while (s.potions.small < 3 && !('error' in buy(s, 'small')));
    if (s.gold > 400) buy(s, 'box');
    const d0 = s.deaths;
    let ok = false;
    for (let attempt = 0; attempt < 4 && !ok; attempt++) {
      ok = playStage(s, n);
      totalTurns += s.turn;
    }
    at[n] = `${ok ? '클리어' : '실패'} 턴${s.turn} Lv${s.heroes.knight.level} 사망${s.deaths - d0}`;
    if (!ok) break;
  }
  if (log) console.log(at, '총턴', totalTurns, '처치', s.kills, '스피릿', JSON.stringify(s.spirits), '골드', s.gold, '물약', s.potions);
  return { s, at };
}

if (process.argv[1]?.endsWith('rpg-bot.ts')) runRpgBot(10, true);
