const glob = require('glob');
const fs = require('fs');
const path = require('path');

/**
 * Lists all files using the specified glob, starting from the given root directory.
 *
 * Will return all matching file paths fully resolved.
 */
module.exports = function listFiles(fromGlob, rootDir) {
  return new Promise(resolve => {
    glob(fromGlob, { cwd: rootDir }, (er, files) => {
      // remember, each filepath returned is relative to rootDir
      resolve(
        files
          // fully resolve the filename relative to rootDir
          .map(filePath => path.resolve(rootDir, filePath))
          // filter out directories
          .filter(filePath => !fs.lstatSync(filePath).isDirectory()),
      );
    });
  });
};
