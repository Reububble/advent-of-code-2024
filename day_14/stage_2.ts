import { getTask, requiredEnv } from "util/getTask.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const x = 86; // Iterations before horizontal pattern
  const y = 51; // Iterations before vertical pattern
  const d = (x - y) % (103 - 101) === 0 ? 0 : 1;
  const b = (x + 101 * d - y) / (103 - 101);
  const n = y + 103 * b;

  await task.output(String(n));
}
