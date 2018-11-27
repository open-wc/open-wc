const wallabyWebpack = require('wallaby-webpack'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');

const wallabyPostprocessor = wallabyWebpack({
  resolve: {
    modules: [path.resolve(__dirname, 'bower_components'), 'node_modules'],
  },
});

module.exports = () => ({
  files: [
    { pattern: '*.js', load: false },
    '!wallaby.js',
    '!*.config.js',
    '!*.conf.js',
  ],
  tests: [
    { pattern: 'test/*.test.js', load: false },
  ],
  testFramework: 'mocha',
  debug: true,
  env: {
    kind: 'chrome',
  },
  postprocessor: wallabyPostprocessor,
  setup: () => {
    // required to trigger test loading
    window.__moduleBundler.loadTests();
  },
});
