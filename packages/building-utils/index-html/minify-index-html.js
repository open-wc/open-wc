const { minify } = require('html-minifier-terser');

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
async function minifyIndexHTML(htmlString, config = defaultMinifyHTMLConfig) {
  return minify(htmlString, config);
}

module.exports.minifyIndexHTML = minifyIndexHTML;
module.exports.defaultMinifyHTMLConfig = defaultMinifyHTMLConfig;
