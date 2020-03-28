const findSupportedBrowsers = require('./find-supported-browsers');
const defaultFileExtensions = require('./default-file-extensions');
const applyServiceWorkerRegistration = require('./apply-sw-registration');
const { toBrowserPath } = require('./to-browser-path');
const dom5Utils = require('./dom5-utils');

module.exports = {
  applyServiceWorkerRegistration,
  findSupportedBrowsers,
  defaultFileExtensions,
  toBrowserPath,
  ...dom5Utils,
};
