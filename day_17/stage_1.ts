import { getTask, requiredEnv } from "util/getTask.ts";
import { Grid } from "util/eachGrid.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const numbers = Grid.create(lines.map((line) => [...line.matchAll(/\d+/g)].map(([n]) => Number(n))));

  const registers: Registers = { a: BigInt(numbers[0][0]), b: BigInt(numbers[1][0]), c: BigInt(numbers[2][0]), i: 0 };
  const prog = numbers[4] as OpCode[];

  const ret = [...solve(prog, registers)];

  await task.output(String(ret));
}

export type Registers = {
  a: bigint;
  b: bigint;
  c: bigint;
  i: number;
};

function comboValue(combo: OpCode, registers: Registers) {
  switch (combo) {
    case 0:
      return 0n;
    case 1:
      return 1n;
    case 2:
      return 2n;
    case 3:
      return 3n;
    case 4:
      return registers.a;
    case 5:
      return registers.b;
    case 6:
      return registers.c;
    case 7:
      throw new Error("Malformed");
  }
}

export type OpCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function* operate(opcode: OpCode, operand: OpCode, registers: Registers) {
  switch (opcode) {
    case 0:
      registers.a = registers.a / 2n ** comboValue(operand, registers);
      break;
    case 1:
      registers.b = registers.b ^ BigInt(operand);
      break;
    case 2:
      registers.b = comboValue(operand, registers) % 8n;
      break;
    case 3:
      if (registers.a === 0n) {
        break;
      }
      registers.i = operand - 2;
      break;
    case 4:
      registers.b = registers.b ^ registers.c;
      break;
    case 5:
      yield Number(comboValue(operand, registers) % 8n);
      break;
    case 6:
      registers.b = registers.a / 2n ** comboValue(operand, registers);
      break;
    case 7:
      registers.c = registers.a / 2n ** comboValue(operand, registers);
      break;
  }
}

export function* solve(prog: OpCode[], registers: Registers) {
  while (true) {
    const opcode = prog[registers.i];
    const operand = prog[registers.i + 1];

    if (opcode === undefined || operand === undefined) {
      return;
    }
    yield* operate(opcode, operand, registers);
    registers.i += 2;
  }
}
