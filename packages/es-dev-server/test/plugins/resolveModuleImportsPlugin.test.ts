import path from 'path';
import { expect } from 'chai';
import fetch from 'node-fetch';
import {
  resolveModuleImports,
  resolveModuleImportsPlugin,
} from '../../src/plugins/resolveModuleImportsPlugin';
import { startServer } from '../../src/start-server';
import { createConfig } from '../../src/config';
import { Plugin } from '../../src/Plugin';

const defaultFilePath = '/root/my-file.js';
const defaultResolveImport = src => `RESOLVED__${src}`;

describe('resolveModuleImports()', () => {
  it('resolves regular imports', async () => {
    const result = await resolveModuleImports(
      [
        'import "my-module";',
        'import foo from "my-module";',
        'import { bar } from "my-module";',
        'import "./my-module.js";',
        'import "https://my-cdn.com/my-package.js";',
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );

    expect(result.split('\n')).to.eql([
      'import "RESOLVED__my-module";',
      'import foo from "RESOLVED__my-module";',
      'import { bar } from "RESOLVED__my-module";',
      'import "RESOLVED__./my-module.js";',
      'import "RESOLVED__https://my-cdn.com/my-package.js";',
    ]);
  });

  it('resolves basic exports', async () => {
    const result = await resolveModuleImports(
      [
        //
        "export * from 'my-module';",
        "export { foo } from 'my-module';",
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );

    expect(result.split('\n')).to.eql([
      //
      "export * from 'RESOLVED__my-module';",
      "export { foo } from 'RESOLVED__my-module';",
    ]);
  });

  it('resolves imports to a file with bare import', async () => {
    const result = await resolveModuleImports(
      "import 'my-module/bar/index.js'",
      defaultFilePath,
      defaultResolveImport,
    );

    expect(result).to.eql("import 'RESOLVED__my-module/bar/index.js");
  });

  it('resolves dynamic imports', async () => {
    const result = await resolveModuleImports(
      [
        'function lazyLoad() { return import("my-module-2"); }',
        'import("my-module");',
        'import("./local-module.js");',
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );

    expect(result.split('\n')).to.eql([
      'function lazyLoad() { return import("RESOLVED__my-module-2"); }',
      'import("RESOLVED__my-module");',
      'import("RESOLVED__./local-module.js");',
    ]);
  });

  it('does not touch import.meta.url', async () => {
    const result = await resolveModuleImports(
      [
        //
        'console.log(import.meta.url);',
        "import 'my-module';",
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );

    expect(result.split('\n')).to.eql([
      'console.log(import.meta.url);',
      "import 'RESOLVED__my-module';",
    ]);
  });

  it('does not touch comments', async () => {
    const result = await resolveModuleImports(
      [
        //
        "import 'my-module';",
        "// Example: import('my-module');",
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );

    expect(result.split('\n')).to.eql([
      "import 'RESOLVED__my-module';",
      "// Example: import('my-module');",
    ]);
  });

  it('does not resolve imports in regular code', async () => {
    const result = await resolveModuleImports(
      [
        //
        'function myimport() { }',
        'function my_import() { }',
        'function importShim() { }',
        "class Foo { import() { return 'foo' } }",
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );

    expect(result.split('\n')).to.eql([
      'function myimport() { }',
      'function my_import() { }',
      'function importShim() { }',
      "class Foo { import() { return 'foo' } }",
    ]);
  });

  it('resolves the package of dynamic imports with string concatenation', async () => {
    const result = await resolveModuleImports(
      [
        //
        'import(`@namespace/my-module-3/dynamic-files/${file}.js`);',
        'import(`my-module/dynamic-files/${file}.js`);',
        'import("my-module/dynamic-files" + "/" + file + ".js");',
        'import("my-module/dynamic-files/" + file + ".js");',
        'import("my-module/dynamic-files".concat(file).concat(".js"));',
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );

    expect(result.split('\n')).to.eql([
      'import(`RESOLVED__@namespace/my-module-3/dynamic-files/${file}.js`);',
      'import(`RESOLVED__my-module/dynamic-files/${file}.js`);',
      'import("RESOLVED__my-module/dynamic-files" + "/" + file + ".js");',
      'import("RESOLVED__my-module/dynamic-files/" + file + ".js");',
      'import("RESOLVED__my-module/dynamic-files".concat(file).concat(".js"));',
    ]);
  });

  it('does not change import with string concatenation cannot be resolved', async () => {
    await resolveModuleImports(
      [
        'const file = "a";',
        'import(`@namespace/non-existing/dynamic-files/${file}.js`);',
        'import(`non-existing/dynamic-files/${file}.js`);',
        'import(totallyDynamic);',
        'import(`${file}.js`);',
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );
  });

  it('does not change import with string concatenation cannot be resolved', async () => {
    await resolveModuleImports(
      [
        'const file = "a";',
        'import(`@namespace/non-existing/dynamic-files/${file}.js`);',
        'import(`non-existing/dynamic-files/${file}.js`);',
        'import(totallyDynamic);',
        'import(`${file}.js`);',
      ].join('\n'),
      defaultFilePath,
      defaultResolveImport,
    );
  });
});

const host = 'http://localhost:8080/';

describe('resolveModuleImportsPlugin', () => {
  it('lets plugins resolve imports using the resolveImport hook', async () => {
    const rootDir = path.resolve(__dirname, '..', 'fixtures', 'simple');
    const plugins: Plugin[] = [
      {
        resolveImport({ source }) {
          return `RESOLVED__${source}`;
        },
      },
    ];
    plugins.push(resolveModuleImportsPlugin({ rootDir, plugins }));

    let server;
    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir,
          compatibility: 'none',
          plugins,
        }),
      ));

      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include("import { message } from 'RESOLVED__my-module';");
    } finally {
      server.close();
    }
  });

  it('resolved imports in inline modules in HTML files', async () => {
    const rootDir = path.resolve(__dirname, '..', 'fixtures', 'simple');
    const plugins: Plugin[] = [
      {
        resolveImport({ source }) {
          return `RESOLVED__${source}`;
        },
      },
    ];
    plugins.push(resolveModuleImportsPlugin({ rootDir, plugins }));

    let server;
    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir,
          compatibility: 'none',
          plugins,
        }),
      ));

      const response = await fetch(`${host}index.html`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include("import { message } from 'RESOLVED__my-module';");
    } finally {
      server.close();
    }
  });

  it('unmatched resolve leaves import untouched', async () => {
    const rootDir = path.resolve(__dirname, '..', 'fixtures', 'simple');
    const plugins: Plugin[] = [
      {
        resolveImport() {
          return undefined;
        },
      },
    ];
    plugins.push(resolveModuleImportsPlugin({ rootDir, plugins }));

    let server;
    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir,
          compatibility: 'none',
          plugins,
        }),
      ));

      const response = await fetch(`${host}app.js`);
      const responseText = await response.text();

      expect(response.status).to.equal(200);
      expect(responseText).to.include("import { message } from 'my-module';");
    } finally {
      server.close();
    }
  });

  it('first matching plugin takes priority', async () => {
    const rootDir = path.resolve(__dirname, '..', 'fixtures', 'simple');
    const plugins: Plugin[] = [
      {
        resolveImport({ source, context }) {
          if (context.path === '/src/local-module.js') {
            return `RESOLVED__A__${source}`;
          }
        },
      },
      {
        resolveImport({ source }) {
          return `RESOLVED__B__${source}`;
        },
      },
    ];
    plugins.push(resolveModuleImportsPlugin({ rootDir, plugins }));

    let server;
    try {
      ({ server } = await startServer(
        createConfig({
          port: 8080,
          rootDir,
          compatibility: 'none',
          plugins,
        }),
      ));

      const responseA = await fetch(`${host}src/local-module.js`);
      const responseB = await fetch(`${host}app.js`);
      const responseTextA = await responseA.text();
      const responseTextB = await responseB.text();

      expect(responseA.status).to.equal(200);
      expect(responseB.status).to.equal(200);
      expect(responseTextA).to.include("import { message } from 'RESOLVED__A__my-module';");
      expect(responseTextB).to.include("import { message } from 'RESOLVED__B__my-module';");
    } finally {
      server.close();
    }
  });
});
