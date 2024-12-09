import { getTask, requiredEnv } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);

  for (const equation of lines) {
    const value = parseInt(equation.match(/^(\d+):/)![1]);
    const inputs = equation.split(": ")[1].split(" ").map((v) => parseInt(v));
    let possible = new Set<number>([inputs[0]!]);
    for (let i = 1; i < inputs.length; ++i) {
      const next = new Set<number>();
      for (const a of possible) {
        next.add(a * inputs[i]);
        next.add(a + inputs[i]);
      }
      possible = next;
    }
    if (possible.has(value)) {
      ret += value;
    }
  }

  await task.output(String(ret));
}
