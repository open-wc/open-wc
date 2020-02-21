import { registerElement } from './registerElement.js';

/**
 * Creates a scoped element
 *
 * @param {string} tagName
 * @param {Object.<string, typeof HTMLElement>} scopedElements
 * @throws Will throw an error if the tag name is unknown
 * @returns {HTMLElement}
 */
export function createScopedElement(tagName, scopedElements = {}) {
  const klass = scopedElements[tagName];

  if (!klass) {
    throw new Error(
      `The tag '${tagName}' is not a registered scoped element. Make sure you add it via static get scopedElements().`,
    );
  }

  return document.createElement(registerElement(tagName, klass));
}
