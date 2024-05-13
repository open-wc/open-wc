import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton1 } from './MyButton1.js';

export class ConstructorClash extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'my-button-1': MyButton1,
  };

  hasErrored = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    try {
      /** Registers the same constructor as in `static scopedElements`, expect to crash */
      this.registry.define('my-button-2', MyButton1);
    } catch {
      this.hasErrored = true;
    }
  }
}
