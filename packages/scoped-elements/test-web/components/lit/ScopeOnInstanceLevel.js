import { LitElement } from 'lit';
import { ScopedElementsMixin } from '../../../lit-element.js';

export class ScopeOnInstanceLevel extends ScopedElementsMixin(LitElement) {
  set registry(r) {
    this.__registry = r;
  }

  get registry() {
    return this.__registry;
  }
}
