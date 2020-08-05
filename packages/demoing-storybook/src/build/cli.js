#!/usr/bin/env node
const build = require('./build');
const readCommandLineArgs = require('./readCommandLineArgs');

(async function main() {
  const config = readCommandLineArgs();

  await build({
    storybookConfigDir: config.configDir,
    storiesPatterns: config.stories,
    outputDir: config.outputDir,
    rollupConfigDecorator: config.rollup,
    addons: config.addons,
    setupMdjsPlugins: config.setupMdjsPlugins,
  });
})();
