import { GRID, HALF } from "./config";

export type Point = [number, number];

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** How visible the grid is at a point: the same elliptical fade as the shader. */
export function gridMask(x: number, y: number, width: number, height: number) {
  const qx = (x / width - 0.5) / 0.79;
  const qy = (y / height - 0.45) / 0.71;
  return 1 - smoothstep(0.15, 0.65, Math.hypot(qx, qy));
}

const snapDown = (v: number) => Math.floor((v - HALF) / GRID) * GRID + HALF;
const snapUp = (v: number) => Math.ceil((v - HALF) / GRID) * GRID + HALF;
const snap = (v: number) => Math.round((v - HALF) / GRID) * GRID + HALF;

/** The grid dot just outside `rect`, on the side facing `from`. */
export function landingPoint([x, y]: Point, rect: DOMRect): Point {
  if (x >= rect.left && x <= rect.right) {
    return [x, y < rect.top ? snapDown(rect.top - 4) : snapUp(rect.bottom + 4)];
  }
  const side = x < rect.left ? snapDown(rect.left - 4) : snapUp(rect.right + 4);
  return [side, snap(Math.min(rect.bottom - 8, Math.max(rect.top + 8, y)))];
}
