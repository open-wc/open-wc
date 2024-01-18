import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';
import { MyButton3 } from '../vanilla/MyButton3.js';
import { MyEnhancedButton3 } from '../vanilla/MyEnhancedButton3.js';

export class FeatureC extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-button-3': MyButton3,
    'my-enhanced-button-3': MyEnhancedButton3,
  };

  render() {
    return html`
      <my-button-3></my-button-3>
      <my-enhanced-button-3></my-enhanced-button-3>
    `;
  }
}
