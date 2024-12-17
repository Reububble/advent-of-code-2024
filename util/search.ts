import { MultiMap } from "util/multiMap.ts";
import { indexOfValue } from "util/sorted.ts";

export function search<T, const U extends unknown[]>(
  initial: T[],
  equivalent: { depth: number; converter: (a: T) => U },
  navigate: (value: T) => "Wall" | "Walk" | "Win",
  evaluate: (value: T) => number,
  explore: (value: T) => T[],
): T | undefined {
  const frontier = initial.map((value) => ({ value, evaluation: evaluate(value) }));
  const explored = new MultiMap<U, number>(equivalent.depth);
  frontier.forEach((v) => explored.set(equivalent.converter(v.value), v.evaluation));
  while (true) {
    const exploring = frontier.shift();
    if (exploring === undefined) {
      return undefined;
    }
    const navigation = navigate(exploring.value);
    if (navigation === "Wall") {
      continue;
    }
    if (navigation === "Win") {
      return exploring.value;
    }
    const exploration = explore(exploring.value).map((value) => ({ value, evaluation: evaluate(value) }));
    for (const explore of exploration) {
      const keys = equivalent.converter(explore.value);
      const before = explored.get(keys);
      if (before !== undefined && before <= explore.evaluation) {
        continue;
      }
      frontier.splice(indexOfValue(frontier.map(({ evaluation }) => evaluation), explore.evaluation), 0, explore);
      explored.set(keys, explore.evaluation);
    }
  }
}

export function searchMany<T, const U extends unknown[]>(
  initial: T[],
  equivalent: { depth: number; converter: (a: T) => U },
  navigate: (value: T) => "Wall" | "Walk" | "Win",
  evaluate: (value: T) => number,
  explore: (value: T) => T[],
): T[] {
  const frontier = initial.map((value) => ({ value, evaluation: evaluate(value) }));
  const explored = new MultiMap<U, number>(equivalent.depth);
  frontier.forEach((v) => explored.set(equivalent.converter(v.value), v.evaluation));
  const wins = new Array<T>();
  while (true) {
    const exploring = frontier.shift();
    if (exploring === undefined) {
      break;
    }
    const navigation = navigate(exploring.value);
    if (navigation === "Wall") {
      continue;
    }
    if (navigation === "Win") {
      wins.push(exploring.value);
    }
    const exploration = explore(exploring.value).map((value) => ({ value, evaluation: evaluate(value) }));
    for (const explore of exploration) {
      const keys = equivalent.converter(explore.value);
      const before = explored.get(keys);
      if (before !== undefined && before < explore.evaluation) {
        continue;
      }
      frontier.push(explore);
      explored.set(keys, explore.evaluation);
    }
  }
  return wins;
}
