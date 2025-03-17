import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';
import { MyButton1 } from '../vanilla/MyButton1.js';

export class FeatureA extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-button': MyButton1,
  };

  render() {
    return html`<my-button></my-button>`;
  }
}
