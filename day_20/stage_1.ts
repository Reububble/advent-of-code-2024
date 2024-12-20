import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";
import { search } from "util/search.ts";
import { Dir2, moved, Vec2 } from "util/positions.ts";
import { Tree } from "util/tree.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const chars = Grid.create(lines);

  const ret = benefitialCheats(100, 2, chars);

  await task.output(String(ret));
}

export function benefitialCheats(benefit: number, cheat: number, chars: Grid<string>) {
  const [start] = chars.findValues(["S"]);
  const normalPath = [
    ...search(
      [{ pos: start, path: new Tree(start) }],
      { depth: 2, converter: ({ pos: { x, y } }) => [x, y] },
      (v) => {
        const char = chars.atPos(v.pos);
        return char === "#" ? "Wall" : char === "E" ? "Win" : "Walk";
      },
      ({ path }) => path.length,
      (v) => [
        walk("<", v),
        walk("^", v),
        walk(">", v),
        walk("v", v),
      ],
    )!.path,
  ].reverse();

  let ret = 0;
  for (let i = 0, j0 = benefit + 2; i < normalPath.length - benefit - 2; ++i, ++j0) {
    const here = normalPath[i];
    for (let j = j0; j < normalPath.length; ++j) {
      const dx = Math.abs(normalPath[j].x - here.x);
      if (dx > cheat) {
        continue;
      }
      const d = dx + Math.abs(normalPath[j].y - here.y);
      if (d <= cheat && j - i - d >= benefit) {
        ++ret;
      }
    }
  }

  return ret;
}

function walk(dir: Dir2, v: { pos: Vec2; path: Tree<Vec2> }): { pos: Vec2; path: Tree<Vec2> } {
  const to = moved(v.pos, dir);
  return { pos: to, path: new Tree(to, v.path) };
}
