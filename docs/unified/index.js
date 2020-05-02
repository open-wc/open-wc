const unified = require('unified');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');
const rehypePrism = require('rehype-prism-template');
const raw = require('rehype-raw');
const htmlStringify = require('rehype-stringify');
const htmlSlug = require('rehype-slug');
const htmlHeading = require('rehype-autolink-headings');
const { mdjsParse } = require('@mdjs/core');

function eleventyUnified(options) {
  const processor = unified()
    .use(markdown)
    .use(mdjsParse)
    .use(remark2rehype, { allowDangerousHTML: true })
    .use(rehypePrism)
    .use(raw)
    .use(htmlSlug)
    .use(htmlHeading, {
      properties: {
        className: ['header-anchor'],
      },
      content: [{ type: 'text', value: '#' }],
    })
    .use(htmlStringify);

  for (let i = 0; i < options.plugins.length; i += 1) {
    processor.use(options.plugins[i]);
  }

  return {
    set: () => {},
    render: async str => {
      const result = await processor.process(str);
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
