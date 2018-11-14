import { nextFrame } from './helpers.js';

export const cachedWrappers = [];

/**
 * Creates a wrapper as a direct child of `<body>` to put the tested element into.
 * Needed to run a `connectedCallback()` on a tested element.
 *
 * @returns {HTMLElement}
 * @private
 */
export class FixtureWrapper {
  constructor() {
    const wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    cachedWrappers.push(wrapper);
    return wrapper;
  }
}

/**
 * Setups an element synchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @param {string} template
 * @param {Object|function(element: HTMLElement)} props
 * @returns {HTMLElement}
 */
export function fixtureSync(template, props = {}) {
  const parent = document.createElement('div'); // we need a real dom node for getters/setters
  parent.innerHTML = template;
  const element = parent.children[0];
  const properties = typeof props === 'function' ? props(element) : props;
  Object.keys(properties).forEach((prop) => {
    element[prop] = properties[prop];
  });
  const wrapper = new FixtureWrapper();
  wrapper.appendChild(element);
  return wrapper.children[0];
}

/**
 * Setups an element asynchronously from the provided string template and puts it in the DOM.
 * Allows to specify properties via an object or a function taking the element as an argument.
 *
 * @param {string} template
 * @param {Object|function(element: HTMLElement)} props
 * @returns {Promise<HTMLElement>}
 */
export async function fixture(template, setup = {}) {
  const result = fixtureSync(template, setup);
  await nextFrame();
  return result;
}
