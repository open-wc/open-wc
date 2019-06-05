const path = require('path');

module.exports = function toBrowserPath(filePath, _path = path) {
  return filePath.replace(new RegExp(_path.sep === '\\' ? '\\\\' : _path.sep, 'g'), '/');
};
