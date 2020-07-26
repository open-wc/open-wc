import path from 'path';
import { expect } from 'chai';
import fetch from 'node-fetch';
import { startServer } from '../../src/start-server';
import { createConfig } from '../../src/config';

const host = 'http://localhost:8080';

interface TestOptions {
  testFile: string;
  source: string;
  expected: string;
  fileExtensions?: string[];
  nodeResolve?: boolean | object;
  preserveSymlinks?: boolean;
}

async function testNodeResolve({
  testFile,
  source,
  expected,
  fileExtensions,
  nodeResolve = true,
  preserveSymlinks,
}: TestOptions) {
  let server;
  try {
    ({ server } = await startServer(
      createConfig({
        port: 8080,
        rootDir: path.resolve(__dirname, '..', 'fixtures', 'simple'),
        compatibility: 'none',
        nodeResolve,
        fileExtensions,
        preserveSymlinks,
        plugins: [
          {
            serve(context) {
              if (context.path === testFile) {
                return { body: source };
              }
            },
          },
        ],
      }),
    ));

    const response = await fetch(`${host}${testFile}`);
    const responseText = await response.text();

    expect(response.status).to.equal(200);
    expect(responseText).to.equal(expected);
  } finally {
    server.close();
  }
}

describe('resolve-module-imports', () => {
  it('resolves bare imports', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        "import 'my-module';",
        "import foo from 'my-module';",
        "import { bar } from 'my-module';",
      ].join('\n'),
      expected: [
        "import '../node_modules/my-module/index.js';",
        "import foo from '../node_modules/my-module/index.js';",
        "import { bar } from '../node_modules/my-module/index.js';",
      ].join('\n'),
    });
  });

  it('resolves basic exports', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "export * from 'my-module';",
        "export { foo } from 'my-module';",
      ].join('\n'),
      expected: [
        //
        "export * from '../node_modules/my-module/index.js';",
        "export { foo } from '../node_modules/my-module/index.js';",
      ].join('\n'),
    });
  });

  it('resolves imports to a folder with index.js', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "export * from 'my-module/bar';",
      ].join('\n'),
      expected: [
        //
        "export * from '../node_modules/my-module/bar/index.js';",
      ].join('\n'),
    });
  });

  it('resolves imports to a file with bare import', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import 'my-module/bar/index.js';",
      ].join('\n'),
      expected: [
        //
        "import '../node_modules/my-module/bar/index.js';",
      ].join('\n'),
    });
  });

  it('resolves using the module field from a package.json', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import 'my-module-2';",
      ].join('\n'),
      expected: [
        //
        "import '../node_modules/my-module-2/my-module-2.js';",
      ].join('\n'),
    });
  });

  it('does not resolve imports with configured file extensions', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import './local-module.js';",
        "import '../local-module.js';",
        "import './../local-module.js';",
        "import '../../local-module.js';",
        "import '/local-module.js';",
        "import 'my-module';",
      ].join('\n'),
      expected: [
        //
        "import './local-module.js';",
        "import '../local-module.js';",
        "import './../local-module.js';",
        "import '../../local-module.js';",
        "import '/local-module.js';",
        "import '../node_modules/my-module/index.js';",
      ].join('\n'),
    });
  });

  it('does resolve imports with non-configured file extensions', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import './styles.css';",
      ].join('\n'),
      expected: [
        //
        "import './styles.css.js';",
      ].join('\n'),
    });
  });

  it('favors .mjs over .js', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import './foo';",
      ].join('\n'),
      expected: [
        //
        "import './foo.mjs';",
      ].join('\n'),
    });
  });

  it('adds file extensions to non-bare imports', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import './local-module';",
        "import 'my-module';",
      ].join('\n'),
      expected: [
        //
        "import './local-module.js';",
        "import '../node_modules/my-module/index.js';",
      ].join('\n'),
    });
  });

  it('handles imports with query params or hashes', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import 'my-module?foo=bar';",
        "import 'my-module?foo=bar&lorem=ipsum';",
        "import 'my-module#foo';",
        "import 'my-module?foo=bar#bar';",
        "import './local-module.js?foo=bar';",
        "import './local-module.js#foo';",
        "import './local-module.js?foo=bar#bar';",

        "import('my-module?foo=bar');",
        "import('my-module#foo');",
        "import('my-module?foo=bar#bar');",
        "import('./local-module.js?foo=bar');",
        "import('./local-module.js#foo');",
        "import('./local-module.js?foo=bar#bar');",
      ].join('\n'),
      expected: [
        //
        "import '../node_modules/my-module/index.js?foo=bar';",
        "import '../node_modules/my-module/index.js?foo=bar&lorem=ipsum';",
        "import '../node_modules/my-module/index.js#foo';",
        "import '../node_modules/my-module/index.js?foo=bar#bar';",
        "import './local-module.js?foo=bar';",
        "import './local-module.js#foo';",
        "import './local-module.js?foo=bar#bar';",
        "import('../node_modules/my-module/index.js?foo=bar');",
        "import('../node_modules/my-module/index.js#foo');",
        "import('../node_modules/my-module/index.js?foo=bar#bar');",
        "import('./local-module.js?foo=bar');",
        "import('./local-module.js#foo');",
        "import('./local-module.js?foo=bar#bar');",
      ].join('\n'),
    });
  });

  it('resolves nested node_modules', async () => {
    await testNodeResolve({
      testFile: '/node_modules/my-module-2/foo.js',
      source: [
        //
        "import 'my-module';",
        "import 'my-module/bar/index.js';",
      ].join('\n'),
      expected: [
        //
        "import './node_modules/my-module/index.js';",
        "import './node_modules/my-module/bar/index.js';",
      ].join('\n'),
    });
  });

  it('does not preserve symlinks when false', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import 'symlinked-package';",
      ].join('\n'),
      expected: [
        //
        "import '../symlinked-package/index.js';",
      ].join('\n'),
      preserveSymlinks: false,
    });
  });

  it('does not preserve symlinks when true', async () => {
    await testNodeResolve({
      testFile: '/src/test-file.js',
      source: [
        //
        "import 'symlinked-package';",
      ].join('\n'),
      expected: [
        //
        "import '../node_modules/symlinked-package/index.js';",
      ].join('\n'),
      preserveSymlinks: true,
    });
  });
});
