import { getTask, requiredEnv } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n)));

  let stones = numbers[0];

  for (let blink = 0; blink < 25; ++blink) {
    const newStones = new Array<number>();
    let j = 0;
    stones.forEach((stone) => {
      if (stone === 0) {
        newStones[j++] = 1;
      } else if (String(stone).length % 2 === 0) {
        const length = String(stone).length;
        newStones[j++] = Number(String(stone).slice(0, length / 2));
        newStones[j++] = Number(String(stone).slice(length / 2));
      } else {
        newStones[j++] = stone * 2024;
      }
    });
    stones = newStones;
  }

  await task.output(String(stones.length));
}
