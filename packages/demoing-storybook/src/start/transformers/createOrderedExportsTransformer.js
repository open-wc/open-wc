const { createOrderedExports } = require('../../shared/createOrderedExports');

module.exports = function createOrderedExportsTransformer(storyUrls) {
  return async function orderedExportsTransformer({ url, body }) {
    const path = url.split('?')[0].split('#')[0];
    if (storyUrls.includes(path)) {
      const orderedExports = await createOrderedExports(body);
      if (!orderedExports) {
        return null;
      }

      return { body: `${body}\n\n${orderedExports}` };
    }
    return null;
  };
};
