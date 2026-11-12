// 모든 밸런스 수치는 여기서 조정한다 (기획서 15장: 코드 수정 없이 조정).
// [결정] = 결정 로그 확정값, [가설] = 시뮬레이션으로 조정할 값.

export const BALANCE = {
  battle: {
    tick: 0.1, // 초
    maxTime: 90, // [가설] 전투 제한 시간
    gaugeMax: 100, // 행동 게이지: 매 틱 spd*tick 만큼 차고 100에서 행동
    energyOnBasic: 12,
    energyOnActive: 20,
    energyOnHit: 4,
    variance: 0.05, // ±5%
    defK: 60, // 피해 = 공격 × 계수 × defK/(defK+방어)
  },
  element: {
    // [결정 D14] 물>불>숲>대지>전기>물
    cycle: ['water', 'fire', 'forest', 'earth', 'electric'] as const,
    advantage: 1.3, // [결정 D15]
    disadvantage: 0.75, // [결정 D15]
    synergyAtk: 0.08, // [가설] 상생 인접 아군 공격 +8%
  },
  rows: {
    // [결정 D12]
    frontDamageTaken: 0.9,
    midSupportBonus: 0.1,
    backRangedBonus: 0.1,
    roleMatchBonus: 0.1,
  },
  growth: {
    maxLevel: 30, // [가설]
    // 골드로 레벨업 (D32): L→L+1 비용 = levelCostBase × levelCostGrowth^(L-1)
    levelCostBase: 20,
    levelCostGrowth: 1.3,
    joinLevelRatio: 0.8, // 새 동료는 최고 레벨의 80%로 합류
    battleXp: false, // 전투 경험치 (D32에서 끔)
    statPerLevel: 0.09, // [가설] 레벨당 +9%
    statPerRank: 0.12, // [가설] 승급당 +12%
    maxRank: 5,
    // 승급 비용 [가설]: rank -> 다음 rank
    rankCost: [
      { stones: 5, gold: 150, minLevel: 4 },
      { stones: 12, gold: 400, minLevel: 8 },
      { stones: 25, gold: 900, minLevel: 12 },
      { stones: 45, gold: 1800, minLevel: 18 },
      { stones: 70, gold: 3200, minLevel: 24 },
    ],
    // E+F [결정 D25]
    catchUpRatio: 0.8,
    catchUpMultiplier: 3,
    catchUpMinGap: 3, // [가설]
    mentorLevel: 20,
    mentorBonus: 0.3,
    bonusCap: 3.5,
  },
  enemy: {
    statPerLevel: 0.1,
    xpPerLevel: 0.12, // [가설] 적 레벨당 경험치 +12%
    goldPerLevel: 0.15,
    stoneChanceMul: 1.5,
  },
  condition: {
    // P0 단순화(D32): 컨디션·경상 효과를 끔. 켜려면 true.
    enabled: false,
    // [결정 D20] 개인 단위
    lossNormal: -5,
    lossBoss: -8,
    lowHp: -3, // 패배 시에만
    ko: -10,
    perBattleCap: -15,
    tiers: [
      { min: 80, label: '최상', mul: 1.0 },
      { min: 60, label: '양호', mul: 0.97 },
      { min: 40, label: '피로', mul: 0.93 },
      { min: 20, label: '지침', mul: 0.87 },
      { min: 0, label: '탈진', mul: 0.8 },
    ],
    naturalPerHour: 5, // [가설]
    restPerHour: 15, // [가설]
    injuryChanceOnKo: 0.25, // [가설]
    injuryAtkPenalty: 0.05,
    injuryNaturalHours: 6, // [결정 D26]
    injuryRestHours: 2, // [결정 D26]
    clinicGold: 120, // [가설]
  },
  activity: {
    trainingHours: 1,
    gatheringHours: 2,
    slots: { training: 2, gathering: 2, rest: 3 }, // [결정 D22]
    // 1시간 훈련 XP = 기준 XP × 레벨 계수 [가설]
    trainingXpBase: 60,
    trainingXpPerLevel: 30,
    // 2시간 채집 보상 [가설]
    gatheringReward: { stones: 10, gold: 300 },
  },
  idle: {
    // [결정 D21] 최대 12시간. 시간당 골드 = goldPerHour + goldPerClearedTile × 클리어한 칸 수
    capHours: 12,
    goldPerHour: 40,
    goldPerClearedTile: 12,
    stonesPerHour: 0.5,
  },
  power: {
    easyAt: 1.15,
    fairAt: 0.95,
  },
  deploy: {
    initialMax: 3, // [결정 D11]
  },
  time: {
    rollbackToleranceMs: 5 * 60_000,
  },
} as const;

export type Balance = typeof BALANCE;
