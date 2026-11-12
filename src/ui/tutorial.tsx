// 튜토리얼: 시작 화면 + 길잡이 '헥시'의 단계별 안내.
// 안내 단계는 게임 상태에서 계산한다 (어느 순서로 플레이해도 맞는 안내가 나오도록).
import { objectiveTile, type GameState } from '../core/game';
import { hexCorners } from '../core/hex';
import { TILE_BY_ID } from '../data/map';

export type GuideTarget = { kind: 'tile'; id: string } | { kind: 'tileAction' } | { kind: 'activityTab' } | { kind: 'trainingStart' } | null;

export interface Guide {
  text: string;
  target: GuideTarget;
  finish?: boolean;
}

export function computeGuide(state: GameState, ctx: { selected: string | null; tab: string }): Guide | null {
  const tut = state.tutorial;
  if (!tut.introSeen || tut.done) return null;
  const c = (id: string) => state.cleared.includes(id);

  // 고목 수호자 돌파 후: 훈련 맡겨 보기 → 마무리
  if (c('b1')) {
    if (state.activities.some((a) => a.type === 'training')) {
      return {
        text:
          '이게 이 게임의 전부야! ① 칸을 넓히며 싸우고 ② 보스에 막히면 패배 화면을 보고 ③ 파밍·승급·훈련·휴식으로 강해져서 다시 도전해. 다음 목표는 이 숲의 주인 "바위 거인 몽돌"이야. 훈련은 1시간 뒤에 끝나니까 그동안 계속 탐험해!',
        target: null,
        finish: true,
      };
    }
    if (ctx.tab !== 'activity') {
      return { text: '돌파 성공! 🎉 막혀도 이렇게 강해지면 넘을 수 있어. 이제 "떠나 있는 동안에도 강해지는" 훈련장이 열렸어. 오른쪽(또는 아래)의 [활동] 탭을 눌러 봐.', target: { kind: 'activityTab' } };
    }
    return { text: '훈련장에서 스피릿 하나를 고르고 [시작]을 눌러. 1시간 뒤 경험치를 받을 수 있어. 훈련 중인 스피릿만 빠지고, 나머지는 계속 싸울 수 있어.', target: { kind: 'trainingStart' } };
  }

  const target = objectiveTile(state);
  if (!target) return null;
  const tile = TILE_BY_ID[target];
  const selected = ctx.selected === target;
  const pressText = (label: string) => `좋아! 카드의 [${label}] 버튼을 눌러.`;

  const lines: Record<string, [string, string]> = {
    a1: [
      '안녕, 나는 길잡이 헥시야! 이 게임에선 네가 직접 싸우지 않아. 모은 스피릿 동료들이 알아서 싸워 줘. 먼저 지도에서 ▼ 표시된 "슬라임 무리" 칸을 눌러 봐.',
      '어떤 적이 있는지 보이지? [전투 시작]을 누르면 타이드쉘이 혼자서도 알아서 싸워. 지켜보기만 하면 돼!',
    ],
    a2: ['잘했어! 칸을 이기면 그 옆 칸들이 열려. 이번엔 ▼ "불씨 바위"야. 새 동료의 기척이 느껴져.', pressText('탐험')],
    a3: ['동료가 둘이 됐어! 편성된 스피릿은 모두 함께 출전해. ▼ "수호자의 앞뜰"에서 싸워 보자.', pressText('전투 시작')],
    b1: state.bossAttempts['b1']
      ? ['이제 셋이야. 회복 담당이 생겼으니 ▼ 고목 수호자에게 다시 도전하자!', pressText('보스 도전')]
      : [
          '여기가 이 숲의 첫 보스 ▼ "고목 수호자"야. 솔직히 지금은 질 수도 있어. 괜찮아, 지면 왜 졌는지 알려 줄게. 도전해 봐!',
          pressText('보스 도전'),
        ],
    s1: ['패배 화면에서 봤지? 회복 담당이 없었어. 남서쪽 ▼ "멧돼지 굴"을 지나면 치유사가 있대. 멧돼지 굴부터 가자.', pressText('전투 시작')],
    s2: ['저 너머 ▼ "이끼 요정의 샘"에 치유사 실피가 있어. 만나러 가자!', pressText('탐험')],
  };
  const pair = lines[target] ?? [`▼ "${tile.name}"(으)로 가 보자.`, pressText('진행')];
  return selected ? { text: pair[1], target: { kind: 'tileAction' } } : { text: pair[0], target: { kind: 'tile', id: target } };
}

export function GuideBubble({ guide, onFinish, onSkip }: { guide: Guide; onFinish: () => void; onSkip: () => void }) {
  return (
    <div className="guide">
      <svg width={44} height={44} viewBox="0 0 44 44" className="guide-face">
        <polygon points={hexCorners(22, 22, 20)} fill="#6fdc8c33" stroke="#6fdc8c" strokeWidth={2} />
        <circle cx={16} cy={20} r={2.6} fill="#6fdc8c" />
        <circle cx={28} cy={20} r={2.6} fill="#6fdc8c" />
        <path d="M15 27 Q22 32 29 27" stroke="#6fdc8c" strokeWidth={2} fill="none" />
      </svg>
      <div className="guide-body">
        <div className="guide-name">길잡이 헥시</div>
        <div className="guide-text">{guide.text}</div>
        <div className="guide-actions">
          {guide.finish ? (
            <button className="primary" onClick={onFinish}>
              알겠어! 혼자 해 볼게
            </button>
          ) : (
            <button className="ghost small" onClick={onSkip}>
              튜토리얼 건너뛰기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function IntroModal({
  hasProgress,
  onTutorial,
  onContinue,
  onSkipTutorial,
  isHelp,
  onClose,
}: {
  hasProgress: boolean;
  onTutorial: () => void;
  onContinue: () => void;
  onSkipTutorial: () => void;
  isHelp?: boolean;
  onClose?: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <div className="intro">
        <div className="logo big">
          HEXA <span>FRONTIER</span>
        </div>
        <h2>이 게임에서 당신이 하는 일</h2>
        <ol className="intro-steps">
          <li>
            <span className="ico">🗺</span>
            <div>
              <b>헥사 지도를 넓힌다</b>
              <p>빛나는 칸을 눌러 탐험하고, 새 동료(스피릿)와 자원을 찾습니다.</p>
            </div>
          </li>
          <li>
            <span className="ico">⚔</span>
            <div>
              <b>스피릿이 자동으로 싸운다</b>
              <p>당신은 직접 싸우지 않습니다. 동료를 모으고, 배치하고, 키우는 것이 당신의 일입니다.</p>
            </div>
          </li>
          <li>
            <span className="ico">☠</span>
            <div>
              <b>보스에 막히면, 강해져서 돌파한다</b>
              <p>지면 패배 화면이 원인과 해결책을 알려 줍니다. 파밍·승급·훈련·휴식으로 강해진 뒤 다시 도전하세요.</p>
            </div>
          </li>
        </ol>
        <div className="intro-actions">
          {isHelp ? (
            <button className="primary" onClick={onClose}>
              닫기
            </button>
          ) : hasProgress ? (
            <>
              <button className="primary" onClick={onTutorial}>
                처음부터 배우기 (추천)
              </button>
              <button onClick={onContinue}>지금 저장으로 계속하기</button>
            </>
          ) : (
            <>
              <button className="primary" onClick={onTutorial}>
                길잡이와 함께 시작하기
              </button>
              <button className="ghost small" onClick={onSkipTutorial}>
                튜토리얼 없이 시작
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
