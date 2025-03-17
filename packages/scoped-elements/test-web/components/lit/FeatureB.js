import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';
import { MyButton2 } from '../vanilla/MyButton2.js';

export class FeatureB extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-button': MyButton2,
  };

  render() {
    return html`<my-button></my-button>`;
  }
}
