const { expect } = require('chai');
const path = require('path');
const { extractModules } = require('../../src/extractModules');

describe('extractModules()', () => {
  it('extracts all modules from a html document', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        inputHtml:
          '<div>before</div>' +
          '<script type="module" src="./foo.js"></script>' +
          '<script type="module" src="/bar.js"></script>' +
          '<div>after</div>',
        rootDir: '/',
      },
      'index.html',
      '/',
    );

    expect(inlineModules.size).to.equal(0);
    expect(moduleImports).to.eql([`${path.sep}foo.js`, `${path.sep}bar.js`]);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });

  it('resolves imports relative to the root dir', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        inputHtml:
          '<div>before</div>' +
          '<script type="module" src="./foo.js"></script>' +
          '<script type="module" src="/bar.js"></script>' +
          '<div>after</div>',
        rootDir: '/base/',
      },
      'index.html',
      '/base/',
    );

    expect(inlineModules.size).to.equal(0);
    expect(moduleImports).to.eql([
      `${path.sep}base${path.sep}foo.js`,
      `${path.sep}base${path.sep}bar.js`,
    ]);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });

  it('resolves relative imports relative to the relative import base', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        inputHtml:
          '<div>before</div>' +
          '<script type="module" src="./foo.js"></script>' +
          '<script type="module" src="/bar.js"></script>' +
          '<div>after</div>',
        rootDir: '/base-1/base-2/',
      },
      'index.html',
      '/base-1/',
    );

    expect(inlineModules.size).to.equal(0);
    expect(moduleImports).to.eql([
      `${path.sep}base-1${path.sep}base-2${path.sep}foo.js`,
      `${path.sep}base-1${path.sep}bar.js`,
    ]);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });

  it('extracts all inline modules from a html document', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        inputHtml:
          '<div>before</div>' +
          '<script type="module">/* my module 1 */</script>' +
          '<script type="module">/* my module 2 */</script>' +
          '<div>after</div>',
        rootDir: '/',
      },
      'index.html',
      '/',
    );

    expect([...inlineModules.entries()]).to.eql([
      ['/inline-module-index-0.js', '/* my module 1 */'],
      ['/inline-module-index-1.js', '/* my module 2 */'],
    ]);
    expect(moduleImports).to.eql([]);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });

  it('prefixes inline module with index.html directory', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        inputHtml:
          '<div>before</div>' +
          '<script type="module">/* my module 1 */</script>' +
          '<script type="module">/* my module 2 */</script>' +
          '<div>after</div>',
        rootDir: '/foo/bar/',
      },
      'foo/bar/index.html',
      '/',
    );

    expect([...inlineModules.entries()]).to.eql([
      ['/foo/bar/inline-module-index-0.js', '/* my module 1 */'],
      ['/foo/bar/inline-module-index-1.js', '/* my module 2 */'],
    ]);
    expect(moduleImports).to.eql([]);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });
});
