const { expect } = require('chai');
const { extractModules } = require('../../src/extractModules');

describe('extractModules()', () => {
  it('extracts all modules from a html document', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        name: 'index.html',
        inputHtml:
          '<div>before</div>' +
          '<script type="module" src="./foo.js"></script>' +
          '<script type="module" src="/bar.js"></script>' +
          '<div>after</div>',
        rootDir: '/',
      },
      '/',
    );

    expect(inlineModules.size).to.equal(0);
    expect(moduleImports).to.eql(['/foo.js', '/bar.js']);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });

  it('resolves imports relative to the root dir', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        name: 'index.html',
        inputHtml:
          '<div>before</div>' +
          '<script type="module" src="./foo.js"></script>' +
          '<script type="module" src="/bar.js"></script>' +
          '<div>after</div>',
        rootDir: '/base/',
      },
      '/base/',
    );

    expect(inlineModules.size).to.equal(0);
    expect(moduleImports).to.eql(['/base/foo.js', '/base/bar.js']);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });

  it('resolves relative imports relative to the relative import base', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        name: 'index.html',
        inputHtml:
          '<div>before</div>' +
          '<script type="module" src="./foo.js"></script>' +
          '<script type="module" src="/bar.js"></script>' +
          '<div>after</div>',
        rootDir: '/base-1/base-2/',
      },
      '/base-1/',
    );

    expect(inlineModules.size).to.equal(0);
    expect(moduleImports).to.eql(['/base-1/base-2/foo.js', '/base-1/bar.js']);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });

  it('extracts all inline modules from a html document', () => {
    const { moduleImports, inlineModules, htmlWithoutModules } = extractModules(
      {
        name: 'index.html',
        inputHtml:
          '<div>before</div>' +
          '<script type="module">/* my module 1 */</script>' +
          '<script type="module">/* my module 2 */</script>' +
          '<div>after</div>',
        rootDir: '/base-1/base-2/',
      },

      '/',
    );

    expect([...inlineModules.entries()]).to.eql([
      ['inline-module-index-0', '/* my module 1 */'],
      ['inline-module-index-1', '/* my module 2 */'],
    ]);
    expect(moduleImports).to.eql([]);
    expect(htmlWithoutModules).to.eql(
      '<html><head></head><body><div>before</div><div>after</div></body></html>',
    );
  });
});
