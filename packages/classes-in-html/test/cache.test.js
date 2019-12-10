import { expect } from '@open-wc/testing';
import { getFromCache, toCache } from '../src/cache.js';

describe('cache', () => {
  it("should return [strings] if 'values' are empty", () => {
    const strings = ['sample'];
    const values = [];

    const when = getFromCache(strings, values);

    expect(when).to.be.an('array');
    expect(when[0]).to.be.equals(strings);
    expect(when.length).to.be.equals(1);
  });

  it("should return undefined if 'strings' is not registered", () => {
    const strings = ['sample'];
    const values = ['A'];

    const when = getFromCache(strings, values);

    expect(when).to.be.undefined;
  });

  it("should return the same 'strings' and 'values' when cached strings are the same than provided strings", () => {
    const strings = ['sample'];
    const values = ['A'];
    toCache(strings, { strings });

    const [newStrings, ...newValues] = getFromCache(strings, values);

    expect(newStrings).to.be.equal(strings);
    expect(newValues).to.be.deep.equal(values);
  });

  it('should return undefined if there is a cache failure', () => {
    const ClassA = class extends HTMLElement {};
    const ClassB = class extends HTMLElement {};
    const strings = ['<', '>', '</', '>'];
    const values = [ClassB, 'text sample', ClassB];
    toCache(strings, {
      keys: [
        [0, ClassA],
        [2, ClassA],
      ],
      indexes: [1],
      strings: ['<x-a>', '</x-a>'],
    });

    const when = getFromCache(strings, values);

    expect(when).to.be.undefined;
  });

  it("should return the cached 'string' with the transformed 'values' if cache matches", () => {
    const ClassA = class extends HTMLElement {};
    const strings = ['<', '>', '</', '>'];
    const values = [ClassA, 'text sample', ClassA];
    const transformedStrings = ['<x-a>', '</x-a>'];
    toCache(strings, {
      keys: [
        [0, ClassA],
        [2, ClassA],
      ],
      indexes: [1],
      strings: transformedStrings,
    });

    const [newStrings, ...newValues] = getFromCache(strings, values);

    expect(newStrings).to.be.equal(transformedStrings);
    expect(newValues).to.be.deep.equal(['text sample']);
  });
});
