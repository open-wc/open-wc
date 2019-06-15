import chai from 'chai';
import { postProcessImportMap } from '../src/postProcessImportMap.js';

const { expect } = chai;

describe('postProcessImportMap', () => {
  it('can override imports', async () => {
    const importMap = {
      imports: {
        a: '/path/to/a/a.js',
        b: '/node_modules/kvs-polyfill/index.mjs',
      },
    };
    const config = {
      overrides: {
        imports: {
          a: '/newPath/patchIt.js',
          b: ['std:kv-storage', '/node_modules/kvs-polyfill/index.mjs'],
        },
      },
    };

    expect(postProcessImportMap(importMap, config)).to.deep.equal({
      imports: {
        a: '/newPath/patchIt.js',
        b: ['std:kv-storage', '/node_modules/kvs-polyfill/index.mjs'],
      },
    });
  });

  it('can override scopes', async () => {
    const importMap = {
      imports: {
        a: '/path/to/a/a.js',
        b: '/node_modules/kvs-polyfill/index.mjs',
      },
      scopes: {
        '/scope2/': {
          a: '/a-2.js',
        },
        '/scope2/scope3/': {
          a: '/a-3.js',
        },
      },
    };
    // 1. everyone uses the polyfill
    // 2. urls within `/scope2/*` use built in with fallback to polyfill
    // 3. urls within `/scope2/scope3/*` forced to use built in
    const config = {
      overrides: {
        scopes: {
          '/scope2/': {
            b: ['std:kv-storage', '/node_modules/kvs-polyfill/index.mjs'],
          },
          '/scope2/scope3/': {
            a: '/a-3-override.js',
            b: 'std:kv-storage',
          },
        },
      },
    };

    expect(postProcessImportMap(importMap, config)).to.deep.equal({
      imports: {
        a: '/path/to/a/a.js',
        b: '/node_modules/kvs-polyfill/index.mjs',
      },
      scopes: {
        '/scope2/': {
          a: '/a-2.js',
          b: ['std:kv-storage', '/node_modules/kvs-polyfill/index.mjs'],
        },
        '/scope2/scope3/': {
          a: '/a-3.js',
        },
      },
    });
  });

  it('can delete imports', async () => {
    const importMap = {
      imports: {
        a: '/path/to/a/a.js',
        b: ['std:kv-storage', '/node_modules/kvs-polyfill/index.mjs'],
        c: '/path/to/c/c.js',
      },
    };
    const config = {
      deletes: {
        imports: ['a', 'b'],
      },
    };

    expect(postProcessImportMap(importMap, config)).to.deep.equal({
      imports: {
        c: '/path/to/c/c.js',
      },
    });
  });

  it('can delete complete scopes', async () => {
    const importMap = {
      scopes: {
        '/scope2/': {
          a: '/a-2.js',
        },
        '/scope2/scope3/': {
          a: '/a-3.js',
        },
      },
    };
    const config = {
      deletes: {
        scopes: ['/scope2/scope3/'],
      },
    };

    expect(postProcessImportMap(importMap, config)).to.deep.equal({
      scopes: {
        '/scope2/': {
          a: '/a-2.js',
        },
      },
    });
  });

  it('can delete imports of a scopes', async () => {
    const importMap = {
      scopes: {
        '/scope2/': {
          a: '/a-2.js',
          b: '/b-2.js',
        },
        '/scope2/scope3/': {
          a: '/a-3.js',
          b: '/b-3.js',
        },
      },
    };
    const config = {
      deletes: {
        scopeImports: {
          '/scope2/': ['a'],
          '/scope2/scope3/': ['b'],
        },
      },
    };

    expect(postProcessImportMap(importMap, config)).to.deep.equal({
      scopes: {
        '/scope2/': {
          b: '/b-2.js',
        },
        '/scope2/scope3/': {
          a: '/a-3.js',
        },
      },
    });
  });

  it('cleans up empty scopes after if imports are deleted', async () => {
    const importMap = {
      scopes: {
        '/scope2/': {
          a: '/a-2.js',
          b: '/b-2.js',
        },
        '/scope2/scope3/': {
          a: '/a-3.js',
        },
      },
    };
    const config = {
      deletes: {
        scopeImports: {
          '/scope2/': ['a', 'b'],
        },
      },
    };

    expect(postProcessImportMap(importMap, config)).to.deep.equal({
      scopes: {
        '/scope2/scope3/': {
          a: '/a-3.js',
        },
      },
    });
  });
});
