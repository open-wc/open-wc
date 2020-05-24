/* eslint-disable */
// @ts-nocheck
const toBrowserPath = require('./src/to-browser-path');
const regex = /import\.meta/g;

/**
 * Webpack loader to rewrite `import.meta` in modules with url data to the source code file location.
 *
 * @example
 * return import.meta;
 * // becomes: return ({ url: `${window.location.protocol}//${window.location.host}/relative/path/to/file.js` });
 *
 * return import.meta.url;
 * // becomes: return ({ url: `${window.location.protocol}//${window.location.host}/relative/path/to/file.js` }).url;
 */
module.exports = function (source) {
  const path = require('path');

  const relativePath = this.context.substring(
    this.context.indexOf(this.rootContext) + this.rootContext.length + 1,
    this.resource.lastIndexOf(path.sep) + 1,
  );

  const browserPath = toBrowserPath(relativePath);

  const fileName = this.resource.substring(this.resource.lastIndexOf(path.sep) + 1);

  let found = false;
  let rewrittenSource = source.replace(regex, () => {
    found = true;
    return `({ url: getAbsoluteUrl('${browserPath}/${fileName}') })`;
  });

  if (found) {
    return `
      function getAbsoluteUrl(relativeUrl) {
        const publicPath = __webpack_public_path__;

        let url = '';

        if (!publicPath || publicPath.indexOf('://') < 0) {
          url += window.location.protocol + '//' + window.location.host;
        }

        if (publicPath) {
          url += publicPath;
        } else {
          url += '/';
        }

        return url + relativeUrl;
      }
${rewrittenSource}`;
  } else {
    return source;
  }
};
