/**
 * Eslint doesn't understand the default export pattern from eslint the plugin, so we
 * re-export the default export here.
 */
const eslintPluginWc = require('eslint-plugin-wc/lib/configs/best-practice').default;

module.exports = eslintPluginWc;
