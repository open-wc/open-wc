/* eslint-disable no-param-reassign */
import { isElement, isParentNode } from './parse5-utils.js';

const defaultIgnoresTags = ['style', 'script', '#comment'];

function filterNode(node, ignoredTags) {
  return !defaultIgnoresTags.includes(node.nodeName) && !ignoredTags.includes(node.nodeName);
}

function sortAttributes(attrs) {
  return (
    attrs
      // Sort attributes
      .map(attr => {
        if (attr.name === 'class') {
          attr.value = attr.value
            .trim()
            .split(/\s+/)
            .sort()
            .join(' ');
        }

        return attr;
      })
      // Sort classes
      .sort((attrA, attrB) => {
        const a = attrA.name.toLowerCase();
        const b = attrB.name.toLowerCase();

        if (a < b) {
          return -1;
        }

        if (a > b) {
          return 1;
        }

        return 0;
      })
  );
}

/**
 * Normalized AST tree, normlaizing whitespace, attribute + class order etc. Not a pure function,
 * mutates input.
 * @param {ASTNode} node
 * @param {string[]} ignoredTags
 */
export function normalizeAST(node, ignoredTags = []) {
  if (isElement(node)) {
    node.attrs = sortAttributes(node.attrs);
  }

  if (isParentNode(node)) {
    node.childNodes = node.childNodes.filter(child => filterNode(child, ignoredTags));
    node.childNodes.forEach(child => normalizeAST(child, ignoredTags));
  }
}
