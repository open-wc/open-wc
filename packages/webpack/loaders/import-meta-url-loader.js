/* eslint-disable */
const regex = /(?!\()import.meta.url(?=\))/g;

/** Webpack loader to rewrite `import.meta.url` in modules to the source code file location. */
module.exports = function (source) {
  const relativePath = this.context.substring(
    this.context.indexOf(this.rootContext) + this.rootContext.length + 1,
    this.resource.lastIndexOf('/') + 1
  );

  const fileName = this.resource.substring(this.resource.lastIndexOf('/') + 1);
  return source.replace(regex, () => `'./${relativePath}/${fileName}'`);
};
