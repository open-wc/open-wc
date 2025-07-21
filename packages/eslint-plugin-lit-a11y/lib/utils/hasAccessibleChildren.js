import { isHiddenFromScreenReader } from './isHiddenFromScreenReader.js';

/**
 * @param {import('parse5-htmlparser2-tree-adapter').Node} node
 * @return {node is import("parse5-htmlparser2-tree-adapter").Element}
 */
function isElement(node) {
  // NB: this isn't accurate, but suffices for use in `hasAccessibleChildren`.
  return node.type !== 'text' && node.type !== 'comment';
}

/**
 * @param {import('parse5-htmlparser2-tree-adapter').Node} node
 * @return {boolean}
 */
function isAccessibleChild(node) {
  return node.type === 'text' || (isElement(node) && !isHiddenFromScreenReader(node));
}

/**
 * @param {import('parse5-htmlparser2-tree-adapter').Element} element
 */
function hasAccessibleChildren(element) {
  return element.children.some(isAccessibleChild);
}

export { hasAccessibleChildren };
