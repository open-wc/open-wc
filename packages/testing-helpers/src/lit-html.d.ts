export { render } from 'lit-html/lit-html.js';
/**
 * This is a wrapper around lit-html that supports dynamic strings to be added as a preprocessing
 * step, before a template is passed to lit's html function.
 * A dynamic string will be evaluated one time (on init) and passed to lit-html as being
 * part of the static string.
 *
 * WARNING: do not use in production!!! has a huge performance penalty as every string is
 * different from lit-htmls perspective so a new tag is created every time.
 *
 * A valid use case for this would be to create dynamic tag names.
 *
 * @example:
 * const tag = unsafeStatic('my-tag');
 * html`<${tag} prop="${prop}"></${tag>`
 * // will in turn calls lit-html html function as:
 * html`<my-tag prop="${prop}"></my-tag>`
 *
 * @param {TemplateStringsArray} strings Static Parts
 * @param {Array[any]} values Dynamic Parts
 * @returns {import('lit-html').TemplateResult}
 */
export declare function html(strings: any, ...values: {}): any;
export declare function unsafeStatic(options: any): {
    d: any;
};
