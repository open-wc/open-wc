/* eslint-disable */
 (function() {
    function loadEntries() {
      ['./app.js','./shared.js'].forEach(function (entry) { window.importShim(entry); });
    }
    loadEntries()
  })();