/** @typedef {import('./types').Story} Story */
/** @typedef {(name: string) => string} TagFunction */
/** @typedef {import('unist').Node} UnistNode */

const visit = require('unist-util-visit');
const { init, parse } = require('es-module-lexer');

/**
 * @param {string} code
 * @returns {Story}
 */
function extractStoryData(code) {
  const parsed = parse(code);
  const key = parsed[1][0];
  const name = key;
  return { key, name, code };
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

  return async (tree, file) => {
    // unifiedjs expects node changes to be made on the given node...
    /* eslint-disable no-param-reassign */
    await init;
    visit(tree, 'code', node => {
      if (node.lang === 'js' && node.meta === 'story') {
        // @ts-ignore
        const storyData = extractStoryData(node.value);
        node.type = 'html';
        node.value = storyTag(storyData.name);
        stories.push(storyData);
      }
      if (node.lang === 'js' && node.meta === 'preview-story') {
        // @ts-ignore
        const storyData = extractStoryData(node.value);
        node.type = 'html';
        node.value = previewStoryTag(storyData.name);
        stories.push(storyData);
      }
    });
    // we can only return/modify the tree but stories should not be part of the tree
    // so we attach it globally to the file.data
    file.data.stories = stories;

    return tree;
    /* eslint-enable no-param-reassign */
  };
}

module.exports = {
  mdjsStoryParse,
};
