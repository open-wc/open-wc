/**
 * @typedef IgnoreAttributesForTags
 * @property {string[]} tags tags on which to ignore the given attributes
 * @property {string[]} attributes attributes to ignore for the given tags
 */
/**
 * @typedef DiffOptions
 * @property {(string | IgnoreAttributesForTags)[]} [ignoreAttributes]
 *  array of attributes to ignore, when given a string that attribute will be ignored on all tags
 *  when given an object of type `IgnoreAttributesForTags`, you can specify on which tags to ignore which attributes
 * @property {string[]} [ignoreTags] array of tags to ignore, these tags are stripped from the output
 * @property {string[]} [ignoreChildren] array of tags whose children to ignore, the children of
 *   these tags are stripped from the output
 * @property {string[]} [stripEmptyAttributes] array of attributes which should be removed when empty.
 *   Be careful not to add any boolean attributes here (e.g. `hidden`) unless you know what you're doing
 */
/**
 * Restructures given HTML string, returning it in a format which can be used for comparison:
 * - whitespace and newlines are normalized
 * - tags and attributes are printed on individual lines
 * - comments, style, script and svg tags are removed
 * - additional tags and attributes can optionally be ignored
 *
 * See README.md for details.
 *
 * @example
 * import getDiffableHTML from '@open-wc/semantic-dom-diff';
 *
 * const htmlA = getDiffableHTML(`... some html ...`, { ignoredAttributes: [], ignoredTags: [], ignoreChildren: [] });
 * const htmlB = getDiffableHTML(`... some html ...`);
 *
 * // use regular string comparison to spot the differences
 * expect(htmlA).to.equal(htmlB);
 *
 * @param {Node | string} html
 * @param {DiffOptions} [options]
 * @returns {string} html restructured in a diffable format
 */
export function getDiffableHTML(html: Node | string, options?: DiffOptions): string;
/**
 * @param {*} arg
 * @return {arg is DiffOptions}
 */
export function isDiffOptions(arg: any): arg is DiffOptions;
export type IgnoreAttributesForTags = {
    /**
     * tags on which to ignore the given attributes
     */
    tags: string[];
    /**
     * attributes to ignore for the given tags
     */
    attributes: string[];
};
export type DiffOptions = {
    /**
     * array of attributes to ignore, when given a string that attribute will be ignored on all tags
     * when given an object of type `IgnoreAttributesForTags`, you can specify on which tags to ignore which attributes
     */
    ignoreAttributes?: (string | IgnoreAttributesForTags)[];
    /**
     * array of tags to ignore, these tags are stripped from the output
     */
    ignoreTags?: string[];
    /**
     * array of tags whose children to ignore, the children of
     * these tags are stripped from the output
     */
    ignoreChildren?: string[];
    /**
     * array of attributes which should be removed when empty.
     * Be careful not to add any boolean attributes here (e.g. `hidden`) unless you know what you're doing
     */
    stripEmptyAttributes?: string[];
};
//# sourceMappingURL=get-diffable-html.d.ts.map