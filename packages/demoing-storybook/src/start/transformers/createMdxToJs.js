const createMdxToJsTransformer = require('../../shared/createMdxToJsTransformer');

module.exports = function createMdxToJs({ previewImport }) {
  const transformMdxToJs = createMdxToJsTransformer({ previewImport });

  return async function mdxToJS({ url, body, status }) {
    const path = url.split('?')[0].split('#')[0];

    if (path.endsWith('.mdx')) {
      if (status < 200 || status >= 300) {
        return null;
      }

      const newBody = (await transformMdxToJs(path, body)).code;
      if (newBody) {
        return { body: newBody, contentType: 'text/javascript' };
      }
    }
    return null;
  };
};
