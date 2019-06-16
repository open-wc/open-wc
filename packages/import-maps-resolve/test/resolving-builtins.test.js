import chai from 'chai';
import { parseFromString } from '../src/parser.js';
import { resolve } from '../src/resolver.js';
import { BUILT_IN_MODULE_SCHEME } from '../src/utils.js';

const { expect } = chai;

const mapBaseURL = 'https://example.com/app/index.html';
const scriptURL = 'https://example.com/js/app.mjs';

const BLANK = `${BUILT_IN_MODULE_SCHEME}:blank`;
const NONE = `${BUILT_IN_MODULE_SCHEME}:none`;

function makeResolveUnderTest(mapString) {
  const map = parseFromString(mapString, mapBaseURL);
  return specifier => resolve(specifier, map, scriptURL);
}

describe('Unmapped built-in module specifiers', () => {
  const resolveUnderTest = makeResolveUnderTest(`{}`);

  it(`should resolve "${BLANK}" to "${BLANK}"`, () => {
    expect(resolveUnderTest(BLANK)).to.equal(BLANK);
  });

  it(`should error resolving "${NONE}"`, () => {
    expect(() => resolveUnderTest(NONE)).to.throw(TypeError);
  });
});

describe('Remapping built-in module specifiers', () => {
  it('should remap built-in modules', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "${BLANK}": "./blank.mjs",
        "${NONE}": "./none.mjs"
      }
    }`);

    expect(resolveUnderTest(BLANK)).to.equal('https://example.com/app/blank.mjs');
    expect(resolveUnderTest(NONE)).to.equal('https://example.com/app/none.mjs');
  });

  it('should remap built-in modules with fallbacks', () => {
    const resolveUnderTest = makeResolveUnderTest(`{
      "imports": {
        "${BLANK}": ["${BLANK}", "./blank.mjs"],
        "${NONE}": ["${NONE}", "./none.mjs"]
      }
    }`);

    expect(resolveUnderTest(BLANK)).to.equal(BLANK);
    expect(resolveUnderTest(NONE)).to.equal('https://example.com/app/none.mjs');
  });
});

describe('Remapping to built-in modules', () => {
  const resolveUnderTest = makeResolveUnderTest(`{
    "imports": {
      "blank": "${BLANK}",
      "/blank": "${BLANK}",
      "none": "${NONE}",
      "/none": "${NONE}"
    }
  }`);

  it(`should remap to "${BLANK}"`, () => {
    expect(resolveUnderTest('blank')).to.equal(BLANK);
    expect(resolveUnderTest('/blank')).to.equal(BLANK);
  });

  it(`should remap to "${BLANK}" for URL-like specifiers`, () => {
    expect(resolveUnderTest('/blank')).to.equal(BLANK);
    expect(resolveUnderTest('https://example.com/blank')).to.equal(BLANK);
    expect(resolveUnderTest('https://///example.com/blank')).to.equal(BLANK);
  });

  it(`should fail when remapping to "${NONE}"`, () => {
    expect(() => resolveUnderTest('none')).to.throw(TypeError);
    expect(() => resolveUnderTest('/none')).to.throw(TypeError);
  });
});

describe('Fallbacks with built-in module addresses', () => {
  const resolveUnderTest = makeResolveUnderTest(`{
    "imports": {
      "blank": [
        "${BLANK}",
        "./blank-fallback.mjs"
      ],
      "none": [
        "${NONE}",
        "./none-fallback.mjs"
      ]
    }
  }`);

  it(`should resolve to "${BLANK}"`, () => {
    expect(resolveUnderTest('blank')).to.equal(BLANK);
  });

  it(`should fall back past "${NONE}"`, () => {
    expect(resolveUnderTest('none')).to.equal('https://example.com/app/none-fallback.mjs');
  });
});
