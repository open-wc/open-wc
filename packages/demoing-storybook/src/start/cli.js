#!/usr/bin/env node

/** @typedef {import('es-dev-server').Config} ServerConfig */
/** @typedef {import('@mdjs/core').MdjsProcessPlugin} MdjsProcessPlugin */

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');
const fs = require('fs');

const readCommandLineArgs = require('./readCommandLineArgs');
const createMdjsToCsfTransformer = require('./transformers/createMdjsToCsfTransformer');
const createServeStorybookTransformer = require('./transformers/createServeStorybookTransformer');
const { mdxToCsfTransformer } = require('./transformers/mdxToCsfTransformer');
const toBrowserPath = require('../shared/toBrowserPath');
const getAssets = require('../shared/getAssets');

async function run() {
  const config = /** @type {ServerConfig & { stories: string[], addons: string[], configDir: string, setupMdjsPlugins: MdjsProcessPlugin[], relativeImports: boolean }} */ (readCommandLineArgs());
  const rootDir = config.rootDir ? path.resolve(process.cwd(), config.rootDir) : process.cwd();
  const pathPrefix = config.relativeImports ? './' : '/';

  const storybookConfigDir = config.configDir;
  const previewPath = require.resolve('storybook-prebuilt/web-components.js');
  const managerPath = require.resolve('storybook-prebuilt/manager.js');
  const previewPathRelative = rootDir
    ? `${pathPrefix}${path.relative(rootDir, previewPath)}`
    : previewPath;
  const managerPathRelative = rootDir
    ? `${pathPrefix}${path.relative(rootDir, managerPath)}`
    : managerPath;
  const previewImport = toBrowserPath(previewPathRelative);
  const managerImport = toBrowserPath(managerPathRelative);

  const previewConfigPath = path.join(process.cwd(), storybookConfigDir, 'preview.js');
  let previewConfigImport;
  if (fs.existsSync(previewConfigPath)) {
    const previewConfigRelative = rootDir
      ? `${pathPrefix}${path.relative(rootDir, previewConfigPath)}`
      : previewConfigPath;
    previewConfigImport = `${toBrowserPath(previewConfigRelative)}`;
  }

  const assets = getAssets({
    storybookConfigDir,
    rootDir,
    managerImport,
    addons: config.addons,
    absoluteImports: !config.relativeImports,
  });

  config.babelModernExclude = [...(config.babelModernExclude || []), '**/storybook-prebuilt/**'];
  config.fileExtensions = [...(config.fileExtensions || []), '.md', '.mdx'];

  config.responseTransformers = [
    ...(config.responseTransformers || []),
    createMdjsToCsfTransformer({
      setupMdjsPlugins: config.setupMdjsPlugins,
    }),
    mdxToCsfTransformer,
    createServeStorybookTransformer({
      assets,
      previewImport,
      previewConfigImport,
      storiesPatterns: config.stories,
      rootDir,
      absolutePath: !config.relativeImports,
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
