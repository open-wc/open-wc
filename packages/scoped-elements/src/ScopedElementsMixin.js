import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { adoptStyles } from '@lit/reactive-element/css-tag.js';

/**
 * @typedef {import('./types').RenderOptions} RenderOptions
 * @typedef {import('./types').ScopedElementsMixin} ScopedElementsMixin
 * @typedef {import('./types').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('@lit/reactive-element').CSSResultFlatArray} CSSResultFlatArray
 */

/**
 * @template {import('./types').Constructor<HTMLElement>} T
 * @param {T} superclass
 * @return {T & import('./types').Constructor<ScopedElementsHost>}
 */
const ScopedElementsMixinImplementation = superclass =>
  /** @type {ScopedElementsMixin} */
  class ScopedElementsHost extends superclass {
    /**
     * Obtains the scoped elements definitions map if specified.
     *
     * @returns {ScopedElementsMap}
     */
    static get scopedElements() {
      return {};
    }

    /** @type {ShadowRootInit} */
    static get shadowRootOptions() {
      return this.__shadowRootOptions;
    }

    /** @type {ShadowRootInit} */
    static set shadowRootOptions(value) {
      this.__shadowRootOptions = value;
    }

    /** @type {CSSResultFlatArray} */
    static get elementStyles() {
      return this.__elementStyles;
    }

    static set elementStyles(styles) {
      this.__elementStyles = styles;
    }

    // either TS or ESLint will complain here
    // eslint-disable-next-line no-unused-vars
    constructor(..._args) {
      super();
      /** @type {RenderOptions} */
      this.renderOptions = this.renderOptions || undefined;
    }

    /**
     * Obtains the CustomElementRegistry if specified.
     *
     * @return {CustomElementRegistry}
     */
    get registry() {
      if (!this._registry) {
        this._registry = new CustomElementRegistry();
      }

      return this._registry;
    }

    createRenderRoot() {
      const {
        scopedElements,
        shadowRootOptions,
        elementStyles,
      } = /** @type {typeof ScopedElementsHost} */ (this.constructor);

      Object.entries(scopedElements).forEach(([tagName, klass]) =>
        this.registry.define(tagName, klass),
      );

      /** @type {ShadowRootInit} */
      const options = {
        mode: 'open',
        ...shadowRootOptions,
        customElements: this.registry,
      };

      this.renderOptions.creationScope = this.attachShadow(options);

      if (this.renderOptions.creationScope instanceof ShadowRoot)
        adoptStyles(this.renderOptions.creationScope, elementStyles);

      return this.renderOptions.creationScope;
    }

    /**
     * Defines a scoped element.
     *
     * @param {string} tagName
     * @param {typeof HTMLElement} klass
     */
    defineScopedElement(tagName, klass) {
      return this.registry.get(tagName) || this.registry.define(tagName, klass);
    }

    /**
     * @deprecated use the native el.tagName instead
     * @returns {string} the tag name in lowercase
     */
    getScopedTagName() {
      return this.tagName.toLowerCase();
    }
  };

export const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);
