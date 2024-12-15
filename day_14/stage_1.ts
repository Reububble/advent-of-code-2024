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

  for (let time = 0; time < 100; ++time) {
    step(robots);
  }

  const quadrants = [[0, 0], [0, 0]];
  for (const robot of robots) {
    const left = robot.pos[0] < 50;
    const right = robot.pos[0] > 50;
    const up = robot.pos[1] < 51;
    const down = robot.pos[1] > 51;
    if (left) {
      if (up) {
        ++quadrants[0][0];
      } else if (down) {
        ++quadrants[1][0];
      }
    } else if (right) {
      if (up) {
        ++quadrants[0][1];
      } else if (down) {
        ++quadrants[1][1];
      }
    }
  }

  await task.output(String(quadrants[0][0] * quadrants[0][1] * quadrants[1][0] * quadrants[1][1]));
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
