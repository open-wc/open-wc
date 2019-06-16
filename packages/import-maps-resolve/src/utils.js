import { URL } from 'url';

// https://fetch.spec.whatwg.org/#fetch-scheme
const FETCH_SCHEMES = new Set([
  'http',
  'https',
  'ftp',
  'about',
  'blob',
  'data',
  'file',
  'filesystem',
]);

// Tentative, so better to centralize so we can change in one place as necessary (including tests).
export const BUILT_IN_MODULE_SCHEME = 'std';

// Useful for comparing to .protocol
export const BUILT_IN_MODULE_PROTOCOL = `${BUILT_IN_MODULE_SCHEME}:`;

export function tryURLParse(string, baseURL) {
  try {
    return new URL(string, baseURL);
  } catch (e) {
    // TODO remove useless binding when ESLint and Jest support that
    return null;
  }
}

export function isUrlString(string) {
  return !!tryURLParse(string);
}

export function hasFetchScheme(url) {
  return FETCH_SCHEMES.has(url.protocol.slice(0, -1));
}

export function tryURLLikeSpecifierParse(specifier, baseURL) {
  if (baseURL.includes('::')) {
    return null;
  }

  if (specifier.startsWith('/') || specifier.startsWith('./') || specifier.startsWith('../')) {
    return new URL(specifier, baseURL);
  }

  const url = tryURLParse(specifier);

  if (url === null) {
    return null;
  }

  if (hasFetchScheme(url) || url.protocol === BUILT_IN_MODULE_PROTOCOL) {
    return url;
  }

  return null;
}
