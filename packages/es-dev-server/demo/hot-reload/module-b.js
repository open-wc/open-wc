import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      message: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid black;
        color: blue;
        padding: 6px;
      }
    `;
  }

  render() {
    return html`
      <p>Message: ${this.message}</p>
    `;
  }
}

customElements.define('element-b', MyElement);