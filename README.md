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
| `npm test` | 코어 로직·튜토리얼 테스트 34개 (Vitest) |
| `npm run typecheck` | 타입 검사 |
| `npm run build` | 타입 검사 + 배포용 빌드 |
| `npm run sim:onboarding` | 첫 보스(고목 수호자) 온보딩 결과를 시드 10개로 확인 |
| `npm run sim:tune` | 파티 레벨·승급별 보스/일반 전투 승률표 |
| `npm run sim:boss` | 봇이 전투력만 보고 플레이할 때 보스까지 걸리는 전투 수·시간 |
| `npm run sim:power` | 권장 전투력 표(`src/data/recommended.ts`) 재생성 — 밸런스 수정 후 실행 |

## 플레이 방법 (스마트폰 세로)

- **🗺 탐험:** 바로 위의 빛나는 칸을 누르면 바텀 시트가 열립니다(적 그림, 내 전투력 vs 권장 전투력, 보상). **전투 시작** → 동료 스피릿이 자동으로 싸웁니다. 이기면 골드를 얻고 위쪽 길이 열립니다.
- **⬆ 강화:** 골드로 **▲ 레벨업** → 전투력 상승. **Lv.10·25에 진화**해 그림과 이름이 바뀝니다. 성장석으로 승급(능력치 +12%). *첫 보스에 도전한 뒤 열립니다.*
- **🏕 자동 사냥:** 게임을 꺼 둬도 골드가 쌓입니다(최대 12시간). *첫 보스를 쓰러뜨리면 열립니다.*
- **튜토리얼:** 모험가 아렌이 한 줄 길을 따라 안내합니다. 첫 보스에서 지는 것이 정상이며, 강화로 돌파하는 법을 배웁니다. 이후 길이 여러 갈래로 열립니다.
- 칸 위 숫자 = 권장 전투력 (초록 쉬움 / 노랑 적정 / 빨강 위험), 💀정예 = 어렵지만 성장석, 보물 = 상자.
- ⚙: 개발 도구(+1/+8시간, 골드 +1000, 새 게임)

### 이미지
원본 시트(`../hexafrontier/*.png`)에서 `python3 tools/extract_assets.py`로 잘라 `public/assets/`에 저장합니다. 원본은 수정하지 않습니다.

### 배포
`main`에 push하면 GitHub Actions가 테스트·빌드 후 GitHub Pages에 올립니다(`.github/workflows/deploy.yml`).

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
