import { Constructor } from '@open-wc/dedupe-mixin';

export { Constructor };

export type ScopedElementsMap = {
  [key: string]: typeof HTMLElement;
};

/**
 * Static interface for the ScopedElementsHost class.
 * This is used to properly type the constructor side (static properties).
 */
export interface ScopedElementsHostConstructor {
  scopedElements?: ScopedElementsMap;
}

/**
 * Instance interface for the ScopedElementsHost class.
 */
export declare class ScopedElementsHost {
  /**
   * Obtains the CustomElementRegistry
   */
  registry?: CustomElementRegistry;
}

declare global {
  interface ShadowRootInit {
    // The polyfill currently expects the registry to be passed as `customElements`
    customElements?: CustomElementRegistry;
    // But the proposal has moved forward, and renamed it to `registry`
    // For backwards compatibility, we pass it as both
    registry?: CustomElementRegistry;
  }

  interface ShadowRoot {
    customElements?: CustomElementRegistry;
    registry?: CustomElementRegistry;
  }

  interface Window {
    scopedElementsVersions: string[]
  }
}