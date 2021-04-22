/* eslint-disable import/no-extraneous-dependencies */
// @ts-nocheck
import { LitElement, html } from 'lit';

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
