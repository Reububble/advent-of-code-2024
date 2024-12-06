import { getTask, requiredEnv } from "util/getTask.ts";

const log = console.log;

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/);

  await task.output(String(ret));
}
