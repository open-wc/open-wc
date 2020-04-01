const path = require('path');

/**
 * Transforms a file system path to a browser URL. For example windows uses `\` on the file system,
 * but it should use `/` in the browser.
 */
function toFilePath(browserPath) {
  return browserPath.replace(new RegExp('/', 'g'), path.sep);
}

module.exports = { toFilePath };
