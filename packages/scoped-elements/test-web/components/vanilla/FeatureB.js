import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton2 } from './MyButton2.js';

export class FeatureB extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'my-button': MyButton2,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<my-button></my-button>';
  }
}
