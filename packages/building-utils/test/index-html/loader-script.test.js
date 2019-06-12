const { expect } = require('chai');
const { createLoaderScript } = require('../../index-html/loader-script');

const polyfills = [
  {
    code: undefined,
    hash: 'myhash',
    name: 'core-js',
    nomodule: true,
    sourcemap: undefined,
    test: undefined,
  },
  {
    code: undefined,
    hash: 'myhash',
    name: 'fetch',
    nomodule: false,
    sourcemap: undefined,
    test: "!('fetch' in window)",
  },
  {
    code: undefined,
    hash: 'myhash',
    name: 'intersection-observer',
    nomodule: false,
    sourcemap: undefined,
    test:
      "!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)",
  },
  {
    code: undefined,
    hash: 'myhash',
    name: 'webcomponents',
    nomodule: false,
    sourcemap: undefined,
    test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)",
  },
];

describe('loader-script', () => {
  it('generates a loader script without legacy entries', () => {
    const entries = ['app.js', 'shared.js'];
    const script = createLoaderScript(entries, null, polyfills, false);

    expect(script).to.eql(
      `(function() {
function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.onerror = function() {
      reject(new Error('Error loading ' + src));
    };
    script.onload = function() {
      resolve();
    };
    script.src = src;
    script.setAttribute('defer', true);
    document.head.appendChild(script);
  });
}

var entries = ['app.js','shared.js']

var polyfills = [];
if (!('fetch' in window)) { polyfills.push(loadScript('polyfills/fetch.myhash.js')) }
if (!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)) { polyfills.push(loadScript('polyfills/intersection-observer.myhash.js')) }
if (!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)) { polyfills.push(loadScript('polyfills/webcomponents.myhash.js')) }

polyfills.length  ? Promise.all(polyfills).then(function() { entries.forEach(function (entry) { loadScript(entry); }) }) : entries.forEach(function (entry) { loadScript(entry); });
})();`,
    );
  });

  it('generates a loader script with legacy entries', () => {
    const entries = ['app.js', 'shared.js'];
    const legacyEntries = ['legacy/app.js', 'legacy/shared.js'];
    const script = createLoaderScript(entries, legacyEntries, polyfills, false);

    expect(script).to.eql(
      `(function() {
function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.onerror = function() {
      reject(new Error('Error loading ' + src));
    };
    script.onload = function() {
      resolve();
    };
    script.src = src;
    script.setAttribute('defer', true);
    document.head.appendChild(script);
  });
}

var entries = 'noModule' in HTMLScriptElement.prototype ? ['app.js','shared.js'] : ['legacy/app.js','legacy/shared.js'];

var polyfills = [];
if (!('fetch' in window)) { polyfills.push(loadScript('polyfills/fetch.myhash.js')) }
if (!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)) { polyfills.push(loadScript('polyfills/intersection-observer.myhash.js')) }
if (!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)) { polyfills.push(loadScript('polyfills/webcomponents.myhash.js')) }

polyfills.length  ? Promise.all(polyfills).then(function() { entries.forEach(function (entry) { loadScript(entry); }) }) : entries.forEach(function (entry) { loadScript(entry); });
})();`,
    );
  });

  it('generates a minified loader script', () => {
    const entries = ['app.js', 'shared.js'];
    const script = createLoaderScript(entries, null, polyfills, true);

    expect(script).to.eql(
      '!function(){function n(n){return new Promise(function(e,t){var o=document.createElement("script");o.onerror=function(){t(new Error("Error loading "+n))},o.onload=function(){e()},o.src=n,o.setAttribute("defer",!0),document.head.appendChild(o)})}var e=["app.js","shared.js"],t=[];"fetch"in window||t.push(n("polyfills/fetch.myhash.js")),"IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype||t.push(n("polyfills/intersection-observer.myhash.js")),"attachShadow"in Element.prototype&&"getRootNode"in Element.prototype||t.push(n("polyfills/webcomponents.myhash.js")),t.length?Promise.all(t).then(function(){e.forEach(function(e){n(e)})}):e.forEach(function(e){n(e)})}();',
    );
  });
});
