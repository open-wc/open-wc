/**
 * @param {string} string
 * @param {URL} [baseURL]
 * @returns {URL | undefined}
 */
function tryURLParse(string, baseURL) {
  try {
    return new URL(string, baseURL);
  } catch (e) {
    return undefined;
  }
}

/**
 * @param {string} specifier
 * @param {URL} baseURL
 * @returns {URL | undefined}
 */
function tryURLLikeSpecifierParse(specifier, baseURL) {
  if (specifier.startsWith('/') || specifier.startsWith('./') || specifier.startsWith('../')) {
    return tryURLParse(specifier, baseURL);
  }

  const url = tryURLParse(specifier);
  return url;
}

module.exports = { tryURLParse, tryURLLikeSpecifierParse };
