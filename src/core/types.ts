// 공통 타입 정의. 게임 코어는 DOM/렌더링에 의존하지 않는다.

export type Element = 'water' | 'fire' | 'forest' | 'earth' | 'electric';
export type Role = 'tank' | 'dealer' | 'support' | 'healer';
export type Range = 'melee' | 'ranged';
export type RowName = 'front' | 'mid' | 'back';

export interface Stats {
  hp: number;
  atk: number;
  def: number;
  spd: number;
}

export type TargetRule =
  | 'enemyDefault' // 근접: 가장 앞 열, 원거리: 아무나 (도발 우선)
  | 'enemyLowestHp'
  | 'enemyHighestAtk'
  | 'enemyAll'
  | 'allyLowestHp'
  | 'allyAll'
  | 'self';

export type SkillEffect =
  | { type: 'damage'; coef: number }
  | { type: 'heal'; coef: number }
  | { type: 'shield'; maxHpRatio: number; duration: number }
  | { type: 'taunt'; duration: number }
  | { type: 'buffAtk'; ratio: number; duration: number }
  | { type: 'debuffDef'; ratio: number; duration: number };

export type SkillCondition =
  | { type: 'none' }
  | { type: 'allyHpBelow'; ratio: number }
  | { type: 'enemiesAtLeast'; count: number }
  | { type: 'selfHpBelow'; ratio: number };

export interface SkillDef {
  id: string;
  name: string;
  kind: 'basic' | 'active' | 'ultimate';
  cooldown: number; // 초 (basic/ultimate는 0)
  target: TargetRule;
  effects: SkillEffect[];
  condition: SkillCondition;
  /** 플레이어에게 보여줄 설명 */
  desc: string;
}

export interface UnitDef {
  id: string;
  name: string;
  /** 이미지 키 (public/assets/{art}-p1~3.webp 초상, -t1~3.webp 헥스 스프라이트) */
  art: string;
  /** 진화 단계 이름 [Lv1~, Lv10~, Lv25~] */
  stages?: [string, string, string];
  /** 적: 항상 이 진화 단계 그림을 쓴다 (보스) */
  fixedStage?: 1 | 2 | 3;
  element: Element;
  role: Role;
  range: Range;
  base: Stats;
  skills: SkillDef[]; // [basic, active?, ultimate?]
}

export interface SpiritDef extends UnitDef {
  title: string;
}

export interface EnemyDef extends UnitDef {
  isBoss?: boolean;
  xp: number;
  gold: number;
  stoneChance: number; // 성장석 1개 드롭 확률
}

export interface EncounterEnemy {
  enemyId: string;
  level: number;
  slot: number; // 0~8
}

export interface Encounter {
  id: string;
  name: string;
  enemies: EncounterEnemy[];
  bossKind?: 'normal' | 'region';
  /** 첫 승리 시 출전 인원을 이 수로 늘린다 */
  unlockDeploy?: number;
  firstClear: { gold: number; stones: number; xp?: number; summon?: number };
}

export interface OwnedSpirit {
  defId: string;
  level: number;
  xp: number; // 현재 레벨에서 쌓인 경험치
  rank: number;
  /** 진화 단계 (D60): 같은 스피릿이 소환돼 모인 copies로 진화한다 */
  stage: 1 | 2 | 3;
  /** 진화에 쓰지 않은 중복 소환 수 */
  copies: number;
  condition: number; // 0~100
  injured: boolean;
  injuryProgress: number; // 0~1, 1이 되면 해제
}

export type ActivityType = 'training' | 'gathering' | 'rest';

export interface ActivityRun {
  id: string;
  type: ActivityType;
  spiritId: string;
  startedAt: number;
  completesAt: number | null; // rest는 null(무기한)
  nodeTileId?: string; // gathering 대상 자원 헥사
  status: 'running' | 'claimed' | 'cancelled';
}
