/* global chai */

const wallabyWebpack = require('wallaby-webpack'); // eslint-disable-line import/no-extraneous-dependencies
const path = require('path');

const wallabyPostprocessor = wallabyWebpack({
  resolve: {
    modules: [path.resolve(__dirname, 'bower_components'), 'node_modules'],
  },
});

module.exports = () => ({
  files: [
    '*.js',
    '!wallaby.js',
    { pattern: 'node_modules/chai/chai.js', instrument: false },
    { pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false },
  ],
  tests: [
    'test/*.test.js',
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
    window.expect = chai.expect;
    // required to trigger test loading
    window.__moduleBundler.loadTests();
  },
});
