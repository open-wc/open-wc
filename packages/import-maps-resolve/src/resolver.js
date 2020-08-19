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

const { tryURLLikeSpecifierParse, tryURLParse } = require('./utils.js');

/**
 * @param {string} normalizedSpecifier
 * @param {ParsedSpecifierMap} specifierMap
 */
function resolveImportsMatch(normalizedSpecifier, specifierMap) {
  for (const [specifierKey, resolutionResult] of Object.entries(specifierMap)) {
    // Exact-match case
    if (specifierKey === normalizedSpecifier) {
      if (!resolutionResult) {
        throw new TypeError(`Blocked by a null entry for "${specifierKey}"`);
      }

      assert(resolutionResult instanceof URL);

      return resolutionResult;
    }

    // Package prefix-match case
    if (specifierKey.endsWith('/') && normalizedSpecifier.startsWith(specifierKey)) {
      if (!resolutionResult) {
        throw new TypeError(`Blocked by a null entry for "${specifierKey}"`);
      }

      assert(resolutionResult instanceof URL);

      const afterPrefix = normalizedSpecifier.substring(specifierKey.length);

      // Enforced by parsing
      assert(resolutionResult.href.endsWith('/'));

      const url = tryURLParse(afterPrefix, resolutionResult);
      if (!url) {
        throw new TypeError(`Failed to resolve prefix-match relative URL for "${specifierKey}"`);
      }

      assert(url instanceof URL);

      return url;
    }
  }

  return undefined;
}

/**
 * @param {string} specifier
 * @param {ParsedImportMap} parsedImportMap
 * @param {URL} scriptURL
 * @returns {{ resolvedImport: URL | null, matched: boolean }}
 */
function resolve(specifier, parsedImportMap, scriptURL) {
  const asURL = tryURLLikeSpecifierParse(specifier, scriptURL);
  const normalizedSpecifier = asURL ? asURL.href : specifier;
  const scriptURLString = scriptURL.href;

  for (const [scopePrefix, scopeImports] of Object.entries(parsedImportMap.scopes || {})) {
    if (
      scopePrefix === scriptURLString ||
      (scopePrefix.endsWith('/') && scriptURLString.startsWith(scopePrefix))
    ) {
      const scopeImportsMatch = resolveImportsMatch(normalizedSpecifier, scopeImports);

      if (scopeImportsMatch) {
        return { resolvedImport: scopeImportsMatch, matched: true };
      }
    }
  }

  const topLevelImportsMatch = resolveImportsMatch(
    normalizedSpecifier,
    parsedImportMap.imports || {},
  );

  if (topLevelImportsMatch) {
    return { resolvedImport: topLevelImportsMatch, matched: true };
  }

  // The specifier was able to be turned into a URL, but wasn't remapped into anything.
  if (asURL) {
    return { resolvedImport: asURL, matched: false };
  }

  return { resolvedImport: null, matched: false };
}

module.exports = { resolve };
