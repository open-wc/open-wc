import { LitElement } from 'lit'; // 17.2k (gzipped: 6.4k)
import { ScopedElementsMixin } from '../lit-element.js';
import { ScopedElementsMixin as HTMLScopedElementsMixin } from '../html-element.js';

/**
 * @typedef {import('../types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('../types.js').ScopedElementsHostConstructor} ScopedElementsHostConstructor
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<ScopedElementsHost>} ConstructorScopedElementsHost
 */

class Button extends HTMLElement {}

class Vanilla extends HTMLScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    ...super.scopedElements,
    'my-button': Button,
  };
}

class Base extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-button': Button,
  };

  constructor() {
    super();
    this.registry = new CustomElementRegistry();
  }
}

class MyElement extends ScopedElementsMixin(Base) {
  static scopedElements = {
    ...super.scopedElements,
    'my-button': Button,
  };

  constructor() {
    super();
    this.registry = new CustomElementRegistry();
  }
}

/**
 * @template {import('@open-wc/dedupe-mixin').Constructor<LitElement>} T
 * @param {T} superclass
 * @returns {T & ConstructorScopedElementsHost & ScopedElementsHostConstructor}
 */
const FooMixin = superclass =>
  class extends ScopedElementsMixin(superclass) {
    static scopedElements = {
      ...super.scopedElements,
      'my-button': Button,
    };

    constructor() {
      super();
      this.registry = new CustomElementRegistry();
    }
  };

class MyElement2 extends FooMixin(ScopedElementsMixin(LitElement)) {
  static scopedElements = {
    ...super.scopedElements,
    'my-button': Button,
  };
}
