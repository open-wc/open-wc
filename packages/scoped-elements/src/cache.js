const cache = new WeakMap(); // should it be garbage collected?

export const fromCache = (strings) =>  cache.get(strings);
export const toCache = (key, value) => {
  cache.set(key, value);

  return value;
};
