import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton1 } from './MyButton1.js';

export class ImperativeDomCreation extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'my-button': MyButton1,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const btn = this.shadowRoot.createElement('my-button');
    this.shadowRoot.appendChild(btn);
  }
}
