import { getTask, requiredEnv } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const line = lines[0];

  const space = new Array<number>();
  let id = 0;
  let on = true;
  for (let i = 0; i < line.length; ++i) {
    const a = parseInt(line[i]);
    const add = new Array<number>(a);
    if (on) {
      space.push(...add.fill(id));
      ++id;
    } else {
      space.push(...add);
    }
    on = !on;
  }

  let available = 0;

  for (let i = space.length - 1; i >= 0; --i) {
    if (space[i] === undefined) {
      space.length = i;
      continue;
    }
    const next = space.slice(available, i).findIndex((v) => v === undefined);
    if (next === -1) {
      break;
    }
    available += next;
    space[available] = space[i];
    space.length = i;
  }

  space.forEach((id, index) => ret += id * index);

  await task.output(String(ret));
}
