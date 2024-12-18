import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";
import { search } from "util/search.ts";
import { moved, Vec2 } from "util/positions.ts";
import { Tree } from "util/tree.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = Grid.create(lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n))));

  const map = Grid.create(new Array(71).fill(undefined).map(() => new Array<string>(71).fill(".")));

  for (let i = 0; i < 1024; ++i) {
    map[numbers[i][1]][numbers[i][0]] = "#";
  }

  ret = path(map)!.length;

  await task.output(String(ret));
}

function pathTo(pos: Vec2, path?: Tree<Vec2>) {
  return { pos, path: new Tree(pos, path) };
}

export function path(map: Grid<string>): Tree<Vec2> | undefined {
  return search(
    [pathTo({ x: 0, y: 0 })],
    { depth: 2, converter: ({ pos: { x, y } }) => [x, y] },
    (s) => map.atPos(s.pos) === "." ? s.pos.x === 70 && s.pos.y === 70 ? "Win" : "Walk" : "Wall",
    ({ path, pos: { x, y } }) => path.length - x - y,
    (s) => [
      pathTo(moved(s.pos, "<"), s.path),
      pathTo(moved(s.pos, "^"), s.path),
      pathTo(moved(s.pos, ">"), s.path),
      pathTo(moved(s.pos, "v"), s.path),
    ],
  )?.path;
}
