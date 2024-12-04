import { getTask } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask("4", "1");

  let ret = 0;

  const rows = task.input.split("\n");

  for (let y = 0; y < rows.length; ++y) {
    for (let x = 0; x < rows[0].length; ++x) {
      if (rows[y][x] !== "X") {
        continue;
      }
      if (x >= 3 && rows[y][x - 1] === "M" && rows[y][x - 2] === "A" && rows[y][x - 3] === "S") {
        ++ret;
      }
      if (y >= 3 && rows[y - 1][x] === "M" && rows[y - 2][x] === "A" && rows[y - 3][x] === "S") {
        ++ret;
      }
      if (x >= 3 && y >= 3 && rows[y - 1][x - 1] === "M" && rows[y - 2][x - 2] === "A" && rows[y - 3][x - 3] === "S") {
        ++ret;
      }

      if (x <= rows[0].length - 4 && rows[y][x + 1] === "M" && rows[y][x + 2] === "A" && rows[y][x + 3] === "S") {
        ++ret;
      }
      if (y <= rows.length - 4 && rows[y + 1][x] === "M" && rows[y + 2][x] === "A" && rows[y + 3][x] === "S") {
        ++ret;
      }
      if (x <= rows[0].length - 4 && y <= rows.length - 4 && rows[y + 1][x + 1] === "M" && rows[y + 2][x + 2] === "A" && rows[y + 3][x + 3] === "S") {
        ++ret;
      }

      if (x >= 3 && y <= rows.length - 4 && rows[y + 1][x - 1] === "M" && rows[y + 2][x - 2] === "A" && rows[y + 3][x - 3] === "S") {
        ++ret;
      }
      if (x <= rows[0].length - 4 && y >= 3 && rows[y - 1][x + 1] === "M" && rows[y - 2][x + 2] === "A" && rows[y - 3][x + 3] === "S") {
        ++ret;
      }
    }
  }

  await task.output(String(ret));
}
