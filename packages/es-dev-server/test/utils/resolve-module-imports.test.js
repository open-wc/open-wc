import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import { resolveModuleImports } from '../../src/utils/resolve-module-imports.js';

const updateSnapshots = process.argv.includes('--update-snapshots');
const snapshotsDir = path.resolve(__dirname, '..', 'snapshots', 'resolve-module-imports');

const baseDir = path.resolve(__dirname, '..', 'fixtures', 'simple');
const sourceFileName = path.resolve(baseDir, 'src', 'foo.js');

const defaultConfig = {
  fileExtensions: ['.mjs', '.js'],
  moduleDirectories: ['node_modules'],
  preserveSymlinks: false,
};

async function expectMatchesSnapshot(name, source, configOverrides = {}) {
  const file = path.resolve(snapshotsDir, `${name}.js`);
  const resolvedSource = await resolveModuleImports(baseDir, sourceFileName, source, {
    ...defaultConfig,
    ...configOverrides,
  });

  if (updateSnapshots) {
    fs.writeFileSync(file, resolvedSource, 'utf-8');
  } else {
    if (!fs.existsSync(file)) {
      throw new Error(`Snapshot ${name} does not exist.`);
    }

    const snapshot = fs.readFileSync(file, 'utf-8');
    expect(resolvedSource).to.equal(snapshot);
  }
}

describe('resolve-module-imports', () => {
  it('resolves bare imports', async () => {
    await expectMatchesSnapshot(
      'basic-imports',
      `
      import 'my-module';
      import foo from 'my-module';
      import { bar } from 'my-module';
    `,
    );
  });

  it('resolves basic exports', async () => {
    await expectMatchesSnapshot(
      'basic-exports',
      `
      export * from 'my-module';
      export { foo } from 'my-module';
    `,
    );
  });

  it('resolves imports to a folder with index.js', async () => {
    await expectMatchesSnapshot(
      'folder-index-js',
      `
      import 'my-module/bar';
    `,
    );
  });

  it('resolves imports to a file with bare import', async () => {
    await expectMatchesSnapshot(
      'folder-index-js',
      `
      import 'my-module/bar/index.js';
    `,
    );
  });

  it('resolves using the module field from a package.json', async () => {
    await expectMatchesSnapshot(
      'module-field',
      `
      import 'my-module-2';
    `,
    );
  });

  it('does not resolve imports with configured file extensions', async () => {
    await expectMatchesSnapshot(
      'configured-extenions',
      `
      import './local-module.js';
      import '../local-module.js';
      import './../local-module.js';
      import '../../local-module.js';
      import '/local-module.js';
      import 'my-module';
    `,
    );
  });

  it('does resolve imports with non-configured file extensions', async () => {
    await expectMatchesSnapshot(
      'not-configured-extenions',
      `
      import './styles.css';
    `,
    );
  });

  it('favors .mjs over .js', async () => {
    await expectMatchesSnapshot(
      'mjs',
      `
      import './foo';
    `,
    );
  });

  it('adds file extensions to non-bare imports', async () => {
    await expectMatchesSnapshot(
      'file-extension',
      `
      import './local-module';
      import 'my-module';
    `,
    );
  });

  it('resolves dynamic imports', async () => {
    await expectMatchesSnapshot(
      'dynamic imports',
      `
      import 'my-module';

      function lazyLoad() {
        return import('my-module-2');
      }

      import('my-module');

      import('./local-module.js');
    `,
    );
  });

  it('does not touch import.meta.url', async () => {
    await expectMatchesSnapshot(
      'import-meta',
      `
      import 'my-module';

      console.log(import.meta.url);
    `,
    );
  });

  it('does not touch comments', async () => {
    await expectMatchesSnapshot(
      'comments',
      `
      import 'my-module';

      /**
       * Example: import 'my-module';
       * import('my-module.js');
       */
      function doSomething() {

      }
    `,
    );
  });

  it('does not touch urls', async () => {
    await expectMatchesSnapshot(
      'urls',
      `
      import 'https://my-cdn.com/my-package.js';
    `,
    );
  });

  it('handles imports with query params or hashes', async () => {
    await expectMatchesSnapshot(
      'query-params-and-hashes',
      `
      import 'my-module?foo=bar';
      import 'my-module#foo';
      import 'my-module?foo=bar#bar';
      import './local-module.js?foo=bar';
      import './local-module.js#foo';
      import './local-module.js?foo=bar#bar';

      import('my-module?foo=bar');
      import('my-module#foo');
      import('my-module?foo=bar#bar');
      import('./local-module.js?foo=bar');
      import('./local-module.js#foo');
      import('./local-module.js?foo=bar#bar');
    `,
    );
  });

  it('does not get confused by import in regular code', async () => {
    await expectMatchesSnapshot(
      'import-in-code',
      `
      function myimport() {

      }

      function my_import() {

      }

      function importShim() {

      }

      class Foo {
        import() {
          return 'foo';
        }
      }
    `,
    );
  });

  it('resolves the package of dynamic imports with string concatenation', async () => {
    await expectMatchesSnapshot(
      'string-concatenation',
      `const file = 'a';
       import(\`@namespace/my-module-3/dynamic-files/\${file}.js\`);
       import(\`my-module/dynamic-files/\${file}.js\`);
       import('my-module/dynamic-files' + '/' + file + '.js');
       import("my-module/dynamic-files/" + file + ".js");
       import('my-module/dynamic-files'.concat(file).concat('.js'));
    `,
    );
  });

  it('does not throw an error when a dynamic import with string concatenation cannot be resolved', async () => {
    await expectMatchesSnapshot(
      'string-concat-errors',
      `const file = 'a';
       import(\`@namespace/non-existing/dynamic-files/\${file}.js\`);
       import(\`non-existing/dynamic-files/\${file}.js\`);
       import(totallyDynamic);
       import(\`\${file}.js\`);
    `,
    );
  });

  it('throws when it cannot find an import', async () => {
    let thrown = false;

    try {
      await resolveModuleImports(baseDir, sourceFileName, 'import "nope";', defaultConfig);
    } catch (error) {
      thrown = true;
      expect(error.message).to.equal(
        `Could not resolve "import { ... } from 'nope';" in "./src/foo.js".`,
      );
    }

    expect(thrown).to.equal(true);
  });
});
