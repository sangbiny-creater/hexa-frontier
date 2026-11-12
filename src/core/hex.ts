// 탐험 맵용 axial 좌표 유틸 (pointy-top).
export const AXIAL_DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
];

export function axialNeighbors(q: number, r: number): [number, number][] {
  return AXIAL_DIRS.map(([dq, dr]) => [q + dq, r + dr]);
}

/** 화면 좌표 (중심). size = 꼭짓점까지 반지름 */
export function axialToPixel(q: number, r: number, size: number): { x: number; y: number } {
  return { x: size * Math.sqrt(3) * (q + r / 2), y: size * 1.5 * r };
}

export function hexCorners(cx: number, cy: number, size: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30);
    pts.push(`${(cx + size * Math.cos(a)).toFixed(1)},${(cy + size * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}
