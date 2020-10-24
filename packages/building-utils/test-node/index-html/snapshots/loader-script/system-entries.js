(function() {
  function loadEntries() {
    ['./app.js','./shared.js'].forEach(function (entry) { System.import(entry); });
  }

  loadEntries()
})();