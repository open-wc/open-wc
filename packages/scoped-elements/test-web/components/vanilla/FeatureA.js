import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton1 } from './MyButton1.js';

export class FeatureA extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'my-button': MyButton1,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<my-button></my-button>';
  }
}
