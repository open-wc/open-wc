import { TemplateResult } from 'lit-html';
import { stringFixture, stringFixtureSync } from './stringFixture.js';
import { litFixture, litFixtureSync } from './litFixture.js';

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
    return stringFixture(template);
  }
  if (template instanceof TemplateResult) {
    return litFixture(template);
  }
  throw new Error('Invalid template provided - string or lit-html TemplateResult is supported');
}
