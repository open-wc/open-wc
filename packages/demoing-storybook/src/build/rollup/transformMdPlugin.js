const { mdjsToCsf } = require('storybook-addon-markdown-docs');
const { transformMdxToCsf } = require('../../shared/transformMdxToCsf');

/**
 * @param {string[]} storyIds
 * @param {object} options
 */
function transformMdPlugin(storyIds, options) {
  return {
    transform(code, id) {
      if (!storyIds.includes(id)) {
        return null;
      }

      if (id.endsWith('.mdx')) {
        return transformMdxToCsf(code, id);
      }

      if (id.endsWith('.md')) {
        return mdjsToCsf(code, id, options);
      }
      return null;
    },
  };
}

module.exports = { transformMdPlugin };
