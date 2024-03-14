import { Constructor } from '@open-wc/dedupe-mixin';

export { Constructor };

export type ScopedElementsMap = {
  [key: string]: typeof HTMLElement;
};

export declare class ScopedElementsHost {
  /**
   * Obtains the scoped elements definitions map
   */
  static scopedElements: ScopedElementsMap | undefined;

  /**
   * Obtains the CustomElementRegistry
   */
  registry?: CustomElementRegistry;

  constructor(...args: any[]);
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