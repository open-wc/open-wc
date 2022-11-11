const { serialize } = require('parse5');
const path = require('path');
const deepmerge = require('deepmerge');
const { createScript, createElement } = require('../dom5-utils.js');
const { append, insertBefore, query, predicates } = require('../dom5-fork/index.js');
const { getPolyfills } = require('./polyfills.js');
const { createLoaderScript } = require('./loader-script.js');
const { minifyIndexHTML, defaultMinifyHTMLConfig } = require('./minify-index-html.js');
const { createContentHash, cleanImportPath, polyfillFilename } = require('./utils.js');

/** @typedef {import('parse5').Document} ASTNode */

/**
 * @typedef {object} EntriesConfig
 * @property {string} type
 * @property {string[]} files
 * @property {string[]} [preloadedFiles]
 * @property {boolean} [polyfillDynamicImport=true]
 */

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
 * @property {boolean} [module]
 */

/**
 * @typedef {object} PolyfillInstruction
 * @property {string} name name of the polyfill
 * @property {string|Array<string>} path polyfill path
 * @property {string} [test] expression which should evaluate to true to load the polyfill
 * @property {boolean} [nomodule] whether to inject the polyfills as a script with nomodule attribute
 * @property {boolean} [module] wether to load the polyfill with type module
 * @property {string} [sourcemapPath] polyfill sourcemaps path
 * @property {boolean} [noMinify] whether to minify the polyfills. default true if no sourcemap is given, false otherwise
 */

/**
 * @typedef {object} PolyfillsConfig
 * @property {boolean} [coreJs] whether to polyfill core-js polyfills
 * @property {boolean | string} [regeneratorRuntime] whether to add regenerator runtime
 * @property {boolean} [webcomponents] whether to polyfill webcomponents
 * @property {boolean} [shadyCssCustomStyle] whether to polyfill shadyCSS
 * @property {boolean} [fetch] whether to polyfill fetch
 * @property {boolean} [intersectionObserver] whether to polyfill intersection observer
 * @property {boolean} [dynamicImport] whether to polyfill dynamic import
 * @property {boolean} [systemJs] whether to polyfill systemjs
 * @property {boolean} [systemJsExtended] whether to polyfill systemjs, extended version with import maps
 * @property {boolean} [esModuleShims] whether to polyfill es modules using es module shims
 * @property {boolean} [hashPolyfills] whether to append the content hash for the emitted polyfill
 * @property {PolyfillInstruction[]} [customPolyfills] custom polyfills specified by the user
 */

/**
 * @typedef {object} CreateIndexHTMLConfig
 * @property {PolyfillsConfig} polyfills
 * @property {EntriesConfig} entries
 * @property {EntriesConfig} [legacyEntries]
 * @property {false|object} minify minify configuration, or false to disable minification
 * @property {string} loader 'inline' | 'external'
 * @property {boolean} preload
 */

/** @type {Partial<CreateIndexHTMLConfig>} */
const defaultConfig = {
  polyfills: {
    hashPolyfills: true,
    coreJs: false,
    regeneratorRuntime: false,
    webcomponents: false,
    intersectionObserver: false,
    fetch: false,
  },
  minify: defaultMinifyHTMLConfig,
  loader: 'inline',
  preload: true,
};

/**
 * Creates script nodes for polyfills and entries which should be loaded on startup. For example
 * core-js polyfills with a 'nomodule' attribute, and the entry point if don't need to inject
 * a loader.
 *
 * @param {PolyfillsConfig} polyfillsConfig
 * @param {Polyfill[]} polyfills
 * @param {EntriesConfig} entries
 * @param {boolean} needsLoader
 * @returns {ASTNode[]}
 */
function createScripts(polyfillsConfig, polyfills, entries, needsLoader) {
  /** @type {ASTNode[]} */
  const scripts = [];

  /**
   * If dynamic imports need to be polyfilled we need to feature detect them.
   * import() is not a regular function, which makes polyfilling complex.
   *
   * This script will fail on browsers which don't support dynamic imports with
   * a syntax error. On browsers which do support it, it will create a function
   * which calls native import(). Later we can check if window.importShim
   * is defined to know if it is natively supported.
   */
  if (polyfillsConfig.dynamicImport) {
    scripts.push(
      createScript(
        null,
        "window.importShim = src => import(src.startsWith('.') ? new URL(src, document.baseURI) : src)",
      ),
    );
  }

  polyfills.forEach(polyfill => {
    if (polyfill.test) {
      return;
    }

    const args = { src: `polyfills/${polyfillFilename(polyfill, polyfillsConfig)}.js` };
    if (polyfill.nomodule) {
      args.nomodule = '';
    }
    scripts.push(createScript(args));
  });

  if (!needsLoader) {
    entries.files.forEach(entry => {
      scripts.push(
        createScript({
          src: cleanImportPath(entry),
          type: entries.type === 'module' ? 'module' : undefined,
        }),
      );
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

  if (!localConfig.entries || !localConfig.entries.files.length) {
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

  const firstScript = query(body, predicates.hasTagName('script'));

  /** @type {FileResult[]} */
  const files = [];
  const polyfills = getPolyfills(localConfig);

  /**
   * Check whether we need add a special loader script, or if we can load app
   * code directly with a script tag. A loader is needed when:
   * - We need to load polyfills conditonally
   * - We are loading system, which can't be loaded with a script tag
   * - We have a legacy build, so we need to conditionally load either modern or legacy
   */
  const needsLoader =
    polyfills.some(p => Boolean(p.test)) ||
    [localConfig.entries, localConfig.legacyEntries].some(c => c && c.type === 'system') ||
    (localConfig.legacyEntries && localConfig.legacyEntries.files.length > 0);

  const scripts = createScripts(localConfig.polyfills, polyfills, localConfig.entries, needsLoader);
  if (firstScript) {
    scripts.forEach(script => {
      insertBefore(body, firstScript, script);
    });
  } else {
    scripts.forEach(script => {
      append(body, script);
    });
  }

  const appendPreloadScript = href => {
    if (localConfig.entries.type === 'module') {
      append(head, createElement('link', { rel: 'modulepreload', href, as: 'script' }));
    } else {
      append(head, createElement('link', { rel: 'preload', href, as: 'script' }));
    }
  };

  let loaderCode;
  if (needsLoader) {
    loaderCode = createLoaderScript(
      localConfig.entries,
      localConfig.legacyEntries,
      polyfills,
      localConfig.polyfills,
      localConfig.loader === 'external',
    );

    if (localConfig.preload) {
      localConfig.entries.files.forEach(appendPreloadScript);
    }

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

  if (localConfig.entries.preloadedFiles) {
    localConfig.entries.preloadedFiles.forEach(appendPreloadScript);
  }

  const serialized = serialize(baseIndex);
  const result = localConfig.minify ? minifyIndexHTML(serialized, localConfig.minify) : serialized;

  polyfills.forEach(polyfill => {
    files.push({
      path: path.join('polyfills', `${polyfillFilename(polyfill, localConfig.polyfills)}.js`),
      content: polyfill.code,
    });
    files.push({
      path: path.join('polyfills', `${polyfillFilename(polyfill, localConfig.polyfills)}.js.map`),
      content: polyfill.sourcemap,
    });
  });

  return {
    indexHTML: result,
    files,
  };
}
module.exports.createIndexHTML = createIndexHTML;
