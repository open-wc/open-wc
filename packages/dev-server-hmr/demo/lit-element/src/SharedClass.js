import { html, css, LitElement } from 'lit-element';

export class SharedClass extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 1px solid black;
      margin: 16px 0;
      padding: 0 8px;
      width: 200px;
    }
  `;

  sharedTemplate() {
    return html`<p>Shared class</p>`;
  }
}
