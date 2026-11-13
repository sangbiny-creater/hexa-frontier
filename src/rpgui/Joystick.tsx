// 반투명 가상 조이스틱 (D88). 폰 터치(touch*)와 마우스(pointer*)를 따로 받아 어느 기기에서나 움직이게 한다.
// 누르고 끄는 방향을 각도(도, 0=오른쪽, 반시계)로 알려 주고, 손을 떼면 null.
import { useEffect, useRef, useState } from 'react';

const R = 52; // 바깥 원 반지름(px)
const DEAD = 14; // 이만큼은 움직여야 방향으로 인정

export function Joystick({ onAngle }: { onAngle: (deg: number | null) => void }) {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0, on: false });
  const cb = useRef(onAngle);
  cb.current = onAngle;

  useEffect(() => {
    const el = base.current;
    if (!el) return;
    let active = false;
    const update = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect();
      let dx = cx - (r.left + r.width / 2);
      let dy = cy - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy);
      if (len > R) (dx = (dx / len) * R), (dy = (dy / len) * R);
      setKnob({ x: dx, y: dy, on: true });
      cb.current(len < DEAD ? null : ((Math.atan2(-dy, dx) * 180) / Math.PI + 360) % 360);
    };
    const end = () => {
      active = false;
      setKnob({ x: 0, y: 0, on: false });
      cb.current(null);
    };
    // 터치 (폰)
    const ts = (e: TouchEvent) => {
      e.preventDefault();
      active = true;
      const t = e.changedTouches[0];
      update(t.clientX, t.clientY);
    };
    const tm = (e: TouchEvent) => {
      if (!active) return;
      e.preventDefault();
      const t = e.touches[0] ?? e.changedTouches[0];
      update(t.clientX, t.clientY);
    };
    const te = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 0) end();
    };
    // 마우스 (PC)
    const md = (e: MouseEvent) => {
      active = true;
      update(e.clientX, e.clientY);
    };
    const mm = (e: MouseEvent) => active && update(e.clientX, e.clientY);
    const mu = () => active && end();
    el.addEventListener('touchstart', ts, { passive: false });
    el.addEventListener('touchmove', tm, { passive: false });
    el.addEventListener('touchend', te, { passive: false });
    el.addEventListener('touchcancel', te, { passive: false });
    el.addEventListener('mousedown', md);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    return () => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove', tm);
      el.removeEventListener('touchend', te);
      el.removeEventListener('touchcancel', te);
      el.removeEventListener('mousedown', md);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
    };
  }, []);

  return (
    <div ref={base} className={`joystick ${knob.on ? 'on' : ''}`} aria-label="이동 조이스틱">
      <div className="js-ring" />
      <div className="js-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  );
}
