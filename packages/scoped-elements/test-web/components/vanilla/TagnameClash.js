import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton1, MyButton2 } from './index.js';

export class TagnameClash extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'my-button': MyButton1,
  };

  hasErrored = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    try {
      /** Registers the same tagname as in `static scopedElements`, expect to crash */
      this.registry.define('my-button', MyButton2);
    } catch {
      this.hasErrored = true;
    }
  }
}
