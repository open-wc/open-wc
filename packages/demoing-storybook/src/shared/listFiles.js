const glob = require('glob');
const fs = require('fs');

module.exports = function listFiles(fromGlob) {
  return new Promise(resolve => {
    glob(fromGlob, {}, (er, files) => {
      resolve(files.filter(filePath => !fs.lstatSync(filePath).isDirectory()));
    });
  });
};
