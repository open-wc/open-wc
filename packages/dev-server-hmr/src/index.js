const { hmrPlugin } = require('./hmrPlugin.js');
const { litElement } = require('./presets/litElement.js');
const { lit } = require('./presets/lit.js');
const { fastElement } = require('./presets/fastElement.js');
const { haunted } = require('./presets/haunted.js');
const { WC_HMR_MODULE_RUNTIME } = require('./constants.js');

const presets = { litElement, fastElement, haunted, lit };

module.exports = {
  hmrPlugin,
  presets,
  WC_HMR_MODULE_RUNTIME,
};
