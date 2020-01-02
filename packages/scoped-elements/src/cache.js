const templatesCache = new WeakMap();

export const fromCache = strings => templatesCache.get(strings);
export const toCache = (key, value) => {
  templatesCache.set(key, value);

  return value;
};
