/**
 * Check if a given text uses any of the mdjs features
 *
 * @param {string} text
 * @returns {boolean}
 */
function isMdjsContent(text) {
  if (!text) {
    return false;
  }
  switch (true) {
    case text.includes('```js'):
    case text.includes('```js story'):
    case text.includes('```js preview-story'):
      return true;
    default:
      return false;
  }
}

module.exports = {
  isMdjsContent,
};
