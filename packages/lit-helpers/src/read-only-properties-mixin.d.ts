// when we update to typescript 3.8
// import type { LitElement } from "lit";
import { LitElement } from "lit";

declare type Constructor<T = {}> = new (...args: any[]) => T;

declare module 'lit-element/lib/updating-element' {
  interface PropertyDeclaration {
    readOnly?: boolean;
  }
}

export interface ReadOnlyClass {
  /**
   * Set read-only properties
   */
  setReadOnlyProperties(props: {
    [s: string]: unknown;
  }): Promise<void>;
}

/**
 * Enables the nofity option for properties to fire change notification events
 */
export declare function ReadOnlyPropertiesMixin<T extends Constructor<LitElement>>(superclass: T): T & Constructor<ReadOnlyClass>;

export {};
