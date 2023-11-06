/**
 * @template {import('./types.js').Constructor<HTMLElement>} T
 * @param {T} superclass
 * @return {T & import('./types.js').Constructor<ScopedElementsHost>}
 */
export function ScopedElementsMixin<T extends import("@open-wc/dedupe-mixin").Constructor<HTMLElement>>(superclass: T): T & import("@open-wc/dedupe-mixin").Constructor<import("./types.js").ScopedElementsHost>;
export type ScopedElementsHost = import('./types.js').ScopedElementsHost;
export type ScopedElementsMap = import('./types.js').ScopedElementsMap;
//# sourceMappingURL=html-element.d.ts.map