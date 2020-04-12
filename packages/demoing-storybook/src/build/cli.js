#!/usr/bin/env node
const build = require('./build');
const readCommandLineArgs = require('./readCommandLineArgs');

(async function main() {
  const config = readCommandLineArgs();

  await build({
    storybookConfigDir: config.configDir,
    storiesPatterns: config.stories,
    outputDir: config.outputDir,
    experimentalMdDocs: config.experimentalMdDocs,
    rollupConfigDecorator: config.rollup,
    addons: config.addons,
  });
})();
