import { parseFragment } from '@bundled-es-modules/parse5';
import { deepDiff } from '@bundled-es-modules/deep-diff';

import { sanitizeHtmlString } from './sanitize-html-string';
import { normalizeAST } from './normalize-ast';
import { getDiffMessage } from './get-diff-message';
import { findDiffedObject } from './find-diffed-object';
import { getDiffPath } from './get-diff-path';

/**
 * @typedef {object} DiffResult
 * @param {string} message
 * @param {string} path
 */

/**
 * Creates the DiffResult for two AST trees.
 *
 * @param {ASTNode} leftTree the left tree AST
 * @param {ASTNode} rightTree the right tree AST
 * @param {Object} diff the semantic difference between the two trees
 *
 * @returns {DiffResult} the diff result containing the human readable semantic difference
 */
function createDiffResult(leftTree, rightTree, diff) {
  const leftDiffObject = findDiffedObject(leftTree, diff.path);
  const rightDiffObject = findDiffedObject(rightTree, diff.path);

  return {
    message: getDiffMessage(diff, leftDiffObject, rightDiffObject),
    path: getDiffPath(leftTree, diff.path),
  };
}

export function getAST(value, config = {}) {
  const ast = parseFragment(sanitizeHtmlString(value));
  normalizeAST(ast, config.ignoredTags);
  return ast;
}

/**
 * Parses two HTML trees, and generates the semantic difference between the two trees.
 * The HTML is diffed semantically, not literally. This means that changes in attribute
 * and class order and whitespace/newlines are ignored. Also, script and style
 * tags ignored.
 *
 * @param leftHTML the left HTML tree
 * @param rightHTML the right HTML tree
 * @returns {DiffResult | null} the diff result, or undefined if no diffs were found
 */
export function getSemanticDomDiff(leftHTML, rightHTML, config = {}) {
  const leftTree = getAST(leftHTML);
  const rightTree = getAST(rightHTML);

  normalizeAST(leftTree, config.ignoredTags);
  normalizeAST(rightTree, config.ignoredTags);

  // parentNode causes a circular reference, so ignore them.
  const ignore = (path, key) => key === 'parentNode';
  const diffs = deepDiff(leftTree, rightTree, ignore);

  if (!diffs || !diffs.length) {
    return null;
  }

  return createDiffResult(leftTree, rightTree, diffs[0]);
}
