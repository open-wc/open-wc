/**
 * The global cache for tag names
 *
 * @type {WeakMap<typeof HTMLElement, string>}
 */
const globalTagsCache = new WeakMap();

/**
 * Adds a tag to the global tags cache
 *
 * @param {string} tag
 * @param {typeof HTMLElement} klass
 */
export const addToGlobalTagsCache = (tag, klass) => globalTagsCache.set(klass, tag);

/**
 * Gets a tag from the global tags cache
 *
 * @exports
 * @param {typeof HTMLElement} klass
 * @returns {undefined|string}
 */
export const getFromGlobalTagsCache = klass => globalTagsCache.get(klass);
