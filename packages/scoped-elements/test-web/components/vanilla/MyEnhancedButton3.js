import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton3 } from './MyButton3.js';

export class MyEnhancedButton3 extends ScopedElementsMixin(MyButton3) {
  connectedCallback() {
    super.connectedCallback();
    const label = document.createElement('label');
    label.textContent = 'The label for my button';
    this.shadowRoot.prepend(label);
  }
}
