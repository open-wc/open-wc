/* eslint-disable class-methods-use-this, import/no-extraneous-dependencies */
import { LitElement, html, css } from 'lit-element';
import './import-meta/meta-url-test-2.js';

console.log('file name should end with demo/lazy/import-meta/lazy-component.js', import.meta.url);

class LazyComponent extends LitElement {
  static get styles() {
    return css`
      p {
        color: red;
      }
    `;
  }

  render() {
    return html`
      <p>Hello from lazy loaded component</p>
    `;
  }
}

customElements.define('lazy-component', LazyComponent);
