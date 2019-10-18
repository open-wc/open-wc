const path = require('path');
const fs = require('fs');
const Terser = require('terser');
const { createContentHash } = require('./utils');

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
        'configured to pollyfill core-js, but no polyfills found. Install with "npm i -D core-js-bundle"',
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
        'configured to pollyfill systemjs, but no polyfills found. Install with "npm i -D systemjs"',
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
        'configured to pollyfill systemjs, but no polyfills found. Install with "npm i -D systemjs"',
      );
    }
  }

  if (config.polyfills.regeneratorRuntime) {
    try {
      instructions.push({
        name: 'regenerator-runtime',
        path: require.resolve('regenerator-runtime/runtime'),
        nomodule: true,
      });
    } catch (error) {
      throw new Error(
        'configured to pollyfill regenerator-runtime, but no polyfills found. Install with "npm i -D regenerator-runtime"',
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
        'configured to pollyfill fetch, but no polyfills found. Install with "npm i -D whatwg-fetch"',
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
        test:
          "!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype)",
        path: require.resolve('intersection-observer/intersection-observer.js'),
      });
    } catch (error) {
      throw new Error(
        'configured to pollyfill IntersectionObserver, but no polyfills found. Install with "npm i -D intersection-observer"',
      );
    }
  }

  if (config.polyfills.webcomponents) {
    try {
      instructions.push({
        name: 'webcomponents',
        test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)",
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
        'configured to pollyfill webcomponentsjs, but no polyfills found. Install with "npm i -D @webcomponents/webcomponentsjs"',
      );
    }
  }

  if (config.polyfills.esModuleShims) {
    try {
      instructions.push({
        name: 'es-module-shims',
        test: "'noModule' in HTMLScriptElement.prototype",
        path: require.resolve('es-module-shims/dist/es-module-shims.min.js'),
        sourcemapPath: require.resolve('es-module-shims/dist/es-module-shims.min.js.map'),
        module: true,
      });
    } catch (error) {
      throw new Error(
        'configured to pollyfill es-module-shims, but no polyfills found. Install with "npm i -D es-module-shims"',
      );
    }
  }

  instructions.forEach(instruction => {
    if (!instruction.name || !instruction.path) {
      throw new Error(`A polyfill should have a name and a path property.`);
    }

    const codePath = path.resolve(instruction.path);
    if (!codePath || !fs.existsSync(codePath) || !fs.statSync(codePath).isFile()) {
      throw new Error(`Could not find a file at ${instruction.path}`);
    }

    let code = fs.readFileSync(codePath, 'utf-8');
    let sourcemap;
    if (instruction.sourcemapPath) {
      const sourcemapPath = path.resolve(instruction.sourcemapPath);
      if (!sourcemapPath || !fs.existsSync(sourcemapPath) || !fs.statSync(sourcemapPath).isFile()) {
        throw new Error(`Could not find a file at ${instruction.sourcemapPath}`);
      }

      sourcemap = fs.readFileSync(sourcemapPath, 'utf-8');
      // minify only if there were no source maps, and if not disabled explicitly
    } else if (!instruction.noMinify && config.minify) {
      const minifyResult = Terser.minify(code, { sourceMap: true });
      ({ code, map: sourcemap } = minifyResult);
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
