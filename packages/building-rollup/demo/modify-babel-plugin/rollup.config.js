const merge = require('deepmerge');
const { createSpaConfig } = require('../../index.js');

const baseConfig = createSpaConfig({
  developmentMode: false,
  injectServiceWorker: false,
  legacyBuild: false,
  babel: {
    plugins: [
      [
        'babel-plugin-template-html-minifier',
        {
          modules: {
            'lit-html': ['html'],
            'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
          },
          htmlMinifier: {
            removeComments: false,
          },
        },
      ],
    ],
  },
});

module.exports = merge(baseConfig, {
  input: 'demo/modify-babel-plugin/index.html',
});
