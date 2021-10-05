import '@webcomponents/scoped-custom-element-registry';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { adoptStyles } from '@lit/reactive-element/css-tag.js';

/**
 * @typedef {import('./types').RenderOptions} RenderOptions
 * @typedef {import('./types').ScopedElementsMixin} ScopedElementsMixin
 * @typedef {import('./types').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('@lit/reactive-element').CSSResultOrNative} CSSResultOrNative
 */

/**
 * @template {import('./types').Constructor<HTMLElement>} T
 * @param {T} superclass
 * @return {T & import('./types').Constructor<ScopedElementsHost>}
 */
const ScopedElementsMixinImplementation = superclass =>
  /** @type {ScopedElementsHost} */
  class ScopedElementsHost extends superclass {
    /**
     * Obtains the scoped elements definitions map if specified.
     *
     * @returns {ScopedElementsMap}
     */
    static get scopedElements() {
      return {};
    }

    /**
     * Obtains the ShadowRoot options.
     *
     * @type {ShadowRootInit}
     */
    static get shadowRootOptions() {
      return this.__shadowRootOptions;
    }

    /**
     * Set the shadowRoot options.
     *
     * @param {ShadowRootInit} value
     */
    static set shadowRootOptions(value) {
      this.__shadowRootOptions = value;
    }

    /**
     * Obtains the element styles.
     *
     * @returns {CSSResultOrNative[]}
     */
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
     * Obtains the CustomElementRegistry associated to the ShadowRoot.
     *
     * @returns {CustomElementRegistry}
     */
    get registry() {
      // @ts-ignore
      return this.constructor.__registry;
    }

    /**
     * Set the CustomElementRegistry associated to the ShadowRoot
     *
     * @param {CustomElementRegistry} registry
     */
    set registry(registry) {
      // @ts-ignore
      this.constructor.__registry = registry;
    }

    /** @override */
    createRenderRoot() {
      const {
        scopedElements,
        shadowRootOptions,
        elementStyles,
      } = /** @type {typeof ScopedElementsHost} */ (this.constructor);

      if (!this.registry) {
        this.registry = new CustomElementRegistry();

        Object.entries(scopedElements).forEach(([tagName, klass]) =>
          this.registry.define(tagName, klass),
        );
      }

      /** @type {ShadowRootInit} */
      const options = {
        mode: 'open',
        ...shadowRootOptions,
        customElements: this.registry,
      };

      this.renderOptions.creationScope = this.attachShadow(options);

      if (this.renderOptions.creationScope instanceof ShadowRoot) {
        adoptStyles(this.renderOptions.creationScope, elementStyles);

        this.renderOptions.renderBefore =
          this.renderOptions.renderBefore || this.renderOptions.creationScope.firstChild;
      }

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
     *
     * @param {string} tagName
     * @returns {string} the tag name
     */
    // eslint-disable-next-line class-methods-use-this
    getScopedTagName(tagName) {
      return tagName;
    }

    /**
     * @deprecated use the native el.tagName instead
     *
     * @param {string} tagName
     * @returns {string} the tag name
     */
    // eslint-disable-next-line class-methods-use-this
    static getScopedTagName(tagName) {
      return tagName;
    }
  };

export const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);
