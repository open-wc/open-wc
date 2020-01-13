#!/usr/bin/env node

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');

const readCommandLineArgs = require('./readCommandLineArgs');
const createServeManagerMiddleware = require('./middleware/createServeManagerMiddleware');
const createServePreviewTransformer = require('./transformers/createServePreviewTransformer');
const createMdxToJs = require('./transformers/createMdxToJs');
const createOrderedExportsTransformer = require('./transformers/createOrderedExportsTransformer');
const toBrowserPath = require('../shared/toBrowserPath');
const getAssets = require('../shared/getAssets');
const listFiles = require('../shared/listFiles');

async function storiesPatternsToFiles(storiesPatterns, rootDir) {
  const listFilesPromises = storiesPatterns.map(pattern => listFiles(pattern, rootDir));
  const arrayOfFilesArrays = await Promise.all(listFilesPromises);
  const files = [];

  for (const filesArray of arrayOfFilesArrays) {
    for (const filePath of filesArray) {
      const relativeFilePath = path.relative(rootDir, filePath);
      files.push(`/${toBrowserPath(relativeFilePath)}`);
    }
  }

  return files;
}

async function run() {
  const config = readCommandLineArgs();
  const rootDir = config.esDevServerConfig.rootDir
    ? path.resolve(process.cwd(), config.esDevServerConfig.rootDir)
    : process.cwd();

  const storybookConfigDir = config.configDir;
  const managerPath = require.resolve(config.managerPath);
  const previewPath = require.resolve(config.previewPath);
  const previewPathRelative = rootDir ? `/${path.relative(rootDir, previewPath)}` : previewPath;
  const previewImport = toBrowserPath(previewPathRelative);
  const storyUrls = await storiesPatternsToFiles(config.resolvedStories, rootDir);
  const assets = getAssets({ storybookConfigDir, managerPath, previewImport, storyUrls });
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
    console.log(
      `We could not find any stories for the provided pattern(s) "${config.stories}". You can configure this in your main.js configuration file.`,
    );
    process.exit(1);
  }

  config.esDevServerConfig.middlewares = [
    createServeManagerMiddleware(assets),
    ...(config.esDevServerConfig.middlewares || []),
  ];

  config.esDevServerConfig.responseTransformers = [
    createMdxToJs({ previewImport }),
    createOrderedExportsTransformer(storyUrls),
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
