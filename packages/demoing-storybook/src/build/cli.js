#!/usr/bin/env node

/* eslint-disable no-console */

const build = require('./build');
const readCommandLineArgs = require('./readCommandLineArgs');
const listFiles = require('../shared/listFiles');

(async function main() {
  const config = readCommandLineArgs();
  const storiesPattern = `${process.cwd()}/${config.stories}`;
  const storyUrls = (await listFiles(storiesPattern)).map(path =>
    path.replace(`${process.cwd()}/`, ''),
  );
  if (storyUrls.length === 0) {
    console.log(`We could not find any stories for the provided pattern "${storiesPattern}".
      You can override it by doing "--stories ./your-pattern.js`);
    process.exit(1);
  }

  await build({
    storybookConfigDir: config['config-dir'],
    storyUrls,
    outputDir: config['output-dir'],
  });
})();
