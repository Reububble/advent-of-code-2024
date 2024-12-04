import { getTask } from "util/getTask.ts";
import { safeLevels, safeReportPairs } from "day_2/stage_1.ts";

/**
 *    c
 *   /|
 *  b |
 *   \|
 *    a
 *
 * 1. Determine the direction of the levels
 * 2. Evaluate triplets to find which level must be removed
 * 3. Once a level is removed, evaluate pairs from then on
 */

function safeReport(report: number[]) {
  if (report.length <= 2) {
    return true;
  }

  const deltaAB = report[1] - report[0];
  const deltaBC = report[2] - report[1];
  const deltaAC = report[2] - report[0];

  if (report.length === 3) {
    const safeAB = deltaAB !== 0 && Math.abs(deltaAB) < 3;
    const safeBC = deltaBC !== 0 && Math.abs(deltaBC) < 3;
    const safeAC = deltaAC !== 0 && Math.abs(deltaAC) < 3;
    if (safeAB || safeBC || safeAC) {
      return true;
    }
    return false;
  }

  // Must decide on a direction
  const direction = Math.sign(Math.sign(deltaAB) + Math.sign(deltaBC) + Math.sign(report[3] - report[2])) as 1 | 0 | -1;

  if (direction === 0) {
    return false;
  }

  let prev = report[1];
  let prevprev = report[0];
  let prevSafe = safeLevels(prevprev, prev, direction);
  for (let i = 2; i < report.length; ++i) {
    const curr = report[i];
    const ab = prevSafe;
    const ac = safeLevels(prevprev, curr, direction);
    const bc = safeLevels(prev, curr, direction);
    if (!ab) {
      if (!ac) {
        // Skip a
        return safeReportPairs(report, direction, i - 1, prev);
      }
      // Skip b
      return safeReportPairs(report, direction, i - 1, prevprev);
    } else if (!bc && !ac) {
      // Skip c
      return safeReportPairs(report, direction, i, prev);
    }

    prevSafe = bc;
    prevprev = prev;
    prev = curr;
  }

  return true;
}

if (import.meta.main) {
  const task = await getTask("2", "2");

  const lines = task.input.split("\n");
  const reports = lines.map((line) => line.split(/\s+/).map((level) => parseInt(level)).filter((level) => !isNaN(level))).filter((report) => report.length > 0);

  let ret = 0;

  for (const report of reports) {
    if (safeReport(report)) {
      ++ret;
    }
  }

  await task.output(String(ret));
}
