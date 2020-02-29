#!/usr/bin/env node

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');
const fs = require('fs');

const readCommandLineArgs = require('./readCommandLineArgs');
const createServeStorybookTransformer = require('./transformers/createServeStorybookTransformer');
const createMdxToJs = require('./transformers/createMdxToJs');
const toBrowserPath = require('../shared/toBrowserPath');
const getAssets = require('../shared/getAssets');

async function run() {
  const config = readCommandLineArgs();
  const rootDir = config.rootDir ? path.resolve(process.cwd(), config.rootDir) : process.cwd();

  const storybookConfigDir = config.configDir;
  const previewPath = require.resolve(config.previewPath);
  const managerPath = require.resolve(config.managerPath);
  const previewPathRelative = rootDir ? `/${path.relative(rootDir, previewPath)}` : previewPath;
  const managerPathRelative = rootDir ? `/${path.relative(rootDir, managerPath)}` : managerPath;
  const previewImport = toBrowserPath(previewPathRelative);
  const managerImport = toBrowserPath(managerPathRelative);

  const previewConfigPath = path.join(process.cwd(), storybookConfigDir, 'preview.js');
  let previewConfigImport;
  if (fs.existsSync(previewConfigPath)) {
    previewConfigImport = `/${toBrowserPath(path.relative(rootDir, previewConfigPath))}`;
  }

  const assets = getAssets({ storybookConfigDir, rootDir, managerImport, absoluteImports: true });

  config.babelModernExclude = [...(config.babelModernExclude || []), '**/storybook-prebuilt/**'];
  config.fileExtensions = [...(config.fileExtensions || []), '.mdx'];

  config.responseTransformers = [
    ...(config.responseTransformers || []),
    createMdxToJs(),
    createServeStorybookTransformer({
      assets,
      previewImport,
      previewConfigImport,
      storiesPatterns: config.stories,
      rootDir,
    }),
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
