const { createScript } = require('@open-wc/building-utils');
const { parse, serialize } = require('parse5');
const { append, predicates, query } = require('@open-wc/building-utils/dom5-fork');
const Terser = require('terser');

/**
 * Applies the service worker registration to the index.html
 * @param {string} htmlString
 * @param {string} swPath
 * @returns {string}
 */
function applyServiceWorkerRegistration(htmlString, swPath) {
  const documentAst = parse(htmlString);
  const body = query(documentAst, predicates.hasTagName('body'));
  const swRegistration = createScript(
    {},
    Terser.minify(`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('${swPath}').then(() => {
          console.log('ServiceWorker registered!');
        }, (err) => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  `).code,
  );

  append(body, swRegistration);
  return serialize(documentAst);
}

module.exports = applyServiceWorkerRegistration;
