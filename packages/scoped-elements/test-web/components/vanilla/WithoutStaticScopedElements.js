import { ScopedElementsMixin } from '../../../html-element.js';

export class WithoutStaticScopedElements extends ScopedElementsMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}
