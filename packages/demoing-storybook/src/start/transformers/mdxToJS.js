const fs = require('fs');
const createMdxToJsTransformer = require('../../shared/createMdxToJsTransformer');

const transformMdxToJs = createMdxToJsTransformer(true);

module.exports = async function mdxToJS({ url, body }) {
  if (url.endsWith('.mdx')) {
    const filePath = `.${url}`;
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const newBody = (await transformMdxToJs(url, body)).code;
    if (newBody) {
      return { body: newBody, contentType: 'text/javascript' };
    }
  }
  return null;
};
