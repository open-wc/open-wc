// @ts-nocheck
import { createUniqueTag } from './tag.js';

const tagsCache = new Map();
const registerElement = (klass, tag) => tagsCache.set(klass, tag);
const getRegisteredTag = klass => tagsCache.get(klass);

const defineElement = klass => {
  const registry = customElements;
  const tag = createUniqueTag(registry, klass);

  // we extend it just in case the class has been defined manually
  registry.define(tag, class extends klass {});
  registerElement(klass, tag);

  return tag;
};

export const registerElements = elements =>
  Object.keys(elements).reduce((acc, key) => {
    const klass = elements[key];
    acc[key] = getRegisteredTag(klass) || defineElement(klass);

    return acc;
  }, {});
