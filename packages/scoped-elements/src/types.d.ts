import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit-element';

export type ScopedElementsMap = {
  [key: string]: typeof HTMLElement;
};

export declare class ScopedElementsHost {
  constructor(...args: any[]);
  /**
   * Obtains the scoped elements definitions map
   */
  static scopedElements: ScopedElementsMap;

  /**
   * Returns a scoped tag name
   */
  static getScopedTagName(tagName: string): string;

  /**
   * Returns a scoped tag name
   */
  getScopedTagName(tagName: string): string;

  /**
   * Defines a scoped element
   */
  defineScopedElement<T extends HTMLElement>(tagName: string, klass: Constructor<T>): void;
}

declare function ScopedElementsMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<ScopedElementsHost> & typeof ScopedElementsHost;

export type ScopedElementsMixin = typeof ScopedElementsMixinImplementation;
