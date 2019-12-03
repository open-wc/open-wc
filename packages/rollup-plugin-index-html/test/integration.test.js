/* eslint-disable import/no-dynamic-require, global-require */
const rollup = require('rollup');
const path = require('path');
const fs = require('fs');
const { testSnapshots } = require('@open-wc/building-utils/testing-helpers/snapshots');

const fixturesDir = path.join(__dirname, 'fixtures');

async function testSnapshot(name, configFilePath) {
  const snapshotDir = path.join(__dirname, 'snapshots', name);
  /** @type {{ [key: string]: string }} */
  const outputFiles = {};

  const requireResult = require(configFilePath);
  const configOrConfigs = requireResult({
    _outputHandler(files) {
      files.forEach(file => {
        outputFiles[file.path] = file.content;
      });
    },
  });

  const configs = Array.isArray(configOrConfigs) ? configOrConfigs : [configOrConfigs];

  /* eslint-disable no-restricted-syntax, no-await-in-loop, no-loop-func */
  for (const config of configs) {
    const bundle = await rollup.rollup(config);
    const { output } = await bundle.generate(config);

    output.forEach(file => {
      const filePath = path.join(config.output.dir, file.fileName);
      // @ts-ignore
      outputFiles[filePath] = file.code;
    });
  }

  testSnapshots(snapshotDir, outputFiles);
}

const testCases = fs.readdirSync(fixturesDir);

describe('integration', () => {
  testCases.forEach(name => {
    const configFilePath = path.join(fixturesDir, name, 'rollup.config.js');
    if (!fs.existsSync(configFilePath)) {
      return;
    }

    it(`test case ${name}`, async () => {
      await testSnapshot(name, configFilePath);
    });
  });
});
