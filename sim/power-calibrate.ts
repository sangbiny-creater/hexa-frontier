// 권장 전투력 표 생성: 여러 편성으로 각 전투를 75% 이상 이기는 최소 레벨을 찾고,
// 그때의 '상성 보정 전투력'(effectivePower) 중 최솟값을 권장값으로 저장한다.
// 밸런스를 바꾸면 다시 실행: npm run sim:power
import { writeFileSync } from 'node:fs';
import { simulateBattle } from '../src/core/battle';
import { buildSetup, newGame } from '../src/core/game';
import { effectivePower } from '../src/core/power';
import { BALANCE } from '../src/data/balance';
import { ENCOUNTERS } from '../src/data/enemies';
import { TILES } from '../src/data/map';
import { DEFAULT_SLOT } from '../src/data/spirits';

// P00(튜토리얼)은 튜토리얼 당시의 동료 조합으로만 잰다
// 튜토리얼은 칸마다 그 시점에 실제로 가진 동료로만 잰다 (D63)
const ST = ['tideshell', 'sylphy'];
const P00_COMPS: Record<string, string[][]> = {
  boss_treant: [[...ST, 'igni']],
  mist_ford: [[...ST, 'rocky'], [...ST, 'galewing'], ['tideshell', 'igni', 'rocky']],
  boar_herd: [[...ST, 'rocky'], ['tideshell', 'igni', 'rocky']],
  boss_boar: [[...ST, 'rocky']],
};
const ALL = ['tideshell', 'igni', 'sylphy', 'galewing', 'rocky'];

function combos(arr: string[], k: number): string[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [h, ...t] = arr;
  return [...combos(t, k - 1).map((c) => [h, ...c]), ...combos(t, k)];
}

/** 본편 스테이지 n에서 낼 수 있는 출전 인원 (025 클리어 → 4명, 075 클리어 → 5명) */
function deployAt(stage: number): number {
  return stage <= 25 ? 3 : stage <= 75 ? 4 : 5;
}

const stageOf = Object.fromEntries(TILES.filter((t) => t.encounterId).map((t) => [t.encounterId!, t.stage]));
const caps = BALANCE.evolution.levelCap;

function stateAt(ids: string[], lv: number) {
  const s = newGame(0);
  s.spirits = {};
  s.formation = {};
  s.maxDeploy = 5;
  // 레벨이 단계 최대치를 넘으면 그만큼 진화했다고 본다
  const stage = lv > caps[1] ? 3 : lv > caps[0] ? 2 : 1;
  for (const id of ids) {
    s.spirits[id] = { defId: id, level: lv, xp: 0, rank: 0, stage, copies: 0, condition: 100, injured: false, injuryProgress: 0 };
    s.formation[id] = DEFAULT_SLOT[id];
  }
  return s;
}

function winsAt(ids: string[], enc: string, lv: number): boolean {
  const s = stateAt(ids, lv);
  let wins = 0;
  for (let i = 0; i < 12; i++) {
    if (simulateBattle(buildSetup(s, enc, 77 + i * 131, 0)).outcome === 'win') wins++;
    if (wins >= 9) return true;
    if (i + 1 - wins > 3) return false;
  }
  return false;
}

const out: Record<string, number> = {};
const MAX_LV = 45;
for (const enc of Object.keys(ENCOUNTERS)) {
  const stage = stageOf[enc];
  const comps = stage ? combos(ALL, deployAt(stage)) : (P00_COMPS[enc] ?? [ST]);
  let best = Infinity;
  for (const ids of comps) {
    if (!winsAt(ids, enc, MAX_LV)) continue;
    let lo = 1;
    let hi = MAX_LV;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (winsAt(ids, enc, mid)) hi = mid;
      else lo = mid + 1;
    }
    best = Math.min(best, effectivePower(stateAt(ids, lo), enc));
  }
  out[enc] = Number.isFinite(best) ? Math.round(best / 10) * 10 : 99999;
  console.log(enc.padEnd(14), out[enc]);
}
writeFileSync(
  new URL('../src/data/recommended.ts', import.meta.url),
  `// 자동 생성: npm run sim:power (여러 편성 중 75% 이상 이기는 최소 '상성 보정 전투력')\nexport const RECOMMENDED_POWER: Record<string, number> = ${JSON.stringify(out, null, 2)};\n`,
);
