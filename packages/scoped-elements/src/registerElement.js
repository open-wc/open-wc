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
  registry.define(tagName, class extends klass {});
  addToGlobalTagsCache(tagName, klass);
};

/**
 * Define a scoped custom element storing the scoped tag name in the cache
 *
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {Map<string, string>} tagsCache
 * @returns {string}
 */
const defineElementAndStoreInCache = (tagName, klass, tagsCache) => {
  const registry = customElements;
  const tag = createUniqueTag(tagName, registry);

  if (extendsHTMLElement(klass)) {
    // @ts-ignore
    // we extend it just in case the class has been defined manually
    defineElement(tag, klass, registry);
  } else {
    if (!tagsCache) {
      throw new Error('Lazy scoped elements requires the use of tags cache');
    }

    tagsCache.set(tagName, tag);
  }

  return tag;
};

/**
 * Gets a scoped tag name from the cache or generates a new one and defines the element if needed
 *
 * @exports
 * @param {string} tagName
 * @param {typeof HTMLElement} klass
 * @param {Map<string, string>} tagsCache
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
 * @param {Map<string, string>} tagsCache
 */
export function defineScopedElement(tagName, klass, tagsCache) {
  const tag = tagsCache.get(tagName);

  defineElement(tag, klass, customElements);
}
