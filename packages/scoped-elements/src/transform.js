import { registerElement } from './registerElement.js';
import { Cache } from './Cache.js';

/**
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 */

/**
 * Allowed tag name chars
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
 * The global cache of processed string arrays
 *
 * @type {Cache<TemplateStringsArray, TemplateStringsArray>}
 */
const globalCache = new Cache();

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
 * Transforms a string array into another one with resolved scoped elements and caches it for future references
 *
 * @param {TemplateStringsArray} strings
 * @param {ScopedElementsMap} scopedElements
 * @param {Cache<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Cache<string, string>} tagsCache
 * @returns {TemplateStringsArray}
 */
const transformTemplate = (strings, scopedElements, templateCache, tagsCache) => {
  const transformedStrings = strings.map(str => {
    let acc = str;
    const matches = matchAll(str);

    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const item = matches[i];
      const [block, tagName] = item;
      const tag = registerElement(tagName, scopedElements[tagName], tagsCache);
      const start = item.index + block.length - tagName.length;
      const end = start + tagName.length;
      const isClosingTag = block.indexOf('</') === 0;

      acc =
        acc.slice(0, start) +
        (isClosingTag ? tag : `${tag} data-tag-name="${tagName}"`) +
        acc.slice(end);
    }

    return acc;
  });

  // @ts-ignore
  // noinspection JSCheckFunctionSignatures
  templateCache.set(strings, transformedStrings);

  // @ts-ignore
  // noinspection JSValidateTypes
  return transformedStrings;
};

/**
 * Obtains the cached strings array with resolved scoped elements or creates it
 *
 * @exports
 * @param {TemplateStringsArray} strings
 * @param {ScopedElementsMap} scopedElements
 * @param {import('./Cache.js').Cache<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {import('./Cache.js').Cache<string, string>} tagsCache
 * @returns {TemplateStringsArray}
 */
export function transform(strings, scopedElements, templateCache = globalCache, tagsCache) {
  return (
    templateCache.get(strings) ||
    transformTemplate(strings, scopedElements, templateCache, tagsCache)
  );
}
