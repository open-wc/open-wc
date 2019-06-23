import chai from 'chai';
import { parseFromString } from '../src/parser.js';
import { resolve } from '../src/resolver.js';

const { expect } = chai;

const mapBaseURL = 'https://example.com/app/index.html';
const scriptURL = 'https://example.com/js/app.mjs';

function makeResolveUnderTest(mapString) {
  const map = parseFromString(mapString, mapBaseURL);
  return specifier => resolve(specifier, map, scriptURL);
}

describe('Unmapped', () => {
  const resolveUnderTest = makeResolveUnderTest(`{}`);

  it('should resolve ./ specifiers as URLs', () => {
    expect(resolveUnderTest('./foo')).to.equal('https://example.com/js/foo');
    expect(resolveUnderTest('./foo/bar')).to.equal('https://example.com/js/foo/bar');
    expect(resolveUnderTest('./foo/../bar')).to.equal('https://example.com/js/bar');
    expect(resolveUnderTest('./foo/../../bar')).to.equal('https://example.com/bar');
  });

  it('should resolve ../ specifiers as URLs', () => {
    expect(resolveUnderTest('../foo')).to.equal('https://example.com/foo');
    expect(resolveUnderTest('../foo/bar')).to.equal('https://example.com/foo/bar');
    expect(resolveUnderTest('../../../foo/bar')).to.equal('https://example.com/foo/bar');
  });

  it('should resolve / specifiers as URLs', () => {
    expect(resolveUnderTest('/foo')).to.equal('https://example.com/foo');
    expect(resolveUnderTest('/foo/bar')).to.equal('https://example.com/foo/bar');
    expect(resolveUnderTest('/../../foo/bar')).to.equal('https://example.com/foo/bar');
    expect(resolveUnderTest('/../foo/../bar')).to.equal('https://example.com/bar');
  });

  it('should parse absolute fetch-scheme URLs', () => {
    expect(resolveUnderTest('about:good')).to.equal('about:good');
    expect(resolveUnderTest('https://example.net')).to.equal('https://example.net/');
    expect(resolveUnderTest('https://ex%41mple.com/')).to.equal('https://example.com/');
    expect(resolveUnderTest('https:example.org')).to.equal('https://example.org/');
    expect(resolveUnderTest('https://///example.com///')).to.equal('https://example.com///');
  });

  it('should fail for absolute non-fetch-scheme URLs', () => {
    expect(() => resolveUnderTest('mailto:bad')).to.throw(TypeError);
    expect(() => resolveUnderTest('import:bad')).to.throw(TypeError);
    // eslint-disable-next-line no-script-url
    expect(() => resolveUnderTest('javascript:bad')).to.throw(TypeError);
    expect(() => resolveUnderTest('wss:bad')).to.throw(TypeError);
  });

  it('should fail for strings not parseable as absolute URLs and not starting with ./ ../ or /', () => {
    expect(() => resolveUnderTest('foo')).to.throw(TypeError);
    expect(() => resolveUnderTest('\\foo')).to.throw(TypeError);
    expect(() => resolveUnderTest(':foo')).to.throw(TypeError);
    expect(() => resolveUnderTest('@foo')).to.throw(TypeError);
    expect(() => resolveUnderTest('%2E/foo')).to.throw(TypeError);
    expect(() => resolveUnderTest('%2E%2E/foo')).to.throw(TypeError);
    expect(() => resolveUnderTest('.%2Ffoo')).to.throw(TypeError);
    expect(() => resolveUnderTest('https://ex ample.org/')).to.throw(TypeError);
    expect(() => resolveUnderTest('https://example.com:demo')).to.throw(TypeError);
    expect(() => resolveUnderTest('http://[www.example.com]/')).to.throw(TypeError);
  });
});

describe('Mapped using the "imports" key only (no scopes)', () => {
  it('should fail when the mapping is to an empty array', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "moment": null,
        "lodash": []
      }
    }`);

    expect(() => resolveUnderTest('moment')).to.throw(TypeError);
    expect(() => resolveUnderTest('lodash')).to.throw(TypeError);
  });

  describe('Package-like scenarios', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "moment": "/node_modules/moment/src/moment.js",
        "moment/": "/node_modules/moment/src/",
        "lodash-dot": "./node_modules/lodash-es/lodash.js",
        "lodash-dot/": "./node_modules/lodash-es/",
        "lodash-dotdot": "../node_modules/lodash-es/lodash.js",
        "lodash-dotdot/": "../node_modules/lodash-es/",
        "nowhere/": []
      }
    }`);

    it('should work for package main modules', () => {
      expect(resolveUnderTest('moment')).to.equal(
        'https://example.com/node_modules/moment/src/moment.js',
      );
      expect(resolveUnderTest('lodash-dot')).to.equal(
        'https://example.com/app/node_modules/lodash-es/lodash.js',
      );
      expect(resolveUnderTest('lodash-dotdot')).to.equal(
        'https://example.com/node_modules/lodash-es/lodash.js',
      );
    });

    it('should work for package submodules', () => {
      expect(resolveUnderTest('moment/foo')).to.equal(
        'https://example.com/node_modules/moment/src/foo',
      );
      expect(resolveUnderTest('lodash-dot/foo')).to.equal(
        'https://example.com/app/node_modules/lodash-es/foo',
      );
      expect(resolveUnderTest('lodash-dotdot/foo')).to.equal(
        'https://example.com/node_modules/lodash-es/foo',
      );
    });

    it('should work for package names that end in a slash by just passing through', () => {
      // TODO: is this the right behavior, or should we throw?
      expect(resolveUnderTest('moment/')).to.equal('https://example.com/node_modules/moment/src/');
    });

    it('should still fail for package modules that are not declared', () => {
      expect(() => resolveUnderTest('underscore/')).to.throw(TypeError);
      expect(() => resolveUnderTest('underscore/foo')).to.throw(TypeError);
    });

    it('should fail for package submodules that map to nowhere', () => {
      expect(() => resolveUnderTest('nowhere/foo')).to.throw(TypeError);
    });
  });

  describe('Tricky specifiers', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "package/withslash": "/node_modules/package-with-slash/index.mjs",
        "not-a-package": "/lib/not-a-package.mjs",
        ".": "/lib/dot.mjs",
        "..": "/lib/dotdot.mjs",
        "..\\\\": "/lib/dotdotbackslash.mjs",
        "%2E": "/lib/percent2e.mjs",
        "%2F": "/lib/percent2f.mjs"
      }
    }`);

    it('should work for explicitly-mapped specifiers that happen to have a slash', () => {
      expect(resolveUnderTest('package/withslash')).to.equal(
        'https://example.com/node_modules/package-with-slash/index.mjs',
      );
    });

    it('should work when the specifier has punctuation', () => {
      expect(resolveUnderTest('.')).to.equal('https://example.com/lib/dot.mjs');
      expect(resolveUnderTest('..')).to.equal('https://example.com/lib/dotdot.mjs');
      expect(resolveUnderTest('..\\')).to.equal('https://example.com/lib/dotdotbackslash.mjs');
      expect(resolveUnderTest('%2E')).to.equal('https://example.com/lib/percent2e.mjs');
      expect(resolveUnderTest('%2F')).to.equal('https://example.com/lib/percent2f.mjs');
    });

    it('should fail for attempting to get a submodule of something not declared with a trailing slash', () => {
      expect(() => resolveUnderTest('not-a-package/foo')).to.throw(TypeError);
    });
  });

  describe('URL-like specifiers', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "/node_modules/als-polyfill/index.mjs": "std:kv-storage",

        "/lib/foo.mjs": "./more/bar.mjs",
        "./dotrelative/foo.mjs": "/lib/dot.mjs",
        "../dotdotrelative/foo.mjs": "/lib/dotdot.mjs",

        "/lib/no.mjs": null,
        "./dotrelative/no.mjs": [],

        "/": "/lib/slash-only/",
        "./": "/lib/dotslash-only/",

        "/test/": "/lib/url-trailing-slash/",
        "./test/": "/lib/url-trailing-slash-dot/",

        "/test": "/lib/test1.mjs",
        "../test": "/lib/test2.mjs"
      }
    }`);

    it('should remap to other URLs', () => {
      expect(resolveUnderTest('https://example.com/lib/foo.mjs')).to.equal(
        'https://example.com/app/more/bar.mjs',
      );
      expect(resolveUnderTest('https://///example.com/lib/foo.mjs')).to.equal(
        'https://example.com/app/more/bar.mjs',
      );
      expect(resolveUnderTest('/lib/foo.mjs')).to.equal('https://example.com/app/more/bar.mjs');

      expect(resolveUnderTest('https://example.com/app/dotrelative/foo.mjs')).to.equal(
        'https://example.com/lib/dot.mjs',
      );
      expect(resolveUnderTest('../app/dotrelative/foo.mjs')).to.equal(
        'https://example.com/lib/dot.mjs',
      );

      expect(resolveUnderTest('https://example.com/dotdotrelative/foo.mjs')).to.equal(
        'https://example.com/lib/dotdot.mjs',
      );
      expect(resolveUnderTest('../dotdotrelative/foo.mjs')).to.equal(
        'https://example.com/lib/dotdot.mjs',
      );
    });

    it('should fail for URLs that remap to empty arrays', () => {
      expect(() => resolveUnderTest('https://example.com/lib/no.mjs')).to.throw(TypeError);
      expect(() => resolveUnderTest('/lib/no.mjs')).to.throw(TypeError);
      expect(() => resolveUnderTest('../lib/no.mjs')).to.throw(TypeError);

      expect(() => resolveUnderTest('https://example.com/app/dotrelative/no.mjs')).to.throw(
        TypeError,
      );
      expect(() => resolveUnderTest('/app/dotrelative/no.mjs')).to.throw(TypeError);
      expect(() => resolveUnderTest('../app/dotrelative/no.mjs')).to.throw(TypeError);
    });

    it('should remap URLs that are just composed from / and .', () => {
      expect(resolveUnderTest('https://example.com/')).to.equal(
        'https://example.com/lib/slash-only/',
      );
      expect(resolveUnderTest('/')).to.equal('https://example.com/lib/slash-only/');
      expect(resolveUnderTest('../')).to.equal('https://example.com/lib/slash-only/');

      expect(resolveUnderTest('https://example.com/app/')).to.equal(
        'https://example.com/lib/dotslash-only/',
      );
      expect(resolveUnderTest('/app/')).to.equal('https://example.com/lib/dotslash-only/');
      expect(resolveUnderTest('../app/')).to.equal('https://example.com/lib/dotslash-only/');
    });

    it('should remap URLs that are prefix-matched by keys with trailing slashes', () => {
      expect(resolveUnderTest('/test/foo.mjs')).to.equal(
        'https://example.com/lib/url-trailing-slash/foo.mjs',
      );
      expect(resolveUnderTest('https://example.com/app/test/foo.mjs')).to.equal(
        'https://example.com/lib/url-trailing-slash-dot/foo.mjs',
      );
    });

    it("should use the last entry's address when URL-like specifiers parse to the same absolute URL", () => {
      expect(resolveUnderTest('/test')).to.equal('https://example.com/lib/test2.mjs');
    });
  });

  describe('Overlapping entries with trailing slashes', () => {
    it('should favor the most-specific key (no empty arrays)', () => {
      const resolveUnderTest = makeResolveUnderTest(`{
        "imports": {
          "a": "/1",
          "a/": "/2/",
          "a/b": "/3",
          "a/b/": "/4/"
        }
      }`);

      expect(resolveUnderTest('a')).to.equal('https://example.com/1');
      expect(resolveUnderTest('a/')).to.equal('https://example.com/2/');
      expect(resolveUnderTest('a/b')).to.equal('https://example.com/3');
      expect(resolveUnderTest('a/b/')).to.equal('https://example.com/4/');
      expect(resolveUnderTest('a/b/c')).to.equal('https://example.com/4/c');
    });

    it('should favor the most-specific key when empty arrays are involved for less-specific keys', () => {
      const resolveUnderTest = makeResolveUnderTest(`{
        "imports": {
          "a": [],
          "a/": [],
          "a/b": "/3",
          "a/b/": "/4/"
        }
      }`);

      expect(() => resolveUnderTest('a')).to.throw(TypeError);
      expect(() => resolveUnderTest('a/')).to.throw(TypeError);
      expect(() => resolveUnderTest('a/x')).to.throw(TypeError);
      expect(resolveUnderTest('a/b')).to.equal('https://example.com/3');
      expect(resolveUnderTest('a/b/')).to.equal('https://example.com/4/');
      expect(resolveUnderTest('a/b/c')).to.equal('https://example.com/4/c');
      expect(() => resolveUnderTest('a/x/c')).to.throw(TypeError);
    });

    it('should favor the most-specific key when empty arrays are involved for more-specific keys', () => {
      const resolveUnderTest = makeResolveUnderTest(`{
        "imports": {
          "a": "/1",
          "a/": "/2/",
          "a/b": [],
          "a/b/": []
        }
      }`);

      expect(resolveUnderTest('a')).to.equal('https://example.com/1');
      expect(resolveUnderTest('a/')).to.equal('https://example.com/2/');
      expect(resolveUnderTest('a/x')).to.equal('https://example.com/2/x');
      expect(() => resolveUnderTest('a/b')).to.throw(TypeError);
      expect(() => resolveUnderTest('a/b/')).to.throw(TypeError);
      expect(() => resolveUnderTest('a/b/c')).to.throw(TypeError);
      expect(resolveUnderTest('a/x/c')).to.equal('https://example.com/2/x/c');
    });
  });
});
