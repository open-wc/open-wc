import { assert } from '@bundled-es-modules/chai';
import { a11ySuite } from '../src/a11y-suite.js';
import { fixture } from '../src/fixture.js';

describe('a11ySuite', () => {
  it('Performs the test', async () => {
    await a11ySuite('Test Suite', `<div></div>`);
  });

  it('Performs accessibility test', async () => {
    await a11ySuite('Test Suite', `<div aria-labelledby="test-x"></div><label id="test-x"></label>`);
  });

  it('Assepts element as an input', async () => {
    const element = await fixture('<div></div>');
    await a11ySuite('Test Suite', element);
  });

  it('Assepts ignored rules list', async () => {
    await a11ySuite('Test Suite', '<div aria-labelledby="test-x"></div>', ['badAriaAttributeValue']);
  });
});
