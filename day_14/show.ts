import { Vector } from "util/vector.ts";

export function show(robots: { pos: Vector; vel: Vector }[]) {
  const map = new Array(103).fill(undefined).map((_, y) =>
    new Array(101).fill(undefined).map((_, x) => robots.find(({ pos }) => pos[0] === x && pos[1] === y) ? "#" : " ")
  );
  console.log(map.map((row) => row.join("")).join("\n"));
}
