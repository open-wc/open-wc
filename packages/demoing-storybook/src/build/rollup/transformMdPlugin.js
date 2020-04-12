const { mdjsToCsf } = require('storybook-addon-markdown-docs');
const { transformMdxToCsf } = require('../../shared/transformMdxToCsf');

/**
 * @param {string[]} storyIds
 */
function transformMdPlugin(storyIds) {
  return {
    transform(code, id) {
      if (!storyIds.includes(id)) {
        return null;
      }

      if (id.endsWith('.mdx')) {
        return transformMdxToCsf(code, id);
      }

      if (id.endsWith('.md')) {
        return mdjsToCsf(code, id);
      }
      return null;
    },
  };
}

module.exports = { transformMdPlugin };
