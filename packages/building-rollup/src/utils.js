/** @typedef {import('./types').SpaOptions} SpaOptions */

const merge = require('deepmerge');
const path = require('path');
const { createScript } = require('@open-wc/building-utils');
const { parse, serialize } = require('parse5');
const { append, predicates, query } = require('@open-wc/building-utils/dom5-fork');
const Terser = require('terser');

const isFalsy = _ => !!_;

function dedupedBabelPlugin(babel, userConfig, defaultConfig) {
  if (!userConfig) {
    return undefined;
  }

  const config = merge(defaultConfig, typeof userConfig === 'object' ? userConfig : {});

  const newPlugins = [];
  const addedPlugins = new Set();
  for (const plugin of [...config.plugins].reverse()) {
    const name = Array.isArray(plugin) ? plugin[0] : plugin;
    const resolvedName = require.resolve(name);
    if (!addedPlugins.has(resolvedName)) {
      addedPlugins.add(resolvedName);
      newPlugins.unshift(plugin);
    }
  }

  config.plugins = newPlugins;
  return babel(config);
}

function pluginWithOptions(plugin, userConfig, defaultConfig, ...otherParams) {
  if (!userConfig) {
    return undefined;
  }

  const config = merge(defaultConfig, typeof userConfig === 'object' ? userConfig : {});
  return plugin(config, ...otherParams);
}

/**
 *
 * @param {SpaOptions} userOptions
 * @param {string} outputDir
 * @param {string} htmlFileName
 */
function createSwPath(userOptions, outputDir, htmlFileName) {
  let swPath;
  if (typeof userOptions.workbox === 'object' && userOptions.workbox.swDest) {
    swPath = userOptions.workbox.swDest.replace(`${outputDir}/`, '');
  } else {
    swPath = './sw.js';
  }

  swPath = path.relative(path.dirname(htmlFileName), swPath);
  return swPath;
}

/**
 * @param {string} htmlString
 * @returns {string}
 */
function applyServiceWorkerRegistration(htmlString, transformOptions, userOptions, outputDir) {
  const swPath = createSwPath(userOptions, outputDir, transformOptions.htmlFileName);
  const documentAst = parse(htmlString);
  const body = query(documentAst, predicates.hasTagName('body'));
  const swRegistration = createScript(
    {},
    Terser.minify(`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('${swPath}')
          .then(function() {
            console.log('ServiceWorker registered.');
          })
          .catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  `).code,
  );

  append(body, swRegistration);
  return serialize(documentAst);
}

module.exports = {
  isFalsy,
  pluginWithOptions,
  dedupedBabelPlugin,
  applyServiceWorkerRegistration,
  createSwPath,
};
