import { getTask, requiredEnv } from "util/getTask.ts";
import { memoize } from "util/memoize.ts";

const alternatives = memoize((patternMap: Map<string, string[]>, design: string): number => {
  const nextChar = design[0];
  if (nextChar === undefined) {
    return 1;
  }
  let ret = 0;
  for (const v of patternMap.get(nextChar)!) {
    if (!design.startsWith(v)) {
      continue;
    }
    ret += alternatives(patternMap, design.slice(v.length));
  }
  return ret;
});

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);

  const patterns = lines[0].split(", ");
  const patternMap = new Map(["w", "u", "b", "r", "g"].map((colour) => [colour, patterns.filter((p) => p[0] === colour)] as const));
  const designs = lines.slice(2);

  for (const design of designs) {
    ret += alternatives(patternMap, design);
  }

  await task.output(String(ret));
}
