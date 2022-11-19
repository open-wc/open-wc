const path = require('path');
const fs = require('fs');
const Terser = require('terser');
const { createContentHash } = require('./utils.js');

/** @typedef {import('./create-index-html').PolyfillInstruction} PolyfillInstruction */
/** @typedef {import('./create-index-html').CreateIndexHTMLConfig} CreateIndexHTMLConfig */
/** @typedef {import('./create-index-html').Polyfill} Polyfill */

/**
 * @param {CreateIndexHTMLConfig} config
 * @returns {Polyfill[]}
 */
function getPolyfills(config) {
  /** @type {Polyfill[]} */
  const polyfills = [];
  /** @type {PolyfillInstruction[]} */
  const instructions = [...(config.polyfills.customPolyfills || [])];

  if (config.polyfills.coreJs) {
    try {
      instructions.push({
        name: 'core-js',
        path: require.resolve('core-js-bundle/minified.js'),
        sourcemapPath: require.resolve('core-js-bundle/minified.js'),
        nomodule: true,
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill core-js, but no polyfills found. Install with "npm i -D core-js-bundle"',
      );
    }
  }

  if (config.polyfills.systemJs) {
    try {
      instructions.push({
        name: 'systemjs',
        path: require.resolve('systemjs/dist/s.min.js'),
        sourcemapPath: require.resolve('systemjs/dist/s.min.js.map'),
        // if main entrypoint is systemjs, we should always load it. Otherwise it
        // should be loaded only on browsers without module support through nomodule attribute
        nomodule: config.entries.type !== 'system',
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill systemjs, but no polyfills found. Install with "npm i -D systemjs"',
      );
    }
  }

  // full systemjs, including import maps polyfill
  if (config.polyfills.systemJsExtended) {
    try {
      instructions.push({
        name: 'systemjs',
        path: require.resolve('systemjs/dist/system.min.js'),
        sourcemapPath: require.resolve('systemjs/dist/system.min.js.map'),
        // if main entrypoint is systemjs, we should always load it. Otherwise it
        // should be loaded only on browsers without module support through nomodule attribute
        nomodule: config.entries.type !== 'system',
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill systemjs, but no polyfills found. Install with "npm i -D systemjs"',
      );
    }
  }

  if (config.polyfills.regeneratorRuntime) {
    try {
      instructions.push({
        name: 'regenerator-runtime',
        path: require.resolve('regenerator-runtime/runtime'),
        /**
         * Regenerator runtime is necessary when compiling to es5, which we generally only do on browsers
         * which don't support modules. Using the nomodule flag means we don't need to load the library on
         * other browsers. This can be overwritten by setting the value to 'always'
         */
        nomodule: config.polyfills.regeneratorRuntime !== 'always',
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill regenerator-runtime, but no polyfills found. Install with "npm i -D regenerator-runtime"',
      );
    }
  }

  if (config.polyfills.fetch) {
    try {
      instructions.push({
        name: 'fetch',
        test: "!('fetch' in window)",
        path: require.resolve('whatwg-fetch/dist/fetch.umd.js'),
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill fetch, but no polyfills found. Install with "npm i -D whatwg-fetch"',
      );
    }
  }

  if (config.polyfills.dynamicImport) {
    instructions.push({
      name: 'dynamic-import',
      /**
       * load dynamic import polyfill if we are on a browser which supports modules but not
       * dynamic imports. we expect window.importShim to be aliased to import() elsewhere
       */
      test: "'noModule' in HTMLScriptElement.prototype && !('importShim' in window)",
      path: require.resolve('./dynamic-import-polyfill.js'),
    });
  }

  if (config.polyfills.intersectionObserver) {
    try {
      instructions.push({
        name: 'intersection-observer',
        test: "!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)",
        path: require.resolve('intersection-observer/intersection-observer.js'),
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill IntersectionObserver, but no polyfills found. Install with "npm i -D intersection-observer"',
      );
    }
  }

  if (config.polyfills.webcomponents && !config.polyfills.shadyCssCustomStyle) {
    try {
      instructions.push({
        name: 'webcomponents',
        test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || (window.ShadyDOM && window.ShadyDOM.force)",
        path: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
        sourcemapPath: require.resolve(
          '@webcomponents/webcomponentsjs/webcomponents-bundle.js.map',
        ),
      });

      // If a browser does not support nomodule attribute, but does support custom elements, we need
      // to load the custom elements es5 adapter. This is the case for Safari 10.1
      instructions.push({
        name: 'custom-elements-es5-adapter',
        test: "!('noModule' in HTMLScriptElement.prototype) && 'getRootNode' in Element.prototype",
        path: require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'),
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill webcomponentsjs, but no polyfills found. Install with "npm i -D @webcomponents/webcomponentsjs"',
      );
    }
  }

  if (config.polyfills.esModuleShims) {
    try {
      instructions.push({
        name: 'es-module-shims',
        test: "'noModule' in HTMLScriptElement.prototype",
        path: require.resolve('es-module-shims/dist/es-module-shims.js'),
        module: true,
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill es-module-shims, but no polyfills found. Install with "npm i -D es-module-shims"',
      );
    }
  }

  if (config.polyfills.shadyCssCustomStyle && !config.polyfills.webcomponents) {
    // shadyCssCustomsStyle isn't going to work without webcomponents.
    throw new Error(
      'configured to polyfill custom-styles, which depends on webcomponents. add `webcomponents:true` to your polyfills config.',
    );
  }
  if (config.polyfills.shadyCssCustomStyle && config.polyfills.webcomponents) {
    // shadycss/custom-style-interface polyfill *must* load after the webcomponents polyfill or it doesn't work.
    // to get around that, concat the two together.
    try {
      instructions.push({
        name: 'shady-css',
        test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)",
        path: [
          require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
          require.resolve('@webcomponents/shadycss/custom-style-interface.min.js'),
          require.resolve('shady-css-scoped-element/shady-css-scoped-element.min.js'),
        ],
      });
    } catch (error) {
      throw new Error(
        'configured to polyfill ShadyCssCustomStyle, but no polyfills found. Install with "npm i -D @webcomponents/shadycss" and "npm i -D @webcomponents/shady-scoped-css-element"',
      );
    }
  }

  instructions.forEach(instruction => {
    if (!instruction.name || !instruction.path) {
      throw new Error(`A polyfill should have a name and a path property.`);
    }
    let code;
    let sourcemap;
    if (Array.isArray(instruction.path)) {
      code = instruction.path.reduce((acc, p) => {
        acc += `\n ${fs.readFileSync(p, 'utf-8')}`; // eslint-disable-line no-param-reassign
        return acc;
      }, '');
    } else {
      const codePath = path.resolve(instruction.path);
      if (!codePath || !fs.existsSync(codePath) || !fs.statSync(codePath).isFile()) {
        throw new Error(`Could not find a file at ${instruction.path}`);
      }

      code = fs.readFileSync(codePath, 'utf-8');
      if (instruction.sourcemapPath) {
        const sourcemapPath = path.resolve(instruction.sourcemapPath);
        if (
          !sourcemapPath ||
          !fs.existsSync(sourcemapPath) ||
          !fs.statSync(sourcemapPath).isFile()
        ) {
          throw new Error(`Could not find a file at ${instruction.sourcemapPath}`);
        }

        sourcemap = fs.readFileSync(sourcemapPath, 'utf-8');
        // minify only if there were no source maps, and if not disabled explicitly
      } else if (!instruction.noMinify && config.minify) {
        const minifyResult = Terser.minify(code, { sourceMap: true });
        ({ code } = minifyResult);
        sourcemap = /** @type {string} */ (minifyResult.map);
      }
    }

    polyfills.push({
      name: instruction.name,
      test: instruction.test,
      hash: createContentHash(code),
      nomodule: !!instruction.nomodule,
      module: !!instruction.module,
      code,
      sourcemap,
    });
  });

  return polyfills;
}

module.exports.getPolyfills = getPolyfills;
