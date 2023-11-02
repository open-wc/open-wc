import { LitElement } from 'lit';
import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton1 } from '../vanilla/index.js';

export class ConstructorClash extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-button-1': MyButton1,
  };

  hasErrored = false;

  connectedCallback() {
    super.connectedCallback();
    try {
      /** Registers the same constructor as in `static scopedElements`, expect to crash */
      this.registry.define('my-button-2', MyButton1);
    } catch {
      this.hasErrored = true;
    }
  }
}
