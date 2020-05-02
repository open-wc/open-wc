/* eslint-disable import/no-extraneous-dependencies */
const glob = require('glob');
const fs = require('fs');
const path = require('path');

const merge = require('deepmerge');
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
 * @param {string} htmlString
 * @returns {string}
 */
function applyServiceWorkerRegistration(htmlString) {
  const documentAst = parse(htmlString);
  const body = query(documentAst, predicates.hasTagName('body'));
  const swRegistration = createScript(
    {},
    Terser.minify(`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker
          .register('./sw.js')
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

/**
 * Lists all files using the specified glob, starting from the given root directory.
 *
 * Will return all matching file paths fully resolved.
 */
function listFiles(fromGlob, rootDir = process.cwd()) {
  return new Promise(resolve => {
    glob(fromGlob, { cwd: rootDir }, (er, files) => {
      // remember, each filepath returned is relative to rootDir
      resolve(
        files
          // fully resolve the filename relative to rootDir
          .map(filePath => path.resolve(rootDir, filePath))
          // filter out directories
          .filter(filePath => !fs.lstatSync(filePath).isDirectory()),
      );
    });
  });
}

module.exports = {
  isFalsy,
  pluginWithOptions,
  dedupedBabelPlugin,
  applyServiceWorkerRegistration,
  listFiles,
};
