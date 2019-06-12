const path = require('path');
const fs = require('fs');
const Terser = require('terser');
const { createContentHash } = require('./utils');

/** @typedef {import('./create-index-html').PolyfillInstruction} PolyfillInstruction */
/** @typedef {import('./create-index-html').PolyfillsConfig} PolyfillsConfig */
/** @typedef {import('./create-index-html').Polyfill} Polyfill */

/**
 * @param {PolyfillsConfig} config
 * @returns {Polyfill[]}
 */
function getPolyfills(config) {
  /** @type {Polyfill[]} */
  const polyfills = [];
  /** @type {PolyfillInstruction[]} */
  const instructions = [...(config.customPolyfills || [])];

  if (config.coreJs) {
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

  if (config.regeneratorRuntime) {
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

  if (config.fetch) {
    try {
      instructions.push({
        name: 'fetch',
        test: "!('fetch' in window)",
        path: require.resolve('whatwg-fetch/fetch.js'),
      });
    } catch (error) {
      throw new Error(
        'configured to pollyfill fetch, but no polyfills found. Install with "npm i -D whatwg-fetch"',
      );
    }
  }

  if (config.intersectionObserver) {
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

  if (config.webcomponents) {
    try {
      instructions.push({
        name: 'webcomponents',
        test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)",
        path: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
        sourcemapPath: require.resolve(
          '@webcomponents/webcomponentsjs/webcomponents-bundle.js.map',
        ),
      });
    } catch (error) {
      throw new Error(
        'configured to pollyfill webcomponentsjs, but no polyfills found. Install with "npm i -D @webcomponents/webcomponentsjs"',
      );
    }
  }

  instructions.forEach(instruction => {
    if (!instruction.name || !instruction.path) {
      throw new Error(`A polyfill should have a name and a path property.`);
    }

    if (!instruction.test && !instruction.nomodule) {
      throw new Error(
        `A polyfill should either specify a test, or be configured to run with nomodule.`,
      );
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
    } else if (!instruction.noMinify) {
      const minifyResult = Terser.minify(code, { sourceMap: true });
      ({ code, map: sourcemap } = minifyResult);
    }

    polyfills.push({
      name: instruction.name,
      test: instruction.test,
      hash: createContentHash(code),
      nomodule: !!instruction.nomodule,
      code,
      sourcemap,
    });
  });

  return polyfills;
}

module.exports.getPolyfills = getPolyfills;
