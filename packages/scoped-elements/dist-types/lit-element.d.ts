/**
 * @typedef {import('./types.js').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('./types.js').ScopedElementsMap} ScopedElementsMap
 * @typedef {import('./types.js').ScopedElementsHostConstructor} ScopedElementsHostConstructor
 * @typedef {import('lit').CSSResultOrNative} CSSResultOrNative
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {typeof import('lit').LitElement} TypeofLitElement
 * @typedef {import('@open-wc/dedupe-mixin').Constructor<LitElement>} LitElementConstructor
 */
/**
 * @template {LitElementConstructor} T
 * @param {T} superclass
 * @return {T & import('@open-wc/dedupe-mixin').Constructor<ScopedElementsHost> & ScopedElementsHostConstructor}
 */
export function ScopedElementsMixin<T extends LitElementConstructor>(superclass: T): T & import("@open-wc/dedupe-mixin").Constructor<import("./types.js").ScopedElementsHost> & import("./types.js").ScopedElementsHostConstructor;
export type ScopedElementsHost = import('./types.js').ScopedElementsHost;
export type ScopedElementsMap = import('./types.js').ScopedElementsMap;
export type ScopedElementsHostConstructor = import('./types.js').ScopedElementsHostConstructor;
export type CSSResultOrNative = import('lit').CSSResultOrNative;
export type LitElement = import('lit').LitElement;
export type TypeofLitElement = typeof import('lit').LitElement;
export type LitElementConstructor = import('@open-wc/dedupe-mixin').Constructor<LitElement>;
//# sourceMappingURL=lit-element.d.ts.map