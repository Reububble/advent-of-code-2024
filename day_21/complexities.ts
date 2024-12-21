import { memoize } from "util/memoize.ts";
import { MultiMap } from "util/multiMap.ts";
import { Dir2, moved, Vec2 } from "util/positions.ts";

const keypadGrid = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [/**/, "0", "A"],
] as string[][];

const remoteGrid = [
  [/**/, "^", "A"],
  ["<", "v", ">"],
] as string[][];

const keypadKeyPos = new Map(keypadGrid.flatMap((row, y) => row.map((button, x) => [button, { x, y }])));
const remoteKeyPos = new Map(remoteGrid.flatMap((row, y) => row.map((button, x) => [button, { x, y }])));
const keypadPosKey = MultiMap.create<[number, number], string>(2, keypadKeyPos.entries().map(([key, pos]) => [[pos.x, pos.y], key]));
const remotePosKey = MultiMap.create<[number, number], string>(2, remoteKeyPos.entries().map(([key, pos]) => [[pos.x, pos.y], key]));

type Keypad = {
  keyPos: Map<string, Vec2>;
  posKey: MultiMap<[number, number], string>;
};

const keypad: Keypad = { keyPos: keypadKeyPos, posKey: keypadPosKey };
const remote: Keypad = { keyPos: remoteKeyPos, posKey: remotePosKey };

const requiredInputs = memoize(
  (nextOutput: string, robots: Keypad[]): { instructions: bigint }[] => {
    const ret = robots.map(() => ({ instructions: 0n }));
    let pos = robots[0].keyPos.get("A")!;
    for (const char of nextOutput) {
      const charPos = robots[0].keyPos.get(char)!;
      const dx = charPos.x - pos.x;
      const dy = charPos.y - pos.y;

      if (robots.length === 1) {
        ret[0].instructions += BigInt(Math.abs(dx) + Math.abs(dy) + 1);
      } else {
        const movements = [...dirs(dx, dy)].filter((instruction) => {
          let testPos = pos;
          for (const char of instruction) {
            testPos = moved(testPos, char as Dir2);
            if (robots[0].posKey.get([testPos.x, testPos.y]) === undefined) {
              return false;
            }
          }
          return true;
        });

        const options = movements.map((a) => a + "A").map((instructions) => ({
          instructions,
          robots: requiredInputs(instructions, robots.slice(1)),
        }));
        const min = options.slice(1).reduce((p, v) => p.robots.at(-1)!.instructions <= v.robots.at(-1)!.instructions ? p : v, options[0]);

        ret[0].instructions += BigInt(min.instructions.length);
        min.robots.forEach((v, i) => {
          ret[i + 1].instructions += v.instructions;
        });
      }
      pos = charPos;
    }
    return ret;
  },
  (a, b) => [a, b.length],
);

function* dirs(dx: number, dy: number): Generator<string, undefined, undefined> {
  if (dx === 0 && dy === 0) {
    yield "";
  }
  if (dx > 0) {
    yield* [...dirs(dx - 1, dy)].map((v) => ">" + v);
  }
  if (dy > 0) {
    yield* [...dirs(dx, dy - 1)].map((v) => "v" + v);
  }
  if (dx < 0) {
    yield* [...dirs(dx + 1, dy)].map((v) => "<" + v);
  }
  if (dy < 0) {
    yield* [...dirs(dx, dy + 1)].map((v) => "^" + v);
  }
}

export function complexities(codes: string[], robotCount: number) {
  return codes.reduce(
    (sum, code) => sum + requiredInputs(code, [keypad, ...new Array(robotCount - 1).fill(remote)]).at(-1)!.instructions * BigInt(parseInt(code)),
    0n,
  );
}
