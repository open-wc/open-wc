const Terser = require('terser');
const htmlMinifier = require('html-minifier');

const defaultMinifyHTMLConfig = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  /** @param {string} code */
  minifyJS: code => Terser.minify(code).code,
};

/**
 * @param {string} htmlString
 * @param {object} config
 */
function minifyHtml(htmlString, config = defaultMinifyHTMLConfig) {
  return htmlMinifier.minify(htmlString, config);
}

module.exports = { minifyHtml };
