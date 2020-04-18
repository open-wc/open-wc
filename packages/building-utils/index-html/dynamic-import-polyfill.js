/* eslint-disable */
//@ts-nocheck

/**
 * Polyfills taken from https://github.com/uupaa/dynamic-import-polyfill.
 *
 * Copied here because:
 * - It is not available on NPM
 * - We need it to be a plain script which registers to the window
 */

(function () {
  function toAbsoluteURL(url) {
    const a = document.createElement('a');
    a.setAttribute('href', url); // <a href="hoge.html">
    return a.cloneNode(false).href; // -> "http://example.com/hoge.html"
  }

  function importShim(url) {
    return new Promise((resolve, reject) => {
      const vector = '$importModule$' + Math.random().toString(32).slice(2);
      const script = document.createElement('script');
      const destructor = () => {
        delete window[vector];
        script.onerror = null;
        script.onload = null;
        script.remove();
        URL.revokeObjectURL(script.src);
        script.src = '';
      };
      script.defer = 'defer';
      script.type = 'module';
      script.onerror = () => {
        reject(new Error(`Failed to import: ${url}`));
        destructor();
      };
      script.onload = () => {
        resolve(window[vector]);
        destructor();
      };
      const absURL = toAbsoluteURL(url);
      const loader = `import * as m from "${absURL}"; window.${vector} = m;`; // export Module
      const blob = new Blob([loader], { type: 'text/javascript' });
      script.src = URL.createObjectURL(blob);

      document.head.appendChild(script);
    });
  }

  window.importShim = importShim;
})();
