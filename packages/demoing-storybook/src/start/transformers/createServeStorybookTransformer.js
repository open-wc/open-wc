module.exports = function createServeStorybookTransformer(assets) {
  return function serveStorybookTransformer({ url }) {
    const cleanURL = url.split('?')[0].split('#')[0];

    if (cleanURL === '/iframe.html') {
      return { body: assets.iframeHTML, contentType: 'text/html' };
    }

    if (cleanURL === '/' || cleanURL === '/index.html') {
      return { body: assets.indexHTML, contentType: 'text/html' };
    }

    return null;
  };
};
