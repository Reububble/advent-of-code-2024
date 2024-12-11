/**
 * Counts the number of digits in the positive integer
 */
export function integerDigits(int: number) {
  return Math.floor(Math.log10(int)) + 1;
}
