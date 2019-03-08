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
      header: { type: String }
    }
  }

  constructor() {
    super();
    this.header = 'My Example';
  }

  render() {
    return html`
      <h2>${this.header}</h2>
      <div>
        <slot></slot>
      </div>
    `;
  }
}
