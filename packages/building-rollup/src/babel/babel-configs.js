const { findModernBrowserslist } = require('./findModernBrowserslist');
const { babelPluginBundledHelpers } = require('./babel-plugin-bundled-helpers');
const { isFalsy } = require('../utils');

const createBabelConfigRollupBuild = developmentMode => ({
  babelHelpers: 'bundled',
  plugins: [
    // rollup doesn't support optional chaining yet, so we compile it during input
    [require.resolve('@babel/plugin-proposal-optional-chaining'), { loose: true }],
    [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), { loose: true }],

    // plugins that aren't part of @babel/preset-env should be applied regularly in
    // the rollup build phase
    require.resolve('babel-plugin-bundled-import-meta'),
    !developmentMode && [
      require.resolve('babel-plugin-template-html-minifier'),
      {
        modules: {
          'lit-html': ['html'],
          'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
        },
        logOnError: true,
        failOnError: false,
        strictCSS: true,
        htmlMinifier: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeComments: true,
          caseSensitive: true,
          minifyCSS: true,
        },
      },
    ],
  ].filter(isFalsy),
});

function createBabelConfigRollupGenerate(modern = true) {
  return {
    babelrc: false,
    configFile: false,
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: modern ? findModernBrowserslist() : ['ie 11'],
          useBuiltIns: false,
          shippedProposals: true,
          modules: false,
          bugfixes: true,
        },
      ],
    ],

    plugins: [
      babelPluginBundledHelpers,
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-syntax-import-meta'),
    ].filter(isFalsy),
  };
}

const babelConfigSystemJs = {
  babelrc: false,
  configFile: false,
  plugins: [
    require.resolve('@babel/plugin-syntax-import-meta'),
    require.resolve('@babel/plugin-proposal-dynamic-import'),
    require.resolve('@babel/plugin-transform-modules-systemjs'),
  ],
};

const babelConfigRollupGenerate = createBabelConfigRollupGenerate();
const babelConfigLegacyRollupGenerate = createBabelConfigRollupGenerate(false);

module.exports = {
  createBabelConfigRollupBuild,
  babelConfigSystemJs,
  babelConfigRollupGenerate,
  babelConfigLegacyRollupGenerate,
};
