import { Constructor } from '@open-wc/dedupe-mixin';
export { Constructor };
export type ScopedElementsMap = {
    [key: string]: typeof HTMLElement;
};
export declare class ScopedElementsHost {
    /**
     * Obtains the scoped elements definitions map
     */
    static scopedElements: ScopedElementsMap;
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