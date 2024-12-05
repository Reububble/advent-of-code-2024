import { getTask } from "util/getTask.ts";

const log = console.log;

if (import.meta.main) {
  const task = await getTask("", "");

  let ret = 0;
  const lines = task.input.split(/\r?\n/);

  await task.output(String(ret));
}
