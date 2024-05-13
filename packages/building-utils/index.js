const findSupportedBrowsers = require('./find-supported-browsers.js');
const defaultFileExtensions = require('./default-file-extensions.js');
const { toBrowserPath } = require('./to-browser-path.js');
const { toFilePath } = require('./to-file-path.js');
const dom5Utils = require('./dom5-utils.js');

module.exports = {
  findSupportedBrowsers,
  defaultFileExtensions,
  toBrowserPath,
  toFilePath,
  ...dom5Utils,
};
