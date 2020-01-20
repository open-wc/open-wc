#!/usr/bin/env node

/* eslint-disable no-console, no-param-reassign */
const { createConfig, startServer } = require('es-dev-server');
const path = require('path');

const readCommandLineArgs = require('./readCommandLineArgs');
const createServeStorybookTransformer = require('./transformers/createServeStorybookTransformer');
const createMdxToJs = require('./transformers/createMdxToJs');
const createOrderedExportsTransformer = require('./transformers/createOrderedExportsTransformer');
const toBrowserPath = require('../shared/toBrowserPath');
const getAssets = require('../shared/getAssets');
const storiesPatternsToUrls = require('../shared/storiesPatternsToUrls');

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
  const storyUrls = await storiesPatternsToUrls(config.stories, rootDir);

  const assets = getAssets({
    storybookConfigDir,
    rootDir,
    previewImport,
    managerImport,
    storyUrls,
  });

  config.babelModernExclude = [
    ...(config.babelModernExclude || []),
    '**/@open-wc/storybook-prebuilt/**',
  ];

  config.fileExtensions = [...(config.fileExtensions || []), '.mdx'];

  if (storyUrls.length === 0) {
    console.log(
      `We could not find any stories for the provided pattern(s) "${config.stories}". You can configure this in your main.js configuration file.`,
    );
    process.exit(1);
  }

  config.responseTransformers = [
    ...(config.responseTransformers || []),
    createMdxToJs(),
    createServeStorybookTransformer(assets),
    createOrderedExportsTransformer(storyUrls),
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
