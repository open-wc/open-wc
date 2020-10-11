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

/**
 * @param {MdjsProcessPlugin[]} plugins
 */
function defaultSetupUnifiedPlugins(plugins) {
  return plugins;
}

/**
 * Processes mdjs to html/js/stories
 *
 * Js code includes the linking between js and stories
 *
 * @param {string} mdjs
 * @param {object} options
 * @param {string} [options.rootNodeQueryCode]
 * @param {function | function[]} [options.setupUnifiedPlugins]
 * @param {MdjsProcessPlugin[]} [options.plugins] @deprecated use setupUnifiedPlugins instead
 */
async function mdjsProcess(
  mdjs,
  {
    rootNodeQueryCode = 'document',
    setupUnifiedPlugins = [defaultSetupUnifiedPlugins],
    /** @deprecated */
    plugins = mdjsProcessPlugins,
  } = {},
) {
  const parser = unified();

  let setupPlugins = plugins;
  /** @type {function[]} */
  let userSetupUnifiedPlugins = [];
  if (setupUnifiedPlugins) {
    if (typeof setupUnifiedPlugins === 'function') {
      userSetupUnifiedPlugins = [setupUnifiedPlugins];
    }
    if (Array.isArray(setupUnifiedPlugins)) {
      userSetupUnifiedPlugins = setupUnifiedPlugins;
    }
  }
  for (const setupFn of userSetupUnifiedPlugins) {
    setupPlugins = setupFn(setupPlugins);
  }

  for (const pluginObj of setupPlugins) {
    parser.use(pluginObj.plugin, pluginObj.options);
  }

  /** @type {unknown} */
  const parseResult = await parser.process(mdjs);
  const result = /** @type {ParseResult} */ (parseResult);

  const { stories, jsCode } = result.data;
  let fullJsCode = jsCode;

  if (stories && stories.length > 0) {
    const storiesCode = stories.map(story => story.code).join('\n');

    const codePlugins = setupPlugins.filter(pluginObj =>
      ['markdown', 'remark2rehype', 'rehypePrism', 'htmlStringify'].includes(pluginObj.name),
    );
    const codeParser = unified();
    for (const pluginObj of codePlugins) {
      codeParser.use(pluginObj.plugin, pluginObj.options);
    }

    const invokeStoriesCode = [];
    for (const story of stories) {
      let code;
      switch (story.type) {
        case 'html':
          code = `\`\`\`html\n${story.code.split('`')[1]}\n\`\`\``;
          break;
        case 'js':
          code = `\`\`\`js\n${story.code}\n\`\`\``;
          break;
        default:
          break;
      }
      // eslint-disable-next-line no-await-in-loop
      const codeResult = await codeParser.process(code);
      const highlightedCode = /** @type {string} */ (codeResult.contents)
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$');
      invokeStoriesCode.push(
        `{ key: '${story.key}', story: ${story.key}, code: \`${highlightedCode}\` }`,
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
      `  storyEl.codeHasHtml = true;`,
      `  storyEl.story = story.story;`,
      `  storyEl.code = story.code;`,
      `};`,
      `if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/mdjs-preview.js'); }`,
      `if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/mdjs-story.js'); }`,
    ].join('\n');
  }
  return { stories, jsCode: fullJsCode, html: result.contents };
}

module.exports = {
  mdjsProcess,
  /** @deprecated use setupUnifiedPlugins option on mdjsProcess instead */
  mdjsProcessPlugins,
};
