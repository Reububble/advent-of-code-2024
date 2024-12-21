import { getTask, requiredEnv } from "util/getTask.ts";
import { complexities } from "day_21/complexities.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);

  await task.output(String(complexities(lines, 26)));
}
