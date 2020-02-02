const { transformAsync } = require('@babel/core');

/**
 * Turns the JSX generated by MDX to JS.
 *
 * @param {string} docsJsx
 * @param {string} filename
 * @returns {Promise<string>}
 */
async function jsxToJs(docsJsx, filename) {
  const result = await transformAsync(docsJsx, {
    filename,
    sourceMaps: true,
    plugins: [
      require.resolve('@babel/plugin-syntax-import-meta'),
      [require.resolve('@babel/plugin-transform-react-jsx'), { useSpread: true }],
    ],
  });
  if (!result || typeof result.code !== 'string') {
    throw new Error(`Something went wrong when compiling ${filename}`);
  }
  return result.code;
}

module.exports = { jsxToJs };
