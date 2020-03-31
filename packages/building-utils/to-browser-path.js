const path = require('path');

const toBrowserPathRegExp = new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g');

/**
 * @param {string} filePath
 * @returns {string}
 */
function toBrowserPath(filePath) {
  return filePath.replace(toBrowserPathRegExp, '/');
}

module.exports = { toBrowserPath };
