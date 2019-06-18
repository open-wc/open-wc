/* eslint-disable import/no-dynamic-require, global-require */
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { testSnapshots } = require('@open-wc/building-utils/testing-helpers/snapshots');

const fixturesDir = path.join(__dirname, 'fixtures');

function compileAsync(config) {
  return new Promise((resolve, reject) => {
    const compiler = webpack({
      ...config,
      output: {
        ...config.output,
        path: os.tmpdir(),
      },
    });

    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

async function testSnapshot(name, configFilePath) {
  const snapshotDir = path.join(__dirname, 'snapshots', name);
  const requireResult = require(configFilePath);
  const configs = Array.isArray(requireResult) ? requireResult : [requireResult];

  /** @type {{ [key: string]: string }} */
  const outputFiles = {};

  // multi build
  // note: this should be sequential, not parallel
  /* eslint-disable no-restricted-syntax, no-await-in-loop */
  for (const config of configs) {
    const stats = await compileAsync(config);

    Object.entries(stats.compilation.assets).forEach(([filePath, file]) => {
      outputFiles[filePath] = file.source();
    });
  }

  testSnapshots(snapshotDir, outputFiles);
}

const testCases = fs.readdirSync(fixturesDir);

describe('webpack-index-html-plugin integration test', () => {
  testCases.forEach(name => {
    const configFilePath = path.join(fixturesDir, name, 'webpack.config.js');
    if (!fs.existsSync(configFilePath)) {
      return;
    }

    it(`test case ${name}`, async function it() {
      this.timeout(1000 * 10);
      await testSnapshot(name, configFilePath);
    });
  });
});
