/** @typedef {import('@mdjs/core').Story} Story */
/** @typedef {import('@mdjs/core').MarkdownResult} MarkdownResult */
/** @typedef {import('@mdjs/core').ParseResult} ParseResult */

const unified = require('unified');
const markdown = require('remark-parse');
// @ts-ignore
const mdSlug = require('remark-slug');
// @ts-ignore
const mdStringify = require('remark-html');
// @ts-ignore
const detab = require('detab');
const u = require('unist-builder');
const visit = require('unist-util-visit-parents');

const { mdjsParse, mdjsStoryParse } = require('@mdjs/core');

/**
 * @param {*} h
 * @param {*} node
 */
function code(h, node) {
  const value = node.value ? detab(node.value) : '';
  const raw = ['', `\`\`\`${node.lang}`, value, '```'].join('\n');
  return h.augment(node, u('raw', raw));
}

function transformPropsHook() {
  // @ts-ignore
  return tree => {
    visit(tree, 'html', (node, ancestors) => {
      // @ts-ignore
      if (node.value.startsWith('<sb-props')) {
        /* eslint-disable no-param-reassign */
        ancestors[1].type = 'html';
        // @ts-ignore
        ancestors[1].value = node.value.replace('<sb-props', '<Props').replace('>', ' />');
        ancestors[1].children = [];
        /* eslint-enable no-param-reassign */
      }
    });
    return tree;
  };
}

/**
 * @param {string} markdownText
 * @returns {Promise<MarkdownResult>}
 */
async function mdjsToMd(markdownText) {
  const parser = unified()
    .use(markdown)
    .use(mdjsParse)
    .use(mdjsStoryParse, {
      storyTag: name => `<Story name="${name}"></Story>`,
      previewStoryTag: name => `<Preview><Story name="${name}"></Story></Preview>`,
    })
    .use(transformPropsHook)
    .use(mdSlug)
    .use(mdStringify, {
      handlers: {
        code,
      },
    });
  /** @type {unknown} */
  const parseResult = await parser.process(markdownText);
  const result = /** @type {ParseResult} */ (parseResult);

  return {
    html: result.contents,
    jsCode: result.data.jsCode,
    stories: result.data.stories,
  };
}

module.exports = { mdjsToMd };
