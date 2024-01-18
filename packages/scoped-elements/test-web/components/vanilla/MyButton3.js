import { LitElement } from 'lit';
import { ScopedElementsMixin } from '../../../html-element.js';

export class MyButton3 extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<button>click</button>';
  }
}
