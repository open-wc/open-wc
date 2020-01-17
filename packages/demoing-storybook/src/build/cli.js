#!/usr/bin/env node

/* eslint-disable no-console */
const path = require('path');

const build = require('./build');
const readCommandLineArgs = require('./readCommandLineArgs');
const toBrowserPath = require('../shared/toBrowserPath');
const storiesPatternsToFiles = require('../shared/storiesPatternsToFiles');

(async function main() {
  const rootDir = process.cwd();
  const config = readCommandLineArgs();
  const storiesPattern = `${process.cwd()}/${config.stories}`;
  const storyFiles = await storiesPatternsToFiles(config.stories, rootDir);
  const storyUrls = storyFiles.map(filePath => {
    const relativeFilePath = path.relative(rootDir, filePath);
    return `./${toBrowserPath(relativeFilePath)}`;
  });

  if (storyUrls.length === 0) {
    console.log(`We could not find any stories for the provided pattern "${storiesPattern}".
      You can override it by doing "--stories ./your-pattern.js`);
    process.exit(1);
  }

  await build({
    storybookConfigDir: config.configDir,
    storyFiles,
    storyUrls,
    outputDir: config.outputDir,
    managerPath: require.resolve(config.managerPath),
    previewPath: require.resolve(config.previewPath),
    rollupConfigDecorator: config.rollup,
  });
})();
