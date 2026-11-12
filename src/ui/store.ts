import { useCallback, useEffect, useRef, useState } from 'react';
import { DevClock } from '../core/clock';
import { detectRollback, newGame, tick, type GameState } from '../core/game';
import { deserialize, SAVE_KEY, serialize } from '../core/save';

const DEV_KEY = 'hexa-frontier-v2/dev';

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* 저장 불가 환경에서도 게임은 동작 */
  }
}

function loadDevClock(): DevClock {
  const raw = safeGet(DEV_KEY);
  const d = raw ? JSON.parse(raw) : { offset: 0, speed: 1 };
  return new DevClock(d.offset ?? 0, d.speed ?? 1);
}

export function useGame() {
  const clockRef = useRef<DevClock>(loadDevClock());
  const clock = clockRef.current;
  const [now, setNow] = useState(() => clock.now());
  const [notice, setNotice] = useState<string | null>(null);
  const [state, setState] = useState<GameState>(() => {
    const raw = safeGet(SAVE_KEY);
    const loaded = raw ? deserialize(raw) : null;
    const t = clock.now();
    if (loaded) {
      if (detectRollback(loaded, t)) {
        setTimeout(() => setNotice('기기 시간이 이전 기록보다 과거입니다. 그동안의 회복·보상은 지급되지 않습니다.'), 0);
      }
      tick(loaded, t);
      return loaded;
    }
    return newGame(t);
  });

  // 1초마다 화면 시간 갱신 (타이머 표시)
  useEffect(() => {
    const id = setInterval(() => setNow(clock.now()), 500);
    return () => clearInterval(id);
  }, [clock]);

  useEffect(() => {
    safeSet(SAVE_KEY, serialize(state));
  }, [state]);

  // 같은 순간에 행동이 연달아 일어나도 서로 덮어쓰지 않도록 최신 상태를 ref로 들고 있는다
  const stateRef = useRef(state);
  stateRef.current = state;

  /** 최신 상태를 복사해 행동을 실행하고 저장한다. */
  const act = useCallback(
    <T,>(fn: (draft: GameState, now: number) => T): T => {
      const t = clock.now();
      const draft = structuredClone(stateRef.current);
      tick(draft, t);
      const result = fn(draft, t);
      stateRef.current = draft;
      setState(draft);
      setNow(t);
      return result;
    },
    [clock],
  );

  const saveDev = () => safeSet(DEV_KEY, JSON.stringify({ offset: clock.offset(), speed: clock.getSpeed() }));

  const dev = {
    advance(ms: number) {
      clock.advance(ms);
      saveDev();
      setNow(clock.now());
    },
    setSpeed(x: number) {
      clock.setSpeed(x);
      saveDev();
      setNow(clock.now());
    },
    speed: clock.getSpeed(),
    offset: clock.offset(),
    resetClock() {
      clock.reset();
      saveDev();
      setNow(clock.now());
    },
    resetSave(patch?: (s: GameState) => void) {
      const fresh = newGame(clock.now());
      patch?.(fresh);
      stateRef.current = fresh;
      setState(fresh);
    },
  };

  return { state, now, act, dev, notice, clearNotice: () => setNotice(null) };
}

export function fmtDuration(ms: number): string {
  if (ms <= 0) return '완료';
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}시간 ${m}분`;
  if (m) return `${m}분 ${sec}초`;
  return `${sec}초`;
}
