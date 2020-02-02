const { mdjsToCsf } = require('storybook-addon-markdown-docs');

/**
 * @param {object} params
 * @param {string} params.body
 * @param {string} params.url
 * @param {number} params.status
 */
async function mdjsToCsfTransformer({ url, body, status }) {
  if (status < 200 || status >= 300) {
    return null;
  }

  const split = url.split('?');
  const path = split[0].split('#')[0];

  if (!path.endsWith('.md')) {
    return null;
  }

  const searchParams = split[1];
  if (!searchParams || !searchParams.startsWith('storybook-story')) {
    return null;
  }

  const markdownStory = await mdjsToCsf(body, path);

  return { body: markdownStory };
}

module.exports = mdjsToCsfTransformer;
