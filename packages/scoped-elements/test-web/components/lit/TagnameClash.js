import { LitElement } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';
import { MyButton1, MyButton2 } from '../vanilla/index.js';

export class TagnameClash extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-button': MyButton1,
  };

  hasErrored = false;

  connectedCallback() {
    super.connectedCallback();
    try {
      /** Registers the same tagname as in `static scopedElements`, expect to crash */
      this.registry.define('my-button', MyButton2);
    } catch {
      this.hasErrored = true;
    }
  }
}
