import { isTemplateResult } from 'lit/directive-helpers.js';

export const isIterable = object => object != null && typeof object[Symbol.iterator] === 'function';

function isValidNonIterableRenderArg(x) {
  return (
    isTemplateResult(x) ||
    x instanceof Node ||
    typeof x === 'number' ||
    typeof x === 'boolean' ||
    typeof x === 'string'
  );
}

export function isValidRenderArg(x) {
  return isIterable(x) ? [...x].every(isValidNonIterableRenderArg) : isValidNonIterableRenderArg(x);
}

/**
 * Node#nodeType enum
 * @readonly
 * @enum {number}
 */
export const NODE_TYPES = Object.freeze({
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
  COMMENT_NODE: 8,
  DOCUMENT_FRAGMENT_NODE: 11,
});
