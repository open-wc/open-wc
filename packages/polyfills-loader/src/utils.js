/** @typedef {import('parse5').Document} Document */
/** @typedef {import('parse5').Node} Node */
/** @typedef {import('./types').FileType} FileType */
/** @typedef {import('./types').PolyfillsLoaderConfig} PolyfillsLoaderConfig */

// @ts-ignore
const { getAttribute } = require('@open-wc/building-utils/dom5-fork');
const crypto = require('crypto');

const noModuleSupportTest = "!('noModule' in HTMLScriptElement.prototype)";

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
  return crypto.createHash('md4').update(content).digest('hex');
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
    // @ts-ignore
    cfg.modern.files.some(f => f.type === type) ||
    (cfg.legacy && cfg.legacy.some(e => e.files.some(f => f.type === type)))
  );
}

module.exports = {
  noModuleSupportTest,
  fileTypes,
  createContentHash,
  cleanImportPath,
  getScriptFileType,
  hasFileOfType,
};
