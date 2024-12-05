import { getTask } from "util/getTask.ts";
import { getOrders, getSections } from "day_5/stage_1.ts";

if (import.meta.main) {
  const task = await getTask("5", "2");

  let ret = 0;

  const { section1, section2 } = getSections(task.input);
  const orders = getOrders(section1);

  for (const line of section2) {
    const numbers = line.split(",");
    if (makeCorrections(numbers, orders)) {
      ret += Number(numbers[(numbers.length - 1) / 2]);
    }
  }

  await task.output(String(ret));
}

function makeCorrections(numbers: string[], orders: Map<string, string[]>) {
  let correct = true;
  for (let i = 0; i < numbers.length; ++i) {
    // make sure i is correct
    const before = orders.get(numbers[i]) ?? [];
    for (let j = i + 1; j < numbers.length; ++j) {
      if (before.includes(numbers[j])) {
        // swap
        [numbers[j], numbers[i]] = [numbers[i], numbers[j]];
        i = -1;
        correct = false;
        break;
      }
    }
    if (!correct && i > (numbers.length - 1) / 2) {
      return true;
    }
  }
  return false;
}
