const { WC_HMR_MODULE_RUNTIME } = require('../constants');

const patch = `import { LitElement } from 'lit-element';
import { updateClassMembers } from '${WC_HMR_MODULE_RUNTIME}';
const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
  (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
  ('adoptedStyleSheets' in Document.prototype) &&
  ('replace' in CSSStyleSheet.prototype);

// static callback
LitElement.hotReplaceCallback = function hotReplaceCallback(newClass) {
  newClass.finalize();
  updateClassMembers(this, newClass);
  this.finalize();
};

// instance callback
LitElement.prototype.hotReplaceCallback = function hotReplaceCallback() {
  if (!supportsAdoptingStyleSheets) {
    const nodes = Array.from(this.renderRoot.children);
    for (const node of nodes) {
      if (node.tagName.toLowerCase() === 'style') {
        node.remove();
      }
    }
  }

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
