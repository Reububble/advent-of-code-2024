import { getTask } from "util/getTask.ts";

export function safeLevels(a: number, b: number, direction: 1 | -1) {
  if (Math.sign(b - a) !== direction) {
    return false;
  }
  if (Math.abs(b - a) > 3) {
    return false;
  }
  return true;
}

export function safeReportPairs(report: number[], direction: 1 | -1, start = 0, prev = report[start]) {
  for (let i = start + 1; i < report.length; ++i) {
    const curr = report[i];
    if (!safeLevels(prev, curr, direction)) {
      return false;
    }
    prev = curr;
  }
  return true;
}

if (import.meta.main) {
  const task = await getTask("2", "1");

  const lines = task.input.split("\n");
  const reports = lines.map((line) => line.split(/\s+/).map((level) => parseInt(level)).filter((level) => !isNaN(level))).filter((report) => report.length > 0);

  let ret = 0;

  for (const report of reports) {
    if (report.length === 1) {
      ++ret;
      continue;
    }

    const direction = Math.sign(report[1] - report[0]) as 1 | 0 | -1;
    if (direction === 0) {
      continue;
    }

    if (safeReportPairs(report, direction)) {
      ++ret;
    }
  }

  await task.output(String(ret));
}
