import { getTask, requiredEnv } from "util/getTask.ts";
import { Pos } from "day_8/stage_1.ts";
import { eachGrid } from "util/eachGrid.ts";
import { Dir, findStart, toPos } from "day_15/stage_1.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const empty = lines.findIndex((line) => line.length === 0);
  const map = lines.slice(0, empty).map((row) =>
    row.split("").flatMap((v) => v === "#" ? ["#", "#"] : v === "O" ? ["[", "]"] : v === "." ? [".", "."] : ["@", "."])
  );
  const moves = lines.slice(empty + 1).join("").split("") as Dir[];

  let pos = findStart(map);

  for (const move of moves) {
    if (canPush(map, pos, move)) {
      push(map, pos, move);
      pos = toPos(pos, move);
    }
  }

  eachGrid(map, (v, x, y) => {
    if (v === "[") {
      ret += x + y * 100;
    }
  });

  await task.output(String(ret));
}

function canPush(map: string[][], pos: Pos, move: Dir): boolean {
  const to = toPos(pos, move);
  switch (map[to.y][to.x]) {
    case "#":
      return false;
    case ".":
      return true;
    case "[":
      if (move === "^" || move === "v") {
        return canPush(map, to, move) && canPush(map, toPos(to, ">"), move);
      }
      return canPush(map, to, move);
    case "]":
      if (move === "^" || move === "v") {
        return canPush(map, to, move) && canPush(map, toPos(to, "<"), move);
      }
      return canPush(map, to, move);
  }
  throw new Error(`Unknown object ${map[to.y][to.x]}`);
}

function push(map: string[][], pos: Pos, move: Dir) {
  const to = toPos(pos, move);
  switch (map[to.y][to.x]) {
    case ".":
      [map[to.y][to.x], map[pos.y][pos.x]] = [map[pos.y][pos.x], map[to.y][to.x]];
      break;
    case "[":
      if (move === "^" || move === "v") {
        push(map, toPos(to, ">"), move);
      }
      push(map, to, move);
      [map[to.y][to.x], map[pos.y][pos.x]] = [map[pos.y][pos.x], map[to.y][to.x]];
      break;
    case "]":
      if (move === "^" || move === "v") {
        push(map, toPos(to, "<"), move);
      }
      push(map, to, move);
      [map[to.y][to.x], map[pos.y][pos.x]] = [map[pos.y][pos.x], map[to.y][to.x]];
      break;
  }
}
