/* eslint-disable */
 (function() {
    function loadEntries() {
      ['./app.js','./shared.js'].forEach(function (entry) { window.__dynamicImport__(entry); });
    }
    loadEntries()
  })();