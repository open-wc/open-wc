import chai from 'chai';
import { parseFromString } from '../src/parser.js';
import { resolve } from '../src/resolver.js';
import { BUILT_IN_MODULE_SCHEME } from '../src/utils.js';

const { expect } = chai;

const mapBaseURL = 'https://example.com/app/index.html';
const scriptURL = 'https://example.com/js/app.mjs';

const BLANK = `${BUILT_IN_MODULE_SCHEME}:blank`;

function makeResolveUnderTest(mapString) {
  const map = parseFromString(mapString, mapBaseURL);
  return specifier => resolve(specifier, map, scriptURL);
}

describe('Fallbacks that are not [built-in, fetch scheme]', () => {
  const resolveUnderTest = makeResolveUnderTest(`{
    "imports": {
      "bad1": [
        "${BLANK}",
        "${BLANK}"
      ],
      "bad2": [
        "${BLANK}",
        "/bad2-1.mjs",
        "/bad2-2.mjs"
      ],
      "bad3": [
        "/bad3-1.mjs",
        "/bad3-2.mjs"
      ]
    }
  }`);

  it('should fail for [built-in, built-in]', () => {
    expect(() => resolveUnderTest('bad1')).to.throw(/not yet implemented/);
  });

  it('should fail for [built-in, fetch scheme, fetch scheme]', () => {
    expect(() => resolveUnderTest('bad2')).to.throw(/not yet implemented/);
  });

  it('should fail for [fetch scheme, fetch scheme]', () => {
    expect(() => resolveUnderTest('bad3')).to.throw(/not yet implemented/);
  });
});
