/* eslint-disable */
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
module.exports = function(source) {
  const relativePath = this.context.substring(
    this.context.indexOf(this.rootContext) + this.rootContext.length + 1,
    this.resource.lastIndexOf('/') + 1,
  );

  const fileName = this.resource.substring(this.resource.lastIndexOf('/') + 1);
  return source.replace(
    regex,
    () =>
      `({ url: \`\${window.location.protocol}//\${window.location.host}/${relativePath}/${fileName}\` })`,
  );
};
