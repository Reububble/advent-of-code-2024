import { getTask, requiredEnv } from "util/getTask.ts";
import { outsideMap } from "day_6/stage_1.ts";
import { addLocation, findAntennas } from "day_8/stage_1.ts";
import { eachPair } from "util/eachPair.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const locations = new Map<number, Set<number>>();

  const antennas = findAntennas(lines);

  for (const positions of antennas.values()) {
    eachPair(positions, (a, b) => {
      const delta = { x: b.x - a.x, y: b.y - a.y };

      const antinodeA = { ...a };
      while (!outsideMap(antinodeA, lines)) {
        addLocation(antinodeA, locations);
        antinodeA.x -= delta.x;
        antinodeA.y -= delta.y;
      }

      const antinodeB = { ...b };
      while (!outsideMap(antinodeB, lines)) {
        addLocation(antinodeB, locations);
        antinodeB.x += delta.x;
        antinodeB.y += delta.y;
      }
    });
  }

  for (const row of locations.values()) {
    ret += row.size;
  }

  await task.output(String(ret));
}
