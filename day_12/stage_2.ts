import { getTask, requiredEnv } from "util/getTask.ts";
import { eachGrid } from "util/eachGrid.ts";
import { MultiMap } from "util/multiMap.ts";
import { Pos } from "day_8/stage_1.ts";
import { findRegion, getRegionID } from "day_12/stage_1.ts";

function addedPerimeter({ x, y }: Pos, lines: string[]) {
  const v = lines[y][x];
  const left = lines[y]?.[x - 1] === v;
  const up = lines[y - 1]?.[x] === v;
  const upLeft = lines[y - 1]?.[x - 1] === v;
  const upRight = lines[y - 1]?.[x + 1] === v;
  let ret = 0;
  if (left) {
    if (up && !upRight) {
      ret -= 2;
    } else if (!up && upLeft) {
      ret += 2;
    }
  } else {
    if (up) {
      if (upRight) {
        ret += 2;
      }
      if (upLeft) {
        ret += 2;
      }
    } else {
      ret += 4;
    }
  }
  return ret;
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
    region.perimeter += addedPerimeter({ x, y }, lines);
  });

  for (const regionID of new Set(regionIDs.map((regionID) => getRegionID(regionID, regionIDs)))) {
    const region = regionInfos[regionID];
    ret += region.perimeter * region.area;
  }

  await task.output(String(ret));
}
