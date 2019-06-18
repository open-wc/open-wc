/* eslint-disable */
 (function() {
    function loadEntries() {
      'noModule' in HTMLScriptElement.prototype ? window.__dynamicImport__('./app.js') : System.import('./legacy/app.js');
    }
    loadEntries()
  })();