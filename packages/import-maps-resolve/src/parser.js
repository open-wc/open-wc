/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax, no-console */
import path from 'path';
import {
  tryURLParse,
  hasFetchScheme,
  tryURLLikeSpecifierParse,
  BUILT_IN_MODULE_PROTOCOL,
} from './utils.js';

function isJSONObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function compare(a, b) {
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
  return 0;
}

function longerLengthThenCodeUnitOrder(a, b) {
  return compare(b.length, a.length) || compare(a, b);
}

function normalizeSpecifierKey(specifierKey, baseURL) {
  // Ignore attempts to use the empty string as a specifier key
  if (specifierKey === '') {
    return null;
  }

  const url = tryURLLikeSpecifierParse(specifierKey, baseURL);
  if (url !== null) {
    const urlString = url.href;
    if (url.protocol === BUILT_IN_MODULE_PROTOCOL && urlString.includes('/')) {
      console.warn(
        `Invalid specifier key "${urlString}". Built-in module specifiers must not contain "/".`,
      );
      return null;
    }
    return urlString;
  }

  return specifierKey;
}

function sortAndNormalizeSpecifierMap(obj, baseURL) {
  if (!isJSONObject(obj)) {
    throw new Error('needs to be an obj');
  }

  // Normalize all entries into arrays
  const normalized = {};
  for (const [specifierKey, value] of Object.entries(obj)) {
    const normalizedSpecifierKey = normalizeSpecifierKey(specifierKey, baseURL);
    if (normalizedSpecifierKey === null) {
      continue;
    }

    if (typeof value === 'string') {
      normalized[normalizedSpecifierKey] = [value];
    } else if (value === null) {
      normalized[normalizedSpecifierKey] = [];
    } else if (Array.isArray(value)) {
      normalized[normalizedSpecifierKey] = obj[specifierKey];
    }
  }

  // Normalize/validate each potential address in the array
  for (const [specifierKey, potentialAddresses] of Object.entries(normalized)) {
    if (!Array.isArray(potentialAddresses)) {
      throw new Error('should be an array');
    }

    const validNormalizedAddresses = [];
    for (const potentialAddress of potentialAddresses) {
      if (typeof potentialAddress !== 'string') {
        continue;
      }

      const addressURL = tryURLLikeSpecifierParse(potentialAddress, baseURL);
      let addressUrlString = '';
      if (addressURL !== null) {
        if (addressURL.protocol === BUILT_IN_MODULE_PROTOCOL && addressURL.href.includes('/')) {
          console.warn(
            `Invalid target address "${potentialAddress}". Built-in module URLs must not contain "/".`,
          );
          continue;
        }
        addressUrlString = addressURL.href;
      } else if (baseURL.includes('::')) {
        const [rootPath, basePath] = baseURL.split('::');

        const dirPath = potentialAddress.startsWith('/') ? '' : path.dirname(basePath);
        addressUrlString = path.normalize(path.join(rootPath, dirPath, potentialAddress));
      }

      if (specifierKey.endsWith('/') && !addressUrlString.endsWith('/')) {
        console.warn(
          `Invalid target address "${addressUrlString}" for package specifier "${specifierKey}". ` +
            `Package address targets must end with "/".`,
        );
        continue;
      }

      if (addressUrlString !== '') {
        validNormalizedAddresses.push(addressUrlString);
      }
    }
    normalized[specifierKey] = validNormalizedAddresses;
  }

  const sortedAndNormalized = {};
  const sortedKeys = Object.keys(normalized).sort(longerLengthThenCodeUnitOrder);
  for (const key of sortedKeys) {
    sortedAndNormalized[key] = normalized[key];
  }

  return sortedAndNormalized;
}

function sortAndNormalizeScopes(obj, baseURL) {
  const normalized = {};
  for (const [scopePrefix, potentialSpecifierMap] of Object.entries(obj)) {
    if (!isJSONObject(potentialSpecifierMap)) {
      throw new TypeError(`The value for the "${scopePrefix}" scope prefix must be an object.`);
    }

    const scopePrefixURL = tryURLParse(scopePrefix, baseURL);
    let scopeString = '';
    if (scopePrefixURL !== null) {
      if (!hasFetchScheme(scopePrefixURL)) {
        console.warn(`Invalid scope "${scopePrefixURL}". Scope URLs must have a fetch scheme.`);
        continue;
      }
      scopeString = scopePrefixURL.href;
    } else {
      const scopePrefixURLWithoutBase = tryURLParse(scopePrefix);
      if (scopePrefixURLWithoutBase !== null) {
        if (!hasFetchScheme(scopePrefixURLWithoutBase)) {
          console.warn(
            `Invalid scope "${scopePrefixURLWithoutBase}". Scope URLs must have a fetch scheme.`,
          );
          continue;
        }
        scopeString = scopePrefixURLWithoutBase.href;
      } else if (baseURL.includes('::')) {
        const [rootPath, basePath] = baseURL.split('::');

        const dirPath = scopePrefix.startsWith('/') ? '' : path.dirname(basePath);
        scopeString = path.normalize(path.join(rootPath, dirPath, scopePrefix));
      } else {
        continue;
      }
    }

    normalized[scopeString] = sortAndNormalizeSpecifierMap(potentialSpecifierMap, baseURL);
  }

  const sortedAndNormalized = {};
  const sortedKeys = Object.keys(normalized).sort(longerLengthThenCodeUnitOrder);
  for (const key of sortedKeys) {
    sortedAndNormalized[key] = normalized[key];
  }

  return sortedAndNormalized;
}

/**
 * Processes and normalizes a given import-map string.
 *
 * @example
 * const importMap = `{ import: {
 *  'foo': './node_modules/foo/foo.js',
 *  'bar': '/node_modules/bar/bar.js'
 * }}`;
 * parseFromString(importMap, '/path/to/root::/src');
 * // { import: {
 * //   'foo': ['/path/to/root/src/node_modules/foo/foo.js'],
 * //   'bar': ['/path/to/root/node_modules/bar/bar.js']
 * // }}
 *
 * @param {string} input   The import map as a string
 * @param {string} baseURL The base url/path to your root + executing sub directory (separated by ::)
 */
export function parseFromString(input, baseURL) {
  const parsed = JSON.parse(input);

  if (!isJSONObject(parsed)) {
    throw new TypeError('Import map JSON must be an object.');
  }

  let sortedAndNormalizedImports = {};
  if ('imports' in parsed) {
    if (!isJSONObject(parsed.imports)) {
      throw new TypeError("Import map's imports value must be an object.");
    }
    sortedAndNormalizedImports = sortAndNormalizeSpecifierMap(parsed.imports, baseURL);
  }

  let sortedAndNormalizedScopes = {};
  if ('scopes' in parsed) {
    if (!isJSONObject(parsed.scopes)) {
      throw new TypeError("Import map's scopes value must be an object.");
    }
    sortedAndNormalizedScopes = sortAndNormalizeScopes(parsed.scopes, baseURL);
  }

  // Always have these two keys, and exactly these two keys, in the result.
  return {
    imports: sortedAndNormalizedImports,
    scopes: sortedAndNormalizedScopes,
  };
}
