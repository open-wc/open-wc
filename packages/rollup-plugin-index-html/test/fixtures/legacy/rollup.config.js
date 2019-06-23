const path = require('path');
const indexHTML = require('../../../rollup-plugin-index-html');

module.exports = config => [
  {
    input: path.resolve(__dirname, './index.html'),
    output: {
      dir: 'legacy',
      format: 'system',
    },
    plugins: [
      indexHTML({
        multiBuild: true,
        legacy: true,
        ...config,
      }),
    ],
  },
  {
    input: path.resolve(__dirname, './index.html'),
    output: {
      dir: '',
      format: 'esm',
    },
    plugins: [
      indexHTML({
        multiBuild: true,
        polyfills: {
          dynamicImport: true,
          coreJs: true,
          regeneratorRuntime: true,
        },
        ...config,
      }),
    ],
  },
];
