import { getTask, requiredEnv } from "util/getTask.ts";
import { eachGrid } from "util/eachGrid.ts";
import { MultiMap } from "util/multiMap.ts";
import { Vec2 } from "util/positions.ts";

export function getRegionID(regionIndex: number, regionIDs: Array<number>) {
  while (regionIndex !== regionIDs[regionIndex]) {
    regionIndex = regionIDs[regionIndex];
  }
  return regionIndex;
}

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);

  const regionInfos = new Array<{ area: number; perimeter: number }>();
  const regionIDs = new Array<number>();

  const regionIndices = new MultiMap<[number, number], number>(2);

  eachGrid(lines, (v, x, y) => {
    const regionID = findRegion(v, { x, y }, lines, regionIDs, regionIndices, regionInfos);
    const region = regionInfos[regionID];
    region.perimeter += addedPerimeter(lines, y, x, v);
  });

  for (const regionID of new Set(regionIDs.map((regionID) => getRegionID(regionID, regionIDs)))) {
    const region = regionInfos[regionID];
    ret += region.perimeter * region.area;
  }

  await task.output(String(ret));
}

function addedPerimeter(lines: string[], y: number, x: number, v: string) {
  let ret = 0;
  ret += 4;
  const left = lines[y][x - 1] === v;
  const up = lines[y - 1]?.[x] === v;
  if (left) {
    ret -= 2;
  }
  if (up) {
    ret -= 2;
  }
  return ret;
}

/** Returns the region that the pos belongs to and updates the area. Does not update the perimeter */
export function findRegion(
  v: string,
  { x, y }: Vec2,
  lines: string[],
  regionIDs: number[],
  regionIndices: MultiMap<[number, number], number>,
  regionInfos: { area: number; perimeter: number }[],
) {
  const left = lines[y][x - 1] === v;
  const up = lines[y - 1]?.[x] === v;
  if (!left && !up) {
    const newRegionID = regionInfos.push({ area: 1, perimeter: 0 }) - 1;
    const newRegionIndex = regionIDs.push(newRegionID) - 1;
    regionIndices.set([y, x], newRegionIndex);
    return newRegionID;
  }
  if (left && up) {
    const regionAID = getRegionID(regionIndices.get([y, x - 1])!, regionIDs);
    const regionBID = getRegionID(regionIndices.get([y - 1, x])!, regionIDs);
    const regionA = regionInfos[regionAID];
    if (regionAID !== regionBID) {
      const regionB = regionInfos[regionBID];
      regionA.area += regionB.area;
      regionA.perimeter += regionB.perimeter;
      regionIDs[regionBID] = regionAID;
    }
    regionA.area += 1;
    regionIndices.set([y, x], regionAID);
    return regionAID;
  }
  const regionID = left ? getRegionID(regionIndices.get([y, x - 1])!, regionIDs) : getRegionID(regionIndices.get([y - 1, x])!, regionIDs);
  const region = regionInfos[regionID];
  region.area += 1;
  regionIndices.set([y, x], regionID);
  return regionID;
}
