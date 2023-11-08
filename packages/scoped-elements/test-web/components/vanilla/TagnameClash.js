import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton1 } from './MyButton1.js';
import { MyButton2 } from './MyButton2.js';

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
