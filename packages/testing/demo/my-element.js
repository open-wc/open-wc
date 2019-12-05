/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      message: { type: String },
    };
  }

  render() {
    return html`
      <h1>My Element</h1>

      <p>${this.message}</p>
    `;
  }
}

customElements.define('my-element', MyElement);
