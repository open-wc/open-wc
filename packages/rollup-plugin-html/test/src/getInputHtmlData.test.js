/** @typedef {import('../../src/types').HtmlFile} HtmlFile */

const { expect } = require('chai');
const path = require('path');
const { getInputHtmlData } = require('../../src/getInputHtmlData');

const rootDir = path.join(__dirname, '..', 'fixtures', 'getInputHtmlData');

/** @param {string} str */
function cleanupHtml(str) {
  return str.replace(/(\r\n|\n|\r| )/gm, '');
}

/** @param {HtmlFile[]} result */
function cleanupResult(result) {
  return result.map(item => ({
    ...item,
    html: cleanupHtml(item.html),
  }));
}

describe('getInputHtmlData()', () => {
  it('supports setting "files" as input in plugin options', () => {
    const result = getInputHtmlData({ files: 'index.html', rootDir });
    expect(cleanupResult(result)).to.eql([
      {
        rootDir,
        name: 'index.html',
        html: '<html>index.html</html>',
      },
    ]);
  });

  it('supports glob "files" string in combination with "flatten: false"', () => {
    const result = getInputHtmlData({ files: '**/*.html', flatten: false, rootDir });
    expect(cleanupResult(result)).to.eql([
      {
        rootDir,
        name: 'index.html',
        html: '<html>index.html</html>',
      },
      {
        rootDir,
        name: 'not-index.html',
        html: '<html>not-index.html</html>',
      },
      {
        rootDir: `${rootDir}/pages`,
        name: 'pages/page-a.html',
        html: '<html>page-a.html</html>',
      },
    ]);
  });

  it('supports setting files as rollup input', () => {
    const result = getInputHtmlData({ rootDir }, 'index.html');
    expect(cleanupResult(result)).to.eql([
      {
        rootDir,
        name: 'index.html',
        html: '<html>index.html</html>',
      },
    ]);
  });

  it('path from plugin takes precedence over rollup input', () => {
    const result = getInputHtmlData({ files: 'not-index.html', rootDir }, 'index.html');

    expect(cleanupResult(result)).to.eql([
      {
        rootDir,
        name: 'not-index.html',
        html: '<html>not-index.html</html>',
      },
    ]);
  });

  it('supports setting html string as input', () => {
    const result = getInputHtmlData({ name: 'foo.html', html: '<html>foo</html>', rootDir });
    expect(cleanupResult(result)).to.eql([
      {
        name: 'foo.html',
        rootDir,
        html: '<html>foo</html>',
      },
    ]);
  });

  it('supports setting multiple html strings as input', () => {
    const result = getInputHtmlData({
      rootDir,
      html: [
        {
          name: 'foo.html',
          html: '<html>foo</html>',
          rootDir,
        },
        {
          name: 'bar.html',
          html: '<html>bar</html>',
          rootDir,
        },
      ],
    });
    expect(cleanupResult(result)).to.eql([
      {
        name: 'foo.html',
        rootDir,
        html: '<html>foo</html>',
      },
      {
        name: 'bar.html',
        rootDir,
        html: '<html>bar</html>',
      },
    ]);
  });

  it('supports setting path with segments as input', () => {
    const result = getInputHtmlData({ files: 'pages/page-a.html', rootDir });
    expect(cleanupResult(result)).to.eql([
      {
        rootDir: path.join(rootDir, 'pages'),
        name: 'page-a.html',
        html: '<html>page-a.html</html>',
      },
    ]);
  });

  it('throws when no files or html is given', () => {
    expect(() => getInputHtmlData({ name: 'index.html', rootDir })).to.throw('');
  });
});
