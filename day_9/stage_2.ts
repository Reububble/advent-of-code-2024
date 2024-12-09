import { getTask, requiredEnv } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  let ret = 0;
  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const line = lines[0];

  const onOff = new Array<[number, number, number]>();
  for (let i = 0, id = 0; i < line.length; ++id) {
    const a = parseInt(line[i++]);
    const b = parseInt(line[i++] ?? "0");
    onOff.push([a, b, id]);
  }

  for (let i = onOff.length - 1; i >= 0; --i) {
    const on = onOff[i][0];
    const id = onOff[i][2];
    for (let j = 0; j < i; ++j) {
      const off = onOff[j][1];
      if (off >= on) {
        onOff[j][1] = 0;
        onOff[i][0] = 0;
        onOff[i][1] += on;
        onOff[i][2] = 0;
        onOff.splice(j + 1, 0, [on, off - on, id]);
        ++i;
        break;
      }
    }
  }

  const space = new Array<number>();
  for (const [on, off, id] of onOff) {
    space.push(...new Array<number>(on).fill(id));
    space.push(...new Array<number>(off));
  }

  space.forEach((id, index) => ret += (id ?? 0) * index);

  await task.output(String(ret));
}
