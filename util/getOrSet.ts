export function getOrSet<A, B>(map: Map<A, B>, key: A, value: B) {
  const ret = map.get(key) ?? value;
  map.set(key, ret);
  return ret;
}
