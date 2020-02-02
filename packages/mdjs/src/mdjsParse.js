const visit = require('unist-util-visit');
const remove = require('unist-util-remove');

function mdjsParse() {
  let jsCode = '';
  return (tree, file) => {
    visit(tree, 'code', node => {
      if (node.lang === 'js' && node.meta === 'script') {
        jsCode += node.value;
      }
    });
    // we can only return/modify the tree but jsCode should not be part of the tree
    // so we attach it globally to the file.data
    // eslint-disable-next-line no-param-reassign
    file.data.jsCode = jsCode;

    remove(tree, node => node.type === 'code' && node.lang === 'js' && node.meta === 'script');

    return tree;
  };
}

module.exports = {
  mdjsParse,
};
