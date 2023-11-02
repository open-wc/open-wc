import { LitElement, css, html } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';

export class AdoptStyles extends ScopedElementsMixin(LitElement) {
  static styles = css`
    button {
      color: green;
    }
  `;

  render() {
    return html`<button>click</button>`;
  }
}
