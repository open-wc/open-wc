import { registerElement } from './registerElement.js';

/**
 * Gets the scoped tag name
 *
 * @param {string} tagName
 * @param {Object.<string, typeof HTMLElement>} scopedElements
 * @throws Will throw an error if the tag name is unknown
 * @returns {string}
 */
export function getScopedTagName(tagName, scopedElements = {}) {
  const klass = scopedElements[tagName];

  if (!klass) {
    throw new Error(
      `The tag '${tagName}' is not a registered scoped element. Make sure you add it via static get scopedElements().`,
    );
  }

  return registerElement(tagName, klass);
}
