import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";
import { path } from "day_18/stage_1.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = Grid.create(lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n))));

  const map = Grid.create(new Array(71).fill(undefined).map(() => new Array<string>(71).fill(".")));
  let i = 0;
  for (; i < 1024; ++i) {
    map[numbers[i][1]][numbers[i][0]] = "#";
  }
  --i;

  let route = path(map);
  while (route !== undefined) {
    ++i;
    map[numbers[i][1]][numbers[i][0]] = "#";
    if (route.some(({ x, y }) => x === numbers[i][0] && y === numbers[i][1])) {
      route = path(map);
    }
  }

  await task.output(String(numbers[i]));
}
