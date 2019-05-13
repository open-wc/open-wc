/* eslint-disable */
// @ts-nocheck

const regex = /<script.*<\/script>/g;

module.exports = function(source) {
  const output = source.replace(regex, '');
  return `module.exports = \`${output}\`;`;
};
