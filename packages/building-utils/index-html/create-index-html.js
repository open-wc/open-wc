const { serialize } = require('parse5');
const path = require('path');
const deepmerge = require('deepmerge');
const { createScript, createElement } = require('../dom5-utils');
const { append, query, predicates } = require('../dom5-fork');
const { getPolyfills } = require('./polyfills');
const { createLoaderScript } = require('./loader-script');
const { minifyIndexHTML, defaultMinifyHTMLConfig } = require('./minify-index-html');
const { createContentHash } = require('./utils');

/** @typedef {import('parse5').ASTNode} ASTNode */

/**
 * @typedef {object} FileResult
 * @property {string} path
 * @property {string} content
 */

/**
 * @typedef {object} Polyfill
 * @property {string} name
 * @property {string} [test]
 * @property {string} code
 * @property {string} hash
 * @property {string} sourcemap
 * @property {boolean} [nomodule]
 */

/**
 * @typedef {object} PolyfillInstruction
 * @property {string} name name of the polyfill
 * @property {string} path polyfill path
 * @property {string} [test] expression which should evaluate to true to load the polyfill
 * @property {boolean} [nomodule] whether to inject the polyfills as a script with nomodule attribute
 * @property {string} [sourcemapPath] polyfill sourcemaps path
 * @property {boolean} [noMinify] whether to minify the polyfills. default true if no sourcemap is given, false otherwise
 */

/**
 * @typedef {object} PolyfillsConfig
 * @property {boolean} [coreJs] whether to polyfill core-js polyfills
 * @property {boolean} [regeneratorRuntime] whether to add regenerator runtime
 * @property {boolean} [webcomponents] whether to polyfill webcomponents
 * @property {boolean} [fetch] whether to polyfill fetch
 * @property {boolean} [intersectionObserver] whether to polyfill intersection observer
 * @property {PolyfillInstruction[]} [customPolyfills] custom polyfills specified by the user
 */

/**
 * @typedef {object} CreateIndexHTMLConfig
 * @property {PolyfillsConfig} polyfills
 * @property {string[]} entries
 * @property {string[]} [legacyEntries]
 * @property {false|object} minify minify configuration, or false to disable minification
 * @property {string} loader 'inline' | 'external'
 */

/** @type {Partial<CreateIndexHTMLConfig>} */
const defaultConfig = {
  polyfills: {
    coreJs: false,
    regeneratorRuntime: false,
    webcomponents: false,
    intersectionObserver: false,
    fetch: false,
  },
  minify: defaultMinifyHTMLConfig,
  loader: 'inline',
};

/**
 * Creates script nodes for polyfills and entries which should be loaded on startup. For example
 * core-js polyfills with a 'nomodule' attribute, and the entry point if don't need to inject
 * a loader.
 *
 * @param {Polyfill[]} polyfills
 * @param {string[]} entries
 * @param {boolean} needsLoader
 * @returns {ASTNode[]}
 */
function createStandaloneScripts(polyfills, entries, needsLoader) {
  /** @type {ASTNode[]} */
  const scripts = [];

  polyfills.forEach(polyfill => {
    if (polyfill.test) {
      return;
    }

    const args = { src: `polyfills/${polyfill.name}.${polyfill.hash}.js` };
    if (polyfill.nomodule) {
      args.nomodule = '';
    }
    scripts.push(createScript(args));
  });

  if (!needsLoader) {
    entries.forEach(entry => {
      scripts.push(createScript({ src: entry }));
    });
  }

  return scripts;
}

/**
 * Generates a index HTML based on the given configuration. A clean index.html should be
 *
 * @param {ASTNode} baseIndex the base index.html
 * @param {Partial<CreateIndexHTMLConfig>} config
 * @returns {{ indexHTML: string, files: FileResult[] }} the updated index html
 */
function createIndexHTML(baseIndex, config) {
  const localConfig = deepmerge(defaultConfig, config);
  if (!baseIndex) {
    throw new Error('Missing baseIndex.');
  }

  if (!localConfig.entries || !localConfig.entries.length) {
    throw new Error('Invalid config: missing config.entries');
  }

  const head = query(baseIndex, predicates.hasTagName('head'));
  const body = query(baseIndex, predicates.hasTagName('body'));

  if (!head) {
    throw new Error(`Invalid index.html: missing <head>`);
  }

  if (!body) {
    throw new Error(`Invalid index.html: missing <body>`);
  }

  /** @type {FileResult[]} */
  const files = [];
  const polyfills = getPolyfills(localConfig.polyfills);

  const needsLoader =
    !!polyfills.find(p => !!p.test) ||
    (localConfig.legacyEntries && localConfig.legacyEntries.length > 0);

  const standaloneScripts = createStandaloneScripts(polyfills, localConfig.entries, needsLoader);

  standaloneScripts.forEach(script => {
    append(body, script);
  });

  let loaderCode;
  if (needsLoader) {
    loaderCode = createLoaderScript(
      localConfig.entries,
      localConfig.legacyEntries,
      polyfills,
      localConfig.loader === 'external',
    );

    localConfig.entries.forEach(entry => {
      append(head, createElement('link', { rel: 'preload', href: entry, as: 'script' }));
    });

    if (localConfig.loader === 'inline') {
      append(body, createScript(null, loaderCode));
    } else if (localConfig.loader === 'external') {
      const name = `loader.${createContentHash(loaderCode)}.js`;
      files.push({ path: name, content: loaderCode });
      append(body, createScript({ src: name }));
    } else {
      throw new Error(`Unknown loader mode: ${localConfig.loader}`);
    }
  }

  const serialized = serialize(baseIndex);
  const result = localConfig.minify ? minifyIndexHTML(serialized, localConfig.minify) : serialized;

  polyfills.forEach(polyfill => {
    files.push({
      path: path.join('polyfills', `${polyfill.name}.${polyfill.hash}.js`),
      content: polyfill.code,
    });
    files.push({
      path: path.join('polyfills', `${polyfill.name}.${polyfill.hash}.js.map`),
      content: polyfill.sourcemap,
    });
  });

  return {
    indexHTML: result,
    files,
  };
}
module.exports.createIndexHTML = createIndexHTML;
