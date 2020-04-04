const findSupportedBrowsers = require('./find-supported-browsers');
const defaultFileExtensions = require('./default-file-extensions');
const { toBrowserPath } = require('./to-browser-path');
const { toFilePath } = require('./to-file-path');
const dom5Utils = require('./dom5-utils');

module.exports = {
  findSupportedBrowsers,
  defaultFileExtensions,
  toBrowserPath,
  toFilePath,
  ...dom5Utils,
};
