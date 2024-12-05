import { getTask } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask("5", "1");

  let ret = 0;

  const { section1, section2 } = getSections(task.input);
  const orders = getOrders(section1);

  for (const line of section2) {
    const numbers = line.split(",");
    if (isCorrect(numbers, orders)) {
      ret += Number(numbers[(numbers.length - 1) / 2]);
    }
  }

  await task.output(String(ret));
}

function isCorrect(numbers: string[], orders: Map<string, string[]>) {
  for (let i = 0; i < numbers.length; ++i) {
    const before = orders.get(numbers[i]) ?? [];
    for (let j = i + 1; j < numbers.length; ++j) {
      if (before.includes(numbers[j])) {
        return false;
      }
    }
  }
  return true;
}

export function getSections(input: string) {
  const rows = input.split("\n");

  const section = rows.findIndex((row) => row.length === 0);
  const section1 = rows.slice(0, section);
  const section2 = rows.slice(section + 1);
  return { section1, section2 };
}

export function getOrders(section1: string[]) {
  const orders = new Map<string, string[]>();
  section1.forEach((line) => {
    const ordering = line.split("|") as [string, string];
    const before = orders.get(ordering[1]) ?? [];
    orders.set(ordering[1], before);
    before.push(ordering[0]);
  });
  return orders;
}
