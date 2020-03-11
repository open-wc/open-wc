const { expect } = require('chai');
const path = require('path');
const { getInputHtmlData } = require('../../src/getInputHtmlData');

const rootDir = path.join(__dirname, '..', 'fixtures', 'getInputHtmlData');

describe('getInputHtmlData()', () => {
  it('supports setting path as input in plugin options', () => {
    const options = { inputPath: 'index.html' };
    const result = getInputHtmlData(options, undefined, rootDir);

    expect(result).to.eql({
      rootDir,
      name: 'index.html',
      inputHtml: '<html>index.html\n\n</html>',
    });
  });

  it('supports setting path as rollup input', () => {
    const result = getInputHtmlData({}, 'index.html', rootDir);

    expect(result).to.eql({
      rootDir,
      name: 'index.html',
      inputHtml: '<html>index.html\n\n</html>',
    });
  });

  it('path from plugin takes presedence over rollup input', () => {
    const options = { inputPath: 'not-index.html' };
    const result = getInputHtmlData(options, 'index.html', rootDir);

    expect(result).to.eql({
      rootDir,
      name: 'not-index.html',
      inputHtml: '<html>not-index.html\n\n</html>',
    });
  });

  it('supports setting html string as input', () => {
    const options = { name: 'foo.html', inputHtml: '<html>My HTML</html>' };
    const result = getInputHtmlData(options, undefined, rootDir);

    expect(result).to.eql({
      name: 'foo.html',
      rootDir,
      inputHtml: options.inputHtml,
    });
  });

  it('supports setting path with segments as input', () => {
    const options = {
      inputPath: 'pages/page-a.html',
    };
    const result = getInputHtmlData(options, undefined, rootDir);

    expect(result).to.eql({
      rootDir: path.join(rootDir, 'pages'),
      name: 'page-a.html',
      inputHtml: '<html>page-a.html\n\n</html>',
    });
  });

  it('throws when no inputPath or inputHtml is given', () => {
    const options = {
      name: 'index.html',
    };
    expect(() => getInputHtmlData(options, undefined, rootDir)).to.throw();
  });
});
