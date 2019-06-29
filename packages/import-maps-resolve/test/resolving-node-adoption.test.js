import chai from 'chai';
import { parseFromString } from '../src/parser.js';
import { resolve } from '../src/resolver.js';

const { expect } = chai;

const mapBaseURL = '/home/foo/project-a::/app/index.js';
const scriptURL = '/home/foo/project-a::/js/app.js';

function makeResolveUnderTest(mapString) {
  const map = parseFromString(mapString, mapBaseURL);
  return specifier => resolve(specifier, map, scriptURL);
}

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
        '/home/foo/project-a/node_modules/moment/src/moment.js',
      );
      expect(resolveUnderTest('lodash-dot')).to.equal(
        '/home/foo/project-a/app/node_modules/lodash-es/lodash.js',
      );
      expect(resolveUnderTest('lodash-dotdot')).to.equal(
        '/home/foo/project-a/node_modules/lodash-es/lodash.js',
      );
    });

    it('should work for package submodules', () => {
      expect(resolveUnderTest('moment/foo')).to.equal(
        '/home/foo/project-a/node_modules/moment/src/foo',
      );
      expect(resolveUnderTest('lodash-dot/foo')).to.equal(
        '/home/foo/project-a/app/node_modules/lodash-es/foo',
      );
      expect(resolveUnderTest('lodash-dotdot/foo')).to.equal(
        '/home/foo/project-a/node_modules/lodash-es/foo',
      );
    });

    it('should work for package names that end in a slash by just passing through', () => {
      // TODO: is this the right behavior, or should we throw?
      expect(resolveUnderTest('moment/')).to.equal('/home/foo/project-a/node_modules/moment/src/');
    });

    it('should still fail for package modules that are not declared', () => {
      expect(() => resolveUnderTest('underscore/')).to.throw(TypeError);
      expect(() => resolveUnderTest('underscore/foo')).to.throw(TypeError);
    });

    it('should fail for package submodules that map to nowhere', () => {
      expect(() => resolveUnderTest('nowhere/foo')).to.throw(TypeError);
    });
  });
});

describe('Unmapped', () => {
  const resolveUnderTest = makeResolveUnderTest(`{}`);

  it('should resolve ./ specifiers as URLs', () => {
    expect(resolveUnderTest('./foo')).to.equal('/home/foo/project-a/js/foo');
    expect(resolveUnderTest('./foo/bar')).to.equal('/home/foo/project-a/js/foo/bar');
    expect(resolveUnderTest('./foo/../bar')).to.equal('/home/foo/project-a/js/bar');
    expect(resolveUnderTest('./foo/../../bar')).to.equal('/home/foo/project-a/bar');
  });

  it('should resolve ../ specifiers as URLs', () => {
    expect(resolveUnderTest('../foo')).to.equal('/home/foo/project-a/foo');
    expect(resolveUnderTest('../foo/bar')).to.equal('/home/foo/project-a/foo/bar');
    // TODO: do not allow to go up higher then root path
    // expect(resolveUnderTest('../../../foo/bar')).to.equal('/home/foo/project-a/foo/bar');
  });

  it('should resolve / specifiers as URLs', () => {
    expect(resolveUnderTest('/foo')).to.equal('/home/foo/project-a/foo');
    expect(resolveUnderTest('/foo/bar')).to.equal('/home/foo/project-a/foo/bar');
    // TODO: do not allow to go up higher then root path
    // expect(resolveUnderTest('/../../foo/bar')).to.equal('/home/foo/project-a/foo/bar');
    // expect(resolveUnderTest('/../foo/../bar')).to.equal('/home/foo/project-a/bar');
  });
});
