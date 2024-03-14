import { ScopedElementsMixin } from '../../../lit-element.js';
import { MyButton3 } from './MyButton3.js';
import { MyEnhancedButton3 } from './MyEnhancedButton3.js';

export class FeatureC extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'my-button-3': MyButton3,
    'my-enhanced-button-3': MyEnhancedButton3,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML =
      '<my-button-3></my-button-3><my-enhanced-button-3></my-enhanced-button-3>';
  }
}
