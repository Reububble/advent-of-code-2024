import { getTask, requiredEnv } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n)));

  for (let index = 0; index < numbers.length; ++index) {
    const buttonA = numbers[index++] as [number, number];
    const buttonB = numbers[index++] as [number, number];
    const prize = numbers[index++] as [number, number];
    ret += cost(buttonA, buttonB, [prize[0], prize[1]]);
  }

  await task.output(String(ret));
}

export function cost(buttonA: [number, number], buttonB: [number, number], prize: [number, number]): number {
  const b = (buttonA[0] * prize[1] - buttonA[1] * prize[0]) / (buttonA[0] * buttonB[1] - buttonA[1] * buttonB[0]);
  if (b % 1 !== 0) {
    return 0;
  }
  const a = (prize[0] - buttonB[0] * b) / buttonA[0];
  if (a % 1 !== 0) {
    return 0;
  }

  return a * 3 + b;
}
