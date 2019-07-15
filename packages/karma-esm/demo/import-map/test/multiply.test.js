import { expect } from '@bundled-es-modules/chai';
import { multiply } from '../src/utils.js';

describe('multiply()', () => {
  it('works', () => {
    expect(multiply(2)).to.equal(4);
  });
});
