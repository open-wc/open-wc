const chai = require('chai');
const { createSwPath } = require('../src/utils.js');

const { expect } = chai;

describe('createSwPath', () => {
  it('uses the workbox configs swDest as swPath if provided by user', () => {
    expect(
      createSwPath(
        {
          workbox: {
            swDest: './foo.js',
          },
        },
        'dist',
        'index.html',
      ),
    ).to.equal('foo.js');
  });

  it('uses "sw.js" as swPath if no swDest is provided by the workbox config', () => {
    expect(
      createSwPath(
        {
          workbox: {
            globDirectory: 'bar',
          },
        },
        'dist',
        'index.html',
      ),
    ).to.equal('sw.js');
  });

  it('returns "sw.js" as swPath if the workbox property is a boolean', () => {
    expect(
      createSwPath(
        {
          workbox: true,
        },
        'dist',
        'index.html',
      ),
    ).to.equal('sw.js');
    expect(
      createSwPath(
        {
          workbox: false,
        },
        'dist',
        'index.html',
      ),
    ).to.equal('sw.js');
  });
});
