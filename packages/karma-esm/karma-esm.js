const merge = require('webpack-merge');
const createCompiler = require('./src/compiler');

const createBabelOptions = (config = {}) => ({
  sourceType: 'module',
  plugins: [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-syntax-import-meta'),
    [
      require.resolve('../forked-babel-plugin-bare-import-rewrite'),
      {
        rootBaseDir: '.',
        alwaysRootImport: ['**'],
        modulesDir: './node_modules',
        failOnUnresolved: true,
        resolveDirectories: config.moduleDirectories,
      },
    ],
    config.coverage && [
      require.resolve('babel-plugin-istanbul'),
      {
        exclude: ['**/node_modules/**', '**/*.test.js', '**/*.spec.js'],
      },
    ],
  ].filter(_ => _),
  sourceMap: 'inline',
});

const defaultPluginConfig = {
  baseDir: './',
  moduleResolveRoot: './',
  moduleDirectories: ['node_modules'],
};

function createPluginConfig(karmaConfig) {
  return merge(
    {
      babelOptions: createBabelOptions(karmaConfig.esm),
    },
    defaultPluginConfig,
    karmaConfig.esm,
  );
}

function initialize(karmaConfig, karmaEmitter) {
  module.exports.pluginConfig = createPluginConfig(karmaConfig);
  module.exports.compile = createCompiler(module.exports.pluginConfig, karmaEmitter);
}

module.exports = {
  initialize,
};
