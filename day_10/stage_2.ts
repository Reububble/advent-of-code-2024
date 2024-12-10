import { getTask, requiredEnv } from "util/getTask.ts";
import { eachGrid } from "util/eachGrid.ts";
import { goesUp } from "day_10/stage_1.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const digits = lines.map((line) => [...line.matchAll(/\d/g)].map(([n]) => Number(n)));

  eachGrid(digits, (_value, x, y) => {
    ret += goesUp(0, x, y, digits).length;
  });

  await task.output(String(ret));
}
