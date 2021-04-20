/* eslint-disable-next-line */
import { expect } from '@esm-bundle/chai';
import { chaiA11yAxe } from '../index.js';

describe('chai-a11y-axe', () => {
  it('exports a plugin', () => {
    expect(chaiA11yAxe).to.be.a('function');
  });
});
