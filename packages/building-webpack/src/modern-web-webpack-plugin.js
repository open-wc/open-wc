/* eslint-disable no-param-reassign */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Terser = require('terser');

/**
 * Webpack plugin which enables writing modern code, providing the necessary
 * polyfills for legacy browsers.
 *
 * This plugin is intended to be loaded twice within one webpack build. Once
 * with a build intended for modern browsers, and one intended for legacy
 * browsers. Currently 'noModule' is used as watermark, but other watermarks
 * can be used as well.
 *
 * Module support is feature detected, and the correct bundle is loaded. A
 * preload link is added to avoid the slight performance loss.
 */

const PLUGIN = 'LegacyBrowserWebpackPlugin';

const asArrayLiteral = arr => `[${arr.map(e => `'${e}'`).join(',')}]`;

// URL is required by webcomponents polyfill
// We can use URLSearchParams as a watermark for URL support
const urlPolyfill = `
  if (!('URLSearchParams' in window)) {
      polyfills.push(loadScript('./polyfills/url.js'));
  }`;

// there is no need anymore to feature detect web component APIs separately,
// only IE and edge don't support web components
const webcomponentsPolyfill = `
  if (!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype)) {
    polyfills.push(loadScript('./polyfills/webcomponents.js'));
  }`;

// function to load a piece of code dynamically
const loadScriptFunction = `
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
  }`;

const loadEntries = 'entries.forEach(function (entry) { loadScript(entry); })';
const entriesLoader = `
  polyfills.length
    ? Promise.all(polyfills).then(function() { ${loadEntries} })
    : ${loadEntries};
`;

const error = msg =>
  `(function() { document.body.innerHTML = '<h1 style="color:red">${msg}</h1>'; throw new Error('${msg}'); })()`;
const modernError = error(
  'You are running webpack-dev-server with a modern build, run the dev server with the --legacy flag for this browser or run a production build.',
);
const legacyError = error(
  'You are running webpack-dev-server with a legacy build, run the dev server with the --legacy flag for this browser or run a production build.',
);

function createEntryVariable(entries, development) {
  if (development) {
    return `var entries = 'noModule' in HTMLScriptElement.prototype
      ? ${entries.modern ? asArrayLiteral(entries.modern) : modernError}
      : ${entries.legacy ? asArrayLiteral(entries.legacy) : legacyError};`;
  }

  return `var entries = 'noModule' in HTMLScriptElement.prototype
    ? ${asArrayLiteral(entries.modern)}
    : ${asArrayLiteral(entries.legacy)};`;
}

function createPolyfillsLoaders(options) {
  const polyfillScripts = [];

  if (options.polyfillURL) {
    polyfillScripts.push(urlPolyfill);
  }

  if (options.polyfillWebcomponents) {
    polyfillScripts.push(webcomponentsPolyfill);
  }

  if (options.polyfills) {
    polyfillScripts.push(
      ...this.options.polyfills.map(
        polyfill => `
      if (${polyfill.test}) {
        polyfills.push(loadScript(${polyfill.src}));
      }`,
      ),
    );
  }

  return `
    var polyfills = [];
    ${polyfillScripts.join('')}
  `;
}

module.exports = class LegacyBrowserWebpackPlugin {
  constructor(options = {}) {
    this.options = {
      polyfillBabel: true,
      polyfillURL: true,
      polyfillWebcomponents: true,
      ...options,
    };
    this.entries = {
      modern: null,
      legacy: null,
    };
    this.copiedFiles = false;
  }

  apply(compiler) {
    const polyfillsDir = path.join(compiler.outputPath, 'polyfills');

    // copy over polyfill files. just once since this plugin is run twice
    if (!this.copiedFiles) {
      this.copiedFiles = true;

      const polyfills = [];
      if (this.options.polyfillBabel) {
        polyfills.push({
          from: require.resolve('@babel/polyfill/dist/polyfill.min.js'),
          to: path.join(polyfillsDir, 'babel.js'),
        });
      }

      if (this.options.polyfillURL) {
        polyfills.push({
          from: require.resolve('url-polyfill/url-polyfill.min.js'),
          to: path.join(polyfillsDir, 'url.js'),
        });
      }

      if (this.options.polyfillWebcomponents) {
        polyfills.push({
          from: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
          to: path.join(polyfillsDir, 'webcomponents.js'),
        });
        polyfills.push({
          from: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle.js.map'),
          to: path.join(polyfillsDir, 'webcomponents-bundle.js.map'),
        });
      }

      if (this.options.polyfills) {
        polyfills.push(
          ...this.options.polyfills.map(pf => ({
            from: require.resolve(pf.file),
            to: path.join(polyfillsDir, `${pf.name}.js`),
          })),
        );
      }

      if (polyfills.length > 0) {
        new CopyWebpackPlugin(polyfills).apply(compiler);
      }
    }

    compiler.hooks.compilation.tap(PLUGIN, compilation => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap(PLUGIN, data => {
        const legacy = data.assets.js.some(js => js.includes('legacy'));
        this.entries[legacy ? 'legacy' : 'modern'] = data.assets.js;

        if (!this.options.development && (!this.entries.legacy || !this.entries.modern)) {
          return;
        }

        const babelPolyfills = this.options.polyfillBabel
          ? '<script src="./polyfills/babel.js" nomodule></script>'
          : '';
        const entryVariable = createEntryVariable(this.entries, this.options.development);
        const polyfillsLoader = createPolyfillsLoaders(this.options);

        // javascript code which loads polyfills + app entries
        const loadScriptCode = `
          (function() {
            ${loadScriptFunction}
            ${entryVariable}
            ${polyfillsLoader}
            ${entriesLoader}
           })()`;

        // minify the loading code
        const minifiedLoadScriptCode = Terser.minify(loadScriptCode).code;
        // concat the separate scripts
        const scripts = `${babelPolyfills}<script>${minifiedLoadScriptCode}</script>`;

        // preload the modern build for maximum performance
        if (this.entries.modern) {
          const preloadLinks = this.entries.modern.map(
            src => `<link rel="preload" href="${src}" as="script">`,
          );
          data.html = data.html.replace('</head>', `${preloadLinks}</head>`);
        }

        // add the actual scripts to the body
        data.html = data.html.replace('</body>', `${scripts}</body>`);
      });
    });
  }
};
