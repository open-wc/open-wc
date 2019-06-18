/* eslint-disable class-methods-use-this, no-param-reassign */
const { serialize, parse } = require('parse5');
const { createIndexHTML, minifyIndexHTML } = require('@open-wc/building-utils/index-html');

const VARIATION_FALLBACK = Symbol('fallback');
/** @param {import('parse5').ASTNode} ast */
function cloneAST(ast) {
  return parse(serialize(ast));
}

/**
 * Emits index.html and the associated polyfills.
 *
 * @param {object} compilation
 * @param {import('../webpack-index-html-plugin').WebpackIndexHTMLPluginConfig} config
 * @param {import('parse5').ASTNode} [baseIndex]
 * @param {Map<string, string[]>} entryNamesForVariations
 * @param {object} legacyEntriesResult
 */
function emitIndexHTML(
  compilation,
  config,
  baseIndex,
  entryNamesForVariations,
  legacyEntriesResult,
) {
  const allEntries = [];
  compilation.entrypoints.forEach(entrypoint => {
    const jsFiles = entrypoint.getRuntimeChunk().files.filter(f => f.endsWith('.js'));
    allEntries.push(...jsFiles);
  });

  /**
   * @param {string} [filename]
   * @param {string[]} [entries]
   * @param {string | Symbol} [variation]
   */
  const generateIndex = (filename, entries, legacyEntries, variation) => {
    /** @type {import('parse5').ASTNode} */
    let localBaseIndex;

    /** If there is a user defined template, use that as the base to inject the output into. */
    if (config.template) {
      if (typeof config.template !== 'function') {
        throw new Error('config.template should be a function.');
      }

      const templateString = config.template({
        assets: compilation.assets,
        entries,
        legacyEntries,
        variation: variation && variation.toString(),
      });
      localBaseIndex = parse(templateString);
    } else {
      /**
       * If there is no user defined template the entrypoint was an index.html, and we use that as the base
       * for our output. We need to clone it to avoid mutating the baseIndex variable.
       */
      localBaseIndex = cloneAST(baseIndex);
    }

    /** @type {string} */
    let finalIndexHTML;

    /** Inject generated output into index.html */
    if (config.inject) {
      const generateResult = createIndexHTML(localBaseIndex, {
        ...config,
        entries: { type: 'script', files: entries },
        legacyEntries: legacyEntries ? { type: 'script', files: legacyEntries } : undefined,
      });

      finalIndexHTML = generateResult.indexHTML;
      if (config.multiIndex && config.multiIndex.transformIndex) {
        finalIndexHTML = config.multiIndex.transformIndex(
          finalIndexHTML,
          variation.toString(),
          variation === VARIATION_FALLBACK,
        );
      }

      generateResult.files.forEach(file => {
        compilation.assets[file.path] = {
          source: () => file.content,
          size: () => file.content.length,
        };
      });
    } else {
      /** If injection is disabled the user takes control, probably with it's own template. */
      const serialized = serialize(localBaseIndex);
      finalIndexHTML = minifyIndexHTML(serialized);
    }

    compilation.assets[filename] = {
      source: () => finalIndexHTML,
      size: () => finalIndexHTML.length,
    };
  };

  if (!entryNamesForVariations) {
    // regular build without variations
    const legacyEntries = legacyEntriesResult && legacyEntriesResult.entries;
    generateIndex('index.html', allEntries, legacyEntries);
  } else {
    // build with variations with a separate index per variation
    entryNamesForVariations.forEach((entryNamesForVariation, variation) => {
      const entriesForVariation = allEntries.filter(e1 =>
        entryNamesForVariation.some(e2 => e1.startsWith(e2)),
      );
      const legacyEntries =
        legacyEntriesResult && legacyEntriesResult.entryNamesForVariations.get(variation);
      generateIndex(`index-${variation}.html`, entriesForVariation, legacyEntries, variation);
    });

    // if necessary, also create a fallback build which generates a fallback index.html
    if (config.multiIndex.fallback) {
      const entryNamesForVariation = entryNamesForVariations.get(config.multiIndex.fallback);
      const entriesForVariation = allEntries.filter(e1 =>
        entryNamesForVariation.some(e2 => e1.startsWith(e2)),
      );
      const legacyEntries =
        legacyEntriesResult &&
        legacyEntriesResult.entryNamesForVariations.get(config.multiIndex.fallback);

      generateIndex('index.html', entriesForVariation, legacyEntries, VARIATION_FALLBACK);
    }
  }
}

module.exports.emitIndexHTML = emitIndexHTML;
