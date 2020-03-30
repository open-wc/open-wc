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
// @ts-ignore
const normalize = require('mdurl/encode');

const { mdjsParse, mdjsStoryParse } = require('@mdjs/core');

/**
 * Keep the code blocks as md source code so storybook will use it's special code block
 *
 * @param {*} h
 * @param {*} node
 */
function code(h, node) {
  const value = node.value ? detab(node.value) : '';
  const raw = ['', `\`\`\`${node.lang}`, value, '```'].join('\n');
  return h.augment(node, u('raw', raw));
}

/**
 * Override image to make it closing `<img src="" />` as otherwise the jsx parser throws
 *
 * @param {*} h
 * @param {*} node
 */
function image(h, node) {
  const attributes = [];
  if (node.title !== null && node.title !== undefined) {
    attributes.push(`title="${node.title}"`);
  }
  if (node.alt !== null && node.alt !== undefined) {
    attributes.push(`alt="${node.alt}"`);
  }
  if (node.url !== null && node.url !== undefined) {
    attributes.push(`src="${normalize(node.url)}"`);
  }

  const raw = `<img ${attributes.join(' ')} />`;
  return h.augment(node, u('raw', raw));
}

/**
 * Override line break to make it closing `<br />` as otherwise the jsx parser throws
 * Can't use 'break' as a function name as it is a reserved javascript language name
 *
 * @param {*} h
 * @param {*} node
 */
function hardBreak(h, node) {
  return [h.augment(node, u('raw', '<br />')), u('text', '\n')];
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
        image,
        break: hardBreak,
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
