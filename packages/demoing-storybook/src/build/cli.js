#!/usr/bin/env node

/* eslint-disable no-console */
const path = require('path');

const build = require('./build');
const readCommandLineArgs = require('./readCommandLineArgs');
const listFiles = require('../shared/listFiles');
const toBrowserPath = require('../shared/toBrowserPath');

(async function main() {
  const rootDir = process.cwd();
  const config = readCommandLineArgs();
  const storiesPattern = `${process.cwd()}/${config.stories}`;
  const storyUrls = (await listFiles(storiesPattern, rootDir)).map(filePath => {
    const relativeFilePath = path.relative(rootDir, filePath);
    return `./${toBrowserPath(relativeFilePath)}`;
  });

  if (storyUrls.length === 0) {
    console.log(`We could not find any stories for the provided pattern "${storiesPattern}".
      You can override it by doing "--stories ./your-pattern.js`);
    process.exit(1);
  }

  await build({
    storybookConfigDir: config['config-dir'],
    storyUrls,
    outputDir: config['output-dir'],
    managerPath: require.resolve(config['manager-path']),
    previewPath: require.resolve(config['preview-path']),
  });
})();
