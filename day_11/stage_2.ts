import { getTask, requiredEnv } from "util/getTask.ts";
import { cache } from "util/cache.ts";
import { integerDigits } from "../util/integerDigits.ts";

const blink = (i: number, stone: number): number => {
  if (i === 0) {
    return 1;
  }
  if (stone === 0) {
    return blinker(i - 1, 1);
  } else {
    const digits = integerDigits(stone);
    if (digits % 2 === 0) {
      const pow10 = 10 ** (digits / 2);
      return blinker(i - 1, Math.floor(stone / pow10)) + blinker(i - 1, stone % pow10);
    } else {
      return blinker(i - 1, stone * 2024);
    }
  }
};

const blinker = cache(blink);

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n)));

  const stones = numbers[0];

  for (const stone of stones) {
    ret += blinker(75, stone);
  }

  await task.output(String(ret));
}
