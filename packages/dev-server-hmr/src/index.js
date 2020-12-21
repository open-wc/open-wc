const { hmrPlugin } = require('./hmrPlugin');
const { litElement } = require('./presets/litElement');
const { fastElement } = require('./presets/fastElement');
const { haunted } = require('./presets/haunted');
const { WC_HMR_MODULE_RUNTIME } = require('./constants');

const presets = { litElement, fastElement, haunted };

module.exports = {
  hmrPlugin,
  presets,
  WC_HMR_MODULE_RUNTIME,
};
