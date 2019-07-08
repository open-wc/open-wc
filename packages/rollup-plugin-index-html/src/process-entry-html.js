const fs = require('fs');
const path = require('path');
const { extractResources } = require('@open-wc/building-utils/index-html');
const { createError } = require('./utils');

const joinTo = dir => p => path.join(dir, p);
const createInlineModule = dir => (_, i) => path.join(dir, `inline-entry.${i}.js`);

/**
 * If the input is an index.html, and an index.html is not provided manually, extracts all module scripts from the index
 * and feeds them to rollup.
 *
 * Returns the index html so that it can be used for output processing.
 */
function processEntryHtml(inputConfig) {
  if (typeof inputConfig.input !== 'string' || !inputConfig.input.endsWith('index.html')) {
    throw createError('Input must be an index.html file, or an indexHTML option must be provided.');
  }

  const indexFolder = path.dirname(inputConfig.input);

  const indexHTMLString = fs.readFileSync(inputConfig.input, 'utf-8');
  const {
    jsModules,
    inlineModules,
    inlineImportMaps,
    indexHTML: outputIndexHTML,
  } = extractResources(indexHTMLString);

  const input = [
    ...jsModules.map(joinTo(indexFolder)),
    ...inlineModules.map(createInlineModule(indexFolder)),
  ];

  return {
    outputIndexHTML,
    inlineImportMaps,
    inlineModules,
    rollupOptions: {
      ...inputConfig,
      input,
    },
  };
}

module.exports = {
  processEntryHtml,
};
