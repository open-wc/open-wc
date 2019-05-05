const createLegacyConfig = require('./legacy-config');
const createEsmConfig = require('./esm-config');

const legacy = process.argv.find(arg => arg.includes('legacy'));

module.exports = legacy ? createLegacyConfig : createEsmConfig;
