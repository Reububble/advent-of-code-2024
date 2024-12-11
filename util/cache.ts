import { MultiMap } from "util/multiMap.ts";

export function cache<Args extends unknown[], Ret>(
  f: (...args: Args) => Ret,
  uniqueness: (...args: Args) => unknown[] = (...v: Args) => v,
) {
  let cache: MultiMap<unknown[], Ret>;
  return (...args: Args) => {
    cache ??= new MultiMap(args.length);
    const unique = uniqueness(...args);
    if (cache.has(unique)) {
      return cache.get(unique) as Ret;
    }
    const ret = f(...args);
    cache.set(unique, ret);
    return ret;
  };
}
