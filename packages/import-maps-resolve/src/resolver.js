/* eslint-disable no-restricted-syntax */
import { URL } from 'url';
import path from 'path';
import {
  tryURLLikeSpecifierParse,
  BUILT_IN_MODULE_SCHEME,
  BUILT_IN_MODULE_PROTOCOL,
  isUrlString,
} from './utils.js';

const supportedBuiltInModules = new Set([`${BUILT_IN_MODULE_SCHEME}:blank`]);

function resolveImportsMatch(normalizedSpecifier, specifierMap) {
  for (const [specifierKey, rawAddresses] of Object.entries(specifierMap)) {
    const addresses = rawAddresses.map(address =>
      isUrlString(address) ? new URL(address) : address,
    );
    // Exact-match case
    if (specifierKey === normalizedSpecifier) {
      if (addresses.length === 0) {
        throw new TypeError(`Specifier "${normalizedSpecifier}" was mapped to no addresses.`);
      } else if (addresses.length === 1) {
        const singleAddress = addresses[0];
        if (
          singleAddress.protocol === BUILT_IN_MODULE_PROTOCOL &&
          !supportedBuiltInModules.has(singleAddress.href)
        ) {
          throw new TypeError(`The "${singleAddress.href}" built-in module is not implemented.`);
        }

        return singleAddress.href ? singleAddress.href : singleAddress;
      } else if (
        addresses.length === 2 &&
        addresses[0].protocol === BUILT_IN_MODULE_PROTOCOL &&
        addresses[1].protocol !== BUILT_IN_MODULE_PROTOCOL
      ) {
        return supportedBuiltInModules.has(addresses[0].href)
          ? addresses[0].href
          : addresses[1].href;
      } else {
        throw new Error(
          'The reference implementation for multi-address fallbacks that are not ' +
            '[built-in module, fetch-scheme URL] is not yet implemented.',
        );
      }
    }

    // Package prefix-match case
    if (specifierKey.endsWith('/') && normalizedSpecifier.startsWith(specifierKey)) {
      if (addresses.length === 0) {
        throw new TypeError(
          `Specifier "${normalizedSpecifier}" was mapped to no addresses ` +
            `(via prefix specifier key "${specifierKey}").`,
        );
      } else if (addresses.length === 1) {
        const afterPrefix = normalizedSpecifier.substring(specifierKey.length);
        if (isUrlString(addresses[0])) {
          return new URL(afterPrefix, addresses[0]).href;
        }
        return `${addresses[0]}${afterPrefix}`;
      } else {
        throw new Error(
          'The reference implementation for multi-address fallbacks that are not ' +
            '[built-in module, fetch-scheme URL] is not yet implemented.',
        );
      }
    }
  }
  return undefined;
}

/**
 * Resolves a given specifier via a parsedImportMap. Knowledge about the path/url of the currently
 * executing script is required.
 *
 * @example
 * const importMap = { import: {
 *  'foo': ['/node_modules/foo/foo.js']
 * }};
 * resolve('foo', importMap, '/path/to/root::/src/index.html');
 * // => /path/to/root/node_modules/foo/foo.js
 *
 * resolve('foo', importMap, 'http://example.com/my-app/src/index.html');
 * // => http://example.com/node_modules/foo/foo.js
 *
 * @param {string} specifier       can be a full URL or a bare_specifier or bare_specifier + path
 * @param {object} parsedImportMap normalized map string (already processed by parseFromString)
 * @param {string} scriptURL       the scripts url/path that is requesting the resolve (neded to support scopes)
 */
export function resolve(specifier, parsedImportMap, scriptURL) {
  const asURL = tryURLLikeSpecifierParse(specifier, scriptURL);
  const normalizedSpecifier = asURL ? asURL.href : specifier;

  let nodeSpecifier = null;
  if (scriptURL.includes('::')) {
    const [rootPath, basePath] = scriptURL.split('::');

    const dirPath = specifier.startsWith('/') ? '' : path.dirname(basePath);
    nodeSpecifier = path.normalize(path.join(rootPath, dirPath, specifier));
  }
  const scriptURLString = scriptURL.split('::').join('');

  for (const [scopePrefix, scopeImports] of Object.entries(parsedImportMap.scopes)) {
    if (
      scopePrefix === scriptURLString ||
      (scopePrefix.endsWith('/') && scriptURLString.startsWith(scopePrefix))
    ) {
      const scopeImportsMatch = resolveImportsMatch(
        nodeSpecifier || normalizedSpecifier,
        scopeImports,
      );
      if (scopeImportsMatch) {
        return scopeImportsMatch;
      }
    }
  }

  const topLevelImportsMatch = resolveImportsMatch(normalizedSpecifier, parsedImportMap.imports);
  if (topLevelImportsMatch) {
    return topLevelImportsMatch;
  }

  // The specifier was able to be turned into a URL, but wasn't remapped into anything.
  if (asURL) {
    if (asURL.protocol === BUILT_IN_MODULE_PROTOCOL && !supportedBuiltInModules.has(asURL.href)) {
      throw new TypeError(`The "${asURL.href}" built-in module is not implemented.`);
    }
    return asURL.href;
  }

  if (nodeSpecifier && (specifier.startsWith('/') || specifier.startsWith('.'))) {
    return nodeSpecifier;
  }

  throw new TypeError(`Unmapped bare specifier "${specifier}"`);
}
