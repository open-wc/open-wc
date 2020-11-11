import { expect } from '@open-wc/testing';
import { Cache } from '../src/Cache.js';

describe('Cache', () => {
  it('should be constructable', () => {
    const cache = new Cache();

    expect(cache).to.be.instanceof(Cache);
  });

  it('should be constructable specifying a parent cache', () => {
    const parent = new Cache();
    const cache = new Cache(parent);

    expect(cache).to.be.instanceof(Cache);
    expect(cache._parent).to.be.instanceof(Cache);
  });

  describe('has', () => {
    it(`should return false if the key doesn't exist in hierarchy`, () => {
      const parent = new Cache();
      const cache = new Cache(parent);

      expect(cache.has('key')).to.be.false;
    });

    it(`should return false if the key does not exist and no parent exists`, () => {
      const cache = new Cache();

      expect(cache.has('key')).to.be.false;
    });

    it(`should return true if the key exist`, () => {
      const cache = new Cache();
      cache._cache.set('key', 'value');

      expect(cache.has('key')).to.be.true;
    });

    it(`should return true if the key exist in hierarchy`, () => {
      const parent = new Cache();
      const cache = new Cache(parent);
      parent._cache.set('key', 'value');

      expect(cache.has('key')).to.be.true;
    });
  });

  describe('set', () => {
    it('should store a value with the specified key', () => {
      const key = 'key';
      const value = 'value';
      const cache = new Cache();
      cache.set(key, value);

      expect(cache._cache.has(key)).to.be.true;
      expect(cache._cache.get(key)).to.be.equal(value);
    });

    it(`shouldn't store a value in the parent cache`, () => {
      const key = 'key';
      const value = 'value';
      const parent = new Cache();
      const cache = new Cache(parent);
      cache.set(key, value);

      expect(parent._cache.has(key)).to.be.false;
    });

    it('should update an existing key value in case it exists', () => {
      const key = 'key';
      const value = 'value';
      const previousValue = 'previous';
      const cache = new Cache();
      cache._cache.set(key, previousValue);

      expect(cache._cache.has(key)).to.be.true;
      expect(cache._cache.get(key)).to.be.equal(previousValue);

      cache.set(key, value);

      expect(cache._cache.get(key)).to.be.equal(value);
    });

    it('should return the cache object', () => {
      const cache = new Cache();

      const returnedObject = cache.set('key', 'value');

      expect(returnedObject).to.be.equal(cache);
    });
  });

  describe('get', () => {
    it('should return undefined in case the key is not in hierarchy', () => {
      const parent = new Cache();
      const cache = new Cache(parent);

      expect(cache.get('key')).to.be.undefined;
    });

    it('should return undefined in case key does not exist and parent does not exist', () => {
      const cache = new Cache();

      expect(cache.get('key')).to.be.undefined;
    });

    it('should return undefined in case the key is not provided', () => {
      const parent = new Cache();
      const cache = new Cache(parent);

      expect(cache.get(undefined)).to.be.undefined;
    });

    it('should return a stored key', () => {
      const key = 'key';
      const value = 'value';
      const cache = new Cache();
      cache._cache.set(key, value);

      expect(cache.get(key)).to.be.equal(value);
    });

    it('should return a stored key in hierarchy', () => {
      const key = 'key';
      const value = 'value';
      const parent = new Cache();
      const cache = new Cache(parent);
      parent._cache.set(key, value);

      expect(cache.get(key)).to.be.equal(value);
    });
  });
});
