import { expect } from '@open-wc/testing';
import { fromCache, toCache } from '../src/cache.js';

describe('cache', () => {
  describe('toCache', () => {
    it('should store the element into the cache and returns it', () => {
      const strings = ['<my-element>', '<my-element>'];
      const newStrings = ['<my-element-1>', '<my-element-1>'];

      expect(toCache(strings, newStrings)).to.be.equal(newStrings);
      expect(fromCache(strings)).to.be.equal(newStrings);
    });
  });

  describe('fromCache', () => {
    it('should return undefined if an element is not cached', () => {
      expect(fromCache('sample')).to.be.undefined;
    });

    it('should return the cached strings strings reference', () => {
      const strings = ['<my-element>', '<my-element>'];
      const newStrings = ['<my-element-1>', '<my-element-1>'];
      toCache(strings, newStrings);

      expect(fromCache(strings)).to.be.equal(newStrings);
    });
  });
});
