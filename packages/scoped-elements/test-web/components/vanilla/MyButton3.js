import { ScopedElementsMixin } from '../../../html-element.js';

export class MyButton3 extends ScopedElementsMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<button>click</button>';
  }
}
