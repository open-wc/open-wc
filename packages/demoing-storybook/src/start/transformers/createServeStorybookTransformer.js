const { injectStories } = require('../../shared/injectStories');
const { createOrderedExports } = require('../../shared/createOrderedExports');

/**
 * @param {object} args
 * @param {object} args.assets
 * @param {string} args.assets.indexHTML
 * @param {string} args.assets.iframeHTML
 * @param {string} args.previewImport
 * @param {string[]} args.storiesPatterns glob patterns of story files
 * @param {string} args.rootDir
 */
function createServeStorybookTransformer({ assets, previewImport, storiesPatterns, rootDir }) {
  const servedStoryUrls = new Set();
  const { indexHTML, iframeHTML } = assets;

  return async function serveStorybookTransformer({ url, status, body }) {
    const cleanURL = url.split('?')[0].split('#')[0];

    if (cleanURL === '/iframe.html') {
      const { html, storyUrls } = await injectStories({
        iframeHTML,
        previewImport,
        storiesPatterns,
        absolutePath: true,
        rootDir,
      });

      storyUrls.forEach(s => {
        servedStoryUrls.add(s);
      });

      return { body: html, contentType: 'text/html' };
    }

    if (cleanURL === '/' || cleanURL === '/index.html') {
      return { body: indexHTML, contentType: 'text/html' };
    }

    if (status === 200 && servedStoryUrls.has(cleanURL)) {
      const orderedExports = await createOrderedExports(body);
      if (!orderedExports) {
        return null;
      }

      return { body: `${body}\n\n${orderedExports}` };
    }

    return null;
  };
}

module.exports = createServeStorybookTransformer;
