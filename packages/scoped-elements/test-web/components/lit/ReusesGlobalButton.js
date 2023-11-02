import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';

export class ReusesGlobalButton extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'globally-defined-button': customElements.get('globally-defined-button'),
  };

  render() {
    return html`<globally-defined-button></globally-defined-button>`;
  }
}
