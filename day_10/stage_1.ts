import { getTask, requiredEnv } from "util/getTask.ts";
import { outsideMap } from "day_6/stage_1.ts";
import { eachGrid } from "util/eachGrid.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const digits = lines.map((line) => [...line.matchAll(/\d/g)].map(([n]) => Number(n)));

  eachGrid(digits, (_value, x, y) => {
    ret += new Set(goesUp(0, x, y, digits)).size;
  });

  await task.output(String(ret));
}

export function goesUp(to: number, x: number, y: number, map: number[][]): string[] {
  if (outsideMap({ x, y }, map) || map[y][x] !== to) {
    return [];
  }
  if (to === 9) {
    return [`${x}, ${y}`];
  }
  const score = new Array<string>();
  for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
    for (const add of goesUp(to + 1, x + dx, y + dy, map)) {
      score.push(add);
    }
  }
  return score;
}
