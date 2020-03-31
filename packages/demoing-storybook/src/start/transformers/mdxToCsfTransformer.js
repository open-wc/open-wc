const { transformMdxToCsf } = require('../../shared/transformMdxToCsf');

async function mdxToCsfTransformer({ url, body, status }) {
  const path = url.split('?')[0].split('#')[0];

  if (path.endsWith('.mdx')) {
    if (status < 200 || status >= 300) {
      return null;
    }

    const newBody = (await transformMdxToCsf(body, path)).code;
    if (newBody) {
      return { body: newBody, contentType: 'text/javascript' };
    }
  }
  return null;
}

module.exports = { mdxToCsfTransformer };
