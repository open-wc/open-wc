/** @typedef {import('@mdjs/core').Story} Story */
/** @typedef {import('@mdjs/core').MarkdownResult} MarkdownResult */
/** @typedef {import('@mdjs/core').ParseResult} ParseResult */
/** @typedef {import('@mdjs/core').MdjsProcessPlugin} MdjsProcessPlugin */

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

/**
 * Override hr to make it closing `<hr />` as otherwise the jsx parser throws
 *
 * @param {*} h
 * @param {*} node
 */
function thematicBreak(h, node) {
  return h.augment(node, u('raw', `<hr />`));
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
 * @param {string} name
 */
function storyTag(name) {
  return `<Story name="${name}"></Story>`;
}

/**
 * @param {string} name
 */
function previewStoryTag(name) {
  return `<Preview><Story name="${name}"></Story></Preview>`;
}

/** @type {MdjsProcessPlugin[]} */
const mdjsToMdPlugins = [
  { name: 'markdown', plugin: markdown },
  { name: 'mdjsParse', plugin: mdjsParse },
  {
    name: 'mdjsStoryParse',
    plugin: mdjsStoryParse,
    options: {
      storyTag,
      previewStoryTag,
    },
  },
  { name: 'transformPropsHook', plugin: transformPropsHook },
  { name: 'mdSlug', plugin: mdSlug },
  {
    name: 'mdStringify',
    plugin: mdStringify,
    options: {
      sanitize: false,
      handlers: {
        code,
        image,
        break: hardBreak,
        thematicBreak,
      },
    },
  },
];

/**
 * @param {MdjsProcessPlugin[]} plugins
 * @param {string=} filePath
 */
// eslint-disable-next-line no-unused-vars
function defaultSetupMdjsPlugins(plugins, filePath = '') {
  return plugins;
}

/**
 * @param {string} markdownText
 * @returns {Promise<MarkdownResult>}
 */
async function mdjsToMd(
  markdownText,
  { filePath = '', setupMdjsPlugins = defaultSetupMdjsPlugins } = {},
) {
  const plugins = setupMdjsPlugins(mdjsToMdPlugins, filePath);
  const parser = unified();
  for (const pluginObj of plugins) {
    parser.use(pluginObj.plugin, pluginObj.options);
  }
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
