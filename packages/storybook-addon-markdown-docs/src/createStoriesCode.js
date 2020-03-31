/** @typedef {import('@mdjs/core').Story} Story */

/**
 * @param {Story[]} stories
 * @returns {string}
 */
function createStoriesCode(stories) {
  let allCode = '';
  for (const story of stories) {
    const { key, name, code } = story;
    if (!key) throw new Error(`Missing key in story`);
    if (!code) throw new Error(`Missing code in story`);

    allCode += `${code}\n`;
    allCode += `${key}.story = ${key}.story || {};\n`;
    allCode += `${name !== key ? `${key}.story.name = ${JSON.stringify(name)};\n` : ''}`;
    allCode += `${key}.story.parameters = ${key}.story.parameters || {};\n`;
    allCode += `${key}.story.parameters.mdxSource = ${JSON.stringify(code.trim())};\n`;
    allCode += '\n';
  }
  return allCode;
}

module.exports = {
  createStoriesCode,
};
