const fs = require('fs');
const path = require('path');
const { extractResources } = require('@open-wc/building-utils/index-html');
const { createError } = require('./utils');

/**
 * If the input is an index.html, and an index.html is not provided manually, extracts all module scripts from the index
 * and feeds them to rollup.
 *
 * Returns the index html so that it can be used for output processing.
 */
function createEntrypoints(inputConfig) {
  if (typeof inputConfig.input !== 'string' || !inputConfig.input.endsWith('index.html')) {
    throw createError('Input must be an index.html file, or an indexHTML option must be provided.');
  }

  const indexFolder = path.dirname(inputConfig.input);
  const indexHTMLString = fs.readFileSync(inputConfig.input, 'utf-8');
  const resources = extractResources(indexHTMLString);
  const modules = resources.jsModules.map(p => path.join(indexFolder, p));

  return {
    outputIndexHTML: resources.indexHTML,
    rollupOptions: {
      ...inputConfig,
      input: modules,
    },
  };
}

module.exports.createEntrypoints = createEntrypoints;
