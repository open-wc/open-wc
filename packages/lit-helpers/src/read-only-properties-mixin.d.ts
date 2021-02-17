import type { LitElement, Constructor } from "lit-element";

declare module 'lit-element/lib/updating-element' {
  interface PropertyDeclaration {
    readOnly?: boolean;
  }
}

/**
 * Enables the optional readOnly property on property declarations, 
 * and adds `setReadOnlyProperties(properties)` to elements
 */
export declare function ReadOnlyPropertiesMixin<T extends Constructor<LitElement>>(superclass: T): T & Constructor<{
  /**
   * Set read-only properties
   * @protected
   */
  setReadOnlyProperties(props: {
    [s: string]: unknown;
  }): Promise<void>;
}>;

export {};
