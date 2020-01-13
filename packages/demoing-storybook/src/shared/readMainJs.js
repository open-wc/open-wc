/* eslint-disable global-require, import/no-dynamic-require */

const path = require('path');
const fs = require('fs');

module.exports = function readMainJs(configDir) {
  const mainFilePath = path.join(process.cwd(), configDir, 'main.js');

  if (fs.existsSync(mainFilePath)) {
    const mainJs = require(mainFilePath);
    return { mainFilePath, mainJs };
  }
  // TODO: make main required in next breaking release
  return { mainFilePath, mainJs: null };
};
