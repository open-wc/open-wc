const { DEFAULT_EXTENSIONS } = require('@babel/core');

/**
 * We take the default extensions from babel, but we want to make sure
 * .mjs is preferred over .js files.
 */
const order = ['.mjs', '.js'];
const extensions = [...order, ...DEFAULT_EXTENSIONS.filter(ext => !order.includes(ext))];

module.exports = extensions;
