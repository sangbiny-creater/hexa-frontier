// 시간 추상화. MVP는 기기 시간 + 개발자 가속(D3).
// 상용 단계에서는 이 인터페이스 뒤를 서버 시간으로 교체한다.
export interface Clock {
  now(): number; // epoch ms
}

export const HOUR = 3_600_000;
export const MINUTE = 60_000;

export const systemClock: Clock = { now: () => Date.now() };

/** 개발자용: 실제 시간 + 오프셋, 배속. */
export class DevClock implements Clock {
  private anchorReal: number;
  private anchorGame: number;
  constructor(offsetMs = 0, private speed = 1) {
    this.anchorReal = Date.now();
    this.anchorGame = this.anchorReal + offsetMs;
  }
  now(): number {
    return this.anchorGame + (Date.now() - this.anchorReal) * this.speed;
  }
  advance(ms: number) {
    this.rebase();
    this.anchorGame += ms;
  }
  setSpeed(speed: number) {
    this.rebase();
    this.speed = speed;
  }
  getSpeed() {
    return this.speed;
  }
  /** 실제 시간 대비 누적 오프셋 (저장용) */
  offset(): number {
    return this.now() - Date.now();
  }
  reset() {
    this.anchorReal = Date.now();
    this.anchorGame = this.anchorReal;
    this.speed = 1;
  }
  private rebase() {
    const g = this.now();
    this.anchorReal = Date.now();
    this.anchorGame = g;
  }
}

/** 시뮬레이션/테스트용 수동 시계 */
export class ManualClock implements Clock {
  constructor(public t = 0) {}
  now() {
    return this.t;
  }
  advance(ms: number) {
    this.t += ms;
  }
}
