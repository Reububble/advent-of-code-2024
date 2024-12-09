import { getTask, requiredEnv } from "util/getTask.ts";
import { getOrSet } from "util/getOrSet.ts";

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
  for (let y = 0; y < map.length; ++y) {
    const x = map[y].indexOf("^");
    if (x !== -1) {
      return { x, y };
    }
  }
  throw new Error("No guard");
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

export function outsideMap(next: { x: number; y: number }, map: string[]) {
  return next.x < 0 || next.y < 0 || next.x >= map[0].length || next.y >= map.length;
}
