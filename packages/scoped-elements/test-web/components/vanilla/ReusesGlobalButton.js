import { ScopedElementsMixin } from '../../../html-element.js';

export class ReusesGlobalButton extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'globally-defined-button': customElements.get('globally-defined-button'),
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<globally-defined-button></globally-defined-button>';
  }
}
