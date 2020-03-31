const { mdjsToCsf } = require('storybook-addon-markdown-docs');
const { transformMdxToCsf } = require('../../shared/transformMdxToCsf');

/**
 * @param {string[]} storyIds
 * @param {boolean} experimentalMdDocs
 */
function transformMdxPlugin(storyIds, experimentalMdDocs) {
  return {
    transform(code, id) {
      if (!storyIds.includes(id)) {
        return null;
      }

      if (id.endsWith('.mdx')) {
        return transformMdxToCsf(code, id);
      }

      if (experimentalMdDocs && id.endsWith('.md')) {
        return mdjsToCsf(code, id);
      }
      return null;
    },
  };
}

module.exports = { transformMdxPlugin };
