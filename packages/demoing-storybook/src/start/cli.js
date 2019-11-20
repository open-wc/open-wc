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
  const rootDir = path.resolve(process.cwd(), config.esDevServerConfig.rootDir);

  const storybookConfigDir = config.storybookServerConfig['config-dir'];
  const storiesPattern = `${rootDir}/${config.storybookServerConfig.stories}`;
  const storyUrls = (await listFiles(storiesPattern, rootDir)).map(filePath => {
    const relativeFilePath = path.relative(rootDir, filePath);
    return `/${toBrowserPath(relativeFilePath)}`;
  });

  const assets = getAssets({ storybookConfigDir, storyUrls });
  config.esDevServerConfig.babelExclude = [
    ...(config.esDevServerConfig.babelExclude || []),
    assets.managerScriptUrl,
  ];

  config.esDevServerConfig.babelModuleExclude = [
    ...(config.esDevServerConfig.babelModuleExclude || []),
    assets.managerScriptUrl,
  ];

  config.esDevServerConfig.fileExtensions = [
    ...(config.esDevServerConfig.fileExtensions || []),
    '.mdx',
  ];

  if (storyUrls.length === 0) {
    console.log(`We could not find any stories for the provided pattern "${storiesPattern}".
      You can override it by doing "--stories ./your-pattern.js`);
    process.exit(1);
  }

  config.esDevServerConfig.middlewares = [
    createServeManagerMiddleware(assets),
    ...(config.esDevServerConfig.middlewares || []),
  ];

  config.esDevServerConfig.responseTransformers = [
    createMdxToJs(rootDir),
    createServePreviewTransformer(assets),
    ...(config.esDevServerConfig.responseTransformers || []),
  ];

  startServer(createConfig(config.esDevServerConfig));

  ['exit', 'SIGINT'].forEach(event => {
    // @ts-ignore
    process.on(event, () => {
      process.exit(0);
    });
  });
}

run();
