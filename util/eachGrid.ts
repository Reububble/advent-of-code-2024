export type Indexable<T> = {
  [x: number]: T;
  length: number;
};

export function eachGrid<T>(grid: Indexable<T>[], apply: (value: T, x: number, y: number) => boolean | void) {
  for (let y = 0; y < grid.length; ++y) {
    for (let x = 0; x < grid[y].length; ++x) {
      if (apply(grid[y][x], x, y) ?? false) {
        return true;
      }
    }
  }
  return false;
}
