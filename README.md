# HEXA FRONTIER v2 — P0 프로토타입

> 헥사 지도를 넓혀 가며 스피릿을 모으고 키우다 보스에 막히면, **지금 더 놀거나 / 1~2시간 훈련·채집을 맡기거나 / 쉬게 해서** 돌파하는 자동전투 RPG.

P0의 목적은 기획서 11장 그대로 **"막힘 → 성장 → 돌파"의 재미 검증**입니다. 그래픽은 임시 도형입니다(D4).

## 실행

```bash
npm install
npm run dev        # http://localhost:5181
```

| 명령 | 내용 |
|---|---|
| `npm run dev` | 개발 서버 (Vite) |
| `npm test` | 코어 로직·튜토리얼·RPG 테스트 61개 (Vitest) |
| `npm run typecheck` | 타입 검사 |
| `npm run build` | 타입 검사 + 배포용 빌드 |
| `npx tsx sim/rpg-bot.ts` | RPG 밸런스 봇: 사냥·스피릿·장비·캐릭터 교체로 보스 4마리까지 걸리는 턴·사망 |
| `npm run sim:tutorial` | 봇이 아렌의 안내만 따라 P00 튜토리얼을 끝까지 진행 (패배 칸·골드 벌기 횟수·시간) |
| `npx tsx sim/p00-minlv.ts <전투> <편성> <적레벨…>` | 튜토리얼 칸 조정용: 적 레벨별 '이기는 최소 레벨' |
| `npm run sim:tune` | 파티 레벨·승급별 보스/일반 전투 승률표 |
| `npm run sim:boss` | 봇이 전투력만 보고 플레이할 때 보스까지 걸리는 전투 수·시간 |
| `npm run sim:power` | 권장 전투력 표(`src/data/recommended.ts`) 재생성 — 밸런스 수정 후 실행 |

## 플레이 방법 (스마트폰 세로)

헥사 들판 사냥 RPG(D72~): 화면 아래 **헥사 방향키**로 한 칸씩 움직이고(PC: Q·E·A·D·Z·C, 숫자 1~3 기술, 스페이스 쉬기), 몬스터 칸으로 가면 공격, 오른쪽 **기술 버튼**으로 원거리·범위 공격. 몬스터를 잡아 레벨업·장비를 얻고, 지도의 제단에서 **5속성 스피릿**을 모아 포인트로 원하는 속성을 키운다. 상성이 안 맞으면 🏕야영지에서 **검사·마법사·궁수**를 바꿔 키운다. 목표는 맨 위 폭풍 언덕의 보스.

## 폴더 구조

```
src/core/   순수 게임 로직 (DOM 의존 없음, 테스트·시뮬레이터 공용)
  battle.ts     결정론적 자동전투 시뮬레이터
  analysis.ts   패배 원인 분석 (반사실 재시뮬레이션)
  game.ts       게임 상태·탐험·보상·활동·방치 보상·목표 안내
  growth.ts     레벨/승급/E+F 성장 보호
  condition.ts  컨디션 B안
  board.ts      편성판(육각 9칸)·속성 상성/상생
  clock.ts      시간 추상화 (DevClock/ManualClock) — 상용 단계에서 서버 시간으로 교체
  save.ts       버전 관리 저장
src/data/   밸런스 수치·스피릿·적·맵 (코드 수정 없이 조정)
src/ui/     React 화면
sim/        밸런스 시뮬레이션 스크립트
tests/      코어 테스트
docs/       기획서 원본, 결정 로그, P0 개발 보고서
```

## 문서
- [docs/P0_REPORT.md](docs/P0_REPORT.md) — P0 개발 보고서 (구현 내용, 시스템 설명, 밸런스 측정, 발견한 문제, 다음 단계)
- [docs/decisions.md](docs/decisions.md) — 결정 로그 D1~D28
- [docs/design-v2.0.md](docs/design-v2.0.md) — 기획서 v2.0 원본
