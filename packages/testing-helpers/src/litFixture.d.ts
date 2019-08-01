/**
 * Setups an element synchronously from the provided lit-html template and puts it in the DOM.
 *
 * @template {Element} T - Is an element or a node
 * @param {import('lit-html').TemplateResult} template
 * @returns {T}
 */
export declare function litFixtureSync(template: any): any;
/**
 * Setups an element asynchronously from the provided lit-html template and puts it in the DOM.
 *
 * @template {Element} T - Is an element or a node
 * @param {import('lit-html').TemplateResult} template
 * @returns {Promise<T>}
 */
export declare function litFixture(template: any): {};
