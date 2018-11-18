const wallabyWebpack = require('wallaby-webpack'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');

const wallabyPostprocessor = wallabyWebpack({
  resolve: {
    modules: [path.resolve(__dirname, 'bower_components'), 'node_modules'],
  },
  entryPatterns: [
    'test/index.js',
  ],
});

module.exports = () => ({
  files: [
    { pattern: '*.js', load: false },
    '!wallaby.js',
    '!*.config.js',
    '!*.conf.js',
    { pattern: 'test/index.js', load: false },
    { pattern: 'test/*.test.js', ignore: true },
  ],
  tests: [
    { pattern: 'test/*.test.js', load: false },
  ],
  testFramework: 'mocha',
  debug: true,
  env: {
    kind: 'chrome',
    params: {
      runner: '--no-sandbox --disable-setuid-sandbox --headless --disable-gpu --disable-translate --disable-extensions --disable-background-networking --safebrowsing-disable-auto-update --disable-sync --metrics-recording-only --disable-default-apps --no-first-run',
    },
  },
  postprocessor: wallabyPostprocessor,
  setup: () => {
    // required to trigger test loading
    window.__moduleBundler.loadTests();
  },
});
