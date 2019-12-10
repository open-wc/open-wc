const stringsCache = new WeakMap();

export const getFromCache = (strings, values) => {
  if (values.length === 0) {
    return [strings];
  }

  const cached = stringsCache.get(strings);
  if (!cached) {
    return undefined; // cache failure
  }

  if (strings === cached.strings) {
    return [strings, ...values];
  }

  for (let i = 0; i < cached.keys.length; i += 1) {
    if (values[cached.keys[i][0]] !== cached.keys[i][1]) {
      return undefined; // cache failure
    }
  }

  return [cached.strings, ...cached.indexes.map(index => values[index])];
};

export const toCache = (key, { keys = {}, indexes = [], strings }) => {
  stringsCache.set(key, { keys, indexes, strings });
};
