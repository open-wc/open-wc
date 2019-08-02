/**
 * Setups an element synchronously from the provided lit-html template and puts it in the DOM.
 *
 * @template {Element} T - Is an element or a node
 * @param {import('lit-html').TemplateResult} template
 * @returns {T}
 */
export function litFixtureSync<T extends Element>(template: import("lit-html").TemplateResult): T;
/**
 * Setups an element asynchronously from the provided lit-html template and puts it in the DOM.
 *
 * @template {Element} T - Is an element or a node
 * @param {import('lit-html').TemplateResult} template
 * @returns {Promise<T>}
 */
export function litFixture<T extends Element>(template: import("lit-html").TemplateResult): Promise<T>;
