import { getTask } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask("3", "1");

  let ret = 0;
  for (const [_,x,y] of task.input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
    ret += parseInt(x) * parseInt(y);
  }

  await task.output(String(ret));
}
