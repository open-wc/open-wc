const { babelPluginBundledHelpers } = require('./babel-plugin-bundled-helpers.js');
const { isFalsy } = require('../utils.js');

const createBabelConfigRollupBuild = ({ developmentMode }) => ({
  babelHelpers: 'bundled',
  compact: true,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: [
          'last 3 Chrome major versions',
          'last 3 ChromeAndroid major versions',
          'last 3 Firefox major versions',
          'last 3 Edge major versions',
          'last 3 Safari major versions',
          'last 3 iOS major versions',
        ],
        useBuiltIns: false,
        shippedProposals: true,
        modules: false,
        bugfixes: true,
      },
    ],
  ],
  plugins: [
    // plugins that aren't part of @babel/preset-env should be applied regularly in
    // the rollup build phase
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
    compact: true,
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: modern
            ? [
                'last 3 Chrome major versions',
                'last 3 ChromeAndroid major versions',
                'last 3 Firefox major versions',
                'last 3 Edge major versions',
                'last 3 Safari major versions',
                'last 3 iOS major versions',
              ]
            : ['ie 11'],
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
  compact: true,
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
