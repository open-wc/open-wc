#!/usr/bin/env node

/** @typedef {import('es-dev-server').Config} ServerConfig */

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');
const fs = require('fs');

const readCommandLineArgs = require('./readCommandLineArgs');
const mdjsToCsfTransformer = require('./transformers/mdjsToCsfTransformer');
const createServeStorybookTransformer = require('./transformers/createServeStorybookTransformer');
const { mdxToCsfTransformer } = require('./transformers/mdxToCsfTransformer');
const toBrowserPath = require('../shared/toBrowserPath');
const getAssets = require('../shared/getAssets');

async function run() {
  const config = /** @type {ServerConfig & { stories: string[], addons: string[], configDir: string}} */ (readCommandLineArgs());
  const rootDir = config.rootDir ? path.resolve(process.cwd(), config.rootDir) : process.cwd();

  const storybookConfigDir = config.configDir;
  const previewPath = require.resolve('storybook-prebuilt/web-components.js');
  const managerPath = require.resolve('storybook-prebuilt/manager.js');
  const previewPathRelative = rootDir ? `/${path.relative(rootDir, previewPath)}` : previewPath;
  const managerPathRelative = rootDir ? `/${path.relative(rootDir, managerPath)}` : managerPath;
  const previewImport = toBrowserPath(previewPathRelative);
  const managerImport = toBrowserPath(managerPathRelative);

  const previewConfigPath = path.join(process.cwd(), storybookConfigDir, 'preview.js');
  let previewConfigImport;
  if (fs.existsSync(previewConfigPath)) {
    previewConfigImport = `/${toBrowserPath(path.relative(rootDir, previewConfigPath))}`;
  }

  const assets = getAssets({
    storybookConfigDir,
    rootDir,
    managerImport,
    addons: config.addons,
    absoluteImports: true,
  });

  config.babelModernExclude = [...(config.babelModernExclude || []), '**/storybook-prebuilt/**'];
  config.fileExtensions = [...(config.fileExtensions || []), '.md', '.mdx'];

  config.responseTransformers = [
    ...(config.responseTransformers || []),
    mdjsToCsfTransformer,
    mdxToCsfTransformer,
    createServeStorybookTransformer({
      assets,
      previewImport,
      previewConfigImport,
      storiesPatterns: config.stories,
      rootDir,
    }),
  ].filter(_ => _);

  startServer(createConfig(config));

  ['exit', 'SIGINT'].forEach(event => {
    // @ts-ignore
    process.on(event, () => {
      process.exit(0);
    });
  });
}

run();
