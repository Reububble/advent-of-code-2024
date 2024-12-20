import { Dir2, moved, Vec2 } from "util/positions.ts";
import { Grid } from "util/eachGrid.ts";

export function applyMoves(map: Grid<string>, moves: ("^" | ">" | "v" | "<")[]) {
  let [pos] = map.findValues(["@"]);

  for (const move of moves) {
    const push = canPush(map, pos, move);
    if (push.can) {
      push.do();
      pos = moved(pos, move);
    }
  }
}
function canPush(map: Grid<string>, pos: Vec2, move: Dir2): { can: false } | { can: true; do: () => void } {
  const to = moved(pos, move);
  const here = map.atPos(pos);
  const adjacent = map.atPos(to);
  const swap = () => {
    // Make sure this hasn't already been swapped
    if (here === map[pos.y][pos.x]) {
      [map[to.y][to.x], map[pos.y][pos.x]] = [here, adjacent];
    }
  };
  switch (adjacent) {
    case "#":
      return { can: false };
    case ".":
      return { can: true, do: swap };
    case "[":
    case "]":
      if (move === "^" || move === "v") {
        const front = canPush(map, to, move);
        const side = canPush(map, moved(to, adjacent === "[" ? ">" : "<"), move);
        return front.can && side.can
          ? {
            can: true,
            do: () => {
              front.do();
              side.do();
              swap();
            },
          }
          : { can: false };
      }
    // fall through
    case "O": {
      const push = canPush(map, to, move);
      return push.can
        ? {
          can: true,
          do: () => {
            push.do();
            swap();
          },
        }
        : { can: false };
    }
  }
  throw new Error(`Unknown object ${adjacent}`);
}
