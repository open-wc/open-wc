const path = require('path');

const regexp = new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g');

module.exports = function toBrowserPath(filePath) {
  return filePath.replace(regexp, '/');
};
