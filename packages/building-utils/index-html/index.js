const { createIndexHTML } = require('./create-index-html.js');
const { minifyIndexHTML } = require('./minify-index-html.js');
const { extractResources } = require('./extract-resources.js');
const { findInlineEntryId } = require('./inline-entry.js');

module.exports = {
  createIndexHTML,
  minifyIndexHTML,
  extractResources,
  findInlineEntryId,
};
