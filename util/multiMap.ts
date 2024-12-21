import { getOrSet } from "util/getOrSet.ts";

type CacheMap<Args extends readonly unknown[], Ret> = Args extends [infer A, ...infer Rest] ? Map<A, CacheMap<Rest, Ret>> : Map<null, Ret>;

export class MultiMap<Keys extends readonly unknown[], Value> extends Map<Keys, Value> {
  static create<Keys extends readonly unknown[], Value>(depth: number, entries: Iterable<readonly [Keys, Value]>) {
    const ret = new MultiMap<Keys, Value>(depth);
    for (const [keys, value] of entries) {
      ret.set(keys, value);
    }
    return ret;
  }
  constructor(private readonly depth: number) {
    super();
  }
  #map = new Map() as CacheMap<Keys, Value>;
  override delete(key: Keys): boolean {
    let map = this.#map as undefined | Map<any, any>;
    for (let i = 0; i < this.depth; ++i) {
      map = map?.get(key[i]) as undefined | Map<any, any>;
    }
    return map?.delete(null) ?? false;
  }
  override forEach(callbackfn: (value: Value, key: Keys, map: Map<Keys, Value>) => void, thisArg?: any): void {
    for (const [keys, value] of this) {
      callbackfn.bind(thisArg)(value, keys, this);
    }
  }
  override get(key: Keys): Value | undefined {
    let map = this.#map as undefined | Map<any, any>;
    for (let i = 0; i < this.depth; ++i) {
      map = map?.get(key[i]) as undefined | Map<any, any>;
    }
    return map?.get(null);
  }
  override has(key: Keys): boolean {
    let map = this.#map as undefined | Map<any, any>;
    for (let i = 0; i < this.depth; ++i) {
      map = map?.get(key[i]) as undefined | Map<any, any>;
    }
    return map?.has(null) ?? false;
  }
  override set(key: Keys, value: Value): this {
    let map = this.#map as Map<any, any>;
    for (let i = 0; i < this.depth; ++i) {
      map = getOrSet(map, key[i], new Map()) as Map<any, any>;
    }
    map.set(null, value);
    return this;
  }
  override get size(): number {
    function depthSize(map: Map<any, any>, depth: number) {
      if (depth === 0) {
        return map.size;
      }
      let ret = 0;
      for (const inner of map.values()) {
        ret += depthSize(inner, depth - 1);
      }
      return ret;
    }

    return depthSize(this.#map, this.depth);
  }
  override *entries(): MapIterator<[Keys, Value]> {
    function* entriesDepth(map: Map<any, any>, depth: number): MapIterator<[readonly any[], Value]> {
      if (depth === 0) {
        for (const v of map.values()) {
          yield [[], v];
        }
        return;
      }
      for (const [key, inner] of map) {
        for (const [keys, value] of entriesDepth(inner, depth - 1)) {
          yield [[key, ...keys], value];
        }
      }
    }
    yield* entriesDepth(this.#map, this.depth) as MapIterator<[Keys, Value]>;
  }
  override *keys(): MapIterator<Keys> {
    for (const [keys] of this) {
      yield keys;
    }
  }
  override *values(): MapIterator<Value> {
    for (const [_keys, value] of this) {
      yield value;
    }
  }
  override [Symbol.iterator](): MapIterator<[Keys, Value]> {
    return this.entries();
  }
}
