const { createIndexHTML } = require('./create-index-html');
const { minifyIndexHTML } = require('./minify-index-html');
const { extractResources } = require('./extract-resources');
const { findInlineEntryId } = require('./inline-entry');

module.exports = {
  createIndexHTML,
  minifyIndexHTML,
  extractResources,
  findInlineEntryId,
};
