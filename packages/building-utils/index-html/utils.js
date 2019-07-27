const crypto = require('crypto');

function createContentHash(content) {
  return crypto
    .createHash('md4')
    .update(content)
    .digest('hex');
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

module.exports = {
  createContentHash,
  cleanImportPath,
};
