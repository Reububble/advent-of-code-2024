import { getTask } from "util/getTask.ts";
import { indexOfValue } from "util/sorted.ts";

if (import.meta.main) {
  const task = await getTask("1", "1");

  const lines = task.input.split("\n");
  const match = lines.map((line) => line.match(/(\d+)\s+(\d+)/));
  const pairs = match.filter((pair): pair is [string, string, string] => pair?.length === 3).map((pair) => [Number(pair[1]), Number(pair[2])] as const);

  const left = new Array<number>();
  const right = new Array<number>();

  for (const [a, b] of pairs) {
    left.splice(indexOfValue(left, a), 0, a);
    right.splice(indexOfValue(right, b), 0, b);
  }

  let ret = 0;
  for (let i = 0; i < pairs.length; ++i) {
    ret += Math.abs(left[i] - right[i]);
  }

  await task.output(String(ret));
}
