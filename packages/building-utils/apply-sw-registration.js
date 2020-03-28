const { parse, serialize } = require('parse5');
const Terser = require('terser');
const { createScript } = require('./dom5-utils.js');
const { append, predicates, query } = require('./dom5-utils.js');

/**
 * @param {string} htmlString
 * @returns {string}
 */
module.exports = function applyServiceWorkerRegistration(htmlString) {
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
};
