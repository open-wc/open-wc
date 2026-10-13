import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { adoptStyles } from 'lit';
import { ScopedElementsMixin as BaseScopedElementsMixin } from './html-element.js';

/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('./types.js').ScopedElementsHostConstructor} ScopedElementsHostConstructor
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<LitElement>} LitElementConstructor
 */

/**
 * @template {LitElementConstructor} T
 * @param {T} superclass
 * @return {T & import('@open-wc/dedupe-mixin').Constructor<ScopedElementsHost> & ScopedElementsHostConstructor}
 */
const ScopedElementsMixinImplementation = superclass =>
  /** @type {ScopedElementsHost} */
  class ScopedElementsHost extends BaseScopedElementsMixin(superclass) {
    createRenderRoot() {
      const { shadowRootOptions, elementStyles } = /** @type {TypeofLitElement} */ (
        this.constructor
      );

      const shadowRoot = this.attachShadow(shadowRootOptions);
      // @ts-ignore
      this.renderOptions.creationScope = shadowRoot;

      adoptStyles(shadowRoot, elementStyles);

      this.renderOptions.renderBefore ??= shadowRoot.firstChild;

      return shadowRoot;
    }
  };

export const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);
