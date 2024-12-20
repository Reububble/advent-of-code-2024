import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";
import { benefitialCheats } from "day_20/stage_1.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const chars = Grid.create(lines);

  const ret = benefitialCheats(100, 20, chars);

  await task.output(String(ret));
}
