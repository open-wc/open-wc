const patch = `import { LitElement } from 'lit-element';
const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
  (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
  ('adoptedStyleSheets' in Document.prototype) &&
  ('replace' in CSSStyleSheet.prototype);

// static callback
LitElement.hotReplacedCallback = function hotReplacedCallback() {
  this.finalize();
};

// instance callback
LitElement.prototype.hotReplacedCallback = function hotReplacedCallback() {
  if (!supportsAdoptingStyleSheets) {
    const nodes = Array.from(this.renderRoot.children);
    for (const node of nodes) {
      if (node.tagName.toLowerCase() === 'style') {
        node.remove();
      }
    }
  }

  // delete styles to ensure that they get recalculated, including picking up
  // changes from parent classes
  delete this.constructor._styles;
  this.constructor._getUniqueStyles();
  if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
    this.adoptStyles();
  }
  this.requestUpdate();
};`;

const litElement = {
  decorators: [{ name: 'customElement', import: 'lit-element' }],
  baseClasses: [{ name: 'LitElement', import: 'lit-element' }],
  patch,
};

module.exports = { litElement };
