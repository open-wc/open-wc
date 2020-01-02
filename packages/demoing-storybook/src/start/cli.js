#!/usr/bin/env node

/* eslint-disable no-console, no-param-reassign */

const { createConfig, startServer } = require('es-dev-server');
const path = require('path');

const readCommandLineArgs = require('./readCommandLineArgs');
const createServeManagerMiddleware = require('./middleware/createServeManagerMiddleware');
const createServePreviewTransformer = require('./transformers/createServePreviewTransformer');
const createMdxToJs = require('./transformers/createMdxToJs');
const toBrowserPath = require('../shared/toBrowserPath');
const getAssets = require('../shared/getAssets');
const listFiles = require('../shared/listFiles');

async function run() {
  const config = readCommandLineArgs();
  const rootDir = config.rootDir ? path.resolve(process.cwd(), config.rootDir) : process.cwd();

  const storybookConfigDir = config.configDir;
  const managerPath = require.resolve(config.managerPath);
  const previewPath = require.resolve(config.previewPath);
  const storiesPattern = config.stories;
  const storyUrls = (await listFiles(storiesPattern, rootDir)).map(filePath => {
    const relativeFilePath = path.relative(rootDir, filePath);
    return `/${toBrowserPath(relativeFilePath)}`;
  });

  const assets = getAssets({ storybookConfigDir, managerPath, storyUrls });
  config.babelExclude = [...(config.babelExclude || []), assets.managerScriptUrl];

  config.babelModuleExclude = [...(config.babelModuleExclude || []), assets.managerScriptUrl];

  config.fileExtensions = [...(config.fileExtensions || []), '.mdx'];

  if (storyUrls.length === 0) {
    console.log(`We could not find any stories for the provided pattern "${storiesPattern}".
      You can override it by doing "--stories ./your-pattern.js`);
    process.exit(1);
  }

  config.middlewares = [createServeManagerMiddleware(assets), ...(config.middlewares || [])];

  config.responseTransformers = [
    createMdxToJs({ rootDir, previewPath }),
    createServePreviewTransformer(assets),
    ...(config.responseTransformers || []),
  ];

  startServer(createConfig(config));

  ['exit', 'SIGINT'].forEach(event => {
    // @ts-ignore
    process.on(event, () => {
      process.exit(0);
    });
  });
}

run();
