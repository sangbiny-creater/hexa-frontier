// RPG 상태 저장소: localStorage에 저장, 행동은 복사본에 적용
import { useCallback, useEffect, useRef, useState } from 'react';
import { newRpg, RPG_VERSION, type RpgState } from '../rpg/game';

export const RPG_KEY = 'hexa-frontier/rpg';

function load(): RpgState | null {
  try {
    const raw = localStorage.getItem(RPG_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s?.version === RPG_VERSION ? s : null;
  } catch {
    return null;
  }
}

export function useRpg() {
  const [state, setState] = useState<RpgState>(() => load() ?? newRpg());
  const [hasSave] = useState(() => !!load());
  const ref = useRef(state);
  ref.current = state;
  useEffect(() => {
    try {
      localStorage.setItem(RPG_KEY, JSON.stringify(state));
    } catch {
      /* 저장 불가 */
    }
  }, [state]);
  const act = useCallback(<T,>(fn: (s: RpgState) => T): T => {
    const d = structuredClone(ref.current);
    const r = fn(d);
    ref.current = d;
    setState(d);
    return r;
  }, []);
  const reset = useCallback(() => {
    const f = newRpg();
    ref.current = f;
    setState(f);
  }, []);
  return { state, act, reset, hasSave };
}
