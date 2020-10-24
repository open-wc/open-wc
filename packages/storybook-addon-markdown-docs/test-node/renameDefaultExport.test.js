const { expect } = require('chai');

const { renameDefaultExport } = require('../src/renameDefaultExport');

describe('renameDefaultExport', () => {
  it('renames the default export of a code string', () => {
    const input = 'export default { title: "My docs" }';

    const output = renameDefaultExport(input, '/foo.js').split('\n');

    expect(output).to.eql([
      //
      'const __export_default__ = {',
      '  title: "My docs"',
      '};',
    ]);
  });

  it('handles multiline default export', () => {
    const input = [
      //
      'export default {',
      '  title: "My docs",',
      '  foo: "bar"',
      '};',
    ].join('\n');

    const output = renameDefaultExport(input, '/foo.js').split('\n');

    expect(output).to.eql([
      //
      'const __export_default__ = {',
      '  title: "My docs",',
      '  foo: "bar"',
      '};',
    ]);
  });

  it('handles default exported variable', () => {
    const input = [
      //
      'const myExport = { title: "My docs" }',
      'export default myExport;',
    ].join('\n');

    const output = renameDefaultExport(input, '/foo.js').split('\n');

    expect(output).to.eql([
      //
      'const myExport = {',
      '  title: "My docs"',
      '};',
      'const __export_default__ = myExport;',
    ]);
  });

  it('preserves code order', () => {
    const input = [
      //
      'const foo = "bar";',
      'export default { title: "My docs" };',
      'console.log("hello world");',
    ].join('\n');

    const output = renameDefaultExport(input, '/foo.js').split('\n');

    expect(output).to.eql([
      //
      'const foo = "bar";',
      'const __export_default__ = {',
      '  title: "My docs"',
      '};',
      'console.log("hello world");',
    ]);
  });

  it('throws when there is no default export', () => {
    expect(() => renameDefaultExport('', '/foo.js')).to.throw();
    expect(() => renameDefaultExport('const foo = "bar"', '/foo.js')).to.throw();
  });

  it('creats a babel code frame error when there was an error parsing', () => {
    const code = [
      //
      "const foo1 = 'bar';",
      "const bar1 = 'foo';",
      '      "',
      "const foo2 = 'bar';",
      "const bar2 = 'foo';",
    ].join('\n');

    let error;
    try {
      renameDefaultExport(code, '/foo.js', false);
    } catch (_error) {
      error = _error;
    }
    expect(error.message.split('\n')).to.eql([
      'Unterminated string constant (3:6)',
      '',
      "  1 | const foo1 = 'bar';",
      "  2 | const bar1 = 'foo';",
      '> 3 |       "',
      '    |      ^',
      "  4 | const foo2 = 'bar';",
      "  5 | const bar2 = 'foo';",
    ]);
  });
});
