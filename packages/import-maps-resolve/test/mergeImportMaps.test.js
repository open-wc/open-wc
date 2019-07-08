import chai from 'chai';
import { mergeImportMaps } from '../src/index.js';

const { expect } = chai;

describe('mergeImportMaps', () => {
  it('always has at least imports and scopes', () => {
    expect(mergeImportMaps({}, null)).to.deep.equal({
      imports: {},
      scopes: {},
    });
  });

  it('merges imports', () => {
    const mapA = { imports: { foo: '/to/foo.js' } };
    const mapB = { imports: { bar: '/to/bar.js' } };

    expect(mergeImportMaps(mapA, mapB)).to.deep.equal({
      imports: {
        foo: '/to/foo.js',
        bar: '/to/bar.js',
      },
      scopes: {},
    });
  });

  it('merges scopes', () => {
    const mapA = { scopes: { '/path/to/foo/': { foo: '/to/foo.js' } } };
    const mapB = { scopes: { '/path/to/bar/': { foo: '/to/bar.js' } } };

    expect(mergeImportMaps(mapA, mapB)).to.deep.equal({
      imports: {},
      scopes: {
        '/path/to/foo/': { foo: '/to/foo.js' },
        '/path/to/bar/': { foo: '/to/bar.js' },
      },
    });
  });

  it('removes unknown keys', () => {
    const mapA = { imports: { foo: '/to/foo.js' } };
    const mapB = { imp: { bar: '/to/bar.js' } };

    expect(mergeImportMaps(mapA, mapB)).to.deep.equal({
      imports: {
        foo: '/to/foo.js',
      },
      scopes: {},
    });
  });

  it('overrides keys of imports and scopes of first map with second', () => {
    const mapA = { imports: { foo: '/to/foo.js' } };
    const mapB = { imports: { foo: '/to/fooOverride.js' } };

    expect(mergeImportMaps(mapA, mapB)).to.deep.equal({
      imports: {
        foo: '/to/fooOverride.js',
      },
      scopes: {},
    });
  });

  it('does not introspect the scopes so with a conflict the last one wins', () => {
    const mapA = { scopes: { '/path/to/foo/': { foo: '/to/foo.js' } } };
    const mapB = { scopes: { '/path/to/foo/': { foo: '/to/fooOverride.js' } } };

    expect(mergeImportMaps(mapA, mapB)).to.deep.equal({
      imports: {},
      scopes: {
        '/path/to/foo/': { foo: '/to/fooOverride.js' },
      },
    });
  });
});
