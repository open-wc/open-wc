/** @typedef {import('./types').Story} Story */
/** @typedef {import('./types').ParseResult} ParseResult */
/** @typedef {import('./types').ProcessResult} ProcessResult */
/** @typedef {import('./types').MdjsProcessPlugin} MdjsProcessPlugin */

const unified = require('unified');
const markdown = require('remark-parse');
const remark2rehype = require('remark-rehype');
const raw = require('rehype-raw');
const htmlStringify = require('rehype-stringify');
const htmlSlug = require('rehype-slug');
const htmlHeading = require('rehype-autolink-headings');
const rehypePrism = require('rehype-prism-template');

const { mdjsParse } = require('./mdjsParse.js');
const { mdjsStoryParse } = require('./mdjsStoryParse.js');

/** @type {MdjsProcessPlugin[]} */
const mdjsProcessPlugins = [
  { name: 'markdown', plugin: markdown },
  { name: 'mdjsParse', plugin: mdjsParse },
  { name: 'mdjsStoryParse', plugin: mdjsStoryParse },
  { name: 'remark2rehype', plugin: remark2rehype, options: { allowDangerousHTML: true } },
  { name: 'rehypePrism', plugin: rehypePrism },
  { name: 'raw', plugin: raw },
  { name: 'htmlSlug', plugin: htmlSlug },
  { name: 'htmlHeading', plugin: htmlHeading },
  { name: 'htmlStringify', plugin: htmlStringify },
];

async function mdjsProcess(
  mdjs,
  { rootNodeQueryCode = 'document', plugins = mdjsProcessPlugins } = {},
) {
  const parser = unified();
  for (const pluginObj of plugins) {
    parser.use(pluginObj.plugin, pluginObj.options);
  }

  /** @type {unknown} */
  const parseResult = await parser.process(mdjs);
  const result = /** @type {ParseResult} */ (parseResult);

  const { stories, jsCode } = result.data;
  let fullJsCode = '';

  if (stories.length > 0) {
    const storiesCode = stories.map(story => story.code).join('\n');

    const invokeStoriesCode = [];
    for (const story of stories) {
      invokeStoriesCode.push(
        `{ key: '${story.key}', story: ${story.key}, code: ${story.key.toString()} }`,
      );
    }

    fullJsCode = [
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
  }
  return { stories, jsCode: fullJsCode, html: result.contents };
}

module.exports = {
  mdjsProcess,
  mdjsProcessPlugins,
};
