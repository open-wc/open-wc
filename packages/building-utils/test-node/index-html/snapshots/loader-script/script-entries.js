(function() {
  function loadScript(src, module) {
    return new Promise(function (resolve, reject) {
      document.head.appendChild(Object.assign(
        document.createElement('script'),
        { src: src, onload: resolve, onerror: reject },
        module ? { type: 'module' } : undefined
      ));
    });
  }


  function loadEntries() {
    ['./app.js','./shared.js'].forEach(function (entry) { loadScript(entry); });
  }

  loadEntries()
})();