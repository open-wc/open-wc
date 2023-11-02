/**
 * @template {import('./types').Constructor<HTMLElement>} T
 * @param {T} superclass
 * @return {T & import('./types').Constructor<ScopedElementsHost>}
 */
export function ScopedElementsMixin<T extends import("@open-wc/dedupe-mixin").Constructor<HTMLElement>>(superclass: T): T & import("@open-wc/dedupe-mixin").Constructor<import("./types").ScopedElementsHost>;
export type ScopedElementsHost = import('./types').ScopedElementsHost;
export type ScopedElementsMap = import('./types').ScopedElementsMap;
//# sourceMappingURL=html-element.d.ts.map