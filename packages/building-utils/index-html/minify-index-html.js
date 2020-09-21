const htmlMinifier = require('html-minifier-terser');

const defaultMinifyHTMLConfig = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
};

/**
 * @param {string} htmlString
 * @param {object} config
 */
function minifyIndexHTML(htmlString, config = defaultMinifyHTMLConfig) {
  return htmlMinifier.minify(htmlString, config);
}

module.exports.minifyIndexHTML = minifyIndexHTML;
module.exports.defaultMinifyHTMLConfig = defaultMinifyHTMLConfig;
