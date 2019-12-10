import { createUniqueTag } from "./tag.js";

const registeredElements = new Map();
const registerElement = (klass, tag) => registeredElements.set(klass, tag);
const getRegisteredTag = klass => registeredElements.get(klass);

const defineElement = (myRegistry, klass) => {
  const registry = myRegistry || customElements;
  const tag = createUniqueTag(registry, klass);

  // we extends it just in case the class has been defined manually
  registry.define(tag, class extends klass {
  });
  registerElement(klass, tag);

  return tag;
};

export const registerElements = (elements, myRegistry) => Object.keys(elements)
    .reduce((acc, key) => {
      const klass = elements[key];
      acc[key] = getRegisteredTag(klass) || defineElement(myRegistry, klass);

      return acc;
    }, {});

export const getTags = (elements, myRegistry) =>
    elements.map(klass => getRegisteredTag(klass) || defineElement(myRegistry, klass));
