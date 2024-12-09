import { getTask, requiredEnv } from "util/getTask.ts";
import { Direction, findGuard, nextPos, outsideMap } from "day_6/stage_1.ts";
import { getOrSet } from "util/getOrSet.ts";

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

function isLoop(pos: { x: number; y: number }, dir: Direction, map: string[]) {
  const visited = new Map<number, Map<number, Set<Direction>>>([[pos.y, new Map([[pos.x, new Set([dir, (dir + 1) % 4])]])]]);
  const obstacle = nextPos(pos, dir);
  dir = (dir + 1) % 4 as Direction;

  while (true) {
    const next = nextPos(pos, dir);
    if (outsideMap(next, map)) {
      return false;
    }
    if (map[next.y][next.x] === "#" || next.x === obstacle.x && next.y === obstacle.y) {
      dir = (dir + 1) % 4 as Direction;
      continue;
    }

    pos.x = next.x;
    pos.y = next.y;
    const row = getOrSet(visited, pos.y, new Map<number, Set<Direction>>());
    const cell = getOrSet(row, pos.x, new Set<Direction>());
    if (cell.has(dir)) {
      return true;
    }
    cell.add(dir);
  }
}
