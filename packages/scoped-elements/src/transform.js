import { registerElement } from './registerElement.js';

/**
 * allowed tag name chars
 *
 * @type {string}
 */
const chars = `-|\\.|[0-9]|[a-z]`;

/**
 * Regular Expression to find a custom element tag
 *
 * @type {RegExp}
 */
const re = new RegExp(`<\\/?([a-z](${chars})*-(${chars})*)`, 'g');

/**
 * Global cache of processed string arrays
 *
 * @type {Map<TemplateStringsArray, TemplateStringsArray>}
 */
const globalCache = new Map();

/**
 * Find custom element tags in the string
 *
 * @param {string} str
 * @returns {RegExpExecArray[]}
 */
const matchAll = str => {
  const matches = [];
  let result;
  // eslint-disable-next-line no-cond-assign
  while ((result = re.exec(str)) !== null) {
    matches.push(result);
  }

  return matches;
};

/**
 * transforms a strings array into another one with resolved scoped elements and caches it for future references
 *
 * @param {TemplateStringsArray} strings
 * @param {Object.<string, typeof HTMLElement>} tags
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} cache
 * @returns {TemplateStringsArray}
 */
const transformTemplate = (strings, tags, cache) => {
  const transformedStrings = strings.map(str => {
    let acc = str;
    const matches = matchAll(str);

    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const item = matches[i];
      const klass = tags[item[1]];

      if (klass) {
        const tag = registerElement(item[1], klass);
        const start = item.index + item[0].length - item[1].length;
        const end = start + item[1].length;

        acc = acc.slice(0, start) + tag + acc.slice(end);
      }
    }

    return acc;
  });

  // @ts-ignore
  // noinspection JSCheckFunctionSignatures
  cache.set(strings, transformedStrings);

  // @ts-ignore
  // noinspection JSValidateTypes
  return transformedStrings;
};

/**
 * Obtains the cached strings array with resolved scoped elements or creates it if needed
 *
 * @exports
 * @param {TemplateStringsArray} strings
 * @param {Object.<string, typeof HTMLElement>} tags
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} cache
 * @returns {TemplateStringsArray}
 */
export function transform(strings, tags, cache = globalCache) {
  return cache.get(strings) || transformTemplate(strings, tags, cache);
}
