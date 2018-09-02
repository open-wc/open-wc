import { html, render } from 'lit-html';

export default class <%= props.className %> extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.header = 'My Example';
  }

  connectedCallback() {
    this.update();
  }

  update() {
    render(this.renderShadowDom(), this.shadowRoot);
  }

  renderShadowDom() {
    return html`
      <style>
        :host {
          background: grey;
          display: block;
          padding: 25px;
        }

        h1 {
          color: white;
          font-size: 25px;
          margin: 0;
        }

        :host(.right)  {
          background: green;
          text-align: right;
        }

        :host(.right) h1 {
          color: orange;
          text-align: right;
        }

        :host(.right) div {
          text-align: right;
        }
      </style>
      <h1>${this.header}</h1>
      <div>
        <slot></slot>
      </div>
    `;
  }
}
