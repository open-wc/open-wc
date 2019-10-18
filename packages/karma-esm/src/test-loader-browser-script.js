/* eslint-disable */
// @ts-nocheck

const { compatibilityModes } = require('es-dev-server');
const {
  createPolyfillsLoaderScript,
} = require('@open-wc/building-utils/index-html/loader-script.js');

/**
 * Loading script for loading polyfills, libraries and module scripts. It's a bit crafty because it needs to
 * work on all browsers, and it's a bit complex hooking into the test loading setup of karma.
 *
 * Loads only the polyfills necessary
 * for a particular browser, and loads tests using the appropriate module loader.
 *
 * Steps:
 *
 * 1. Load import maps, including shimmed/polyfilled import map if needed
 * 2. Load core-js polyfill if needed, so that we can use Promise in the loader.
 * 3. Load test libs (mocha etc.) and polyfills that don't require any feature detection
 * 4. Load polyfills that require feature detection (uses generic polyfill loader script)
 * 5. Load tests using native module loader, es-module-shims (browsers that don't support all module features)
 *    or system-js (browsers that don't support modules)
 */

/**
 * Creates the test loader script to be executed in the browser.
 *
 * @param {string} [compatibilityMode]
 * @param {import('@open-wc/building-utils/index-html/create-index-html').Polyfill[]} polyfills
 * @param {object | null} [importMap]
 */

const defaultPolyfillsConfig = {
  hashPolyfills: true,
  coreJs: false,
  regeneratorRuntime: false,
  webcomponents: false,
  intersectionObserver: false,
  fetch: false,
};

function createTestLoaderBrowserScript(compatibilityMode, polyfills, importMap) {
  const loadPolyfillsWithFeatureDetectionScript = createPolyfillsLoaderScript(
    polyfills,
    defaultPolyfillsConfig,
    'loadPolyfillsWithFeatureDetection',
  );
  // polyfills without a test don't require feature detection and are not included in the generic loader scriptˆ
  const polyfillsWithoutFeatureDetection = polyfills.filter(p => !p.test);

  // load core-js separately so that we can use Promise in the loader
  const indexOfCoreJs = polyfillsWithoutFeatureDetection.findIndex(p => p.name === 'core-js');
  const coreJs =
    indexOfCoreJs === -1 ? null : polyfillsWithoutFeatureDetection.splice(indexOfCoreJs, 1)[0];

  const polyfillsWithoutFeatureDetectionString = polyfillsWithoutFeatureDetection
    .map(p => `{ tagName: 'script', props: { src: '/polyfills/${p.name}.${p.hash}.js', noModule: ${Boolean(p.nomodule)} } }`)
    .join(',');

  return `
(function () {
${createLoadImportMapScript(compatibilityMode, importMap)}

${startTestLoader.toString()}

${loadElement.toString()}

${loadPolyfillsWithFeatureDetectionScript}

${loadLibsAndPolyfills.toString()}

${loadTests.toString()}

startTestLoader('${compatibilityMode}', ${coreJs && `'/polyfills/${coreJs.name}.${coreJs.hash}.js'`}, [${polyfillsWithoutFeatureDetectionString}]);})();
`;
}

/**
 * Creates a script to load import maps for the test run. Shims or polyfills the import maps
 * if applicable for using import map with es-module-shims or system-js.
 *
 * @param {string} compatibilityMode
 * @param {object} importMap
 * @returns {string}
 */
function createLoadImportMapScript(compatibilityMode, importMap) {
  const types = [];

  if (importMap) {
    types.push('importmap');

    const shimmed = [compatibilityModes.ESM, compatibilityModes.MODERN, compatibilityModes.ALL];
    if (shimmed.includes(compatibilityMode)) {
      types.push('importmap-shim');
    }

    if (compatibilityMode === compatibilityModes.ALL) {
      types.push('systemjs-importmap');
    }
  }

  if (types.length === 0) {
    return '';
  }

  return `
(function () {
  [${types.map(t => `'${t}'`).join(', ')}].forEach(function (type) {
    var script = document.createElement('script');
    script.type = type;
    script.textContent = '${JSON.stringify(importMap)}';
    document.head.appendChild(script);
  });
})();
`;
}

/**
 * Loads an element (script, link etc.) in the browser, returning a
 * promise which resolves when loading is done.
 *
 * @param {string} tagName
 * @param {object} props
 * @returns {Promise<void>}
 */
function loadElement(tagName, props) {
  return new Promise(function (resolve) {
    document.head.appendChild(
      Object.assign(document.createElement(tagName), {
        onload: resolve, onerror: function (e) {
          console.error('failed to load element ' + props.src || props.href);
          resolve();
        }
      }, props)
    );
  });
}

/**
 * Starts the test loader. First loads core-js if needed, since we want to use Promise and Object.assign
 * in the test loader.
 *
 * @param {string} compatibilityMode
 * @param {src} coreJsSrc
 * @param {object[]} polyfills
 */
function startTestLoader(compatibilityMode, coreJsSrc, polyfills) {
  if (coreJsSrc && !('noModule' in HTMLScriptElement.prototype)) {
    var script = document.createElement('script');
    script.src = coreJsSrc;
    script.onload = function () {
      loadLibsAndPolyfills(compatibilityMode, polyfills);
    };
    document.head.appendChild(script);
  } else {
    loadLibsAndPolyfills(compatibilityMode, polyfills);
  }
}

/**
 * Loads libraries and polyfills needed for running the tests. Loads polyfills that don't need feature detection directly,
 * uses generic polyfills script for loading with feature detection.
 *
 * @param {string} compatibilityMode
 * @param {object[]} polyfills
 */
function loadLibsAndPolyfills(compatibilityMode, polyfillsWithoutFeatureDetection) {
  var supportsModules = 'noModule' in HTMLScriptElement.prototype;
  // directly load polyfills which don't need feature detection, or do feature detection using nomodule attribute
  var libsAndPolyfills = polyfillsWithoutFeatureDetection.filter(function (polyfill) {
    // filter out polyfills which are loaded with nomodule on a browser which doesn't need them
    return !polyfill.props.noModule || !supportsModules;
  });
  var testModules = [];

  /**
   * The files loaded by karma (libs and tests) are stored in a comment in the index.html (thats how we hack around karma)
   * Extract the comment, put it in a div and retreive the necessary information from there
   */
  var childNodes = Array.from(document.getElementById('scriptsContainer').childNodes);
  var testElementsText = childNodes.filter(function (node) {
    return node.nodeName === '#comment';
  })[0].textContent;
  var container = document.createElement('div');
  container.innerHTML = testElementsText;

  Array.from(container.children).forEach(function (el) {
    if (el.tagName === 'SCRIPT' && el.type === 'module') {
      testModules.push(el.src);
    } else {
      libsAndPolyfills.push({
        tagName: el.tagName,
        props: {
          type: el.type,
          rel: el.rel,
          src: el.src,
          href: el.href,
          noModule: el.noModule
        }
      });
    }
  });

  // load all libs and polyfills that don't require feature detection sequentually, as some libs such as mocha require others to be loaded first
  var i = 0;
  function loadNextLibOrPolyfills() {
    if (i !== libsAndPolyfills.length) {
      var e = libsAndPolyfills[i];
      i += 1;
      loadElement(e.tagName, e.props).then(loadNextLibOrPolyfills);
    } else {
      onLibsAndPolyfillsFinished();
    }
  }
  loadNextLibOrPolyfills();

  // when libs and polyfills finished loading, load polyfills that do require feature detection
  // and then load tests
  function onLibsAndPolyfillsFinished() {
    loadPolyfillsWithFeatureDetection().then(function () {
      loadTests(compatibilityMode, testModules);
    });
  }
}

/**
 * Loads tests, using the appropriate module loader based on browser support.
 *
 * @param {string} compatibilityMode
 * @param {string[]} testModules
 */
function loadTests(compatibilityMode, testModules) {
  if (window.System) {
    // appends a query param to each systemjs request to trigger es5 compilation
    var originalResolve = System.constructor.prototype.resolve;
    System.constructor.prototype.resolve = function () {
      return Promise.resolve(originalResolve.apply(this, arguments)).then(function (url) {
        return url + '?legacy=true';
      });
    };
  }

  var importModules;

  if ('noModule' in HTMLScriptElement.prototype) {
    importModules = testModules.map(function (src) {
      // if compatibility mode, use the module shim
      if (['all', 'modern', 'esm'].includes(compatibilityMode)) {
        return importShim(src);
      } else {
        // otherwise use native module loader
        return loadElement('script', { type: 'module', src: src })
      }
    });
  } else {
    if (compatibilityMode !== 'all') {
      throw new Error('You need to run karma-esm in compatibility mode on this browser.');
    }

    // otherwise load them using systemjs
    importModules = testModules.map(function (src) {
      return System.import(src);
    });
  }

  // signal karma after all modules are loaded
  Promise.all(importModules).then(function () {
    window.__karma__.loaded();
  });
}

module.exports = {
  createTestLoaderBrowserScript,
};
