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
const storiesPatternsToUrls = require('../shared/storiesPatternsToUrls');

async function run() {
  const config = readCommandLineArgs();
  const rootDir = config.rootDir ? path.resolve(process.cwd(), config.rootDir) : process.cwd();

  const storybookConfigDir = config.configDir;
  const managerPath = require.resolve(config.managerPath);
  const previewPath = require.resolve(config.previewPath);
  const previewPathRelative = rootDir ? `/${path.relative(rootDir, previewPath)}` : previewPath;
  const previewImport = toBrowserPath(previewPathRelative);
  const storyUrls = await storiesPatternsToUrls(config.stories, rootDir);

  const assets = getAssets({ storybookConfigDir, rootDir, managerPath, previewImport, storyUrls });
  config.babelExclude = [...(config.babelExclude || []), assets.managerScriptUrl];

  config.babelModuleExclude = [...(config.babelModuleExclude || []), assets.managerScriptUrl];

  config.fileExtensions = [...(config.fileExtensions || []), '.mdx'];

  if (storyUrls.length === 0) {
    console.log(
      `We could not find any stories for the provided pattern(s) "${config.stories}". You can configure this in your main.js configuration file.`,
    );
    process.exit(1);
  }

  config.middlewares = [createServeManagerMiddleware(assets), ...(config.middlewares || [])];

  config.responseTransformers = [
    createMdxToJs({ previewImport }),
    createOrderedExportsTransformer(storyUrls),
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
