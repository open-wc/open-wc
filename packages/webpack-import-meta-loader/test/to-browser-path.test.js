const { expect } = require('chai');
const toBrowserPath = require('../src/to-browser-path');

describe('toBrowserPath', () => {
  it('replaces all path windows separators', () => {
    // @ts-ignore
    expect(toBrowserPath('foo\\bar\\buz', { sep: '\\' })).to.equal('foo/bar/buz');
  });

  it('preserves all unix path separators', () => {
    // @ts-ignore
    expect(toBrowserPath('foo/bar/buz', { sep: '/' })).to.equal('foo/bar/buz');
  });
});
