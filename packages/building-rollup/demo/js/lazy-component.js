import { LitElement, html, css } from 'lit-element';

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
      <p>Lazy component</p>
    `;
  }
}

customElements.define('lazy-component', LazyComponent);
