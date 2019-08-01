/**
 * Awaits for "update complete promises" of elements
 * - for [lit-element](https://github.com/polymer/lit-element) that is `el.updateComplete`;
 * - for [stencil](https://github.com/ionic-team/stencil/) that is `el.componentOnReady()`;
 *
 * If none of those specfic Promise hooks are found, it will wait for one frame via
 * `await nextFrame()`.
 *
 * Ensures that ShadyDOM finished its job if available.
 *
 * @template {Element} T
 * @param {T} el
 * @returns {Promise<T>}
 */
export declare function elementUpdated(el: any): {};
