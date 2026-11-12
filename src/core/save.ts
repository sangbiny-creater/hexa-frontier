// 버전 관리되는 저장 데이터 (기획서 12장).
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
  // v3에서 맵이 세로형으로 바뀌어 칸 ID가 달라졌다 → 이전 저장은 새 게임으로 시작
  if (raw.version < 3) return null;
  return raw as GameState;
}
