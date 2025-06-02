import { isAriaHidden } from './aria.js';
import { isHiddenFromScreenReader } from './isHiddenFromScreenReader.js';
import { isPresentationRole } from './isPresentationRole.js';

/**
 * @param {import("parse5-htmlparser2-tree-adapter").Element} element
 * @return {boolean}
 */
function isIncludedInAOM(element) {
  return (
    !isHiddenFromScreenReader(element) &&
    !isPresentationRole(element.attribs) &&
    !isAriaHidden(element)
  );
}

export { isIncludedInAOM };
