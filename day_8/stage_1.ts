import { getTask, requiredEnv } from "util/getTask.ts";
import { outsideMap } from "day_6/stage_1.ts";
import { eachGrid } from "util/eachGrid.ts";
import { eachPair } from "util/eachPair.ts";

export type Pos = {
  x: number;
  y: number;
};

export function addLocation(pos: Pos, locations: Map<number, Set<number>>) {
  const row = locations.get(pos.y) ?? new Set<number>();
  row.add(pos.x);
  locations.set(pos.y, row);
}

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const locations = new Map<number, Set<number>>();

  const antennas = new Map<string, Pos[]>();

  eachGrid(lines, (char, x, y) => {
    if (char !== ".") {
      const nodes = antennas.get(char) ?? new Array<Pos>();
      nodes.push({ x, y });
      antennas.set(char, nodes);
    }
  });

  for (const positions of antennas.values()) {
    eachPair(positions, (a, b) => {
      const antinodeA = { x: 2 * a.x - b.x, y: 2 * a.y - b.y };
      const antinodeB = { x: 2 * b.x - a.x, y: 2 * b.y - a.y };

      if (!outsideMap(antinodeA, lines)) {
        addLocation(antinodeA, locations);
      }

      if (!outsideMap(antinodeB, lines)) {
        addLocation(antinodeB, locations);
      }
    });
  }

  for (const row of locations.values()) {
    ret += row.size;
  }

  await task.output(String(ret));
}
