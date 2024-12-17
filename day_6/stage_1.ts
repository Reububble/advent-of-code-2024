import { getTask, requiredEnv } from "util/getTask.ts";
import { getOrSet } from "util/getOrSet.ts";
import { Indexable } from "util/eachGrid.ts";
import { findSymbol } from "util/findSymbol.ts";
import { Dir2, moved, rotated } from "util/positions.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const map = task.input.split(/\r?\n/);

  const pos = findGuard(map);
  let dir = "^" as Dir2;
  const visited = new Map<number, Set<number>>([[pos.y, new Set([pos.x])]]);

  while (true) {
    const next = moved(pos, dir);
    if (outsideMap(next, map)) {
      break;
    }
    if (map[next.y][next.x] === "#") {
      dir = rotated(dir);
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

export function outsideMap<T>(next: { x: number; y: number }, map: Indexable<T>[]) {
  return next.x < 0 || next.y < 0 || next.x >= map[0].length || next.y >= map.length;
}
