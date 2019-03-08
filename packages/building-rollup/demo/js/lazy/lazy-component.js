/* eslint-disable */
import { LitElement, html, css } from 'lit-element';

import('./import-meta/meta-url-test-4.js');

console.log(
  'lazy-component.js import.meta.url correct: ' +
    import.meta.url.endsWith('/demo/lazy/lazy-component.js'),
  import.meta.url,
);

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
