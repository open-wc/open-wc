import TreeAdapter from 'parse5-htmlparser2-tree-adapter';

/**
 * @param {TreeAdapter.Node} node
 * @return {node is TreeAdapter.TextNode}
 */
function isTextNode(node) {
  return TreeAdapter.isTextNode(node);
}

export { isTextNode };
