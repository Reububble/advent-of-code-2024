export function eachGrid(grid: string[], apply: (value: string, x: number, y: number) => boolean | void) {
  for (let y = 0; y < grid.length; ++y) {
    for (let x = 0; x < grid[y].length; ++x) {
      if (apply(grid[y][x], x, y) ?? false) {
        return true;
      }
    }
  }
  return false;
}
