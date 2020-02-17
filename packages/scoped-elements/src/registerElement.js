import { createUniqueTag } from './createUniqueTag.js';

/**
 * Global cache for tag names
 *
 * @type {Map<typeof HTMLElement, string>}
 */
const tagsCache = new Map();

/**
 * Adds a tag to the cache
 *
 * @param {string} tag
 * @param {typeof HTMLElement} klass
 */
const addToTagsCache = (tag, klass) => tagsCache.set(klass, tag);

/**
 * Gets a tag from the cache
 *
 * @exports
 * @param {typeof HTMLElement} klass
 * @returns {undefined|string}
 */
export const getFromTagsCache = klass => tagsCache.get(klass);

/**
 * Define an scoped custom element storing the scoped tag name in the cache
 *
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @returns {string}
 */
const defineElement = (tagName, klass) => {
  const registry = customElements;
  const tag = createUniqueTag(registry, tagName);

  // we extend it just in case the class has been defined manually
  registry.define(tag, class extends klass {});
  addToTagsCache(tag, klass);

  return tag;
};

/**
 * Gets an scoped tag name from cache or generates a new one and defines the element if needed
 *
 * @exports
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @returns {string}
 */
export function registerElement(tagName, klass) {
  return getFromTagsCache(klass) || defineElement(tagName, klass);
}
