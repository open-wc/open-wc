module.exports = function createServePreviewTransformer(assets) {
  /**
   * Serve preview from a transformer, so that it will be picked up by
   * compatibility mode.
   */
  return function servePreviewTransformer({ url }) {
    const cleanURL = url.split('?')[0].split('#')[0];

    if (cleanURL === '/iframe.html') {
      return { body: assets.iframeHTML, contentType: 'text/html' };
    }

    return null;
  };
};
