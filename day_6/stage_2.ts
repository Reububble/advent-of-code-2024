import { getTask, requiredEnv } from "util/getTask.ts";
import { findGuard, outsideMap } from "day_6/stage_1.ts";
import { getOrSet } from "util/getOrSet.ts";
import { Dir2, moved, rotated, Vec2 } from "util/positions.ts";

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
    } else if (
      (visited.get(next.y)?.has(next.x) !== true) // We can't put an obstacle there because the guard needs to have walked through it
    ) {
      // What if there was an obstacle there though?
      if (isLoop({ ...pos }, dir, map)) {
        ++ret;
      }
    }

    pos.x = next.x;
    pos.y = next.y;
    getOrSet(visited, next.y, new Set()).add(next.x);
  }

  await task.output(String(ret));
}

function isLoop(pos: Vec2, dir: Dir2, map: string[]) {
  const visited = new Map<number, Map<number, Set<Dir2>>>([[pos.y, new Map([[pos.x, new Set([dir, rotated(dir)])]])]]);
  const obstacle = moved(pos, dir);
  dir = rotated(dir);

  while (true) {
    const next = moved(pos, dir);
    if (outsideMap(next, map)) {
      return false;
    }
    if (map[next.y][next.x] === "#" || next.x === obstacle.x && next.y === obstacle.y) {
      dir = rotated(dir);
      continue;
    }

    pos.x = next.x;
    pos.y = next.y;
    const row = getOrSet(visited, pos.y, new Map<number, Set<Dir2>>());
    const cell = getOrSet(row, pos.x, new Set<Dir2>());
    if (cell.has(dir)) {
      return true;
    }
    cell.add(dir);
  }
}
