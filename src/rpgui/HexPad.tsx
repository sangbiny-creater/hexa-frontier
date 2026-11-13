// 이동 버튼 (D94): 화면 오른쪽 아래 고정. 6방향 화살표, 누르고 있으면 계속 걷고, 손가락을 미끄러뜨리면 방향이 바뀐다.
// 폰에서 확실히 먹히도록 터치 이벤트를 직접 받는다(passive: false). PC는 마우스.
// 이 영역 안에서는 지도가 눌리거나 끌리지 않는다.
import { useEffect, useRef, useState } from 'react';

/** 화살표 각도(0 = 오른쪽, 반시계) — 가로 화면(지도가 왼쪽→오른쪽)의 6방향 */
export const PAD_ANGLES = [30, 90, 150, 210, 270, 330] as const;
const ARROW: Record<number, string> = { 30: '↗', 90: '↑', 150: '↖', 210: '↙', 270: '↓', 330: '↘' };
const R = 46; // 화살표가 놓이는 반지름(px)
const DEAD = 14; // 가운데 이 안은 '멈춤'

export function HexPad({ onDir }: { onDir: (deg: number | null) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const cb = useRef(onDir);
  cb.current = onDir;
  const [on, setOn] = useState<number | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cur: number | null = null;
    const pick = (x: number, y: number) => {
      const r = el.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = (r.top + r.height / 2) - y;
      if (Math.hypot(dx, dy) < DEAD) return null;
      const deg = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
      let best: number = PAD_ANGLES[0];
      for (const a of PAD_ANGLES) {
        const d = (x: number) => Math.min(Math.abs(x - deg), 360 - Math.abs(x - deg));
        if (d(a) < d(best)) best = a;
      }
      return best;
    };
    const set = (v: number | null) => {
      if (v === cur) return;
      cur = v;
      setOn(v);
      cb.current(v);
    };
    const ts = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const t = e.touches[0];
      if (t) set(pick(t.clientX, t.clientY));
    };
    const te = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 0) set(null);
    };
    let mouse = false;
    const md = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      mouse = true;
      set(pick(e.clientX, e.clientY));
    };
    const mm = (e: MouseEvent) => mouse && set(pick(e.clientX, e.clientY));
    const mu = () => {
      if (!mouse) return;
      mouse = false;
      set(null);
    };
    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener('touchstart', ts, { passive: false });
    el.addEventListener('touchmove', ts, { passive: false });
    el.addEventListener('touchend', te, { passive: false });
    el.addEventListener('touchcancel', te, { passive: false });
    el.addEventListener('mousedown', md);
    el.addEventListener('pointerdown', stop);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    return () => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove', ts);
      el.removeEventListener('touchend', te);
      el.removeEventListener('touchcancel', te);
      el.removeEventListener('mousedown', md);
      el.removeEventListener('pointerdown', stop);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
      cb.current(null);
    };
  }, []);

  return (
    <div className="g-pad-zone" onPointerDown={(e) => e.stopPropagation()}>
      <div ref={box} className="hexpad">
        {PAD_ANGLES.map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <span key={a} className={`hp-btn ${on === a ? 'on' : ''}`} style={{ left: `calc(50% + ${Math.cos(rad) * R}px)`, top: `calc(50% - ${Math.sin(rad) * R}px)` }}>
              {ARROW[a]}
            </span>
          );
        })}
        <span className="hp-mid">이동</span>
      </div>
    </div>
  );
}
