const CleanCSS = require('clean-css');

const cleanCSS = new CleanCSS({
  rebase: false,
  inline: ['none'],
  // @ts-ignore
  level: {
    1: {
      all: false,
      optimizeBackground: true, // controls `background` property optimizations; defaults to `true`
      optimizeBorderRadius: true, // controls `border-radius` property optimizations; defaults to `true`
      optimizeFilter: true, // controls `filter` property optimizations; defaults to `true`
      optimizeFont: true, // controls `font` property optimizations; defaults to `true`
      optimizeFontWeight: true, // controls `font-weight` property optimizations; defaults to `true`
      optimizeOutline: true, // controls `outline` property optimizations; defaults to `true`
      removeEmpty: false, // controls removing empty rules and nested blocks; defaults to `true`
      removeNegativePaddings: false, // controls removing negative paddings; defaults to `true`
      removeQuotes: true, // controls removing quotes when unnecessary; defaults to `true`
      removeWhitespace: true, // controls removing unused whitespace; defaults to `true`
      replaceMultipleZeros: false, // contols removing redundant zeros; defaults to `true`
      replaceTimeUnits: true, // controls replacing time units with shorter values; defaults to `true`
      replaceZeroUnits: true, // controls replacing zero values with units; defaults to `true`
      roundingPrecision: false, // rounds pixel values to `N` decimal places; `false` disables rounding; defaults to `false`
      selectorsSortingMethod: false, // denotes selector sorting method; can be `'natural'` or `'standard'`, `'none'`, or false (the last two since 4.1.0); defaults to `'standard'`
      specialComments: 'all', // denotes a number of /*! ... */ comments preserved; defaults to `all`
      tidyAtRules: false, // controls at-rules (e.g. `@charset`, `@import`) optimizing; defaults to `true`
      tidyBlockScopes: false, // controls block scopes (e.g. `@media`) optimizing; defaults to `true`
      tidySelectors: false, // controls selectors optimizing; defaults to `true`,
      semicolonAfterLastProperty: false, // controls removing trailing semicolons in rule; defaults to `false` - means remove
    },
  },
});

/**
 * Minifies CSS, bailing on any warning or error parsing CSS. This is necessary because
 * lit-element allows partial invalid CSS, which trips up the minifier.
 *
 * @param {string} originalCSS
 * @returns {string}
 */
function customMinifyCSS(originalCSS) {
  const result = cleanCSS.minify(originalCSS);

  if (result.warnings.length > 0 || result.errors.length > 0) {
    return originalCSS.trim();
  }

  return result.styles;
}

module.exports = customMinifyCSS;
