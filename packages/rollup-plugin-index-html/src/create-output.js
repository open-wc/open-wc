const path = require('path');
const fs = require('fs');
const { serialize, parse } = require('parse5');
const { createIndexHTML, minifyIndexHTML } = require('@open-wc/building-utils/index-html');

/** @typedef {import('parse5').ASTNode} ASTNode */
/** @typedef {import('@open-wc/building-utils/index-html/create-index-html').EntriesConfig} EntriesConfig */
/** @typedef {import('../rollup-plugin-index-html').RollupPluginIndexHTMLConfig} RollupPluginIndexHTMLConfig */

/**
 * @typedef {object} OutputResult
 * @property {string} path
 * @property {string} content
 */

/**
 * @param {ASTNode} ast
 * @returns {ASTNode}
 */
function cloneAST(ast) {
  return parse(serialize(ast));
}

/**
 * @param {RollupPluginIndexHTMLConfig} pluginConfig
 * @param {ASTNode} inputIndexHTML
 * @param {EntriesConfig} entries
 * @param {EntriesConfig} [legacyEntries]
 */
function getOutputIndexHTML(pluginConfig, inputIndexHTML, entries, legacyEntries) {
  /** If there is a user defined template, use that as the base to inject the output into. */
  if (pluginConfig.template) {
    if (typeof pluginConfig.template !== 'function') {
      throw new Error('config.template should be a function.');
    }

    const templateString = pluginConfig.template({
      entries,
      legacyEntries,
      // variation: variation && variation.toString(),
    });
    try {
      return parse(templateString);
    } catch (error) {
      throw new Error(`Unable to parse returned from config.template function: ${error.message}`);
    }
  } else if (pluginConfig.indexHTML) {
    if (typeof pluginConfig.indexHTML !== 'string') {
      throw new Error('config.indexHTML must be a string');
    }

    if (!pluginConfig.indexHTML.endsWith('.html')) {
      throw new Error('config.indexHTML must be a html file');
    }

    if (!fs.existsSync(pluginConfig.indexHTML)) {
      throw new Error(`No file found at ${pluginConfig.indexHTML}`);
    }

    const indexHTMLString = fs.readFileSync(pluginConfig.indexHTML, 'utf-8');
    try {
      return parse(indexHTMLString);
    } catch (error) {
      throw new Error(`Unable to parse index html at ${pluginConfig.indexHTML}: ${error.message}`);
    }
  }

  /**
   * If there is no user defined template the entrypoint was an index.html, and we use that as the base
   * for our output. We need to clone it to avoid mutating the inputIndexHTML variable.
   */
  return cloneAST(inputIndexHTML);
}

/**
 * @param {RollupPluginIndexHTMLConfig} pluginConfig
 * @param {ASTNode} inputIndexHTML
 * @param {EntriesConfig} entries
 * @param {EntriesConfig} [legacyEntries]
 * @returns {OutputResult[]}
 */
function injectIntoIndexHTML(pluginConfig, inputIndexHTML, entries, legacyEntries) {
  /**
   * Inject output files, loader script and polyfills into index.html
   */
  if (pluginConfig.inject) {
    const result = createIndexHTML(inputIndexHTML, {
      ...pluginConfig,
      entries,
      legacyEntries,
    });

    return [{ path: pluginConfig.indexFilename, content: result.indexHTML }, ...result.files];
  }

  /**
   * If injection is disabled the user takes control, probably with it's own template.
   */
  const serialized = serialize(inputIndexHTML);
  return [{ path: pluginConfig.indexFilename, content: minifyIndexHTML(serialized) }];
}

/**
 * @param {RollupPluginIndexHTMLConfig} pluginConfig
 * @param {*} outputConfig
 * @param {ASTNode} inputIndexHTML
 * @param {EntriesConfig} entries
 * @param {EntriesConfig} [legacyEntries]
 * @returns {OutputResult[]}
 */
function createOutput(pluginConfig, outputConfig, inputIndexHTML, entries, legacyEntries) {
  const mergedPluginConfig = { indexFilename: 'index.html', ...pluginConfig };

  const indexHTML = getOutputIndexHTML(mergedPluginConfig, inputIndexHTML, entries, legacyEntries);
  const files = injectIntoIndexHTML(mergedPluginConfig, indexHTML, entries, legacyEntries);

  const outputDir = path.join(outputConfig.dir);
  return files.map(file => ({
    ...file,
    path: path.join(outputDir, file.path),
  }));
}

module.exports = {
  createOutput,
};
