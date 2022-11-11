/* eslint-disable no-param-reassign */
/** @typedef {import('./types').SpaOptions} SpaOptions */
/** @typedef {import('polyfills-loader').PolyfillsLoaderConfig} PolyfillsLoaderConfig */

const merge = require('deepmerge');
const { rollupPluginHTML } = require('@web/rollup-plugin-html');
const { importMetaAssets } = require('@web/rollup-plugin-import-meta-assets');
const { polyfillsLoader } = require('@web/rollup-plugin-polyfills-loader');
const path = require('path');
const { generateSW } = require('rollup-plugin-workbox');
const { createBasicConfig } = require('./createBasicConfig.js');
const { pluginWithOptions, applyServiceWorkerRegistration, isFalsy } = require('./utils.js');
const { defaultPolyfills } = require('./polyfills.js');

/**
 * @param {SpaOptions} options
 */
function createSpaConfig(options) {
  const basicConfig = createBasicConfig(options);

  /** @type {SpaOptions} */
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

  if (userOptions.rootDir) {
    if (typeof userOptions.html === 'boolean' && userOptions.html) {
      userOptions.html = {
        rootDir: userOptions.rootDir,
      };
    }
    if (typeof userOptions.html === 'object') {
      userOptions.html.rootDir = userOptions.rootDir;
    }
  }

  const applySw = (htmlString, transformOptions) =>
    applyServiceWorkerRegistration(htmlString, transformOptions, userOptions, outputDir);

  const htmlPlugin = pluginWithOptions(rollupPluginHTML, userOptions.html, {
    minify: !userOptions.developmentMode,
    transformHtml: [userOptions.injectServiceWorker && applySw].filter(isFalsy),
    injectServiceWorker: false,
  });

  let polyfillsLoaderConfig = {
    polyfills: {},
    minify: !userOptions.developmentMode,
  };

  if (userOptions.legacyBuild) {
    if (!htmlPlugin) {
      throw new Error('Cannot generate multi build outputs when html plugin is disabled');
    }
    outputDir = basicConfig.output[0].dir;

    basicConfig.output[0].plugins.push(htmlPlugin.api.addOutput('module'));
    basicConfig.output[1].plugins.push(htmlPlugin.api.addOutput('nomodule'));
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

  const workboxPlugin = pluginWithOptions(
    generateSW,
    userOptions.workbox,
    {
      // Keep 'legacy-*.js' just for retro compatibility
      globIgnores: ['polyfills/*.js', 'legacy-*.js', 'nomodule-*.js'],
      navigateFallback: '/index.html',
      // where to output the generated sw
      swDest: path.join(outputDir, 'sw.js'),
      // directory to match patterns against to be precached
      globDirectory: path.join(outputDir),
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
      // create HTML file output
      htmlPlugin,

      importMetaAssets(),

      // inject polyfills loader into HTML
      pluginWithOptions(polyfillsLoader, userOptions.polyfillsLoader, polyfillsLoaderConfig),
    ],
  });
}

module.exports = { createSpaConfig };
