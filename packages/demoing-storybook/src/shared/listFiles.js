const glob = require('glob');
const fs = require('fs');

module.exports = function listFiles(fromGlob, rootDir) {
  return new Promise(resolve => {
    glob(fromGlob, { cwd: rootDir }, (er, files) => {
      resolve(files.filter(filePath => !fs.lstatSync(filePath).isDirectory()));
    });
  });
};
