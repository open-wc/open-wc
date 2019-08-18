import { expect } from './setup.js';
import { multiply } from '../src/utils.js';

describe('multiply()', () => {
  it('works', () => {
    expect(multiply(2)).to.equal(4);
  });
});
