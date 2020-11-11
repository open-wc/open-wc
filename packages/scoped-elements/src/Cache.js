/**
 * Cache class that allows to search in a cache hierarchy.
 * @template T, Q
 */
export class Cache {
  /**
   * Creates a Cache instance
   * @param {Cache} [parent]
   */
  constructor(parent) {
    this._parent = parent;
    this._cache = new Map();
  }

  /**
   * Returns a boolean indicating whether an element with the specified key exists or not.
   *
   * @param {T} key - The key of the element to test for presence in the Cache object.
   * @return {boolean}
   */
  has(key) {
    return !!(this._cache.has(key) || (this._parent && this._parent._cache.has(key)));
  }

  /**
   * Adds or updates an element with a specified key and a value to a Cache object.
   *
   * @param {T} key - The key of the element to add to the Cache object.
   * @param {Q} value - The value of the element to add to the Cache object.
   * @return {Cache<T, Q>} the cache object
   */
  set(key, value) {
    this._cache.set(key, value);

    return this;
  }

  /**
   * Returns a specified element from a Map object. If the value that is associated to the provided key is an
   * object, then you will get a reference to that object and any change made to that object will effectively modify
   * it inside the Map object.
   *
   * @param {T} key - The key of the element to return from the Cache object.
   * @return {Q}
   */
  get(key) {
    return this._cache.get(key) || (this._parent && this._parent._cache.get(key));
  }
}
