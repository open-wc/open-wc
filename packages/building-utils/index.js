const findSupportedBrowsers = require('./find-supported-browsers');
const defaultFileExtensions = require('./default-file-extensions');
const { toBrowserPath } = require('./to-browser-path');
const dom5Utils = require('./dom5-utils');

module.exports = {
  findSupportedBrowsers,
  defaultFileExtensions,
  toBrowserPath,
  ...dom5Utils,
};
