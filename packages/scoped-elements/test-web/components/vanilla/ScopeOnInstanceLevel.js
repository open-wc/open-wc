import { ScopedElementsMixin } from '../../../html-element.js';

export class ScopeOnInstanceLevel extends ScopedElementsMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set registry(r) {
    this.__registry = r;
  }

  get registry() {
    return this.__registry;
  }
}
