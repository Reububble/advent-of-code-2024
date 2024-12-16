import { Indexable } from "util/eachGrid.ts";

export function findSymbol<T>(find: T, map: Indexable<T>[]) {
  for (let y = 0; y < map.length; ++y) {
    const x = map[y].indexOf(find);
    if (x !== -1) {
      return { x, y };
    }
  }
  throw new Error(`Cannot find ${find}`);
}
