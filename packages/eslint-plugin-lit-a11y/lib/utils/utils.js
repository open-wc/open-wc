/**
 *
 * @param {string[]} attributes - Array of the specific elements' attributes
 * @param {string} attribute - the attribute we want to find
 * @returns {boolean}
 */
function hasAttr(attributes, attribute) {
  return Object.keys(attributes).includes(attribute);
}

function createValidLitHtmlSources(context) {
  return ['lit-html', 'lit-element', ...(context.settings.litHtmlSources || [])];
}

function hasLitHtmlImport(node, validLitHtmlSources) {
  return (
    node.specifiers &&
    // eslint-disable-next-line
    node.specifiers.some(specifier => {
      return (
        specifier.type &&
        specifier.type === 'ImportSpecifier' &&
        specifier.local.name === 'html' &&
        validLitHtmlSources.includes(node.source.value)
      );
    })
  );
}

function prependLitHtmlImport(i) {
  return {
    ...i,
    code: `import {html} from 'lit-html';${i.code}`,
  };
}

module.exports = {
  hasAttr,
  prependLitHtmlImport,
  hasLitHtmlImport,
  createValidLitHtmlSources,
};
