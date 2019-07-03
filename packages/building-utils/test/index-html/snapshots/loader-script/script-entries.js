(function() {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.onerror = reject;
      script.onload = resolve;
      script.src = src;
      script.defer = true;

      document.head.appendChild(script);
    });
  }


  function loadEntries() {
    ['./app.js','./shared.js'].forEach(function (entry) { loadScript(entry); });
  }

  loadEntries()
})();