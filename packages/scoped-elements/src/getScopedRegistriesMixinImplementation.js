import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('./types').ScopedElementsMixin} ScopedElementsMixin
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 */

export const getScopedRegistriesMixinImplementation = () => {
  /** @type {ScopedElementsMixin} */
  const ScopedRegistriesMixinImplementation = superclass =>
    class ScopedElementsHost extends superclass {
      /**
       * Obtains the scoped elements definitions map
       *
       * @returns {ScopedElementsMap}
       */
      static get scopedElements() {
        return {};
      }

      /**
       * Returns a scoped tag name
       *
       * @deprecated Please, use the instance method instead of the static one. This static method is not able to
       * obtain the tagName of lazy defined elements, while the instance one is.
       * @param {string} tagName
       * @returns {string|undefined}
       */
      static getScopedTagName(tagName) {
        return tagName;
      }

      constructor() {
        super();

        // @ts-ignore
        const { scopedElements } = this.constructor;

        Object.entries(scopedElements).forEach(([tagName, klass]) =>
          this.registry.define(tagName, klass),
        );
      }

      createRenderRoot() {
        this.registry = new CustomElementRegistry();

        return this.attachShadow({
          mode: 'open',
          customElements: this.registry,
        });
      }

      /**
       * Defines a scoped element
       *
       * @param {string} tagName
       * @param {typeof HTMLElement} klass
       */
      defineScopedElement(tagName, klass) {
        return this.registry.define(tagName, klass);
      }

      /**
       * Returns a scoped tag name
       *
       * @param {string} tagName
       * @returns {string|undefined}
       */
      // eslint-disable-next-line class-methods-use-this
      getScopedTagName(tagName) {
        return tagName;
      }
    };

  return dedupeMixin(ScopedRegistriesMixinImplementation);
};
