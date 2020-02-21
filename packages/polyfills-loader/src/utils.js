/** @typedef {import('parse5').Document} Document */
/** @typedef {import('parse5').Node} Node */
/** @typedef {import('./types').FileType} FileType */
/** @typedef {import('./types').PolyfillsLoaderConfig} PolyfillsLoaderConfig */

const {
  constructors,
  setAttribute,
  append,
  queryAll,
  predicates,
  getAttribute,
  hasAttribute,
} = require('@open-wc/building-utils/dom5-fork');
const crypto = require('crypto');
const path = require('path');
const { isUri } = require('valid-url');

const noModuleSupportTest = "!('noModule' in HTMLScriptElement.prototype)";
const toBrowserPathRegExp = new RegExp(path.sep === '\\' ? '\\\\' : path.sep, 'g');

/** @type {Record<'SCRIPT' | 'MODULE' | 'ES_MODULE_SHIMS' | 'SYSTEMJS', FileType>} */
const fileTypes = {
  SCRIPT: 'script',
  MODULE: 'module',
  ES_MODULE_SHIMS: 'es-module-shims',
  SYSTEMJS: 'systemjs',
};

/**
 * @param {string} content
 * @returns {string}
 */
function createContentHash(content) {
  return crypto
    .createHash('md4')
    .update(content)
    .digest('hex');
}

/**
 * @param {string} importPath
 * @returns {string}
 */
function cleanImportPath(importPath) {
  if (importPath.startsWith('/')) {
    return importPath;
  }

  if (importPath.startsWith('../') || importPath.startsWith('./')) {
    return importPath;
  }

  return `./${importPath}`;
}

/**
 * @param {string} tag
 * @param {Record<string, string>} attributes
 * @returns {Node}
 */
function createElement(tag, attributes) {
  const element = constructors.element(tag);
  if (attributes) {
    Object.keys(attributes).forEach(key => {
      if (attributes[key] != null) {
        setAttribute(element, key, attributes[key]);
      }
    });
  }
  return element;
}

/**
 * @param {Record<string, string>} attributes
 * @param {string} [code]
 * @returns {Node}
 */
function createScript(attributes, code) {
  const script = createElement('script', attributes);
  if (code) {
    const scriptText = constructors.text(code);
    append(script, scriptText);
  }
  return script;
}

/**
 * @param {string} code
 * @returns {Node}
 */
function createModuleScript(code) {
  return createScript({ type: 'module' }, code);
}

/**
 * @param {Node} script
 * @returns {FileType}
 */
function getScriptFileType(script) {
  return getAttribute(script, 'type') === 'module' ? fileTypes.MODULE : fileTypes.SCRIPT;
}

/**
 * @param {PolyfillsLoaderConfig} cfg
 * @param {FileType} type
 */
function hasFileOfType(cfg, type) {
  return (
    cfg.modern.files.some(f => f.type === type) ||
    (cfg.legacy && cfg.legacy.some(e => e.files.some(f => f.type === type)))
  );
}

/**
 * @param {Document} document
 * @returns {{ inline: Node[], external: Node[]}}
 */
function findImportMapScripts(document) {
  /** @type {Node[]} */
  const allScripts = queryAll(document, predicates.hasTagName('script'));
  const scripts = allScripts.filter(script => getAttribute(script, 'type') === 'importmap');

  /** @type {Node[]} */
  const inline = [];
  /** @type {Node[]} */
  const external = [];
  scripts.forEach(script => {
    if (getAttribute(script, 'src')) {
      external.push(script);
    } else {
      inline.push(script);
    }
  });

  return { inline, external };
}

/** @param {Node} script */
function isDeferred(script) {
  return getAttribute(script, 'type') === 'module' || hasAttribute(script, 'defer');
}

/** @param {Node} script */
function isAsync(script) {
  return hasAttribute(script, 'async');
}

/**
 * @param {Node} a
 * @param {Node} b
 * @returns {number}
 */
function sortByLoadingPriority(a, b) {
  if (isAsync(a)) {
    return 0;
  }

  const aDeferred = isDeferred(a);
  const bDeferred = isDeferred(b);

  if (aDeferred && bDeferred) {
    return 0;
  }

  if (aDeferred) {
    return 1;
  }

  if (bDeferred) {
    return -1;
  }

  return 0;
}

/**
 * Finds all js scripts in a document, returns the scripts sorted by loading priority.
 * @param {Document} document
 * @param {{ jsScripts?: boolean, jsModules?: boolean, inlineJsScripts?: boolean, inlineJsModules?: boolean }} [exclude]
 * @returns {Node[]}
 */
function findJsScripts(document, exclude = {}) {
  /** @type {Node[]} */
  const allScripts = queryAll(document, predicates.hasTagName('script'));

  return allScripts
    .filter(script => {
      const inline = !hasAttribute(script, 'src');
      const type = getAttribute(script, 'type');

      // we don't handle scripts which import from a URL (ex. a CDN)
      if (!inline && isUri(getAttribute(script, 'src'))) {
        return false;
      }

      if (!type || ['application/javascript', 'text/javascript'].includes(type)) {
        return inline ? !exclude.inlineJsScripts : !exclude.jsScripts;
      }
      if (type === 'module') {
        return inline ? !exclude.inlineJsModules : !exclude.jsModules;
      }
      return false;
    })
    .sort(sortByLoadingPriority);
}

/**
 * @param {string} filePath
 * @returns {string}
 */
function toBrowserPath(filePath) {
  return filePath.replace(toBrowserPathRegExp, '/');
}

module.exports = {
  noModuleSupportTest,
  fileTypes,
  createContentHash,
  cleanImportPath,
  createElement,
  createScript,
  createModuleScript,
  findImportMapScripts,
  findJsScripts,
  getScriptFileType,
  hasFileOfType,
  toBrowserPath,
};
