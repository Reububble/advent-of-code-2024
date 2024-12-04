import { getTask } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask("4", "2");

  let ret = 0;

  const rows = task.input.split("\n");

  for (let y = 1; y < rows.length - 1; ++y) {
    for (let x = 1; x < rows[0].length - 1; ++x) {
      if (rows[y][x] !== "A") {
        continue;
      }
      if (rows[y - 1][x - 1] === "M" && rows[y + 1][x + 1] === "S" || rows[y - 1][x - 1] === "S" && rows[y + 1][x + 1] === "M") {
        if (rows[y - 1][x + 1] === "M" && rows[y + 1][x - 1] === "S" || rows[y - 1][x + 1] === "S" && rows[y + 1][x - 1] === "M") {
          ++ret;
        }
      }
    }
  }

  await task.output(String(ret));
}
