import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";
import { search, searchMany } from "util/search.ts";
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
      (v) => chars.atPos(v.pos) === "#" ? "Wall" : chars.atPos(v.pos) === "E" ? "Win" : "Walk",
      ({ path }) => path.length,
      (v) => [
        walk("<", v),
        walk("^", v),
        walk(">", v),
        walk("v", v),
      ],
    )!.path,
  ];

  const distance = Grid.create(new Array(chars.length).fill(undefined).map(() => new Array(chars[0]?.length ?? 0).fill(-1)));

  normalPath.forEach((pos, i) => distance.setPos(pos, i));

  let ret = 0;
  for (let i = benefit + 2; i < normalPath.length; ++i) {
    const here = normalPath[i];
    // search outwards 20 steps for distances that are 100 less than i
    const many = searchMany(
      [here],
      { depth: 2, converter: ({ x, y }) => [x, y] },
      (v) => {
        const offset = Math.abs(v.x - here.x) + Math.abs(v.y - here.y);
        const pathLength = distance.atPos(v);
        return pathLength === undefined
          ? "Wall"
          : offset > cheat
          ? "Wall"
          : chars.atPos(v) === "#"
          ? "Walk"
          : pathLength + offset <= i - benefit
          ? "Win"
          : "Walk";
      },
      () => 0,
      (v) => [moved(v, "^"), moved(v, "<"), moved(v, "v"), moved(v, ">")],
    );

    ret += many.length;
  }
  return ret;
}

function walk(dir: Dir2, v: { pos: Vec2; path: Tree<Vec2> }): { pos: Vec2; path: Tree<Vec2> } {
  const to = moved(v.pos, dir);
  return { pos: to, path: new Tree(to, v.path) };
}
