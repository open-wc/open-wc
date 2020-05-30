import { registerElement } from './registerElement.js';

/**
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 */

/**
 * The global cache of processed string arrays
 *
 * @type {Map<TemplateStringsArray, TemplateStringsArray>}
 */
const globalCache = new Map();

/**
 * Allowed tag name characters
 *
 * @type {string[]}
 */
const TAGNAME_CHARS = '-.0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Characters used to open a string
 *
 * @type {string[]}
 */
const OPEN_STRING_CHARS = `"'`.split('');

/**
 * Checks if the next token is an string
 *
 * @param {string} str
 * @param {number} index
 * @returns {boolean}
 */
const isOpenString = (str, index) => OPEN_STRING_CHARS.includes(str[index]);

/**
 * Returns the length of the opening or closing chars of a tag name
 *
 * @param {string} str
 * @param {number} index
 * @returns {number}
 */
const getStartTagLength = (str, index) => {
  if (str[index] !== '<') return 0;
  if (str[index + 1] === '/') return 2;

  return 1;
};

/**
 * Obtains the next name in the string from the index
 *
 * @param {string} str
 * @param {number} index
 * @returns {{isCustomElement: boolean, index: *, tagName: string}}
 */
const getName = (str, index) => {
  let i = index;
  let isCustomElement = false;

  while (TAGNAME_CHARS.includes(str[i])) {
    isCustomElement = isCustomElement || str[i] === '-';

    i += 1;
  }

  return {
    index,
    isCustomElement,
    tagName: str.substring(index, i),
  };
};

/**
 * Find custom element tags in the string
 *
 * @param {string} str
 * @returns {{index: number, tagName: string}[]}
 */
const matchAll = str => {
  const matches = [];
  let openStringChar;

  for (let index = 0; index < str.length; index += 1) {
    if (!openStringChar) {
      const startTagLength = getStartTagLength(str, index);

      if (startTagLength > 0) {
        index += startTagLength;

        const tagName = getName(str, index);

        if (tagName.isCustomElement) {
          matches.push({ index: tagName.index, tagName: tagName.tagName });
        }

        index += tagName.tagName.length;
      }

      if (isOpenString(str, index)) {
        openStringChar = str[index];
        index += 1;
      }
    }

    if (str[index] === openStringChar) {
      index += 1;
      openStringChar = undefined;
    }
  }

  return matches;
};

/**
 * Transforms a string array into another one with resolved scoped elements and caches it for future references
 *
 * @param {TemplateStringsArray} strings
 * @param {ScopedElementsMap} scopedElements
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {TemplateStringsArray}
 */
const transformTemplate = (strings, scopedElements, templateCache, tagsCache) => {
  const transformedStrings = strings.map(str => {
    let acc = str;
    const matches = matchAll(str);

    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const item = matches[i];
      const klass = scopedElements[item.tagName];
      const tag = registerElement(item.tagName, klass, tagsCache);
      const start = item.index;
      const end = start + item.tagName.length;

      acc = acc.slice(0, start) + tag + acc.slice(end);
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
 * @param {Map<TemplateStringsArray, TemplateStringsArray>} templateCache
 * @param {Map<string, string>} tagsCache
 * @returns {TemplateStringsArray}
 */
export function transform(strings, scopedElements, templateCache = globalCache, tagsCache) {
  return (
    templateCache.get(strings) ||
    transformTemplate(strings, scopedElements, templateCache, tagsCache)
  );
}
