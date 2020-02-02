/** @typedef {import('@mdjs/core').Story} Story */

const { expect } = require('chai');
const { jsxToJs } = require('../src/jsxToJs');

describe('jsxToJs', () => {
  it('turns MD into JSX', async () => {
    const input = `
function render() {
  return <MyComponent />;
}
`;
    expect(await jsxToJs(input, '/foo')).to.equal(`function render() {
  return React.createElement(MyComponent, null);
}`);
  });

  it('does not transform es2015', async () => {
    const input = 'export default () => <MyComponent />;';
    expect(await jsxToJs(input, '/foo')).to.equal(
      'export default (() => React.createElement(MyComponent, null));',
    );
  });

  it('does not transform es2018', async () => {
    const input = 'const foo = {...bar}';
    expect(await jsxToJs(input, '/foo')).to.equal('const foo = { ...bar\n};');
  });

  it('does not transform es2020', async () => {
    const input = "console.log(foo?.bar ?? 'buz')";
    expect(await jsxToJs(input, '/foo')).to.equal("console.log(foo?.bar ?? 'buz');");
  });

  it('can parse import.meta.url', async () => {
    const input = 'console.log(import.meta.url)';
    expect(await jsxToJs(input, '/foo')).to.equal('console.log(import.meta.url);');
  });

  it('can parse dynamic import', async () => {
    const input = "import('foo')";
    expect(await jsxToJs(input, '/foo')).to.equal("import('foo');");
  });

  it('handles empty input', async () => {
    expect(await jsxToJs('', '/foo')).to.equal('');
  });
});
