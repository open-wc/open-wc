import { expect } from './setup.js';
import { add } from '../src/utils';

describe('add()', () => {
  it('works', () => {
    expect(add(2, 3)).to.equal(5);
  });
});
