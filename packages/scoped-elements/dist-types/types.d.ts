import { Constructor } from '@open-wc/dedupe-mixin';
export { Constructor };
export type ScopedElementsMap = {
    [key: string]: typeof HTMLElement;
};
/**
 * Static interface for the ScopedElementsHost class.
 * This is used to properly type the constructor side (static properties).
 */
export interface ScopedElementsHostConstructor {
    scopedElements?: ScopedElementsMap;
}
/**
 * Instance interface for the ScopedElementsHost class.
 */
export declare class ScopedElementsHost {
    /**
     * Obtains the CustomElementRegistry
     */
    registry?: CustomElementRegistry;
}
declare global {
    interface ShadowRootInit {
        customElements?: CustomElementRegistry;
        registry?: CustomElementRegistry;
    }
    interface ShadowRoot {
        customElements?: CustomElementRegistry;
        registry?: CustomElementRegistry;
    }
    interface Window {
        scopedElementsVersions: string[];
    }
}
//# sourceMappingURL=types.d.ts.map