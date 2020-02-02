const MagicString = require('magic-string');
const { createOrderedExports } = require('../../shared/createOrderedExports');

/**
 * @param {string[]} storyIds
 */
function injectOrderedExportsPlugin(storyIds) {
  return {
    async transform(code, id) {
      if (!storyIds.includes(id)) {
        return null;
      }
      const orderedExports = await createOrderedExports(code);
      if (!orderedExports) {
        return null;
      }

      // @ts-ignore
      const ms = new MagicString(code);
      ms.append(`\n\n${orderedExports}`);

      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true }),
      };
    },
  };
}

module.exports = { injectOrderedExportsPlugin };
