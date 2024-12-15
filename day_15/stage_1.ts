import { getTask, requiredEnv } from "util/getTask.ts";
import { Pos } from "day_8/stage_1.ts";
import { eachGrid } from "util/eachGrid.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const empty = lines.findIndex((line) => line.length === 0);
  const map = lines.slice(0, empty).map((row) => row.split(""));
  const moves = lines.slice(empty + 1).join("").split("") as Dir[];

  let pos = findStart(map);
  for (const move of moves) {
    if (push(map, pos, move)) {
      pos = toPos(pos, move);
    }
  }

  eachGrid(map, (v, x, y) => {
    if (v === "O") {
      ret += x + y * 100;
    }
  });

  await task.output(String(ret));
}

export type Dir = "v" | "^" | "<" | ">";

function toPos(pos: Pos, move: Dir) {
  switch (move) {
    case "v":
      return { x: pos.x, y: pos.y + 1 };
    case "^":
      return { x: pos.x, y: pos.y - 1 };
    case "<":
      return { x: pos.x - 1, y: pos.y };
    case ">":
      return { x: pos.x + 1, y: pos.y };
  }
}

function push(map: string[][], pos: Pos, move: Dir) {
  const to = toPos(pos, move);
  switch (map[to.y][to.x]) {
    case "#":
      return false;
    case ".":
      [map[to.y][to.x], map[pos.y][pos.x]] = [map[pos.y][pos.x], map[to.y][to.x]];
      return true;
    default:
      if (push(map, to, move)) {
        [map[to.y][to.x], map[pos.y][pos.x]] = [map[pos.y][pos.x], map[to.y][to.x]];
        return true;
      }
      return false;
  }
}

export function findStart(map: string[][]) {
  for (let y = 0; y < map.length; y++) {
    const line = map[y];
    const x = line.indexOf("@");
    if (x !== -1) {
      return { x, y };
    }
  }
  throw new Error("Cannot find start");
}
