const Terser = require('terser');

/**
 * @typedef {import('./create-index-html').EntriesConfig} EntriesConfig
 */

/**
 * @typedef {import('./create-index-html').Polyfill} Polyfill
 */
const loadScriptFunction = `
function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.onerror = reject;
    script.onload = resolve;
    script.src = src;
    script.defer = true;

    document.head.appendChild(script);
  })\n\n;
}`;

/**
 * @param {EntriesConfig} entries
 * @param {EntriesConfig} legacyEntries
 * @param {Polyfill[]} polyfills
 */
function createLoadScriptFunction(entries, legacyEntries, polyfills) {
  if (polyfills && polyfills.length > 0) {
    return loadScriptFunction;
  }

  if (entries.type === 'script' || (legacyEntries && legacyEntries.type === 'script')) {
    return loadScriptFunction;
  }

  return '';
}

const asArrayLiteral = arr => `[${arr.map(e => `'${e}'`).join(',')}]`;

const entryLoaderCreators = {
  script: files =>
    files.length === 1
      ? `loadScript('${files[0]}')`
      : `${asArrayLiteral(files)}.forEach(function (entry) { loadScript(entry); })`,
  module: files =>
    files.length === 1
      ? `window.importShim('${files[0]}')`
      : `${asArrayLiteral(files)}.forEach(function (entry) { window.importShim(entry); })`,
  system: files =>
    files.length === 1
      ? `System.import('${files[0]}')`
      : `${asArrayLiteral(files)}.forEach(function (entry) { System.import(entry); })`,
};

/**
 * @param {EntriesConfig} entries
 * @param {EntriesConfig} legacyEntries
 */
function createEntriesLoaderFunction(entries, legacyEntries) {
  if (!legacyEntries) {
    return `${entryLoaderCreators[entries.type](entries.files.map(f => `./${f}`))};`;
  }

  const load = entryLoaderCreators[entries.type](entries.files.map(f => `./${f}`));
  const loadLegacy = entryLoaderCreators[legacyEntries.type](
    legacyEntries.files.map(f => `./${f}`),
  );
  return `'noModule' in HTMLScriptElement.prototype ? ${load} : ${loadLegacy};`;
}

/**
 * @param {Polyfill[]} polyfills
 */
function createExecuteLoadEntries(polyfills) {
  if (polyfills && polyfills.length) {
    return 'polyfills.length ? Promise.all(polyfills).then(loadEntries) : loadEntries();';
  }
  return 'loadEntries()';
}

/**
 * @param {EntriesConfig} entries
 * @param {EntriesConfig} legacyEntries
 * @param {Polyfill[]} polyfills
 */
function createEntriesLoader(entries, legacyEntries, polyfills) {
  const loadEntriesFunction = createEntriesLoaderFunction(entries, legacyEntries);
  const executeLoadEntries = createExecuteLoadEntries(polyfills);

  return `
    function loadEntries() {
      ${loadEntriesFunction}
    }
    ${executeLoadEntries}
  `;
}

/**
 * @param {import('@open-wc/building-utils/index-html/create-index-html').Polyfill[]} polyfills
 */
function createPolyfillsLoader(polyfills) {
  if (!polyfills) {
    return '';
  }

  let code = 'var polyfills = [];\n';

  polyfills.forEach(polyfill => {
    if (!polyfill.test) {
      return;
    }

    code += `if (${polyfill.test}) { polyfills.push(loadScript('polyfills/${polyfill.name}.${
      polyfill.hash
    }.js')) }\n`;
  });

  return `${code}\n`;
}

/**
 *
 * @param {EntriesConfig} entries
 * @param {EntriesConfig} legacyEntries
 * @param {import('@open-wc/building-utils/index-html/create-index-html').Polyfill[]} polyfills
 */
function createLoaderScript(entries, legacyEntries, polyfills, minified = true) {
  /* eslint-disable prefer-template */
  const code =
    '(function() {' +
    createLoadScriptFunction(entries, legacyEntries, polyfills) +
    createPolyfillsLoader(polyfills) +
    createEntriesLoader(entries, legacyEntries, polyfills) +
    '})();';

  return minified ? Terser.minify(code).code : code;
}

module.exports.createLoaderScript = createLoaderScript;
