/**
 * @param {string[]} storyIds
 */
function collectStoryIdsPlugin(storyIds) {
  return {
    name: 'story-ids',
    // query params trip up rollup, so we strip them and remember which imports had them
    /**
     * @param {string} id
     */
    async resolveId(id) {
      const [queryPath, params] = id.split('?');
      if (params && params === 'storybook-story') {
        const resolved = await this.resolveId(queryPath);
        // mutating function parameter on purpose
        storyIds.push(resolved);
        return resolved;
      }

      return null;
    },
  };
}

module.exports = { collectStoryIdsPlugin };
