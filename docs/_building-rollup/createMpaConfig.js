/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-param-reassign */
/** @typedef {import('polyfills-loader').PolyfillsLoaderConfig} PolyfillsLoaderConfig */

const merge = require('deepmerge');
const html = require('@open-wc/rollup-plugin-html');
const polyfillsLoader = require('@open-wc/rollup-plugin-polyfills-loader');
const path = require('path');
const { generateSW } = require('rollup-plugin-workbox');
const { createBasicConfig } = require('@open-wc/building-rollup');
const { defaultPolyfills } = require('@open-wc/building-rollup');
const {
  pluginWithOptions,
  applyServiceWorkerRegistration,
  isFalsy,
  listFiles,
} = require('./utils');

/**
 * @param {SpaOptions} options
 */
async function createMpaConfig(options) {
  const basicConfig = createBasicConfig(options);
  const userOptions = merge(
    {
      html: true,
      polyfillsLoader: true,
      workbox: true,
      injectServiceWorker: false,
    },
    options,
  );
  let outputDir = basicConfig.output.dir;

  const htmlPlugins = [];
  const polyfillPlugins = [];

  if (!userOptions.inputGlob) {
    throw new Error('Cannot generate multi build outputs when html plugin is disabled');
  }

  const htmlFiles = await listFiles(userOptions.inputGlob);
  const htmlPluginName = [];

  for (const inputPath of htmlFiles) {
    const name = inputPath.substring(userOptions.rootPath.length + 1);
    const htmlPlugin = pluginWithOptions(html, userOptions.html, {
      minify: !userOptions.developmentMode,
      transform: [userOptions.injectServiceWorker && applyServiceWorkerRegistration].filter(
        isFalsy,
      ),
      inject: false,
      inputPath,
      name,
    });
    htmlPlugins.push(htmlPlugin);
    htmlPluginName.push(name);
  }

  let polyfillsLoaderConfig = {
    polyfills: {},
    minify: !userOptions.developmentMode,
  };

  if (userOptions.legacyBuild) {
    if (htmlPlugins.length < 1) {
      throw new Error('Cannot generate multi build outputs when html plugin is disabled');
    }
    outputDir = basicConfig.output[0].dir;

    for (const htmlPlugin of htmlPlugins) {
      basicConfig.output[0].plugins.push(htmlPlugin.addOutput('module'));
      basicConfig.output[1].plugins.push(htmlPlugin.addOutput('nomodule'));
    }

    polyfillsLoaderConfig = {
      modernOutput: {
        name: 'module',
        type: 'module',
      },
      legacyOutput: {
        name: 'nomodule',
        type: 'systemjs',
        test:
          // test if browser supports dynamic imports (and thus modules). import.meta.url cannot be tested
          "(function(){try{Function('!function(){import(_)}').call();return false;}catch(_){return true}})()",
      },
      minify: !userOptions.developmentMode,
      polyfills: defaultPolyfills,
    };
  }

  for (let i = 0; i < htmlPlugins.length; i += 1) {
    const localConfig = {
      ...polyfillsLoaderConfig,
    };
    const name = htmlPluginName[i];
    localConfig.htmlFileName = name;
    const polyfillPlugin = pluginWithOptions(
      polyfillsLoader,
      userOptions.polyfillsLoader,
      localConfig,
    );
    polyfillPlugins.push(polyfillPlugin);
  }

  const workboxPlugin = pluginWithOptions(
    generateSW,
    userOptions.workbox,
    {
      // Keep 'legacy-*.js' just for retro compatibility
      globIgnores: ['polyfills/*.js', 'legacy-*.js', 'nomodule-*.js'],
      navigateFallback: '/index.html',
      // where to output the generated sw
      swDest: path.join(process.cwd(), outputDir, 'sw.js'),
      // directory to match patterns against to be precached
      globDirectory: path.join(process.cwd(), outputDir),
      // cache any html js and css by default
      globPatterns: ['**/*.{html,js,css,webmanifest}'],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: 'polyfills/*.js',
          handler: 'CacheFirst',
        },
      ],
    },
    () => {},
  );

  if (userOptions.workbox) {
    if (basicConfig.output.length > 1) {
      const lastOutput = basicConfig.output.length - 1;
      basicConfig.output[lastOutput].plugins.push(workboxPlugin);
    } else {
      basicConfig.output.plugins.push(workboxPlugin);
    }
  }

  return merge(basicConfig, {
    plugins: [
      // create HTML files output
      ...htmlPlugins,

      // inject polyfills loaders into HTML
      ...polyfillPlugins,
    ],
  });
}

module.exports = { createMpaConfig };
