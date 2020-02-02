const { mdjsToCsf } = require('../../index');

module.exports = {
  stories: ['../stories/*.stories.{js,md}'],
  esDevServer: {
    open: true,
    watch: true,
    nodeResolve: true,
    fileExtensions: ['.js', '.mjs', '.md'],
    responseTransformers: [
      async function mdToStory({ url, body }) {
        const cleanURL = url.split('?')[0].split('#')[0];

        if (cleanURL.endsWith('md')) {
          const markdownStory = await mdjsToCsf(body, cleanURL);
          return { body: markdownStory };
        }
      },
    ],
  },
};
