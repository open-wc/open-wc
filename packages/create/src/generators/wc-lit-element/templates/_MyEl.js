import { html, css, LitElement } from 'lit-element';

export class <%= className %> extends LitElement {
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
      title: { type: String },
    };
  }

  constructor() {
    super();
    this.title = 'Hello world!';
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <div>
        <slot></slot>
      </div>
    `;
  }
}
