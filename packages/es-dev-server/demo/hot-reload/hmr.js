import { applyPolyfill, ReflowStrategy } from 'custom-elements-hmr-polyfill';

applyPolyfill(
    // resets the body's innerHTML, thus rerenders all elements
    // but doesn't call all lifecycle methods in a standard way (less calls)
    ReflowStrategy.RERENDER_INNER_HTML,
    /* buffers changes for 500ms */ 500
);
