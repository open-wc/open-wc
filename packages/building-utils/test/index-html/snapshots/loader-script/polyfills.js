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

  var polyfills = [];
  if (!('fetch' in window)) { polyfills.push(loadScript('polyfills/fetch.myhash.js', false)) }
  if (!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)) { polyfills.push(loadScript('polyfills/intersection-observer.myhash.js', false)) }
  if (!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || (window.ShadyDOM && window.ShadyDOM.force)) { polyfills.push(loadScript('polyfills/webcomponents.myhash.js', false)) }

  function loadEntries() {
    window.importShim('./app.js');
  }

  polyfills.length ? Promise.all(polyfills).then(loadEntries) : loadEntries();
})();