// 튜토리얼: 모험가 '아렌'이 한 줄 길을 따라 단계별로 안내한다.
// 단계는 게임 상태에서 계산 → 어떤 순서로 눌러도 맞는 안내가 나온다.
import { objectiveTile, TUTORIAL_PATH, type GameState } from '../core/game';
import { recommendedPower, teamPower } from '../core/power';
import { TILE_BY_ID } from '../data/map';
import { asset, GOLD, POWER } from './art';

export type Tab = 'map' | 'upgrade' | 'idle';
export type GuideTarget = { kind: 'tile'; id: string } | { kind: 'tileAction' } | { kind: 'tab'; tab: Tab } | { kind: 'levelUp' } | null;

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
      text: '해냈어! 이제 숲이 여러 갈래로 열렸어. 칸 위 숫자가 초록이면 쉬움, 빨강이면 위험. 💀정예 칸은 어렵지만 💎성장석을 줘. 아래 [자동 사냥]도 열렸어. 게임을 꺼 둬도 골드가 쌓여!',
      target: null,
      finish: true,
    };
  }

  // 첫 보스에 진 뒤: 강화 탭 → 레벨업 → 지도로 → 재도전
  if (state.bossAttempts['b1']) {
    const goal = recommendedPower('boss_treant');
    const tp = teamPower(state);
    if (tp < goal) {
      if (ctx.tab !== 'upgrade') return { text: `골렘이 너무 강했어. 새 기능 [강화]가 열렸어! 아래 ⬆강화 탭을 눌러 봐.`, target: { kind: 'tab', tab: 'upgrade' } };
      return {
        text: `지금까지 모은 ${GOLD}골드로 [▲ 레벨업]을 눌러! 누를 때마다 ${POWER}전투력이 올라가. 목표 ${POWER}${goal} (지금 ${tp})`,
        target: { kind: 'levelUp' },
      };
    }
    if (ctx.tab !== 'map') return { text: `${POWER}${tp}! 골렘의 권장 전투력 ${goal}을 넘었어. 아래 🗺탐험 탭으로 돌아가자.`, target: { kind: 'tab', tab: 'map' } };
    return ctx.selected === 'b1'
      ? { text: '이번엔 이길 수 있어. [보스 도전]!', target: { kind: 'tileAction' } }
      : { text: '고목 골렘을 다시 눌러 재도전하자!', target: { kind: 'tile', id: 'b1' } };
  }

  const target = objectiveTile(state);
  if (!target || !TUTORIAL_PATH.includes(target)) return null;
  const tile = TILE_BY_ID[target];
  const lines: Record<string, [string, string]> = {
    a1: [
      '나는 모험가 아렌. 이 숲 꼭대기까지 올라가는 게 목표야! 싸움은 동료 스피릿이 알아서 해. 바로 위 칸(▼)을 눌러 봐.',
      '적이 보이지? 숫자는 권장 전투력이야. 내 전투력이 비슷하면 이겨. [전투 시작]!',
    ],
    a2: ['이겼어! 이기면 위쪽 길이 열려. ✦동료 표시가 보이지? 눌러서 새 동료를 만나자.', '[동료 만나기]를 눌러!'],
    a3: ['동료가 둘! 같이 싸우니 전투력이 확 올랐어. 계속 위로!', '[전투 시작]!'],
    s1: ['좋아, 골드도 쌓이고 있어(위쪽 🪙). 다음 칸도 가 보자.', '[전투 시작]!'],
    s2: ['저기 치유사가 있어! 다친 동료를 회복시켜 줘.', '[동료 만나기]를 눌러!'],
    b1: [
      '숲을 지키는 보스, 고목 골렘이야. 숫자가 빨갛지? 우리보다 강하다는 뜻이야. 그래도 한번 부딪혀 보자!',
      '[보스 도전]! 져도 괜찮아.',
    ],
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
          <span>⬆</span>
          <div>
            <b>골드로 강화</b>
            <p>레벨업하면 {POWER}전투력이 올라가고, Lv.10에 스피릿이 진화해요.</p>
          </div>
        </li>
        <li>
          <span>👑</span>
          <div>
            <b>보스 돌파</b>
            <p>막히면 강해져서 다시! 숲 꼭대기의 테라스톤을 쓰러뜨리세요.</p>
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
