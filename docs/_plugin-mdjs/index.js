/* eslint-disable import/no-extraneous-dependencies */
const { mdjsProcess, mdjsProcessPlugins } = require('@mdjs/core');

const plugins = mdjsProcessPlugins.map(pluginObj => {
  if (pluginObj.name === 'htmlHeading') {
    return {
      ...pluginObj,
      options: {
        properties: {
          className: ['header-anchor'],
        },
        content: [{ type: 'text', value: '#' }],
      },
    };
  }
  return pluginObj;
});

function eleventyUnified() {
  return {
    set: () => {},
    render: async str => {
      const result = await mdjsProcess(str, {
        plugins,
      });
      return result;
    },
  };
}

const defaultEleventyUnifiedOptions = {
  plugins: [],
};

const _eleventy = {
  initArguments: {},
  configFunction: (eleventyConfig, pluginOptions = {}) => {
    const options = {
      ...defaultEleventyUnifiedOptions,
      ...pluginOptions,
    };
    eleventyConfig.setLibrary('md', eleventyUnified(options));
  },
};

module.exports = _eleventy;
