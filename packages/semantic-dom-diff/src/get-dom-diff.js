import { parseFragment, serialize } from '@bundled-es-modules/parse5';
import toDiffableHtml from 'diffable-html';

import { sanitizeHtmlString } from './sanitize-html-string.js';
import { normalizeAST } from './normalize-ast.js';

export function getAST(value, config = {}) {
  const ast = parseFragment(sanitizeHtmlString(value));
  normalizeAST(ast, config.ignoredTags);
  return ast;
}

/**
 * Parses HTML and returns HTML in a formatted and diffable format which is semantically
 * equal to the input, but with some transformations:
 * - whitespace and newlines in and around tags are normalized
 * - classes and attributes are ordered
 * - script, style and comments are removed
 *
 * @param {string} html
 * @returns {string}
 */
export function getDiffableSemanticHTML(html) {
  const ast = getAST(html);
  normalizeAST(ast, []);
  const serialized = serialize(ast);
  return toDiffableHtml(serialized);
}
