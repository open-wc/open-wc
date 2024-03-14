
import { LitElement } from 'lit';
import { ScopedElementsHostConstructor, ScopedElementsMap, ScopedElementsMixin } from '../../../lit-element.js';
import { MyButton1 } from './MyButton1.js';
import { ScopedElementsHost } from '../../../types.js';

export class FeatureA0 extends LitElement {  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.shadowRoot!.innerHTML = '<button></button>';
  }
}

export class FeatureA extends ScopedElementsMixin(FeatureA0) {
  static scopedElements = {
    // Note this line does not generate error anymore
    ...super.scopedElements,
    'my-button': MyButton1,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = '<my-button></my-button>';
  }
}
