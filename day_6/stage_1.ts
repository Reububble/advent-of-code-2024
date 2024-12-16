import { getTask, requiredEnv } from "util/getTask.ts";
import { getOrSet } from "util/getOrSet.ts";
import { Indexable } from "util/eachGrid.ts";
import { findSymbol } from "util/findSymbol.ts";

export enum Direction {
  up,
  right,
  down,
  left,
}

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const map = task.input.split(/\r?\n/);

  const pos = findGuard(map);
  let dir = Direction.up;
  const visited = new Map<number, Set<number>>([[pos.y, new Set([pos.x])]]);

  while (true) {
    const next = nextPos(pos, dir);
    if (outsideMap(next, map)) {
      break;
    }
    if (map[next.y][next.x] === "#") {
      dir = (dir + 1) % 4 as Direction;
      continue;
    }

    pos.x = next.x;
    pos.y = next.y;
    getOrSet(visited, pos.y, new Set()).add(pos.x);
  }

  for (const row of visited.values()) {
    ret += row.size;
  }

  await task.output(String(ret));
}

export function findGuard(map: string[]) {
  return findSymbol("^", map);
}

export function nextPos({ x, y }: { x: number; y: number }, dir: Direction) {
  switch (dir) {
    case Direction.up:
      --y;
      break;
    case Direction.right:
      ++x;
      break;
    case Direction.down:
      ++y;
      break;
    case Direction.left:
      --x;
      break;
  }
  return { x, y };
}

export function outsideMap<T>(next: { x: number; y: number }, map: Indexable<T>[]) {
  return next.x < 0 || next.y < 0 || next.x >= map[0].length || next.y >= map.length;
}
