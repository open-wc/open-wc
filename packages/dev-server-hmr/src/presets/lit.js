const patch = `import { LitElement, adoptStyles } from 'lit';
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

  this.constructor.finalizeStyles();
  if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
    adoptStyles(
      this.renderRoot,
      this.constructor.elementStyles
    );
  }
  this.requestUpdate();
};`;

const lit = {
  decorators: [{ name: 'customElement', import: 'lit' }],
  baseClasses: [{ name: 'LitElement', import: 'lit' }],
  patch,
};

module.exports = { lit };
