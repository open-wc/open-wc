import { TemplateResult } from 'lit-html';
import { stringFixtureSync } from './stringFixture.js';
import { litFixtureSync } from './litFixture.js';

/**
 * Setups an element synchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @param {string | TemplateResult} template
 * @returns {Element}
 */
export function fixtureSync(template) {
  if (typeof template === 'string') {
    return stringFixtureSync(template);
  }
  if (template instanceof TemplateResult) {
    return litFixtureSync(template);
  }
  throw new Error('Invalid template provided - string or lit-html TemplateResult is supported');
}

/**
 * Setups an element asynchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @param {string | TemplateResult} template
 * @returns {Promise<Element>}
 */
export async function fixture(template) {
  if (typeof template === 'string') {
    return stringFixtureSync(template);
  }
  if (template instanceof TemplateResult) {
    return litFixtureSync(template);
  }
  throw new Error('Invalid template provided - string or lit-html TemplateResult is supported');
}
