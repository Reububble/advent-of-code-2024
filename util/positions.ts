import { positiveMod } from "util/mod.ts";

export type Vec2 = { x: number; y: number };

const dirs = ["^", ">", "v", "<"] as const;
export type Dir2 = typeof dirs[number];

export function moved(pos: Vec2, dir: Dir2, distance = 1) {
  switch (dir) {
    case "v":
      return { x: pos.x, y: pos.y + distance };
    case "^":
      return { x: pos.x, y: pos.y - distance };
    case "<":
      return { x: pos.x - distance, y: pos.y };
    case ">":
      return { x: pos.x + distance, y: pos.y };
  }
}

export function rotated(dir: Dir2, right = 1) {
  return dirs[positiveMod(dirs.indexOf(dir) + right, dirs.length)];
}
