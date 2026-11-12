// 튜토리얼: 모험가 '아렌'이 단계별로 안내한다. 단계는 게임 상태에서 계산한다.
// 핵심 흐름(D47): 시작 팀(💧+🌿)으로 첫 보스(🌿)에 반드시 진다 → 소환으로 🔥불 스피릿 → 배치 → 승리.
import { objectiveTile, TUTORIAL_PATH, type GameState } from '../core/game';
import { recommendedPower, teamPower } from '../core/power';
import type { Element } from '../core/types';
import { BALANCE } from '../data/balance';
import { TILE_BY_ID } from '../data/map';
import { asset, GOLD, POWER } from './art';

export type Tab = 'map' | 'spirit' | 'summon' | 'camp';
export type GuideTarget =
  | { kind: 'tile'; id: string }
  | { kind: 'tileAction' }
  | { kind: 'tab'; tab: Tab }
  | { kind: 'altar'; element: Element }
  | { kind: 'levelUp' }
  | null;

export interface Guide {
  text: string;
  target: GuideTarget;
  finish?: boolean;
}

export function computeGuide(state: GameState, ctx: { selected: string | null; tab: Tab }): Guide | null {
  const tut = state.tutorial;
  if (!tut.introSeen || tut.done) return null;
  const c = (id: string) => state.cleared.includes(id);

  if (c('b1')) {
    return {
      text: '해냈어! 상성 맞는 동료 하나가 판을 바꿨지? 이제 길이 여러 갈래야. 칸을 누르면 적 속성과 동료별 ▲유리/▼불리가 보여. 🔮결정을 모아 소환하고, 🐾스피릿 탭에서 배치·레벨업, 🏕캠프의 자동 사냥도 열렸어!',
      target: null,
      finish: true,
    };
  }

  // 첫 보스에 진 뒤
  if (state.bossAttempts['b1']) {
    const fireOwned = !!state.spirits.igni;
    const fireDeployed = state.formation.igni !== undefined;
    if (!fireOwned && state.summonStones >= BALANCE.summon.cost) {
      if (ctx.tab !== 'summon')
        return { text: '골렘은 🌿숲 속성이야. 우리 팀(💧물·🌿숲)은 골렘에게 강하지 않아서 아무리 버텨도 못 이겨. 🌿숲에 강한 건 🔥불! 새로 열린 ✨소환 탭으로 가자.', target: { kind: 'tab', tab: 'summon' } };
      return { text: '아까 주운 🔮결정으로 🔥불의 제단에서 [소환]을 눌러!', target: { kind: 'altar', element: 'fire' } };
    }
    if (fireOwned && !fireDeployed) {
      if (ctx.tab !== 'spirit') return { text: '엠버윙을 출전시켜야 해. 🐾스피릿 탭으로!', target: { kind: 'tab', tab: 'spirit' } };
      return { text: '아래 엠버윙 칩을 누르고, 배치판의 빈 칸(후열 추천)을 눌러 출전시켜!', target: null };
    }
    if (!fireOwned) {
      // 다른 속성을 골랐다면: 레벨업으로 보완
      const goal = recommendedPower('boss_treant');
      const tp = teamPower(state);
      if (tp < goal) {
        if (ctx.tab !== 'spirit') return { text: `상성이 맞지 않으면 전투력으로 버텨야 해. 🐾스피릿 탭에서 레벨업하자! (목표 ${POWER}${goal})`, target: { kind: 'tab', tab: 'spirit' } };
        return { text: `${GOLD}골드로 [모두 레벨업]! 목표 ${POWER}${goal} (지금 ${tp})`, target: { kind: 'levelUp' } };
      }
    }
    if (ctx.tab !== 'map') return { text: fireOwned ? '🔥엠버윙이 출전했어! 🗺탐험으로 돌아가 골렘에 재도전!' : '준비됐어. 🗺탐험으로!', target: { kind: 'tab', tab: 'map' } };
    return ctx.selected === 'b1'
      ? { text: '[보스 도전]! 주황색 "유리!" 숫자를 잘 봐.', target: { kind: 'tileAction' } }
      : { text: '고목 골렘을 다시 눌러!', target: { kind: 'tile', id: 'b1' } };
  }

  const target = objectiveTile(state);
  if (!target || !TUTORIAL_PATH.includes(target)) return null;
  const tile = TILE_BY_ID[target];
  const lines: Record<string, [string, string]> = {
    a1: [
      '나는 모험가 아렌. 숲 꼭대기까지 올라가는 게 목표야! 싸움은 동료 💧쉘나이트와 🌿블루멜이 알아서 해. 바로 위 칸(▼)을 눌러!',
      '적 정보와 내 전투력이 보이지? [전투 시작]!',
    ],
    a2: ['좋아! 이기면 위쪽 길이 열려. 다음은 💧물 속성 여우야. 칸마다 적 속성이 달라.', '[전투 시작]!'],
    a3: ['반짝이는 🔮결정이 있어! 소환에 쓰는 귀한 돌이야. 챙겨 두자.', '[결정 줍기]!'],
    s1: ['🌿숲 강아지 떼야. 우리 팀은 💧물·🌿숲이라 숲에 특별히 강하진 않아. 그래도 이 정도는 이겨!', '[전투 시작]!'],
    s2: ['보물 상자! 골드는 나중에 레벨업에 써.', '[상자 열기]!'],
    b1: ['숲의 보스, 고목 골렘(🌿숲)! 숫자가 빨갛지? 우리 팀으론 벅차. 그래도 한번 부딪혀 보자!', '[보스 도전]! 져도 괜찮아.'],
  };
  const pair = lines[target] ?? [`▼ ${tile.name}`, '버튼을 눌러!'];
  return ctx.selected === target ? { text: pair[1], target: { kind: 'tileAction' } } : { text: pair[0], target: { kind: 'tile', id: target } };
}

export function GuideBar({ guide, onFinish, onSkip }: { guide: Guide; onFinish: () => void; onSkip: () => void }) {
  return (
    <div className="guide">
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
            <p>레벨업하면 {POWER}전투력이 오르고, Lv.10에 진화해요. 숲 꼭대기의 테라스톤을 쓰러뜨리세요.</p>
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
