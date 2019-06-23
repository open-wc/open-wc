/* eslint-disable */
 (function() {
function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.onerror = reject;
    script.onload = resolve;
    script.src = src;
    script.defer = true;

    document.head.appendChild(script);
  })

;
}var polyfills = [];
if (!('fetch' in window)) { polyfills.push(loadScript('polyfills/fetch.myhash.js')) }
if (!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)) { polyfills.push(loadScript('polyfills/intersection-observer.myhash.js')) }
if (!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)) { polyfills.push(loadScript('polyfills/webcomponents.myhash.js')) }


    function loadEntries() {
      window.__dynamicImport__('./app.js');
    }
    polyfills.length ? Promise.all(polyfills).then(loadEntries) : loadEntries();
  })();