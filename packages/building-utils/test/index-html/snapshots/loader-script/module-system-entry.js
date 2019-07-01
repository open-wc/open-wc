/* eslint-disable */
 (function() {
    function loadEntries() {
      'noModule' in HTMLScriptElement.prototype ? window.importShim('./app.js') : System.import('./legacy/app.js');
    }
    loadEntries()
  })();