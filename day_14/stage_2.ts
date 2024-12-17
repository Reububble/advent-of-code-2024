import { getTask, requiredEnv } from "util/getTask.ts";
import { Vector } from "util/vector.ts";

if (import.meta.main) {
  const task = await getTask(requiredEnv("DAY"), requiredEnv("STAGE"));

  const lines = task.input.split(/\r?\n/).slice(0, -1);
  const robots = lines.map((line) =>
    [...line.matchAll(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/g)].map(([_, px, py, vx, vy]) => ({
      pos: Vector.create([Number(px), Number(py)]),
      vel: Vector.create([Number(vx), Number(vy)]),
    }))[0]
  );

  let varStep = variance(robots);
  const lowestXVariance = { time: 0, var: varStep[0] };
  const lowestYVariance = { time: 0, var: varStep[1] };

  for (let time = 0; time < 103; ++time) {
    step(robots);
    varStep = variance(robots);
    if (varStep[0] < lowestXVariance.var) {
      lowestXVariance.time = time + 1;
      lowestXVariance.var = varStep[0];
    }
    if (varStep[1] < lowestYVariance.var) {
      lowestYVariance.time = time + 1;
      lowestYVariance.var = varStep[1];
    }
  }

  await task.output(String(moduloMatch(lowestXVariance.time, lowestYVariance.time)));
}

function variance(robots: {
  pos: Vector;
  vel: Vector;
}[]) {
  const average = Vector.create([0, 0]);
  robots.forEach(({ pos }) => average.add(pos));
  average.div(robots.length);
  const variance = Vector.create([0, 0]);
  robots.forEach(({ pos }) => {
    const delta = pos.copy().sub(average);
    variance.add(Vector.create([delta[0] ** 2, delta[1] ** 2]));
  });
  variance.div(robots.length);
  return variance;
}

function step(robots: { pos: Vector; vel: Vector }[]) {
  for (const robot of robots) {
    robot.pos.add(robot.vel);
    robot.pos[0] %= 101;
    robot.pos[0] += 101;
    robot.pos[0] %= 101;

    robot.pos[1] %= 103;
    robot.pos[1] += 103;
    robot.pos[1] %= 103;
  }
}

function moduloMatch(x: number, y: number) {
  const d = (x - y) % (103 - 101) === 0 ? 0 : 1;
  const b = (x + 101 * d - y) / (103 - 101);
  const n = y + 103 * b;
  return n;
}
