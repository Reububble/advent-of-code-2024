import { getTask, requiredEnv } from "util/getTask.ts";
import { cost } from "day_13/stage_1.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n)));

  for (let index = 0; index < numbers.length; ++index) {
    const buttonA = numbers[index++] as [number, number];
    const buttonB = numbers[index++] as [number, number];
    const prize = numbers[index++] as [number, number];
    ret += cost(buttonA, buttonB, [prize[0] + 10000000000000, prize[1] + 10000000000000]);
  }

  await task.output(String(ret));
}
