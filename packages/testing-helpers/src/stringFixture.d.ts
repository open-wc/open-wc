/**
 * Setups an element synchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @template {Element} T - Is an element or a node
 * @param {string} template
 * @returns {T}
 */
export function stringFixtureSync<T extends Element>(template: string): T;
/**
 * Setups an element asynchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @template {Element} T - Is an element or a node
 * @param {string} template
 * @returns {Promise<T>}
 */
export function stringFixture<T extends Element>(template: string): Promise<T>;
