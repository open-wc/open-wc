const { createIndexHTML } = require('./create-index-html');
const { minifyIndexHTML } = require('./minify-index-html');
const { extractResources } = require('./extract-resources');

module.exports = {
  createIndexHTML,
  minifyIndexHTML,
  extractResources,
};
