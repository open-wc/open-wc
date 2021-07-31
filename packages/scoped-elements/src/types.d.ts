import { Constructor } from '@open-wc/dedupe-mixin';
import { ReactiveElement } from '@lit/reactive-element';

export { Constructor }

export type ScopedElementsMap = {
  [key: string]: typeof HTMLElement;
};

export interface RenderOptions {
  creationScope: Node|ShadowRoot;
  renderBefore: Node|undefined;
}

export declare class ScopedElementsHost {
  constructor(...args: any[]);

  /**
   * Obtains the scoped elements definitions map
   */
  static scopedElements: ScopedElementsMap;

  static shadowRootOptions: ShadowRootInit;

  /**
   * Obtains the CustomElementRegistry
   */
  registry: CustomElementRegistry;

  /**
   * Defines a scoped element inside the CustomElementRegistry bound to the shadowRoot.
   */
  defineScopedElement<T extends HTMLElement>(tagName: string, klass: Constructor<T>): void;

  declare public renderOptions: RenderOptions
}

declare function ScopedElementsMixinImplementation<T extends Constructor<ReactiveElement>>(
  superclass: T,
): T & Constructor<ScopedElementsHost> & typeof ScopedElementsHost;

export type ScopedElementsMixin = typeof ScopedElementsMixinImplementation;

declare global {
  interface ShadowRootInit {
    customElements?: CustomElementRegistry;
  }
}
