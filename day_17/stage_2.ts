import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";
import { OpCode, Registers, solve } from "day_17/stage_1.ts";

/**
 * The program can be rewritten as:
 * do {
 *   B = (A & 111) ^ 001
 *   A = A >>> 3
 *   C = A >>> B
 *   D = 110 ^ C
 *   out B ^ D
 * } until (A === 0);
 *
 * We can work backwards from the exit condition (A === 0).
 * Each iteration, A is bitshifted to the right by 3.
 * This means iterations do not depend on prior iterations.
 *
 * Solve using a recursive algorithm that fills 3 bits at a time.
 * Backtracking is required.
 */

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = Grid.create(lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n))));
  const prog = [...numbers[4] as OpCode[]];

  const b = BigInt(numbers[1][0]);
  const c = BigInt(numbers[2][0]);
  const ret = solveForProg(0n, b, c, prog, 0);
  const prog2 = [...solve(prog, { a: ret!, b, c, i: 0 })];
  if (prog2.some((v, i) => v !== prog[i])) {
    throw new Error(`${ret} is incorrect`);
  }
  await task.output(String(ret));
}

function solveForProg(A: bigint, b: bigint, c: bigint, prog: OpCode[], i: number): undefined | bigint {
  for (let a = 0n; a < 8n; ++a) {
    const registers: Registers = { a: A + a, b, c, i: 0 };
    const next = solve(prog, registers).next();
    if (next.done === true) {
      continue;
    }
    if (next.value !== prog[prog.length - 1 - i]) {
      continue;
    }
    if (i === prog.length - 1) {
      return A | a;
    }
    const solution = solveForProg((A | a) << 3n, b, c, prog, i + 1);
    if (solution !== undefined) {
      return solution;
    }
    // Backtrack
  }
}
