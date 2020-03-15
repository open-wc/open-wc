/** @typedef {import('./types').Story} Story */
/** @typedef {import('./types').ParseResult} ParseResult */
/** @typedef {import('./types').ProcessResult} ProcessResult */

const unified = require('unified');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');
const raw = require('rehype-raw');
const htmlStringify = require('rehype-stringify');
const htmlSlug = require('rehype-slug');
const htmlHeading = require('rehype-autolink-headings');

const { mdjsParse } = require('./mdjsParse.js');
const { mdjsStoryParse } = require('./mdjsStoryParse.js');

async function mdjsProcess(
  mdjs,
  { rootNodeQueryCode = 'document', mdjsStoryParseOptions = {} } = {},
) {
  const parser = unified()
    .use(markdown)
    .use(mdjsParse)
    .use(mdjsStoryParse, mdjsStoryParseOptions)
    .use(remark2rehype, { allowDangerousHTML: true })
    .use(raw)
    .use(htmlSlug)
    .use(htmlHeading)
    .use(htmlStringify);

  /** @type {unknown} */
  const parseResult = await parser.process(mdjs);
  const result = /** @type {ParseResult} */ (parseResult);

  const { stories, jsCode } = result.data;

  const storiesCode = stories.map(story => story.code).join('\n');

  const invokeStoriesCode = [];
  for (const story of stories) {
    invokeStoriesCode.push(
      `{ key: '${story.key}', story: ${story.key}, code: ${story.key.toString()} }`,
    );
  }

  const fullJsCode = [
    `import '@mdjs/mdjs-story/mdjs-story.js';`,
    `import '@mdjs/mdjs-preview/mdjs-preview.js';`,
    jsCode,
    storiesCode,
    `const rootNode = ${rootNodeQueryCode};`,
    `const stories = [${invokeStoriesCode.join(', ')}];`,
    `for (const story of stories) {`,
    // eslint-disable-next-line no-template-curly-in-string
    '  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);',
    `  storyEl.story = story.story;`,
    `  storyEl.code = story.code;`,
    `};`,
  ].join('\n');
  return { stories, jsCode: fullJsCode, html: result.contents };
}

module.exports = {
  mdjsProcess,
};
