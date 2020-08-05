/* eslint-disable prefer-template */
/** @typedef {import('./types').PolyfillsLoaderConfig} PolyfillsLoaderConfig */
/** @typedef {import('./types').File} File */
/** @typedef {import('./types').GeneratedFile} GeneratedFile */
/** @typedef {import('./types').PolyfillFile} PolyfillFile */
/** @typedef {import('./types').PolyfillsConfig} PolyfillsConfig */
/** @typedef {import('./types').PolyfillConfig} PolyfillConfig */
/** @typedef {import('./types').PolyfillsLoader} PolyfillsLoader */
/** @typedef {import('./types').LegacyEntrypoint} LegacyEntrypoint */

const { transform } = require('@babel/core');
const Terser = require('terser');
const { fileTypes, hasFileOfType, cleanImportPath } = require('./utils');
const { createPolyfillsData } = require('./create-polyfills-data');

const DEFAULT_POLYFILLS_DIR = 'polyfills';

/**
 * Function which loads a script dynamically, returning a thenable (object with then function)
 * because Promise might not be loaded yet
 */
const loadScriptFunction = `
  function loadScript(src, type) {
    return new Promise(function (resolve) {
      var script = document.createElement('script');
      function onLoaded() {
        if (script.parentElement) {
          script.parentElement.removeChild(script);
        }
        resolve();
      }
      script.src = src;
      script.onload = onLoaded;
      script.onerror = function () {
        console.error('[polyfills-loader] failed to load: ' + src + ' check the network tab for HTTP status.');
        onLoaded();
      }
      if (type) script.type = type;
      document.head.appendChild(script);
    });
  }
`;

/**
 * Returns the loadScriptFunction if a script will be loaded for this config.
 * @param {PolyfillsLoaderConfig} cfg
 * @param {PolyfillFile[]} polyfills
 * @returns {string}
 */
function createLoadScriptCode(cfg, polyfills) {
  const { MODULE, SCRIPT, ES_MODULE_SHIMS } = fileTypes;
  if (
    (polyfills && polyfills.length > 0) ||
    [SCRIPT, MODULE, ES_MODULE_SHIMS].some(type => hasFileOfType(cfg, type))
  ) {
    return loadScriptFunction;
  }

  return '';
}

/**
 * Returns a js statement which loads the given resource in the browser.
 * @param {File} file
 */
function createLoadFile(file) {
  const resourePath = cleanImportPath(file.path);

  switch (file.type) {
    case fileTypes.SCRIPT:
      return `loadScript('${resourePath}')`;
    case fileTypes.MODULE:
      return `loadScript('${resourePath}', 'module')`;
    case fileTypes.ES_MODULE_SHIMS:
      return `loadScript('${resourePath}', 'module-shim')`;
    case fileTypes.SYSTEMJS:
      return `System.import('${resourePath}')`;
    default:
      throw new Error(`Unknown resource type: ${file.type}`);
  }
}

/**
 * Creates a statement which loads the given resources in the browser sequentually.
 * @param {File[]} files
 */
function createLoadFiles(files) {
  if (files.length === 1) {
    return createLoadFile(files[0]);
  }

  return `[
    ${files.map(r => `function() { return ${createLoadFile(r)} }`)}
  ].reduce(function (a, c) {
    return a.then(c);
  }, Promise.resolve())`;
}

/**
 * Creates js code which loads the correct resources, uses runtime feature detection
 * of legacy resources are configured to load the appropriate resources.
 * @param {PolyfillsLoaderConfig} cfg
 */
function createLoadFilesFunction(cfg) {
  const loadResources = cfg.modern && cfg.modern.files ? createLoadFiles(cfg.modern.files) : '';
  if (!cfg.legacy || cfg.legacy.length === 0) {
    return loadResources;
  }

  /**
   * @param {string} all
   * @param {LegacyEntrypoint} current
   * @param {number} i
   */
  function reduceFn(all, current, i) {
    return `${all}${i !== 0 ? ' else ' : ''}if (${current.test}) {
      ${createLoadFiles(current.files)}
    }`;
  }
  const loadLegacyResources = cfg.legacy.reduce(reduceFn, '');

  return `${loadLegacyResources} else {
      ${loadResources}
    }`;
}

/**
 * Creates js code which waits for polyfills if applicable, and executes
 * the code which loads entrypoints.
 * @param {PolyfillsLoaderConfig} cfg
 * @param {PolyfillFile[]} polyfills
 * @returns {string}
 */
function createLoadFilesCode(cfg, polyfills) {
  const loadFilesFunction = createLoadFilesFunction(cfg);

  // create a separate loadFiles to be run after polyfills
  if (polyfills && polyfills.length > 0) {
    return `
  function loadFiles() {
    ${loadFilesFunction}
  }

  if (polyfills.length) {
    Promise.all(polyfills).then(loadFiles);
  } else {
    loadFiles();
  }`;
  }

  // there are no polyfills, load entries straight away
  return `${loadFilesFunction}`;
}

/**
 * Creates code which loads the configured polyfills
 * @param {PolyfillsLoaderConfig} cfg
 * @param {PolyfillFile[]} polyfills
 * @returns {{ loadPolyfillsCode: string, generatedFiles: GeneratedFile[] }}
 */
function createPolyfillsLoaderCode(cfg, polyfills) {
  if (!polyfills || polyfills.length === 0) {
    return { loadPolyfillsCode: '', generatedFiles: [] };
  }
  /** @type {GeneratedFile[]} */
  const generatedFiles = [];
  let loadPolyfillsCode = '  var polyfills = [];';

  polyfills.forEach(polyfill => {
    let loadScript = `loadScript('./${polyfill.path}')`;
    if (polyfill.initializer) {
      loadScript += `.then(function () { ${polyfill.initializer} })`;
    }
    const loadPolyfillCode = `polyfills.push(${loadScript});`;

    if (polyfill.test) {
      loadPolyfillsCode += `if (${polyfill.test}) { ${loadPolyfillCode} }`;
    } else {
      loadPolyfillsCode += `${loadPolyfillCode}`;
    }

    generatedFiles.push({
      type: polyfill.type,
      path: polyfill.path,
      content: polyfill.content,
    });
  });

  return { loadPolyfillsCode, generatedFiles };
}

/**
 * Creates a loader script that executes immediately, loading the configured
 * polyfills and resources (app entrypoints, scripts etc.).
 *
 * @param {PolyfillsLoaderConfig} cfg
 * @returns {PolyfillsLoader | null}
 */
function createPolyfillsLoader(cfg) {
  let polyfillFiles = createPolyfillsData(cfg);
  /** @type {PolyfillFile | undefined} */
  const coreJs = polyfillFiles.find(pf => pf.name === 'core-js');
  polyfillFiles = polyfillFiles.filter(pf => pf !== coreJs);
  const { loadPolyfillsCode, generatedFiles } = createPolyfillsLoaderCode(cfg, polyfillFiles);

  let code = `
    ${createLoadScriptCode(cfg, polyfillFiles)}
    ${loadPolyfillsCode}
    ${createLoadFilesCode(cfg, polyfillFiles)}
  `;

  if (coreJs) {
    generatedFiles.push({
      type: fileTypes.SCRIPT,
      path: coreJs.path,
      content: coreJs.content,
    });

    // if core-js should be polyfilled, load it first and then the rest because most
    // polyfills rely on things like Promise to be already loaded
    code = `(function () {
      function polyfillsLoader() {
        ${code}
      }

      if (${coreJs.test}) {
        var s = document.createElement('script');
        function onLoaded() {
          document.head.removeChild(s);
          polyfillsLoader();
        }
        s.src = "${coreJs.path}";
        s.onload = onLoaded;
        s.onerror = function () {
          console.error('[polyfills-loader] failed to load: ' + s.src + ' check the network tab for HTTP status.');
          onLoaded();
        }
        document.head.appendChild(s);
      } else {
        polyfillsLoader();
      }
     })();`;
  } else {
    code = `(function () { ${code} })();`;
  }

  if (cfg.minify) {
    const output = Terser.minify(code);
    if (!output || !output.code) {
      throw new Error('Could not minify loader.');
    }
    ({ code } = output);
  } else {
    const output = transform(code, { babelrc: false, configFile: false });
    if (!output || !output.code) {
      throw new Error('Could not prettify loader.');
    }
    ({ code } = output);
  }

  return { code, polyfillFiles: generatedFiles };
}

module.exports = {
  createPolyfillsLoader,
  DEFAULT_POLYFILLS_DIR,
};
