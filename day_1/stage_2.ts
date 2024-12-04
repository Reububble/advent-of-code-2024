import { getTask } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask("1", "2");

  const lines = task.input.split("\n");
  const match = lines.map((line) => line.match(/(\d+)\s+(\d+)/));
  const pairs = match.filter((pair): pair is [string, string, string] => pair?.length === 3).map((pair) => [Number(pair[1]), Number(pair[2])] as const);

  const left = new Map<number, number>();
  const right = new Map<number, number>();

  for (const [a, b] of pairs) {
    left.set(a, (left.get(a) ?? 0) + 1);
    right.set(b, (right.get(b) ?? 0) + 1);
  }

  let ret = 0;
  for (const [a, count] of left) {
    ret += a * count * (right.get(a) ?? 0);
  }

  await task.output(String(ret));
}
