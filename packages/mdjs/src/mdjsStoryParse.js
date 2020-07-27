/** @typedef {import('./types').Story} Story */
/** @typedef {import('./types').StoryTypes} StoryTypes */
/** @typedef {(name: string) => string} TagFunction */
/** @typedef {import('unist').Node} UnistNode */

const visit = require('unist-util-visit');
const { init, parse } = require('es-module-lexer');

/**
 * @typedef {object} MDJSNodeProperties
 * @property {string} value
 * @property {'js'|'ts'|'html'} lang
 * @property {'script'|'story'|'preview-story'} meta
 */

/** @typedef {UnistNode & MDJSNodeProperties} MDJSNode */

/**
 * @param {string} code
 * @param {{type: StoryTypes}} options
 * @returns {Story}
 */
function extractStoryData(code, { type = 'js' } = { type: 'js' }) {
  const parsed = parse(code);
  const key = parsed[1][0];
  const name = key;
  return { key, name, code, type };
}

/**
 * @param {string} name
 */
function defaultStoryTag(name) {
  return `<mdjs-story mdjs-story-name="${name}"></mdjs-story>`;
}

/**
 * @param {string} name
 */
function defaultPreviewStoryTag(name) {
  return `<mdjs-preview mdjs-story-name="${name}"></mdjs-preview>`;
}

/**
 * @param {object} arg
 * @param {TagFunction} [arg.storyTag]
 * @param {TagFunction} [arg.previewStoryTag]
 * @param {number} [arg.counter]
 */
function mdjsStoryParse({
  storyTag = defaultStoryTag,
  previewStoryTag = defaultPreviewStoryTag,
} = {}) {
  /** @type {Story[]} */
  const stories = [];
  let index = 0;

  /* eslint-disable no-param-reassign */
  /** @type {import('unist-util-visit').Visitor<MDJSNode>} node */
  const nodeCodeVisitor = node => {
    if (node.lang === 'js' && node.meta === 'story') {
      const storyData = extractStoryData(node.value);
      node.type = 'html';
      node.value = storyTag(storyData.name);
      stories.push(storyData);
    }
    if (node.lang === 'js' && node.meta === 'preview-story') {
      const storyData = extractStoryData(node.value);
      node.type = 'html';
      node.value = previewStoryTag(storyData.name);
      stories.push(storyData);
    }

    if (node.lang === 'html' && node.meta === 'story') {
      const storyData = extractStoryData(
        `export const HtmlStory${index} = () => html\`${node.value}\`;`,
        { type: 'html' },
      );
      node.type = 'html';
      node.value = storyTag(storyData.name);
      stories.push(storyData);
      index += 1;
    }
    if (node.lang === 'html' && node.meta === 'preview-story') {
      const storyData = extractStoryData(
        `export const HtmlStory${index} = () => html\`${node.value}\`;`,
        { type: 'html' },
      );
      node.type = 'html';
      node.value = previewStoryTag(storyData.name);
      stories.push(storyData);
      index += 1;
    }
  };

  return async (tree, file) => {
    // unifiedjs expects node changes to be made on the given node...
    await init;
    visit(tree, 'code', nodeCodeVisitor);
    // we can only return/modify the tree but stories should not be part of the tree
    // so we attach it globally to the file.data
    file.data.stories = stories;

    return tree;
  };
  /* eslint-enable no-param-reassign */
}

module.exports = {
  mdjsStoryParse,
};
