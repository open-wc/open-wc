/* eslint-disable no-console, no-continue */
/** @typedef {import('./types').ImportMap} ImportMap */
/** @typedef {import('./types').ScopesMap} ScopesMap */
/** @typedef {import('./types').SpecifierMap} SpecifierMap */
/** @typedef {import('./types').ParsedImportMap} ParsedImportMap */
/** @typedef {import('./types').ParsedScopesMap} ParsedScopesMap */
/** @typedef {import('./types').ParsedSpecifierMap} ParsedSpecifierMap */

const _assert = require('assert');
// NB: TS casts the `required` function to a const, then pukes on the assertion
// see https://github.com/microsoft/TypeScript/issues/34523#issuecomment-542978853
/**
 *
 * @param {*} x
 * @param {string|Error} [message]
 * @return {asserts x}
 */
function assert(x, message) {
  return _assert(x, message);
}

const { tryURLParse, tryURLLikeSpecifierParse } = require('./utils.js');

/**
 * @param {*} value
 * @returns {value is object}
 */
function isJSONObject(value) {
  return typeof value === 'object' && value != null && !Array.isArray(value);
}

/**
 * @param {string} a
 * @param {string} b
 */
function codeUnitCompare(a, b) {
  if (a > b) {
    return 1;
  }

  if (b > a) {
    return -1;
  }

  throw new Error('This should never be reached because this is only used on JSON object keys');
}

/**
 * @param {string} specifierKey
 * @param {URL} baseURL
 * @returns {string | undefined}
 */
function normalizeSpecifierKey(specifierKey, baseURL) {
  // Ignore attempts to use the empty string as a specifier key
  if (specifierKey === '') {
    console.warn(`Invalid empty string specifier key.`);
    return undefined;
  }

  const url = tryURLLikeSpecifierParse(specifierKey, baseURL);
  if (url) {
    return url.href;
  }

  return specifierKey;
}

/**
 * @param {SpecifierMap} obj
 * @param {URL} baseURL
 * @returns {ParsedSpecifierMap}
 */
function sortAndNormalizeSpecifierMap(obj, baseURL) {
  assert(isJSONObject(obj));

  const normalized = /** @type {ParsedSpecifierMap} */ ({});

  for (const [specifierKey, value] of Object.entries(obj)) {
    const normalizedSpecifierKey = normalizeSpecifierKey(specifierKey, baseURL);
    if (!normalizedSpecifierKey) {
      continue;
    }

    if (typeof value !== 'string') {
      console.warn(
        `Invalid address ${JSON.stringify(value)} for the specifier key "${specifierKey}". ` +
          `Addresses must be strings.`,
      );
      normalized[normalizedSpecifierKey] = null;
      continue;
    }

    const addressURL = tryURLLikeSpecifierParse(value, baseURL);
    if (!addressURL) {
      console.warn(`Invalid address "${value}" for the specifier key "${specifierKey}".`);
      normalized[normalizedSpecifierKey] = null;
      continue;
    }

    if (specifierKey.endsWith('/') && !addressURL.href.endsWith('/')) {
      console.warn(
        `Invalid address "${addressURL.href}" for package specifier key "${specifierKey}". ` +
          `Package addresses must end with "/".`,
      );
      normalized[normalizedSpecifierKey] = null;
      continue;
    }

    normalized[normalizedSpecifierKey] = addressURL;
  }

  const sortedAndNormalized = /** @type {ParsedSpecifierMap} */ ({});
  const sortedKeys = Object.keys(normalized).sort((a, b) => codeUnitCompare(b, a));
  for (const key of sortedKeys) {
    sortedAndNormalized[key] = normalized[key];
  }

  return sortedAndNormalized;
}

/**
 * @param {ScopesMap} obj
 * @param {URL} baseURL
 */
function sortAndNormalizeScopes(obj, baseURL) {
  const normalized = /** @type {ParsedScopesMap} */ ({});
  for (const [scopePrefix, potentialSpecifierMap] of Object.entries(obj)) {
    if (!isJSONObject(potentialSpecifierMap)) {
      throw new TypeError(`The value for the "${scopePrefix}" scope prefix must be an object.`);
    }

    const scopePrefixURL = tryURLParse(scopePrefix, baseURL);
    if (!scopePrefixURL) {
      console.warn(`Invalid scope "${scopePrefix}" (parsed against base URL "${baseURL}").`);
      continue;
    }

    const normalizedScopePrefix = scopePrefixURL.href;
    normalized[normalizedScopePrefix] = sortAndNormalizeSpecifierMap(
      potentialSpecifierMap,
      baseURL,
    );
  }

  const sortedAndNormalized = /** @type {ParsedScopesMap} */ ({});
  const sortedKeys = Object.keys(normalized).sort((a, b) => codeUnitCompare(b, a));
  for (const key of sortedKeys) {
    sortedAndNormalized[key] = normalized[key];
  }

  return sortedAndNormalized;
}

/**
 * @param {ImportMap} input
 * @param {URL} baseURL
 * @returns {ParsedImportMap}
 */
function parse(input, baseURL) {
  if (!isJSONObject(input)) {
    throw new TypeError('Import map JSON must be an object.');
  }

  if (!(baseURL instanceof URL)) {
    throw new TypeError('Missing base URL or base URL is not a URL');
  }

  let sortedAndNormalizedImports = /** @type {ParsedSpecifierMap} */ ({});
  if ('imports' in input) {
    if (!input.imports || !isJSONObject(input.imports)) {
      throw new TypeError("Import map's imports value must be an object.");
    }
    sortedAndNormalizedImports = sortAndNormalizeSpecifierMap(input.imports, baseURL);
  }

  let sortedAndNormalizedScopes = /** @type {ParsedScopesMap} */ ({});
  if ('scopes' in input) {
    if (!input.scopes || !isJSONObject(input.scopes)) {
      throw new TypeError("Import map's scopes value must be an object.");
    }
    sortedAndNormalizedScopes = sortAndNormalizeScopes(input.scopes, baseURL);
  }

  const badTopLevelKeys = new Set(Object.keys(input));
  badTopLevelKeys.delete('imports');
  badTopLevelKeys.delete('scopes');

  for (const badKey of badTopLevelKeys) {
    console.warn(`Invalid top-level key "${badKey}". Only "imports" and "scopes" can be present.`);
  }

  // Always have these two keys, and exactly these two keys, in the result.
  return {
    imports: sortedAndNormalizedImports,
    scopes: sortedAndNormalizedScopes,
  };
}

/**
 * @param {string} input
 * @param {URL} baseURL
 * @returns {ParsedImportMap}
 */
function parseFromString(input, baseURL) {
  const importMap = /** @type {ImportMap} */ (JSON.parse(input));
  return parse(importMap, baseURL);
}

module.exports = { parse, parseFromString };
