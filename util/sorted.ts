/**
 * Find the index you would find the value at in the sorted array
 * @param array a list sorted on `<`
 * @param value the value to find the index of
 * @returns the index the value should have
 */
export function indexOfValue<T>(array: T[], value: T) {
  let low = 0;
  let high = array.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (array[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

export function indexOfEvaluation<T, U>(array: T[], value: U, evaluation: (value: T) => U) {
  let low = 0;
  let high = array.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (evaluation(array[mid]) < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

export function insertIntoSorted<T>(array: T[], value: T) {
  const index = indexOfValue(array, value);
  array.splice(index, 0, value);
}

export function insertIntoSortedEvaluated<T, U>(array: T[], value: T, evaluation: (value: T) => U) {
  const index = indexOfEvaluation(array, evaluation(value), evaluation);
  array.splice(index, 0, value);
}
