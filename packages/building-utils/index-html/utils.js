const crypto = require('crypto');

function createContentHash(content) {
  return crypto.createHash('md4').update(content).digest('hex');
}

function cleanImportPath(path) {
  if (path.startsWith('/')) {
    return path;
  }

  if (path.startsWith('../') || path.startsWith('./')) {
    return path;
  }

  return `./${path}`;
}

function polyfillFilename(polyfill, polyfillsConfig) {
  return `${polyfill.name}${polyfillsConfig.hashPolyfills ? `.${polyfill.hash}` : ''}`;
}

module.exports = {
  createContentHash,
  cleanImportPath,
  polyfillFilename,
};
