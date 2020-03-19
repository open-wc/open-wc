/**
 * The global cache for tag names
 *
 * @type {Map<typeof HTMLElement, string>}
 */
const globalTagsCache = new Map();

/**
 * Adds a tag to the global cache
 *
 * @param {string} tag
 * @param {typeof HTMLElement} klass
 */
export const addToGlobalTagsCache = (tag, klass) => globalTagsCache.set(klass, tag);

/**
 * Gets a tag from the global cache
 *
 * @exports
 * @param {typeof HTMLElement} klass
 * @returns {undefined|string}
 */
export const getFromGlobalTagsCache = klass => globalTagsCache.get(klass);
