import { getTask } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask("3", "2");

  let ret = 0;
  const dos = task.input.split("do()").map((dos) => dos.split("don't()")[0]);
  for (const doing of dos) {
    for (const [_, x, y] of doing.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
      ret += parseInt(x) * parseInt(y);
    }
  }

  await task.output(String(ret));
}
