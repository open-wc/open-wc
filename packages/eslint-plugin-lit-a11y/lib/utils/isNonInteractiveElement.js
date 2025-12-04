import { isCustomElement } from './isCustomElement.js';
import { isInteractiveElement } from './isInteractiveElement.js';

/**
 * @param {import("parse5-htmlparser2-tree-adapter").Element} element
 * @return {boolean}
 */
function isNonInteractiveElement(element, options) {
  // NOTE: nullish coalescing would be nice here
  const allowCustomElements = 'allowCustomElements' in options ? options.allowCustomElements : true;
  const allowList = options.allowList || [];

  if (allowCustomElements && isCustomElement(element)) return false;
  if (allowList.includes(element.name)) return false;

  return !isInteractiveElement(element);
}

export { isNonInteractiveElement };
