const { expect } = require('chai');
const { parse } = require('parse5');
const { getAttribute, getTextContent } = require('../dom5-fork');
const { findJsScripts, findImportMapScripts } = require('../dom5-utils');

const htmlString = `
  <html>
    <head>
      <script type="module" src="module-a.js"></script>
      <script src="script-a.js"></script>
      <script type="importmap">{ "imports": {} }</script>
      <script type="importmap" src="./importmap.json"></script>
    </head>
    <body>
      <script type="module" src="module-b.js"></script>
      <script src="script-b.js"></script>
      <script type="module">console.log('hello module');</script>
      <script>console.log('hello script');</script>
      <script type="module" src="module-c.js"></script>
      <script src="script-c.js"></script>
    </body>
  </html>
`;

describe('findJsScripts', () => {
  it('returns all external scripts', () => {
    const scripts = findJsScripts(parse(htmlString), {
      jsScripts: false,
      inlineJsScripts: true,
      jsModules: true,
      inlineJsModules: true,
    });
    const result = scripts.map(scr => getAttribute(scr, 'src') || getTextContent(scr));

    expect(result).to.eql(['script-a.js', 'script-b.js', 'script-c.js']);
  });

  it('returns all inline scripts', () => {
    const scripts = findJsScripts(parse(htmlString), {
      jsScripts: true,
      inlineJsScripts: false,
      jsModules: true,
      inlineJsModules: true,
    });
    const result = scripts.map(scr => getAttribute(scr, 'src') || getTextContent(scr));

    expect(result).to.eql(["console.log('hello script');"]);
  });

  it('returns all external modules', () => {
    const scripts = findJsScripts(parse(htmlString), {
      jsScripts: true,
      inlineJsScripts: true,
      jsModules: false,
      inlineJsModules: true,
    });
    const result = scripts.map(scr => getAttribute(scr, 'src') || getTextContent(scr));

    expect(result).to.eql(['module-a.js', 'module-b.js', 'module-c.js']);
  });

  it('returns all inline modules', () => {
    const scripts = findJsScripts(parse(htmlString), {
      jsScripts: true,
      inlineJsScripts: true,
      jsModules: true,
      inlineJsModules: false,
    });
    const result = scripts.map(scr => getAttribute(scr, 'src') || getTextContent(scr));

    expect(result).to.eql(["console.log('hello module');"]);
  });

  it('returns all scripts', () => {
    const scripts = findJsScripts(parse(htmlString), {
      jsScripts: false,
      jsModules: false,
      inlineJsScripts: false,
      inlineJsModules: false,
    });
    const result = scripts.map(scr => getAttribute(scr, 'src') || getTextContent(scr));

    expect(result).to.eql([
      'script-a.js',
      'script-b.js',
      "console.log('hello script');",
      'script-c.js',
      'module-a.js',
      'module-b.js',
      "console.log('hello module');",
      'module-c.js',
    ]);
  });

  it('does not return scripts which reference a URL', () => {
    const html = parse(`
      <script src="http://my.cdn.com/false"></script>
      <script src="http://localhost:5000/bar"></script>
      <script src="app.js"></script>
    `);
    const scripts = findJsScripts(html, { jsScripts: false });
    const result = scripts.map(scr => getAttribute(scr, 'src') || getTextContent(scr));
    expect(result).to.eql(['app.js']);
  });
});

describe('findImportMapScripts', () => {
  it('returns import maps in the document', () => {
    const result = findImportMapScripts(parse(htmlString));
    const external = result.external.map(scr => getAttribute(scr, 'src'));
    const inline = result.inline.map(scr => getTextContent(scr));

    expect(external).to.eql(['./importmap.json']);
    expect(inline).to.eql(['{ "imports": {} }']);
  });
});
