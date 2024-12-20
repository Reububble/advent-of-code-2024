import { getTask, requiredEnv } from "util/getTask.ts";
import { memoize } from "util/memoize.ts";

const possible = memoize((patternMap: Map<string, string[]>, design: string): boolean => {
  const nextChar = design[0];
  if (nextChar === undefined) {
    return true;
  }
  for (const v of patternMap.get(nextChar)!) {
    if (!design.startsWith(v)) {
      continue;
    }
    if (possible(patternMap, design.slice(v.length))) {
      return true;
    }
  }
  return false;
});

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);

  const patterns = lines[0].split(", ");
  const patternMap = new Map(["w", "u", "b", "r", "g"].map((colour) => [colour, patterns.filter((p) => p[0] === colour)] as const));
  const designs = lines.slice(2);

  for (const design of designs) {
    if (possible(patternMap, design)) {
      ++ret;
    }
  }

  await task.output(String(ret));
}
