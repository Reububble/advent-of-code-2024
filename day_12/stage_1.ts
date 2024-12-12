import { getTask, requiredEnv } from "util/getTask.ts";
import { eachGrid } from "util/eachGrid.ts";
import { outsideMap } from "day_6/stage_1.ts";
import { MultiMap } from "util/multiMap.ts";
import { Pos } from "day_8/stage_1.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);

  const regionInfos = new Array<{ positions: Pos[]; perimeter: number }>();
  const regionIDs = new Array<number>();

  function getRegionID(regionIndex: number) {
    while (regionIndex !== regionIDs[regionIndex]) {
      regionIndex = regionIDs[regionIndex];
    }
    return regionIndex;
  }

  const regionIndices = new MultiMap<[number, number], number>(2);

  eachGrid(lines, (v, x, y) => {
    const neighbours = findRegions(v, { x, y });
    if (neighbours.length === 0) {
      const regionID = regionInfos.length;
      regionInfos.push({ positions: [{ x, y }], perimeter: 4 });
      const regionIndex = regionIDs.length;
      regionIDs.push(regionID);
      regionIndices.set([y, x], regionIndex);
    } else {
      const neighbouringRegions = new Set(neighbours.map((pos) => getRegionID(regionIndices.get([pos.y, pos.x])!)));
      if (neighbouringRegions.size === 1) {
        const regionIndex = regionIndices.get([neighbours[0].y, neighbours[0].x])!;
        const regionID = getRegionID(regionIndex);
        const regionInfo = regionInfos[regionID];
        regionInfo.positions.push({ x, y });
        regionInfo.perimeter += 4 - 2 * neighbours.length;
        regionIndices.set([y, x], regionIndex);
      } else {
        // combine regions
        const newRegionInfo = { positions: [{ x, y }], perimeter: 4 - neighbours.length };
        const newRegionID = regionInfos.length;
        regionInfos.push(newRegionInfo);
        const newRegionIndex = regionIDs.length;
        regionIDs.push(newRegionID);
        regionIndices.set([y, x], newRegionIndex);
        for (const regionIndex of neighbouringRegions) {
          const regionID = getRegionID(regionIndex);
          const regionInfo = regionInfos[regionID];
          newRegionInfo.positions.push(...regionInfo.positions);
          newRegionInfo.perimeter += regionInfo.perimeter - 1;
          regionIDs[regionIndex] = newRegionID;
        }
      }
    }
  });

  for (const regionID of new Set(regionIDs.map((regionID) => getRegionID(regionID)))) {
    const region = regionInfos[regionID];
    ret += region.perimeter * region.positions.length;
  }

  await task.output(String(ret));

  function findRegions(v: string, { x, y }: Pos) {
    const neighbours = new Array<Pos>();
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const neighbour = { x: x + dx, y: y + dy };
      if (outsideMap(neighbour, lines)) {
        continue;
      }
      if (lines[neighbour.y][neighbour.x] === v) {
        if (regionIndices.has([neighbour.y, neighbour.x])) {
          neighbours.push(neighbour);
        }
      }
    }
    return neighbours;
  }
}
