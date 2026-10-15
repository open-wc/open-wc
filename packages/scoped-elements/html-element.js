import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('./types.js').ScopedElementsHostConstructor} ScopedElementsHostConstructor
 */

const version = '3.0.0';
const versions = window.scopedElementsVersions || (window.scopedElementsVersions = []);
if (!versions.includes(version)) {
  versions.push(version);
}

/** @type {boolean|undefined} */
let nativeRegistryOption;

/**
 * Whether `attachShadow` honours the registry under `customElementRegistry`, the name
 * settled on by the final spec.
 *
 * This cannot be answered by feature detection alone. The polyfill replaces the global
 * `CustomElementRegistry` with its own shim and patches `attachShadow` to read the
 * registry from `customElements`/`registry`, stripping those before delegating to the
 * native implementation. It does not strip `customElementRegistry`, so on a browser that
 * supports scoped registries natively, passing that name hands a shim to native
 * `attachShadow`, which rejects it. Passing every name at once therefore throws in
 * exactly the setup this package documents. Probe instead, so that whichever
 * implementation is actually in charge gets the name it understands.
 *
 * @returns {boolean}
 */
const supportsNativeRegistryOption = () => {
  if (nativeRegistryOption === undefined) {
    nativeRegistryOption = false;
    if ('customElementRegistry' in ShadowRoot.prototype) {
      try {
        const probe = document.createElement('div').attachShadow({
          mode: 'open',
          customElementRegistry: new CustomElementRegistry(),
        });
        nativeRegistryOption = probe.customElementRegistry != null;
      } catch {
        // Native `attachShadow` refused the registry object, so the polyfill is in charge.
      }
    }
  }
  return nativeRegistryOption;
};

/**
 * @template {import('./types.js').Constructor<HTMLElement>} T
 * @param {T} superclass
 * @return {T & import('./types.js').Constructor<ScopedElementsHost> & ScopedElementsHostConstructor}
 */
const ScopedElementsMixinImplementation = superclass =>
  /** @type {ScopedElementsHost} */
  class ScopedElementsHost extends superclass {
    /**
     * Obtains the scoped elements definitions map if specified.
     *
     * @type {ScopedElementsMap=}
     */
    static scopedElements;

    static get scopedElementsVersion() {
      return version;
    }

    /** @type {CustomElementRegistry=} */
    static __registry;

    /**
     * Obtains the CustomElementRegistry associated to the ShadowRoot.
     *
     * @returns {CustomElementRegistry=}
     */
    get registry() {
      return /** @type {typeof ScopedElementsHost} */ (this.constructor).__registry;
    }

    /**
     * Set the CustomElementRegistry associated to the ShadowRoot
     *
     * @param {CustomElementRegistry} registry
     */
    set registry(registry) {
      /** @type {typeof ScopedElementsHost} */ (this.constructor).__registry = registry;
    }

    /**
     * @param {ShadowRootInit} options
     * @returns {ShadowRoot}
     */
    attachShadow(options) {
      const { scopedElements } = /** @type {typeof ScopedElementsHost} */ (this.constructor);

      const shouldCreateRegistry =
        !this.registry ||
        // @ts-ignore
        (this.registry === this.constructor.__registry &&
          !Object.prototype.hasOwnProperty.call(this.constructor, '__registry'));

      /**
       * Create a new registry if:
       * - the registry is not defined
       * - this class doesn't have its own registry *AND* has no shared registry
       * This is important specifically for superclasses/inheritance
       */
      if (shouldCreateRegistry) {
        this.registry = new CustomElementRegistry();
        for (const [tagName, klass] of Object.entries(scopedElements ?? {})) {
          this.registry.define(tagName, klass);
        }
      }

      return super.attachShadow({
        ...options,
        ...(supportsNativeRegistryOption()
          ? // The final spec names the option `customElementRegistry`
            { customElementRegistry: this.registry }
          : {
              // The polyfill expects the registry to be passed as `customElements`
              customElements: this.registry,
              // An intermediate version of the proposal renamed it to `registry`, which
              // the polyfill accepts as of 0.0.10. For compatibility, we pass it as both
              registry: this.registry,
            }),
      });
    }
  };

export const ScopedElementsMixin = dedupeMixin(ScopedElementsMixinImplementation);
