import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";
import { search } from "util/search.ts";
import { moved } from "util/positions.ts";

const log = console.log;

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret: number | undefined = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = Grid.create(lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n))));

  const map = Grid.create(new Array(71).fill(undefined).map(() => new Array<string>(71).fill(".")));
  let i = 0;
  for (; i < 1024; ++i) {
    map[numbers[i][1]][numbers[i][0]] = "#";
  }

  while (ret !== undefined) {
    ++i;
    map[numbers[i][1]][numbers[i][0]] = "#";
    ret = search(
      [{ pos: { x: 0, y: 0 }, score: 0 }],
      { depth: 2, converter: ({ pos: { x, y } }) => [x, y] },
      (s) => map.atPos(s.pos) === "." ? s.pos.x === 70 && s.pos.y === 70 ? "Win" : "Walk" : "Wall",
      ({ score, pos: { x, y } }) => score - x - y,
      (s) => [
        { pos: moved(s.pos, "<"), score: s.score + 1 },
        { pos: moved(s.pos, "^"), score: s.score + 1 },
        { pos: moved(s.pos, ">"), score: s.score + 1 },
        { pos: moved(s.pos, "v"), score: s.score + 1 },
      ],
    )?.score;
  }

  await task.output(String(numbers[i]));
}
