const merge = require('deepmerge');
const { createScript } = require('@open-wc/building-utils');
const { parse, serialize } = require('parse5');
const { append, predicates, query } = require('@open-wc/building-utils/dom5-fork');

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
 * @param {string} code
 * @returns {string}
 */
function appendScriptToBody(htmlString, code) {
  const documentAst = parse(htmlString);
  const body = query(documentAst, predicates.hasTagName('body'));
  const swRegistration = createScript({}, code);

  append(body, swRegistration);
  return serialize(documentAst);
}

/**
 * @param {string} htmlString
 * @returns {string}
 */
function applyServiceWorkerRegistration(htmlString) {
  const code = `
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
  `;

  return appendScriptToBody(htmlString, code);
}

module.exports = {
  isFalsy,
  pluginWithOptions,
  dedupedBabelPlugin,
  appendScriptToBody,
  applyServiceWorkerRegistration,
};
