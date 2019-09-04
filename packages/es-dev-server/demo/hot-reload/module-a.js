import './hmr.js';
import { LitElement, html } from 'lit-element';
import './module-b.js';

class ElementA extends LitElement {
  render() {
    return html`
      <element-b message="foo"></element-b>
      <element-b message="bar"></element-b>
      <element-b message="baz"></element-b>
    `;
  }
}

customElements.define('element-a', ElementA);
