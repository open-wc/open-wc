import chai from 'chai';
import { URL } from 'url';
import { parseFromString } from '../src/parser.js';
import { resolve } from '../src/resolver.js';

const { expect } = chai;

const mapBaseURL = 'https://example.com/app/index.html';

function makeResolveUnderTest(mapString) {
  const map = parseFromString(mapString, mapBaseURL);
  return (specifier, baseURL) => resolve(specifier, map, baseURL);
}

describe('Mapped using scope instead of "imports"', () => {
  const jsNonDirURL = 'https://example.com/js';
  const jsPrefixedURL = 'https://example.com/jsiscool';
  const inJSDirURL = 'https://example.com/js/app.mjs';
  const topLevelURL = 'https://example.com/app.mjs';

  it('should fail when the mapping is to an empty array', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "scopes": {
        "/js/": {
          "moment": null,
          "lodash": []
        }
      }
    }`);

    expect(() => resolveUnderTest('moment', inJSDirURL)).to.throw(TypeError);
    expect(() => resolveUnderTest('lodash', inJSDirURL)).to.throw(TypeError);
  });

  describe('Exact vs. prefix based matching', () => {
    it('should match correctly when both are in the map', () => {
      const resolveUnderTest = makeResolveUnderTest(`{
        "scopes": {
          "/js": {
            "moment": "/only-triggered-by-exact/moment",
            "moment/": "/only-triggered-by-exact/moment/"
          },
          "/js/": {
            "moment": "/triggered-by-any-subpath/moment",
            "moment/": "/triggered-by-any-subpath/moment/"
          }
        }
      }`);

      expect(resolveUnderTest('moment', jsNonDirURL)).to.equal(
        'https://example.com/only-triggered-by-exact/moment',
      );
      expect(resolveUnderTest('moment/foo', jsNonDirURL)).to.equal(
        'https://example.com/only-triggered-by-exact/moment/foo',
      );

      expect(resolveUnderTest('moment', inJSDirURL)).to.equal(
        'https://example.com/triggered-by-any-subpath/moment',
      );
      expect(resolveUnderTest('moment/foo', inJSDirURL)).to.equal(
        'https://example.com/triggered-by-any-subpath/moment/foo',
      );

      expect(() => resolveUnderTest('moment', jsPrefixedURL)).to.throw(TypeError);
      expect(() => resolveUnderTest('moment/foo', jsPrefixedURL)).to.throw(TypeError);
    });

    it('should match correctly when only an exact match is in the map', () => {
      const resolveUnderTest = makeResolveUnderTest(`{
        "scopes": {
          "/js": {
            "moment": "/only-triggered-by-exact/moment",
            "moment/": "/only-triggered-by-exact/moment/"
          }
        }
      }`);

      expect(resolveUnderTest('moment', jsNonDirURL)).to.equal(
        'https://example.com/only-triggered-by-exact/moment',
      );
      expect(resolveUnderTest('moment/foo', jsNonDirURL)).to.equal(
        'https://example.com/only-triggered-by-exact/moment/foo',
      );

      expect(() => resolveUnderTest('moment', inJSDirURL)).to.throw(TypeError);
      expect(() => resolveUnderTest('moment/foo', inJSDirURL)).to.throw(TypeError);

      expect(() => resolveUnderTest('moment', jsPrefixedURL)).to.throw(TypeError);
      expect(() => resolveUnderTest('moment/foo', jsPrefixedURL)).to.throw(TypeError);
    });

    it('should match correctly when only a prefix match is in the map', () => {
      const resolveUnderTest = makeResolveUnderTest(`{
        "scopes": {
          "/js/": {
            "moment": "/triggered-by-any-subpath/moment",
            "moment/": "/triggered-by-any-subpath/moment/"
          }
        }
      }`);

      expect(() => resolveUnderTest('moment', jsNonDirURL)).to.throw(TypeError);
      expect(() => resolveUnderTest('moment/foo', jsNonDirURL)).to.throw(TypeError);

      expect(resolveUnderTest('moment', inJSDirURL)).to.equal(
        'https://example.com/triggered-by-any-subpath/moment',
      );
      expect(resolveUnderTest('moment/foo', inJSDirURL)).to.equal(
        'https://example.com/triggered-by-any-subpath/moment/foo',
      );

      expect(() => resolveUnderTest('moment', jsPrefixedURL)).to.throw(TypeError);
      expect(() => resolveUnderTest('moment/foo', jsPrefixedURL)).to.throw(TypeError);
    });
  });

  describe('Package-like scenarios', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "moment": "/node_modules/moment/src/moment.js",
        "moment/": "/node_modules/moment/src/",
        "lodash-dot": "./node_modules/lodash-es/lodash.js",
        "lodash-dot/": "./node_modules/lodash-es/",
        "lodash-dotdot": "../node_modules/lodash-es/lodash.js",
        "lodash-dotdot/": "../node_modules/lodash-es/"
      },
      "scopes": {
        "/": {
          "moment": "/node_modules_3/moment/src/moment.js",
          "vue": "/node_modules_3/vue/dist/vue.runtime.esm.js"
        },
        "/js/": {
          "lodash-dot": "./node_modules_2/lodash-es/lodash.js",
          "lodash-dot/": "./node_modules_2/lodash-es/",
          "lodash-dotdot": "../node_modules_2/lodash-es/lodash.js",
          "lodash-dotdot/": "../node_modules_2/lodash-es/"
        }
      }
    }`);

    it('should resolve scoped', () => {
      expect(resolveUnderTest('lodash-dot', inJSDirURL)).to.equal(
        'https://example.com/app/node_modules_2/lodash-es/lodash.js',
      );
      expect(resolveUnderTest('lodash-dotdot', inJSDirURL)).to.equal(
        'https://example.com/node_modules_2/lodash-es/lodash.js',
      );
      expect(resolveUnderTest('lodash-dot/foo', inJSDirURL)).to.equal(
        'https://example.com/app/node_modules_2/lodash-es/foo',
      );
      expect(resolveUnderTest('lodash-dotdot/foo', inJSDirURL)).to.equal(
        'https://example.com/node_modules_2/lodash-es/foo',
      );
    });

    it('should apply best scope match', () => {
      expect(resolveUnderTest('moment', topLevelURL)).to.equal(
        'https://example.com/node_modules_3/moment/src/moment.js',
      );
      expect(resolveUnderTest('moment', inJSDirURL)).to.equal(
        'https://example.com/node_modules_3/moment/src/moment.js',
      );
      expect(resolveUnderTest('vue', inJSDirURL)).to.equal(
        'https://example.com/node_modules_3/vue/dist/vue.runtime.esm.js',
      );
    });

    it('should fallback to "imports"', () => {
      expect(resolveUnderTest('moment/foo', topLevelURL)).to.equal(
        'https://example.com/node_modules/moment/src/foo',
      );
      expect(resolveUnderTest('moment/foo', inJSDirURL)).to.equal(
        'https://example.com/node_modules/moment/src/foo',
      );
      expect(resolveUnderTest('lodash-dot', topLevelURL)).to.equal(
        'https://example.com/app/node_modules/lodash-es/lodash.js',
      );
      expect(resolveUnderTest('lodash-dotdot', topLevelURL)).to.equal(
        'https://example.com/node_modules/lodash-es/lodash.js',
      );
      expect(resolveUnderTest('lodash-dot/foo', topLevelURL)).to.equal(
        'https://example.com/app/node_modules/lodash-es/foo',
      );
      expect(resolveUnderTest('lodash-dotdot/foo', topLevelURL)).to.equal(
        'https://example.com/node_modules/lodash-es/foo',
      );
    });

    it('should still fail for package-like specifiers that are not declared', () => {
      expect(() => resolveUnderTest('underscore/', inJSDirURL)).to.throw(TypeError);
      expect(() => resolveUnderTest('underscore/foo', inJSDirURL)).to.throw(TypeError);
    });
  });

  describe('The scope inheritance example from the README', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "a": "/a-1.mjs",
        "b": "/b-1.mjs",
        "c": "/c-1.mjs"
      },
      "scopes": {
        "/scope2/": {
          "a": "/a-2.mjs"
        },
        "/scope2/scope3/": {
          "b": "/b-3.mjs"
        }
      }
    }`);

    const scope1URL = 'https://example.com/scope1/foo.mjs';
    const scope2URL = 'https://example.com/scope2/foo.mjs';
    const scope3URL = 'https://example.com/scope2/scope3/foo.mjs';

    it('should fall back to "imports" when none match', () => {
      expect(resolveUnderTest('a', scope1URL)).to.equal('https://example.com/a-1.mjs');
      expect(resolveUnderTest('b', scope1URL)).to.equal('https://example.com/b-1.mjs');
      expect(resolveUnderTest('c', scope1URL)).to.equal('https://example.com/c-1.mjs');
    });

    it('should use a direct scope override', () => {
      expect(resolveUnderTest('a', scope2URL)).to.equal('https://example.com/a-2.mjs');
      expect(resolveUnderTest('b', scope2URL)).to.equal('https://example.com/b-1.mjs');
      expect(resolveUnderTest('c', scope2URL)).to.equal('https://example.com/c-1.mjs');
    });

    it('should use an indirect scope override', () => {
      expect(resolveUnderTest('a', scope3URL)).to.equal('https://example.com/a-2.mjs');
      expect(resolveUnderTest('b', scope3URL)).to.equal('https://example.com/b-3.mjs');
      expect(resolveUnderTest('c', scope3URL)).to.equal('https://example.com/c-1.mjs');
    });
  });

  describe('Relative URL scope keys', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "a": "/a-1.mjs",
        "b": "/b-1.mjs",
        "c": "/c-1.mjs"
      },
      "scopes": {
        "": {
          "a": "/a-empty-string.mjs"
        },
        "./": {
          "b": "/b-dot-slash.mjs"
        },
        "../": {
          "c": "/c-dot-dot-slash.mjs"
        }
      }
    }`);
    const inSameDirAsMap = new URL('./foo.mjs', mapBaseURL).href;
    const inDirAboveMap = new URL('../foo.mjs', mapBaseURL).href;

    it('should resolve an empty string scope using the import map URL', () => {
      expect(resolveUnderTest('a', mapBaseURL)).to.equal('https://example.com/a-empty-string.mjs');
      expect(resolveUnderTest('a', inSameDirAsMap)).to.equal('https://example.com/a-1.mjs');
    });

    it("should resolve a ./ scope using the import map URL's directory", () => {
      expect(resolveUnderTest('b', mapBaseURL)).to.equal('https://example.com/b-dot-slash.mjs');
      expect(resolveUnderTest('b', inSameDirAsMap)).to.equal('https://example.com/b-dot-slash.mjs');
    });

    it("should resolve a ../ scope using the import map URL's directory", () => {
      expect(resolveUnderTest('c', mapBaseURL)).to.equal('https://example.com/c-dot-dot-slash.mjs');
      expect(resolveUnderTest('c', inSameDirAsMap)).to.equal(
        'https://example.com/c-dot-dot-slash.mjs',
      );
      expect(resolveUnderTest('c', inDirAboveMap)).to.equal(
        'https://example.com/c-dot-dot-slash.mjs',
      );
    });
  });
});
