import { getTask, requiredEnv } from "util/getTask.ts";
import { Pos } from "day_8/stage_1.ts";
import { Direction, nextPos } from "day_6/stage_1.ts";
import { findSymbol } from "util/findSymbol.ts";
import { search } from "util/search.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);

  const endPos = findSymbol("E", lines);
  const startPos = findSymbol("S", lines);
  const startDir = Direction.right as Direction;

  await task.output(String(findBest(startPos, startDir, endPos, lines)));
}

export function findBest(startPos: Pos, startDir: Direction, endPos: Pos, lines: string[]) {
  const frontier = [{ pos: startPos, dir: startDir, score1: 0, score2: endScore(endPos, startPos) }];
  return search(
    frontier,
    { depth: 3, converter: (a) => [a.pos.y, a.pos.x, a.dir] },
    ({ pos }) => {
      if (lines[pos.y][pos.x] === "#") {
        return "Wall";
      }
      if (lines[pos.y][pos.x] === "E") {
        return "Win";
      }
      return "Walk";
    },
    ({ score1, score2 }) => score1 + score2,
    (exploring) => {
      const forwardPos = nextPos(exploring.pos, exploring.dir);
      const forward = { pos: forwardPos, dir: exploring.dir, score1: exploring.score1 + 1, score2: endScore(endPos, forwardPos) };
      const left = { pos: exploring.pos, dir: (exploring.dir + 3) % 4 as Direction, score1: exploring.score1 + 1000, score2: exploring.score2 };
      const right = { pos: exploring.pos, dir: (exploring.dir + 1) % 4 as Direction, score1: exploring.score1 + 1000, score2: exploring.score2 };
      return [forward, left, right];
    },
  )?.score1;
}

function endScore(end: { x: number; y: number }, pos: { x: number; y: number }) {
  return Math.abs(end.y - pos.y) + Math.abs(end.x - pos.x);
}
