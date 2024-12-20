import { getTask, requiredEnv } from "util/getTask.ts";
import { eachGrid, Grid } from "util/eachGrid.ts";
import { Dir2 } from "util/positions.ts";
import { applyMoves } from "day_15/applyMoves.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const empty = lines.findIndex((line) => line.length === 0);
  const map = Grid.create(lines.slice(0, empty));
  const moves = lines.slice(empty + 1).join("").split("") as Dir2[];

  applyMoves(map, moves);

  eachGrid(map, (v, x, y) => {
    if (v === "O") {
      ret += x + y * 100;
    }
  });

  await task.output(String(ret));
}
