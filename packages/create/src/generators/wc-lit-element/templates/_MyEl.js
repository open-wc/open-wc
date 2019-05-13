import { html, css, LitElement } from 'lit-element';

export default class <%= className %> extends LitElement {
  static get styles() {
    return css`
      :host {
        background: grey;
        display: block;
        padding: 25px;
      }
    `;
  }

  static get properties() {
    return {
      heading: { type: String }
    }
  }

  constructor() {
    super();
    this.heading = 'Hello world!';
  }

  render() {
    return html`
      <h2>${this.heading}</h2>
      <div>
        <slot></slot>
      </div>
    `;
  }
}
