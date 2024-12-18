import { Vec2 } from "util/positions.ts";

export type Indexable<T> = {
  [x: number]: T;
  length: number;
  indexOf(searchElement: T, fromIndex?: number): number;
  [Symbol.iterator](): ArrayIterator<T>;
};

export function eachGrid<T>(grid: Indexable<T>[], apply: (value: T, x: number, y: number) => boolean | void): Vec2 | undefined {
  for (let y = 0; y < grid.length; ++y) {
    for (let x = 0; x < grid[y].length; ++x) {
      if (apply(grid[y][x], x, y) ?? false) {
        return { x, y };
      }
    }
  }
}

export class Grid<T> extends Array<Indexable<T>> {
  static create<T>(data: Indexable<T>[]) {
    const ret = new Grid<T>();
    ret.push(...data);
    return ret;
  }

  findValues(values: T[]) {
    const toFind = [...values];
    const found = new Array<Vec2>(values.length);
    while (toFind.length > 0) {
      const foundOne = this.eachCell((v) => {
        if (toFind.includes(v)) {
          return true;
        }
      });
      if (foundOne === undefined) {
        return found;
      }
      const value = this.atPos(foundOne);
      const index = toFind.indexOf(value);
      found[index] = foundOne;
      delete toFind[index];
    }
    return found;
  }

  atPos(pos: Vec2) {
    return this[pos.y]?.[pos.x];
  }

  eachCell(apply: (value: T, x: number, y: number) => boolean | void) {
    return eachGrid(this, apply);
  }
}
