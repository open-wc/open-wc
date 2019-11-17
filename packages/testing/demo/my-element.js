/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html } from 'lit-element';

class MyElement extends LitElement {
  static get properties() {
    return {
      message: { type: String },
    };
  }

  async getMessage() {
    const response = await fetch(new URL('./my-file.txt', import.meta.url).toString());
    this.message = await response.text();
  }

  render() {
    return html`
      <h1>My Element</h1>

      <p>${this.message}</p>
    `;
  }
}

customElements.define('my-element', MyElement);
