import { getDiffableHTML } from './src/get-diffable-html';

/**
 * @typedef IgnoreAttributesForTags
 * @property {string[]} tags tags on which to ignore the given attributes
 * @property {string[]} attributes attributes to ignore for the given tags
 */

/**
 * @typedef DiffOptions
 * @property {(string | IgnoreAttributesForTags)[]} ignoreAttributes
 *  array of attributes to ignore, when given a string that attribute will be ignored on all tags
 *  when given an object of type `IgnoreAttributesForTags`, you can specify on which tags to ignore which attributes
 * @property {string[]} ignoreTags array of tags to ignore, these tags are stripped from the output
 * @property {string[]} ignoreLightDom array of tags whose light dom to ignore, the light dom of
 *   these tags are stripped from the output
 */

/**
 * Restructures given HTML string, returning it in a format which can be used for comparison:
 * - whitespace and newlines are normalized
 * - tags and attributes are printed on individual lines
 * - comments, style and script tags are removed
 * - additional tags and attributes can optionally be ignored
 *
 * See README.md for details.
 *
 * @example
 * const htmlA = getDiffableHTML(`... some html ...`, { ignoredAttributes: [], ignoredTags: [], ignoreLightDom: [] });
 * const htmlB = getDiffableHTML(`... some html ...`);
 *
 * // use regular string comparison to spot the differences
 * expect(htmlA).to.equal(htmlB);
 *
 * @param {string} html
 * @param {DiffOptions} options
 * @returns {string} html restructured in a diffable format
 */
export default function(html, options) {
  return getDiffableHTML(html, options);
}
