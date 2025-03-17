import { ScopedElementsMixin } from '../../../html-element.js';
import { MyButton1 } from './MyButton1.js';

export class ScopeTagnameThatIsGloballyUsed extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'globally-defined-button': MyButton1,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<globally-defined-button></globally-defined-button>';
  }
}
