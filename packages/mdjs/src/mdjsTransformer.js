const { mdjsDocPage } = require('./mdjsDocPage.js');

async function mdjsTransformer({ url, body }) {
  if (url.endsWith('.md')) {
    return {
      body: await mdjsDocPage(body),
      contentType: 'text/html',
    };
  }
  return null;
}

module.exports = {
  mdjsTransformer,
};
