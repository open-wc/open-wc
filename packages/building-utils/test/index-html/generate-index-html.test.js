const { expect } = require('chai');
const { parse } = require('parse5');
const path = require('path');
const fs = require('fs');
const { createIndexHTML } = require('../../index-html');

const updateSnapshots = process.argv.includes('--update-snapshots');

const indexHTML = `
<html lang="en-GB">

<head>
  <title>My app</title>
  <style>
    my-app {
      display: block;
    }
  </style>
</head>

<body>
  <h1>
    <span>
      Hello world!
    </span>
  </h1>
  <my-app></my-app>
</body>

</html>
`;

async function testSnapshot(name, config) {
  const snapshotPath = path.join(__dirname, 'snapshots', 'create-index-html', `${name}.html`);
  const ast = parse(indexHTML);
  const result = await createIndexHTML(ast, config);

  if (updateSnapshots) {
    fs.writeFileSync(snapshotPath, result.indexHTML, 'utf-8');
  } else {
    const snapshot = fs.readFileSync(snapshotPath, 'utf-8');
    expect(result.indexHTML).to.equal(snapshot);
  }
}

describe('generate-index-html', () => {
  it('generates a index.html with module', () => {
    testSnapshot('module', {
      entries: { type: 'module', files: ['app.js'] },
    });
  });

  it('generates a index.html with a script entry', () => {
    testSnapshot('script', {
      entries: { type: 'script', files: ['app.js', 'shared.js'] },
    });
  });

  it('generates a index.html with a system entry', () => {
    testSnapshot('system', {
      entries: { type: 'system', files: ['app.js', 'shared.js'] },
    });
  });

  it('generates a index.html with a module and legacy system', () => {
    testSnapshot('module-system', {
      entries: { type: 'module', files: ['app.js'] },
      legacyEntries: { type: 'system', files: ['legacy/app.js'] },
    });
  });

  it('generates a index.html with core-js polyfills', () => {
    testSnapshot('polyfill-core-js', {
      entries: { type: 'module', files: ['app.js'] },
      polyfills: {
        coreJs: true,
      },
    });
  });

  it('generates a index.html with webcomponents polyfills', () => {
    testSnapshot('polyfill-wc', {
      entries: { type: 'module', files: ['app.js'] },
      polyfills: {
        webcomponents: true,
      },
    });
  });

  it('generates a index.html with dynamic import polyfills', () => {
    testSnapshot('dynamic-import', {
      entries: { type: 'module', files: ['app.js'] },
      polyfills: {
        dynamicImport: true,
      },
    });
  });

  it('generates a index.html with multiple polyfills', () => {
    testSnapshot('polyfill-multiple', {
      entries: { type: 'module', files: ['app.js'] },
      polyfills: {
        coreJs: true,
        webcomponents: true,
        fetch: true,
        dynamicImport: true,
        customPolyfills: [
          {
            name: 'custom-a',
            test: "'foo' in window",
            path: path.resolve(__dirname, '../custom-polyfills/polyfill-a.js'),
          },
          {
            name: 'custom-b',
            nomodule: true,
            path: path.resolve(__dirname, '../custom-polyfills/polyfill-b.js'),
          },
        ],
      },
    });
  });

  it('generates a index.html with legacy and polyfills', () => {
    testSnapshot('polyfill-multiple-legacy', {
      entries: { type: 'module', files: ['app.js'] },
      legacyEntries: { type: 'system', files: ['legacy/app.js'] },
      polyfills: {
        coreJs: true,
        webcomponents: true,
      },
    });
  });
});
