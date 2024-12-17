import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";

const log = console.log;

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const digits = Grid.create(lines.map((line) => [...line.matchAll(/\d/g)].map(([n]) => Number(n))));
  const numbers = Grid.create(lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n))));
  const chars = Grid.create(lines);

  await task.output(String(ret));
}
