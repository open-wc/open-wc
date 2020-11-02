import { createUniqueTag } from './createUniqueTag.js';
import { getFromGlobalTagsCache, addToGlobalTagsCache } from './globalTagsCache.js';

/**
 * Checks if klass is a subclass of HTMLElement
 *
 * @param {typeof HTMLElement} klass
 * @returns {boolean}
 */
const extendsHTMLElement = klass => Object.prototype.isPrototypeOf.call(HTMLElement, klass);

/**
 * Defines a custom element
 *
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {CustomElementRegistry} registry
 */
const defineElement = (tagName, klass, registry = customElements) => {
  addToGlobalTagsCache(tagName, klass);
  registry.define(tagName, class extends klass {});
};

/**
 * Stores a lazy element in the cache to be used in future
 *
 * @param {string} tagName
 * @param {CustomElementRegistry} registry
 * @param {import('./Cache.js').Cache<string, string>} tagsCache
 * @returns {string}
 */
const storeLazyElementInCache = (tagName, registry, tagsCache) => {
  const tag = createUniqueTag(tagName, registry);

  if (!tagsCache) {
    throw new Error('Lazy scoped elements requires the use of tags cache');
  }

  tagsCache.set(tagName, tag);

  return tag;
};

/**
 * Define a scoped custom element storing the scoped tag name in the cache
 *
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {import('./Cache.js').Cache<string, string>} tagsCache
 * @returns {string}
 */
const defineElementAndStoreInCache = (tagName, klass, tagsCache) => {
  const registry = customElements;

  if (!extendsHTMLElement(klass)) {
    return storeLazyElementInCache(tagName, registry, tagsCache);
  }

  if (klass === customElements.get(tagName)) {
    addToGlobalTagsCache(tagName, klass);

    return tagName;
  }

  const tag = createUniqueTag(tagName, registry);
  // @ts-ignore
  // we extend it just in case the class has been defined manually
  defineElement(tag, klass, registry);

  return tag;
};

/**
 * Gets a scoped tag name from the cache or generates a new one and defines the element if needed
 *
 * @exports
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {import('./Cache.js').Cache<string, string>} tagsCache
 * @returns {string}
 */
export function registerElement(tagName, klass, tagsCache = undefined) {
  const tag =
    getFromGlobalTagsCache(klass) ||
    (tagsCache && tagsCache.get(tagName)) ||
    defineElementAndStoreInCache(tagName, klass, tagsCache);

  return tag;
}

/**
 * Defines a lazy element
 *
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {import('./Cache.js').Cache<string, string>} tagsCache
 */
export function defineScopedElement(tagName, klass, tagsCache) {
  const tag = tagsCache.get(tagName);

  if (tag) {
    if (customElements.get(tag) === undefined) {
      defineElement(tag, klass, customElements);
    }
  } else {
    tagsCache.set(tagName, registerElement(tagName, klass, tagsCache));
  }
}
