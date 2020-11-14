const { transformSync } = require('@babel/core');
const path = require('path');
const babelPluginWcHmr = require('../../src/babel/babelPluginWcHmr');

const banner = `import * as __$wc_hmr$__ from '/__web-dev-server__/wc-hmr/runtime.js';

if (import.meta.hot) {
  import.meta.hot.accept();
}
`;

const rootDir = path.join(process.cwd(), 'virtual-project');

/**
 * @param {string} code
 * @returns {string}
 */
function transform(code, extraOptions) {
  return transformSync(code, {
    babelrc: false,
    configFile: false,
    filename: path.join(rootDir, 'src', 'foo.js'),
    plugins: [[babelPluginWcHmr, { rootDir, ...extraOptions }]],
  }).code;
}

module.exports = { banner, transform, rootDir };
