/** @typedef {import('./types').PolyfillsLoaderConfig} PolyfillsLoaderConfig  */
/** @typedef {import('./types').PolyfillConfig} PolyfillConfig  */
/** @typedef {import('./types').PolyfillFile} PolyfillFile  */

const path = require('path');
const fs = require('fs');
const Terser = require('terser');
const { createContentHash, noModuleSupportTest, hasFileOfType, fileTypes } = require('./utils');

/**
 * @param {PolyfillsLoaderConfig} cfg
 * @returns {PolyfillFile[]}
 */
function createPolyfillsData(cfg) {
  const { polyfills = {} } = cfg;

  /** @type {PolyfillConfig[]} */
  const polyfillConfigs = [];

  /**
   * @param {PolyfillConfig} polyfillConfig
   */
  function addPolyfillConfig(polyfillConfig) {
    try {
      polyfillConfigs.push(polyfillConfig);
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error(
          `[Polyfills loader]: Error resolving polyfill ${polyfillConfig.name}` +
            ' Are dependencies installed correctly?',
        );
      }

      throw error;
    }
  }

  if (polyfills.coreJs) {
    addPolyfillConfig({
      name: 'core-js',
      path: require.resolve('core-js-bundle/minified.js'),
      test: noModuleSupportTest,
    });
  }

  if (polyfills.regeneratorRuntime) {
    addPolyfillConfig({
      name: 'regenerator-runtime',
      test: polyfills.regeneratorRuntime !== 'always' ? noModuleSupportTest : undefined,
      path: require.resolve('regenerator-runtime/runtime'),
    });
  }

  if (polyfills.fetch) {
    addPolyfillConfig({
      name: 'fetch',
      test: `!('fetch' in window)${
        polyfills.abortController
          ? " || !('Request' in window) || !('signal' in window.Request.prototype)"
          : ''
      }`,
      path: polyfills.abortController
        ? [
            require.resolve('whatwg-fetch/dist/fetch.umd.js'),
            require.resolve('abortcontroller-polyfill/dist/umd-polyfill.js'),
          ]
        : [require.resolve('whatwg-fetch/dist/fetch.umd.js')],
      minify: true,
    });
  }

  if (polyfills.abortController && !polyfills.fetch) {
    throw new Error('Cannot polyfill AbortController without fetch.');
  }

  // load systemjs, an es module polyfill, if one of the entries needs it
  const hasSystemJs =
    cfg.polyfills && cfg.polyfills.custom && cfg.polyfills.custom.find(c => c.name === 'systemjs');
  if (
    polyfills.systemjs ||
    polyfills.systemjsExtended ||
    (!hasSystemJs && hasFileOfType(cfg, fileTypes.SYSTEMJS))
  ) {
    const name = 'systemjs';
    const alwaysLoad =
      cfg.modern && cfg.modern.files && cfg.modern.files.some(f => f.type === fileTypes.SYSTEMJS);
    const test = alwaysLoad || !cfg.legacy ? undefined : cfg.legacy.map(e => e.test).join(' || ');

    if (polyfills.systemjsExtended) {
      // full systemjs, including import maps polyfill
      addPolyfillConfig({
        name,
        test,
        path: require.resolve('systemjs/dist/system.min.js'),
      });
    } else {
      // plain systemjs as es module polyfill
      addPolyfillConfig({
        name,
        test,
        path: require.resolve('systemjs/dist/s.min.js'),
      });
    }
  }

  if (polyfills.dynamicImport) {
    addPolyfillConfig({
      name: 'dynamic-import',
      /**
       * dynamic import is syntax, not an actual function so we cannot feature detect it without using an import statement.
       * using a dynamic import on a browser which doesn't support it throws a syntax error and prevents the entire script
       * from being run, so we need to dynamically create and execute a function and catch the error.
       *
       * CSP can block the dynamic function, in which case the polyfill will always be loaded which is ok. The polyfill itself
       * uses Blob, which might be blocked by CSP as well. In that case users should use systemjs instead.
       */
      test:
        "'noModule' in HTMLScriptElement.prototype && " +
        "(function () { try { Function('window.importShim = s => import(s);').call(); return false; } catch (_) { return true; } })()",
      path: require.resolve('dynamic-import-polyfill/dist/dynamic-import-polyfill.umd.js'),
      initializer: "window.dynamicImportPolyfill.initialize({ importFunctionName: 'importShim' });",
    });
  }

  if (polyfills.esModuleShims) {
    addPolyfillConfig({
      name: 'es-module-shims',
      test: "'noModule' in HTMLScriptElement.prototype",
      path: require.resolve('es-module-shims/dist/es-module-shims.min.js'),
      fileType: fileTypes.MODULE,
    });
  }

  if (polyfills.intersectionObserver) {
    addPolyfillConfig({
      name: 'intersection-observer',
      test:
        "!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)",
      path: require.resolve('intersection-observer/intersection-observer.js'),
      minify: true,
    });
  }

  if (polyfills.resizeObserver) {
    addPolyfillConfig({
      name: 'resize-observer',
      test: "!('ResizeObserver' in window)",
      path: require.resolve('resize-observer-polyfill/dist/ResizeObserver.global.js'),
      minify: true,
    });
  }

  if (polyfills.webcomponents && !polyfills.shadyCssCustomStyle) {
    addPolyfillConfig({
      name: 'webcomponents',
      test:
        "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || (window.ShadyDOM && window.ShadyDOM.force)",
      path: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
    });

    // If a browser does not support nomodule attribute, but does support custom elements, we need
    // to load the custom elements es5 adapter. This is the case for Safari 10.1
    addPolyfillConfig({
      name: 'custom-elements-es5-adapter',
      test: "!('noModule' in HTMLScriptElement.prototype) && 'getRootNode' in Element.prototype",
      path: require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'),
    });
  }

  if (polyfills.webcomponents && polyfills.shadyCssCustomStyle) {
    // shadycss/custom-style-interface polyfill *must* load after the webcomponents polyfill or it doesn't work.
    // to get around that, concat the two together.

    addPolyfillConfig({
      name: 'webcomponents-shady-css-custom-style',
      test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)",
      path: [
        require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
        require.resolve('@webcomponents/shadycss/custom-style-interface.min.js'),
        require.resolve('shady-css-scoped-element/shady-css-scoped-element.min.js'),
      ],
    });
  }

  polyfillConfigs.push(...(polyfills.custom || []));

  /**
   * @description returns the contents of a file at the given path
   * @param {string} filePath
   * @return {!string}
   */
  function readPolyfillFileContents(filePath) {
    const codePath = path.resolve(filePath);
    if (!codePath || !fs.existsSync(codePath) || !fs.statSync(codePath).isFile()) {
      throw new Error(`Could not find a file at ${filePath}`);
    }

    const contentLines = fs.readFileSync(filePath, 'utf-8').split('\n');

    // remove source map url
    for (let i = contentLines.length - 1; i >= 0; i -= 1) {
      if (contentLines[i].startsWith('//# sourceMappingURL')) {
        contentLines[i] = '';
      }
    }
    return contentLines.join('\n');
  }

  /** @type {PolyfillFile[]} */
  const polyfillFiles = [];

  for (const polyfillConfig of polyfillConfigs) {
    if (!polyfillConfig.name || !polyfillConfig.path) {
      throw new Error(`A polyfill should have a name and a path property.`);
    }
    let content = '';
    if (Array.isArray(polyfillConfig.path)) {
      content = polyfillConfig.path.map(p => readPolyfillFileContents(p)).join('');
    } else {
      content = readPolyfillFileContents(polyfillConfig.path);
    }
    if (polyfillConfig.minify) {
      const minifyResult = Terser.minify(content, { sourceMap: false });
      // @ts-ignore
      content = minifyResult.code;
    }

    const filePath = `${path.posix.join(
      cfg.polyfillsDir || 'polyfills',
      `${polyfillConfig.name}${polyfills.hash !== false ? `.${createContentHash(content)}` : ''}`,
    )}.js`;

    const polyfillFile = {
      name: polyfillConfig.name,
      type: polyfillConfig.fileType || fileTypes.SCRIPT,
      path: filePath,
      content,
      test: polyfillConfig.test,
      initializer: polyfillConfig.initializer,
    };

    polyfillFiles.push(polyfillFile);
  }

  return polyfillFiles;
}

module.exports = {
  createPolyfillsData,
};
