// 버전 관리되는 저장 데이터 (기획서 12장).
import { newTutorial, SAVE_VERSION, type GameState } from './game';

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
  if (raw.version === 1) {
    // v1 → v2: 튜토리얼 필드 추가. 이미 진행한 저장이면 시작 화면에서 '처음부터 배우기'를 권한다.
    raw.tutorial = newTutorial();
    raw.version = 2;
  }
  return raw as GameState;
}
