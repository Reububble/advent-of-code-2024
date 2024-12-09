export function eachPair<T>(list: T[], apply: (a: T, b: T, indexA: number, indexB: number) => boolean | void) {
  for (let indexA = 0; indexA < list.length; ++indexA) {
    const a = list[indexA];
    for (let indexB = 0; indexB < list.length; ++indexB) {
      const b = list[indexB];
      if (apply(a, b, indexA, indexB) ?? false) {
        return true;
      }
    }
  }
  return false;
}
