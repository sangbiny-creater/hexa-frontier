// 버전 관리되는 저장 데이터 (기획서 12장).
import { BALANCE } from '../data/balance';
import { TILE_BY_ID } from '../data/map';
import { SAVE_VERSION, type GameState } from './game';

export const SAVE_KEY = 'hexa-frontier-v2/save';

export function serialize(s: GameState): string {
  return JSON.stringify(s);
}

export function deserialize(text: string): GameState | null {
  try {
    const raw = JSON.parse(text);
    return migrate(raw);
  } catch {
    return null;
  }
}

/** 버전별 마이그레이션. 새 필드를 추가할 때 여기서 기본값을 채운다. */
export function migrate(raw: any): GameState | null {
  if (!raw || typeof raw !== 'object' || typeof raw.version !== 'number') return null;
  if (raw.version > SAVE_VERSION) return null;
  // v3: 세로 맵, v4: 스테이지 재구성, v5: 소환·시작 스피릿, v6: 튜토리얼 2단계 → 이전 저장은 새 게임으로 시작
  if (raw.version < 6) return null;
  if (raw.version === 6) {
    // v7: P00 튜토리얼 축소 + P01, 리스폰, 진화 단계·중복 소환 (D57~D60)
    raw.cleared = (raw.cleared as string[]).filter((id) => TILE_BY_ID[id]);
    if (!TILE_BY_ID[raw.lastTile]) raw.lastTile = 'start';
    raw.map = 'P00';
    raw.respawnAt = {};
    raw.summonCounter = 0;
    raw.settings = { skipBattle: false };
    const caps = BALANCE.evolution.levelCap;
    for (const sp of Object.values(raw.spirits) as any[]) {
      // 이미 레벨이 높은 스피릿은 그 레벨에 맞는 단계로 진화한 것으로 친다
      sp.stage = sp.level > caps[1] ? 3 : sp.level > caps[0] ? 2 : 1;
      sp.copies = 0;
    }
    raw.version = 7;
  }
  return raw as GameState;
}
