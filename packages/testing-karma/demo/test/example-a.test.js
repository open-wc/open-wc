import { expect } from './setup.js';
import { foo } from '../src/example.js';

describe('a', () => {
  describe('foo()', () => {
    it('returns false when given true', () => {
      expect(foo(true)).to.equal(false);
    });

    it('returns true when given false', async () => {
      expect(foo(false)).to.equal(true);
    });
  });
});
