/**
 * @typedef {import('./types').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 */
/**
 * @template {import('./types').Constructor<LitElement>} T
 * @param {T} superclass
 * @return {T & import('./types').Constructor<ScopedElementsHost>}
 */
export function ScopedElementsMixin<T extends import("@open-wc/dedupe-mixin").Constructor<import("lit").LitElement>>(superclass: T): T & import("@open-wc/dedupe-mixin").Constructor<import("./types").ScopedElementsHost>;
export type ScopedElementsHost = import('./types').ScopedElementsHost;
export type ScopedElementsMap = import('./types').ScopedElementsMap;
export type CSSResultOrNative = import('lit').CSSResultOrNative;
export type LitElement = import('lit').LitElement;
export type TypeofLitElement = typeof import('lit').LitElement;
//# sourceMappingURL=lit-element.d.ts.map