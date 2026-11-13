// 튜토리얼: 모험가 '아렌'이 단계별로 안내한다. 단계는 게임 상태에서 계산한다.
// D63: P00 전체가 한 줄 길. 일부러 바로 못 깨는 칸을 두고, 질 때마다 '깨는 방법'을 하나씩 가르친다.
//   ① 어린 바위엄니 → 레벨업  ② 불씨 둥지·돌풍 언덕 → 상성 유리/불리  ③ 가시 덤불 → 골드 벌기(다시 싸우기)
//   ④ 고목 골렘 → 상성 맞춰 소환  ⑤ 캠프 자동 사냥  ⑥ 물안개 여울 → 물리/마법 + 편성 교체  ⑦ 바위엄니 대장 → 진화
import { affordableLevelUps, bestFarmTile, levelCap, TUTORIAL_PATH, type GameState } from '../core/game';
import { levelUpCost } from '../core/growth';
import { effectivePower, recommendedPower } from '../core/power';
import type { Element } from '../core/types';
import { BALANCE } from '../data/balance';
import { ENCOUNTERS, ENEMIES } from '../data/enemies';
import { TILE_BY_ID } from '../data/map';
import { SPIRITS } from '../data/spirits';
import { asset, GOLD, POWER } from './art';

export type Tab = 'map' | 'spirit' | 'summon' | 'camp';
export type GuideTarget =
  | { kind: 'tile'; id: string }
  | { kind: 'tileAction' }
  | { kind: 'tab'; tab: Tab }
  | { kind: 'altar'; element: Element }
  | { kind: 'levelUp' }
  | { kind: 'evolve'; id: string }
  | { kind: 'suggest' }
  | null;

export interface Guide {
  text: string;
  target: GuideTarget;
  finish?: boolean;
}

/** 받침에 맞는 조사: josa('락키', '을', '를') → '락키를' */
export function josa(w: string, withFinal: string, without: string): string {
  const c = w.charCodeAt(w.length - 1);
  const final = c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0;
  return w + (final ? withFinal : without);
}

/** 진화 연습에 쓸 스피릿: 락터스크(물안개 여울에서 소환) → 없으면 레벨이 가장 높은 출전 스피릿 */
export function evolveTarget(s: GameState): string {
  if (s.spirits.rocky) return 'rocky';
  return Object.keys(s.formation).sort((a, b) => s.spirits[b].level - s.spirits[a].level)[0];
}

export function computeGuide(state: GameState, ctx: { selected: string | null; tab: Tab; now?: number }): Guide | null {
  const tut = state.tutorial;
  if (!tut.introSeen || tut.done || state.map !== 'P00') return null;
  const now = ctx.now ?? state.lastTickAt;
  const c = (id: string) => state.cleared.includes(id);
  const stones = state.summonStones >= BALANCE.summon.cost;

  const atMap = (id: string, ask: string, press: string): Guide =>
    ctx.tab !== 'map'
      ? { text: '🗺탐험 탭으로 돌아가자!', target: { kind: 'tab', tab: 'map' } }
      : ctx.selected === id
        ? { text: press, target: { kind: 'tileAction' } }
        : { text: ask, target: { kind: 'tile', id } };

  const toSummon = (el: Element, why: string): Guide =>
    ctx.tab !== 'summon' ? { text: `${why} ✨소환 탭으로!`, target: { kind: 'tab', tab: 'summon' } } : { text: `${why} 이 제단에서 [소환]!`, target: { kind: 'altar', element: el } };

  /** 편성 교체: 칸을 눌러 [✨상성 추천 편성] */
  const swapIn = (tileId: string, text: string): Guide =>
    ctx.tab !== 'map'
      ? { text: `${josa(TILE_BY_ID[tileId].name, '을', '를')} 눌러 출전 동료를 바꾸자. 🗺탐험으로!`, target: { kind: 'tab', tab: 'map' } }
      : ctx.selected !== tileId
        ? { text: `${josa(TILE_BY_ID[tileId].name, '을', '를')} 눌러 봐.`, target: { kind: 'tile', id: tileId } }
        : { text, target: { kind: 'suggest' } };

  /** 전투력이 모자랄 때: 골드가 있으면 레벨업, 없으면 이미 이긴 칸에서 골드 벌기 */
  const strengthen = (tileId: string, lead: string): Guide => {
    const enc = TILE_BY_ID[tileId].encounterId!;
    const goal = recommendedPower(enc);
    const eff = effectivePower(state, enc);
    if (eff >= goal) return atMap(tileId, `${POWER}${eff} / 권장 ${goal}. 이제 충분해! ${TILE_BY_ID[tileId].name} 재도전!`, '[전투 시작]!');
    if (affordableLevelUps(state) > 0) {
      if (ctx.tab !== 'spirit') return { text: `${lead} ${GOLD}골드로 레벨업하자! 🐾스피릿 탭으로. (목표 ${POWER}${goal}, 지금 ${eff})`, target: { kind: 'tab', tab: 'spirit' } };
      return { text: `[모두 레벨업]을 눌러! 레벨이 오르면 체력·공격·방어가 모두 올라. ${POWER}${eff} / 목표 ${goal}`, target: { kind: 'levelUp' } };
    }
    const atCap = Object.keys(state.formation).every((id) => state.spirits[id].level >= levelCap(state.spirits[id]));
    if (atCap) return { text: `출전 동료가 모두 최대 레벨이야. 진화하거나 상성이 맞는 동료로 바꿔야 해.`, target: null };
    const farm = bestFarmTile(state, now);
    if (!farm) return { text: `골드가 모자라! 이긴 칸은 ⏳쿨타임(튜토리얼 1분)이 지나면 몬스터가 다시 나타나. 잠깐 기다렸다가 다시 싸워서 골드를 벌자. ${TUTORIAL_PATH.includes('b1') && c('b1') ? '🏕캠프 자동 사냥 보상도 받아 둬!' : ''}`, target: null };
    const fenc = ENCOUNTERS[TILE_BY_ID[farm].encounterId!];
    const gain = fenc.enemies.reduce((a, e) => a + Math.round(ENEMIES[e.enemyId].gold * (1 + BALANCE.enemy.goldPerLevel * (e.level - 1))), 0);
    const need = Object.keys(state.formation).map((id) => levelUpCost(state.spirits[id].level)).sort((a, b) => a - b)[0];
    return atMap(
      farm,
      `골드 벌러 가자! 레벨업에 ${GOLD}${need}이 필요한데 ${state.gold}뿐이야. 이미 이긴 칸은 다시 싸울 수 있어. ▼${TILE_BY_ID[farm].name}에서 ${GOLD}약 ${gain}!`,
      `[다시 싸우기]! 이긴 칸은 ⏳쿨타임 뒤 몬스터가 다시 나타나.`,
    );
  };

  const next = TUTORIAL_PATH.find((id) => !c(id));
  if (!next)
    return {
      text: '튜토리얼 끝! 막히면 ① 레벨업 ② 골드 벌기(다시 싸우기·자동 사냥) ③ 속성 상성 ④ 물리/마법 ⑤ 진화를 떠올려 봐. 이제 맨 위 길로 본편 P01(스테이지 100개)에 가자!',
      target: null,
      finish: true,
    };
  const tried = !!state.attempts[next] || !!state.bossAttempts[next];

  // 고목 골렘을 넘으면: 캠프 자동 사냥 소개 (한 번)
  if (c('b1') && !tut.campTip) return { text: '골렘을 넘었더니 🏕캠프 자동 사냥이 열렸어! 게임을 꺼 둬도 동료들이 골드를 모아 와. 한번 가 보자.', target: { kind: 'tab', tab: 'camp' } };

  if (tried) {
    switch (next) {
      case 'a3':
        return strengthen('a3', '졌지만 괜찮아! 적이 우리보다 강하면');
      case 'a7':
        return strengthen('a7', '가시 덤불은 아직 버거워.');
      case 'b1': {
        if (!state.spirits.igni) {
          if (stones) return toSummon('fire', '골렘은 🌿숲! 🌿숲에 강한 건 🔥불이야. 🔥불의 제단에서 엠버윙을 부르자.');
          return strengthen('b1', '상성이 안 맞으면 힘으로 버텨야 해.');
        }
        if (state.formation.igni === undefined) return swapIn('b1', '🔥엠버윙이 ▲유리! [✨상성 추천 편성]을 눌러 출전시켜.');
        return atMap('b1', '🔥엠버윙과 함께 고목 골렘 재도전!', '[보스 도전]! 주황색 "유리!" 큰 숫자를 잘 봐.');
      }
      case 'c2': {
        const phys = ['rocky', 'galewing'].find((id) => state.spirits[id]);
        if (!phys) {
          if (stones) return toSummon('earth', '물안개 여우는 마법 방어가 높아. ⛰️락터스크는 물리 공격수야!');
          return strengthen('c2', '물리 공격 동료가 없으면');
        }
        if (state.formation[phys] === undefined) return swapIn('c2', `출전은 3명뿐! 🔥엠버윙은 ✨마법이라 막혀. ${SPIRITS[phys].stages?.[0]}(⚔️물리)로 바꾸자. [✨상성 추천 편성]!`);
        return strengthen('c2', '물리 공격수가 출전했어.');
      }
      case 'b2': {
        const id = evolveTarget(state);
        const sp = state.spirits[id];
        const name = SPIRITS[id].stages?.[sp.stage - 1] ?? SPIRITS[id].name;
        if (sp.stage === 1) {
          if (sp.copies < 1) {
            if (stones) return toSummon(SPIRITS[id].element, `진화하려면 같은 ${josa(name, '이', '가')} 한 장 더 필요해. ${SPIRITS[id].element === 'earth' ? '⛰️대지' : '같은 속성'} 제단에서 한 번 더 소환!`);
            return strengthen('b2', '진화 재료가 없어.');
          }
          if (sp.level < BALANCE.evolution.levelCap[0]) {
            if (state.gold < levelUpCost(sp.level)) {
              const farm = bestFarmTile(state, now);
              if (!farm) return { text: `${josa(name, '을', '를')} Lv.${BALANCE.evolution.levelCap[0]}까지 올릴 골드가 모자라. ⏳잠깐 기다렸다가 이긴 칸에서 다시 싸우자. 🏕자동 사냥 보상도 받아!`, target: null };
              return atMap(farm, `${josa(name, '을', '를')} Lv.${BALANCE.evolution.levelCap[0]}까지 올릴 골드를 벌자! ▼${TILE_BY_ID[farm].name}에서 다시 싸우기.`, '[다시 싸우기]!');
            }
            if (ctx.tab !== 'spirit') return { text: `진화 조건: Lv.${BALANCE.evolution.levelCap[0]} + 같은 스피릿 1장. ${josa(name, '을', '를')} Lv.${BALANCE.evolution.levelCap[0]}까지 올리자! 🐾스피릿 탭으로.`, target: { kind: 'tab', tab: 'spirit' } };
            return { text: `${name} 카드에서 [▲ 레벨업]! Lv.${sp.level} → ${BALANCE.evolution.levelCap[0]}`, target: { kind: 'evolve', id } };
          }
          if (ctx.tab !== 'spirit') return { text: `${name} 진화 준비 완료! 🐾스피릿 탭으로.`, target: { kind: 'tab', tab: 'spirit' } };
          return { text: `[✨ 진화]를 눌러! 모습이 바뀌고 능력치 ×1.15, 최대 레벨이 25로 늘어나.`, target: { kind: 'evolve', id } };
        }
        if (state.formation[id] === undefined) return swapIn('b2', `진화한 ${josa(name, '을', '를')} 출전시키자. [✨상성 추천 편성]!`);
        return strengthen('b2', `${name} 진화 완료! 최대 레벨이 늘었으니`);
      }
      default:
        return strengthen(next, '조금 더 강해지자.');
    }
  }

  const lines: Record<string, [string, string]> = {
    a1: ['나는 모험가 아렌. 숲 꼭대기까지 올라가는 게 목표야! 싸움은 동료 💧쉘나이트와 🌿블루멜이 알아서 해. 바로 위 칸(▼)을 눌러!', '적의 배치와 내 편성이 보이지? [전투 시작]!'],
    a2: ['이겼다! 이기면 골드를 얻고 위쪽 길이 열려. 버섯 수풀에 보물이 있어.', '[상자 열기]!'],
    a3: ['다음은 어린 바위엄니. 칸 위 숫자가 빨갛지? 권장 전투력보다 약하다는 뜻이야. 그래도 한번 부딪혀 보자!', '[전투 시작]! 져도 괜찮아.'],
    a4: ['레벨업하니 강해졌지? 다음은 💧물 속성 아기 여우. 칸마다 적의 속성이 달라.', '[전투 시작]!'],
    a5: ['🔥불 속성 불씨 둥지! 우리 쉘나이트는 💧물이야. 물은 불에 강해!', '[전투 시작]! 주황색 "유리!" 숫자를 봐.'],
    a6: ['이번엔 🌪️바람 늑대가 있어. 💧물은 🌪️바람에 약해서 쉘나이트 공격이 약해져.', '[전투 시작]! 회색 "불리" 숫자를 봐.'],
    a7: ['가시 덤불은 꽤 강해. 일단 도전해 보자!', '[전투 시작]!'],
    a8: ['반짝이는 🔮결정! 소환에 쓰는 돌이야. 주우면 ✨소환이 열려.', '[결정 줍기]!'],
    b1: ['숲의 보스 고목 골렘(🌿숲)! 소환은 잠깐 참고, 먼저 부딪혀서 어떤 상대인지 보자.', '[보스 도전]! 져도 괜찮아.'],
    c1: ['버려진 야영지에 누군가 🔮결정을 두고 갔어! 챙겨 두자. (아직 쓰지 마!)', '[결정 줍기]!'],
    c2: ['물안개 여울(💧물)이야. 상성은 배웠지? 그런데 여기엔 다른 비밀이 있어. 일단 도전!', '[전투 시작]!'],
    c3: ['물리와 마법까지 배웠어! 바위엄니 떼로 연습해 보자. 칸을 누르면 ▲▼(속성)·⚔️✨(물리/마법)가 보여.', '[전투 시작]!'],
    c4: ['진화의 결정! 이것도 아껴 둬. 먼저 바위엄니 대장을 보자.', '[결정 줍기]!'],
    b2: ['튜토리얼 마지막 보스, 바위엄니 대장! 지금 힘으로 될까? 부딪혀 보자.', '[보스 도전]! 져도 괜찮아.'],
  };
  const pair = lines[next] ?? [`▼ ${TILE_BY_ID[next].name}`, '버튼을 눌러!'];
  return atMap(next, pair[0], pair[1]);
}

export function GuideBar({ guide, onFinish, onSkip, over }: { guide: Guide; onFinish: () => void; onSkip: () => void; over?: boolean }) {
  return (
    <div className={`guide ${over ? 'over' : ''}`}>
      <img className="guide-face" src={asset('hero-p')} alt="아렌" />
      <div className="guide-body">
        <div className="guide-text">{guide.text}</div>
        <div className="guide-actions">
          {guide.finish ? (
            <button className="cta small-cta" onClick={onFinish}>
              알겠어!
            </button>
          ) : (
            <button className="link" onClick={onSkip}>
              튜토리얼 건너뛰기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Intro({ hasProgress, onStart, onContinue, onClose }: { hasProgress: boolean; onStart: () => void; onContinue?: () => void; onClose?: () => void }) {
  return (
    <div className="screen intro">
      <img className="intro-hero" src={asset('hero-t')} alt="" />
      <div className="intro-logo">
        HEXA <span>FRONTIER</span>
      </div>
      <div className="intro-sub">작은 헥사, 넓은 세계</div>
      <ol className="intro-steps">
        <li>
          <span>🗺</span>
          <div>
            <b>위로 올라가며 탐험</b>
            <p>칸을 누르면 동료 스피릿이 자동으로 싸워요. 이기면 골드를 얻고 길이 열려요.</p>
          </div>
        </li>
        <li>
          <span>✨</span>
          <div>
            <b>소환과 속성 조합</b>
            <p>🔮결정으로 원하는 속성의 스피릿을 소환해요. 💧물→🔥불→🌿숲→⛰️대지→🌪️바람→💧물, 상성이 맞으면 피해 1.3배!</p>
          </div>
        </li>
        <li>
          <span>👑</span>
          <div>
            <b>강해져서 보스 돌파</b>
            <p>골드로 레벨업하면 {POWER}전투력이 올라요. 같은 스피릿을 또 소환해 진화하면 최대 레벨이 늘어나요. 물리·마법 상성도 있어요! 튜토리얼(P00) 다음엔 P01-001~P01-100.</p>
          </div>
        </li>
      </ol>
      {onClose ? (
        <button className="cta" onClick={onClose}>
          닫기
        </button>
      ) : (
        <>
          <button className="cta" onClick={onStart}>
            {hasProgress ? '처음부터 시작' : '모험 시작'}
          </button>
          {hasProgress && onContinue && (
            <button className="ghost" onClick={onContinue}>
              이어서 하기
            </button>
          )}
        </>
      )}
    </div>
  );
}
