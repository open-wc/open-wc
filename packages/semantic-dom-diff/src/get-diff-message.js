import { isElement, isTextNode } from './parse5-utils.js';

export const isAttribute = arg => arg && 'name' in arg && 'value' in arg;
const { isArray } = Array;

/**
 * @param {ASTNode | Attribute} arg
 * @returns {string} the human readable diff identifier
 */
function getIdentifier(arg) {
  if (isTextNode(arg)) {
    return `text "${arg.value}"`;
  }

  if (isElement(arg)) {
    return `tag <${arg.tagName}>`;
  }

  if (isAttribute(arg)) {
    return arg.value ? `attribute [${arg.name}="${arg.value}"]` : `attribute [${arg.name}]`;
  }

  throw new Error(`Unknown arg: ${arg}`);
}

/**
 * Asserts that the diff is an array diff, returns type assertions to remove optional props.
 * @returns {boolean}
 */
function isArrayDiff(diff) {
  return diff.kind === 'A' && !!diff.item && typeof diff.index === 'number';
}

const messageTemplates = {
  // New diff
  N: (diff, lhs, rhs) => `${getIdentifier(rhs)} has been added`,
  // Edit diff
  E: (diff, lhs, rhs) => `${getIdentifier(lhs)} was changed to ${getIdentifier(rhs)}`,
  // Delete diff
  D: (diff, lhs) => `${getIdentifier(lhs)} has been removed`,
};

/**
 * Generates a human understandable message for a HTML diff.
 *
 * @param {object} diff The diff
 * @param {object | object[]} lhs The left hand side diffed object.
 *  Can be a HTML ASTNode or an Attribute.
 * @param {object | object[]} rhs The left hand side diffed object.
 *  Can be a HTML ASTNode or an Attribute.
 *
 * @returns the message
 */
export function getDiffMessage(diff, lhs, rhs) {
  // Array diff
  if (isArray(lhs) || isArray(rhs)) {
    if (!isArrayDiff(diff) || !isArray(lhs) || !isArray(rhs)) {
      throw new Error('Not all arguments are array diffs');
    }

    return getDiffMessage(diff.item, lhs[diff.index], rhs[diff.index]);
  }

  // Non-array diff
  if (diff.kind in messageTemplates) {
    return messageTemplates[diff.kind](diff, lhs, rhs);
  }

  throw new Error(`Unknown diff kind: ${diff.kind}`);
}
