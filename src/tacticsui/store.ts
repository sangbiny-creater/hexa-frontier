// 전술 전투 저장소 (D109): 캠페인과 진행 중인 전투를 localStorage에 저장. 행동은 복사본에 적용.
import { useCallback, useEffect, useRef, useState } from 'react';
import { newCampaign, TACTICS_VERSION, type Battle, type Campaign } from '../tactics/engine';

export const TAC_KEY = 'hexa-frontier/tactics';
interface Saved {
  cp: Campaign;
  battle: Battle | null;
}
function load(): Saved | null {
  try {
    const raw = localStorage.getItem(TAC_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s?.cp?.version === TACTICS_VERSION ? s : null;
  } catch {
    return null;
  }
}

export function useTactics() {
  const [saved, setSaved] = useState<Saved>(() => load() ?? { cp: newCampaign(), battle: null });
  const [hasSave] = useState(() => !!load());
  // 주인공을 고르기 전(새 게임)에는 저장하지 않는다 — 고르기 전에 새로고침해도 다시 고르게
  const [persist, setPersist] = useState(() => !!load());
  const ref = useRef(saved);
  ref.current = saved;
  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(TAC_KEY, JSON.stringify(saved));
    } catch {
      /* 저장 불가 */
    }
  }, [saved, persist]);
  /** 캠페인·전투를 복사본에서 바꾼다 */
  const act = useCallback(<T,>(fn: (cp: Campaign, b: Battle | null) => T): T => {
    const d = structuredClone(ref.current);
    const r = fn(d.cp, d.battle);
    ref.current = d;
    setSaved(d);
    return r;
  }, []);
  const setBattle = useCallback((b: Battle | null) => {
    const d = { ...structuredClone(ref.current), battle: b };
    ref.current = d;
    setSaved(d);
  }, []);
  const reset = useCallback((hero: 'aren' | 'lia' = 'aren') => {
    const f = { cp: newCampaign(hero), battle: null };
    ref.current = f;
    setSaved(f);
    setPersist(true);
  }, []);
  return { cp: saved.cp, battle: saved.battle, act, setBattle, reset, hasSave, ref };
}
