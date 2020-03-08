#!/usr/bin/env node
const build = require('./build');
const readCommandLineArgs = require('./readCommandLineArgs');

(async function main() {
  const config = readCommandLineArgs();

  await build({
    storybookConfigDir: config.configDir,
    storiesPatterns: config.stories,
    outputDir: config.outputDir,
    managerPath: require.resolve(config.managerPath),
    previewPath: require.resolve(config.previewPath),
    rollupConfigDecorator: config.rollup,
    addons: config.addons,
  });
})();
