const createMdxToJsTransformer = require('../../shared/createMdxToJsTransformer');

module.exports = function createMdxToJs(rootDir) {
  const transformMdxToJs = createMdxToJsTransformer(rootDir);

  return async function mdxToJS({ url, body, status }) {
    if (url.endsWith('.mdx')) {
      if (status < 200 || status >= 300) {
        return null;
      }

      const newBody = (await transformMdxToJs(url, body)).code;
      if (newBody) {
        return { body: newBody, contentType: 'text/javascript' };
      }
    }
    return null;
  };
};
