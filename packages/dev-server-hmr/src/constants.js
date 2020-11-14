const WC_HMR_NAMESPACE = '__$wc_hmr$__';
const WC_HMR_MODULE_PREFIX = '/__web-dev-server__/wc-hmr/';
const WC_HMR_MODULE_PATCH = `${WC_HMR_MODULE_PREFIX}patch.js`;
const WC_HMR_MODULE_RUNTIME = `${WC_HMR_MODULE_PREFIX}runtime.js`;

module.exports = {
  WC_HMR_NAMESPACE,
  WC_HMR_MODULE_PREFIX,
  WC_HMR_MODULE_PATCH,
  WC_HMR_MODULE_RUNTIME,
};
