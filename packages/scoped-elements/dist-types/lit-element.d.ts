/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 */
/**
 * @template {import('./types.js').Constructor<LitElement>} T
 * @param {T} superclass
 * @return {T & import('./types.js').Constructor<ScopedElementsHost>}
 */
export function ScopedElementsMixin<T extends import("@open-wc/dedupe-mixin").Constructor<import("lit").LitElement>>(superclass: T): T & import("@open-wc/dedupe-mixin").Constructor<import("./types.js").ScopedElementsHost>;
export type ScopedElementsHost = import('./types.js').ScopedElementsHost;
export type ScopedElementsMap = import('./types.js').ScopedElementsMap;
export type CSSResultOrNative = import('lit').CSSResultOrNative;
export type LitElement = import('lit').LitElement;
export type TypeofLitElement = typeof import('lit').LitElement;
//# sourceMappingURL=lit-element.d.ts.map