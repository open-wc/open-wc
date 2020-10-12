/**
 * @template {'html'|'svg'|'css'} Name
 * @typedef {import('estree').TaggedTemplateExpression & { tag: { type: 'Identifier'; name: Name } }} LitTaggedExpression
 */

/**
 * Whether a node is a lit-element css-tagged template expression
 * @param {import('eslint').Rule.Node} node
 * @returns {node is LitTaggedExpression<'css'>}
 */
function isCssTaggedTemplate(node) {
  return (
    node.type === 'TaggedTemplateExpression' &&
    node.tag.type === 'Identifier' &&
    node.tag.name === 'css'
  );
}

/**
 * Whether a node is a lit-html html-tagged template expression
 * @param {import('eslint').Rule.Node} node
 * @returns {node is LitTaggedExpression<'html'>}
 */
function isHtmlTaggedTemplate(node) {
  return (
    node.type === 'TaggedTemplateExpression' &&
    node.tag.type === 'Identifier' &&
    node.tag.name === 'html'
  );
}

/**
 * Whether a node is a lit-html svg-tagged template expression
 * @param {import('eslint').Rule.Node} node
 * @returns {node is LitTaggedExpression<'svg'>}
 */
function isSvgTaggedTemplate(node) {
  return (
    node.type === 'TaggedTemplateExpression' &&
    node.tag.type === 'Identifier' &&
    node.tag.name === 'svg'
  );
}

module.exports = {
  isCssTaggedTemplate,
  isHtmlTaggedTemplate,
  isSvgTaggedTemplate,
};
