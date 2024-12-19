import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";
import { search } from "util/search.ts";

const log = console.log;

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const digits = Grid.create(lines.map((line) => [...line.matchAll(/\d/g)].map(([n]) => Number(n))));
  const numbers = Grid.create(lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n))));
  const chars = Grid.create(lines);

  const patterns = lines[0].split(", ");
  const designs = lines.slice(2);

  for (const design of designs) {
    if (
      search([""], { depth: 1, converter: (a) => [a] }, (v) => design === v ? "Win" : design.startsWith(v) ? "Walk" : "Wall", (v) => -v.length, (v) => {
        return patterns.map((p) => v + p);
      }) !== undefined
    ) {
      ++ret;
    }
  }

  await task.output(String(ret));
}
