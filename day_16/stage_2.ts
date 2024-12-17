import { getTask, requiredEnv } from "util/getTask.ts";
import { MultiMap } from "util/multiMap.ts";
import { findBest } from "day_16/stage_1.ts";
import { findSymbol } from "util/findSymbol.ts";
import { searchMany } from "util/search.ts";
import { Dir2, moved, rotated, Vec2 } from "util/positions.ts";

type Node = { pos: Vec2; dir: Dir2; score1: number; prev: Node | undefined };

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);

  const endPos = findSymbol("E", lines);
  const startPos = findSymbol("S", lines);
  const startDir = ">";

  const best = findBest(startPos, startDir, endPos, lines)!;

  const finishes = searchMany(
    [{ pos: startPos, dir: startDir, score1: 0, prev: undefined }] as Node[],
    { depth: 3, converter: (a) => [a.pos.y, a.pos.x, a.dir] },
    ({ pos, score1 }) => {
      if (lines[pos.y][pos.x] === "#" || score1 > best) {
        return "Wall";
      }
      if (lines[pos.y][pos.x] === "E") {
        return "Win";
      }
      return "Walk";
    },
    ({ score1 }) => score1,
    (exploring) => {
      const forwardPos = moved(exploring.pos, exploring.dir);
      const forward = { pos: forwardPos, dir: exploring.dir, score1: exploring.score1 + 1, prev: exploring };
      const left = { pos: exploring.pos, dir: rotated(exploring.dir, -1), score1: exploring.score1 + 1000, prev: exploring };
      const right = { pos: exploring.pos, dir: rotated(exploring.dir, +1), score1: exploring.score1 + 1000, prev: exploring };
      return [forward, left, right];
    },
  );

  const tiles = new MultiMap<[number, number], null>(2);
  for (const finish of finishes) {
    let node = finish as Node | undefined;
    while (node !== undefined) {
      tiles.set([node.pos.y, node.pos.x], null);
      node = node.prev;
    }
  }

  await task.output(String(tiles.size));
}
