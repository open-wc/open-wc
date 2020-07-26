/* eslint-disable no-template-curly-in-string */

import chai from 'chai';
import fs from 'fs';
import {
  copyTemplateJsonInto,
  copyTemplates,
  deleteVirtualFile,
  executeMixinGenerator,
  filesToTree,
  optionsToCommand,
  processTemplate,
  readFileFromPath,
  resetVirtualFiles,
  setOverrideAllFiles,
  virtualFiles,
  writeFileToPath,
  writeFileToPathOnDisk,
} from '../src/core.js';

const { expect } = chai;

describe('processTemplate', () => {
  it('replaces <%= keyName %> in source if provided as data', async () => {
    expect(processTemplate('prefix <%= name %> suffix', { name: 'foo' })).to.equal(
      'prefix foo suffix',
    );
  });

  it('replaces multiple instances <%= keyName %> in source if provided as data', async () => {
    expect(processTemplate('prefix <%= name %> suffix <%= name %>', { name: 'foo' })).to.equal(
      'prefix foo suffix foo',
    );
  });

  it('ignores <%= keyName %> in source if not provided as data', async () => {
    expect(processTemplate('prefix <%= name %> suffix', { foo: 'foo' })).to.equal(
      'prefix <%= name %> suffix',
    );
  });
});

describe('writeFileToPath', () => {
  beforeEach(() => {
    resetVirtualFiles();
  });

  it('stores file to write in an array', async () => {
    writeFileToPath('foo/bar.js', 'barfile');
    expect(virtualFiles).to.deep.equal([{ path: 'foo/bar.js', content: 'barfile' }]);
    writeFileToPath('foo/baz.js', 'bazfile');
    expect(virtualFiles).to.deep.equal([
      { path: 'foo/bar.js', content: 'barfile' },
      { path: 'foo/baz.js', content: 'bazfile' },
    ]);
  });

  it('will override content for the same path', async () => {
    writeFileToPath('foo/bar.js', 'barfile');
    writeFileToPath('foo/bar.js', 'updated barfile');
    expect(virtualFiles).to.deep.equal([{ path: 'foo/bar.js', content: 'updated barfile' }]);
  });
});

describe('readFileFromPath', () => {
  beforeEach(() => {
    resetVirtualFiles();
    fs.writeFileSync(`./__tmpfoo.txt`, 'content of foo');
  });
  afterEach(() => {
    if (fs.existsSync(`./__tmpfoo.txt`)) {
      fs.unlinkSync(`./__tmpfoo.txt`);
    }
  });

  it('return false for non existing files', async () => {
    expect(readFileFromPath('non/existing/path.txt')).to.be.false;
  });

  it('reads file from disk', async () => {
    expect(readFileFromPath(`./__tmpfoo.txt`)).to.equal('content of foo');
  });

  it('reads file from virtual then from disk', async () => {
    writeFileToPath(`./__tmpfoo.txt`, 'virtual foo');
    expect(readFileFromPath(`./__tmpfoo.txt`)).to.equal('virtual foo');
  });
});

describe('deleteVirtualFile', () => {
  beforeEach(() => {
    resetVirtualFiles();
  });

  it('removes an entry from the array of virtual files', async () => {
    writeFileToPath('foo/bar.js', 'barfile');
    expect(virtualFiles).to.deep.equal([{ path: 'foo/bar.js', content: 'barfile' }]);

    deleteVirtualFile('foo/bar.js');
    expect(virtualFiles).to.deep.equal([]);
  });
});

describe('writeFileToPathOnDisk', () => {
  beforeEach(() => {
    fs.writeFileSync(`./__tmpfoo.txt`, 'content of foo');
  });
  afterEach(() => {
    if (fs.existsSync(`./__tmpfoo.txt`)) {
      fs.unlinkSync(`./__tmpfoo.txt`);
    }
  });

  it('will not override by default', async () => {
    await writeFileToPathOnDisk(`./__tmpfoo.txt`, 'updatedfoofile', { ask: false });
    expect(fs.readFileSync(`./__tmpfoo.txt`, 'utf-8')).to.equal('content of foo');
  });

  it('will override if set', async () => {
    await writeFileToPathOnDisk(`./__tmpfoo.txt`, 'updatedfoofile', {
      override: true,
      ask: false,
    });
    expect(fs.readFileSync(`./__tmpfoo.txt`, 'utf-8')).to.equal('updatedfoofile');
  });

  it('will override if setOverrideAllFiles(true) is used', async () => {
    setOverrideAllFiles(true);
    await writeFileToPathOnDisk(`./__tmpfoo.txt`, 'updatedfoofile', { ask: false });
    expect(fs.readFileSync(`./__tmpfoo.txt`, 'utf-8')).to.equal('updatedfoofile');
    setOverrideAllFiles(false);
  });
});

describe('copyTemplates', () => {
  it('returns a promise which resolves with the copied and processed files', async () => {
    const copiedFiles = await copyTemplates(`./test/template/**/*`, `source`, {
      name: 'hello-world',
    });
    expect(copiedFiles).to.deep.equal([
      {
        processed: "console.log('name: hello-world');\n",
        toPath: './source/index.js',
      },
    ]);
  });
});

describe('copyTemplateJsonInto', () => {
  beforeEach(() => {
    resetVirtualFiles();
  });

  it('merges objects', async () => {
    writeFileToPath(`source/package.json`, '{ "source": "data" }');
    writeFileToPath(`generator/package.json`, '{ "from": "generator" }');
    copyTemplateJsonInto(`generator/package.json`, 'source/package.json');
    deleteVirtualFile('generator/package.json'); // just used to make test easier

    expect(virtualFiles).to.deep.equal([
      {
        path: 'source/package.json',
        content: '{\n  "source": "data",\n  "from": "generator"\n}',
      },
    ]);
  });

  it('merges arrays', async () => {
    writeFileToPath(`source/package.json`, '{ "array": [1, 2] }');
    writeFileToPath(`generator/package.json`, '{ "array": [3] }');
    copyTemplateJsonInto(`generator/package.json`, 'source/package.json');
    deleteVirtualFile('generator/package.json'); // just used to make test easier

    expect(virtualFiles).to.deep.equal([
      {
        path: 'source/package.json',
        content: '{\n  "array": [\n    1,\n    2,\n    3\n  ]\n}',
      },
    ]);
  });

  it('can override arrays by setting { mode: "override" } ', async () => {
    writeFileToPath(`source/package.json`, '{ "array": [1, 2] }');
    writeFileToPath(`generator/package.json`, '{ "array": [3] }');
    copyTemplateJsonInto(
      `generator/package.json`,
      'source/package.json',
      {},
      {
        mode: 'override',
      },
    );
    deleteVirtualFile('generator/package.json'); // just used to make test easier

    expect(virtualFiles).to.deep.equal([
      {
        path: 'source/package.json',
        content: '{\n  "array": [\n    3\n  ]\n}',
      },
    ]);
  });
});

describe('executeMixinGenerator', () => {
  it('combines multiple mixins and executes them', async () => {
    const FooMixin = subclass =>
      class extends subclass {
        constructor() {
          super();
          this.foo = true;
        }
      };

    const BarMixin = subclass =>
      class extends subclass {
        constructor() {
          super();
          this.bar = true;
        }
      };

    const data = {};
    class Base {
      execute() {
        // @ts-ignore
        data.foo = this.foo;
        // @ts-ignore
        data.bar = this.bar;
        data.gotExecuted = true;
      }

      // eslint-disable-next-line class-methods-use-this
      end() {
        data.gotEnded = true;
      }
    }

    // @ts-ignore
    await executeMixinGenerator([FooMixin, BarMixin], {}, Base);

    expect(data).to.deep.equal({
      foo: true,
      bar: true,
      gotExecuted: true,
      gotEnded: true,
    });
  });
});

describe('optionsToCommand', () => {
  it('supports strings', async () => {
    const options = {
      type: 'scaffold',
    };
    expect(optionsToCommand(options)).to.equal('npm init @open-wc --type scaffold ');
  });

  it('supports numbers', async () => {
    const options = {
      version: 2,
    };
    expect(optionsToCommand(options)).to.equal('npm init @open-wc --version 2 ');
  });

  it('supports boolean', async () => {
    const options = {
      writeToDisk: true,
    };
    expect(optionsToCommand(options)).to.equal('npm init @open-wc --writeToDisk ');
    const options2 = {
      writeToDisk: false,
    };
    expect(optionsToCommand(options2)).to.equal('npm init @open-wc ');
  });

  it('supports arrays', async () => {
    const options = {
      features: ['testing', 'demoing'],
    };
    expect(optionsToCommand(options)).to.equal('npm init @open-wc --features testing demoing ');
  });

  it('converts real example', async () => {
    const options = {
      type: 'scaffold',
      scaffoldType: 'wc',
      features: ['testing', 'demoing'],
      scaffoldFilesFor: ['testing', 'demoing'],
      tagName: 'foo-bar',
      installDependencies: 'false',
    };
    expect(optionsToCommand(options)).to.equal(
      'npm init @open-wc --type scaffold --scaffoldType wc --features testing demoing --scaffoldFilesFor testing demoing --tagName foo-bar --installDependencies false ',
    );
  });
});

describe('filesToTree', () => {
  it('renders a single file', async () => {
    expect(filesToTree(['./foo.js'])).to.equal(['./', '└── foo.js\n'].join('\n'));
  });

  it('renders two files', async () => {
    // prettier-ignore
    expect(filesToTree(['./foo.js', './bar.js'])).to.equal([
      './',
      '├── foo.js',
      '└── bar.js\n',
    ].join('\n'));
  });

  it('renders multiple files', async () => {
    // prettier-ignore
    expect(filesToTree(['./foo.js', './bar.js', './baz.js'])).to.equal([
      './',
      '├── foo.js',
      '├── bar.js',
      '└── baz.js\n',
    ].join('\n'));
  });

  it('renders a directory and file', async () => {
    // prettier-ignore
    expect(filesToTree(['./foo/foo.js'])).to.equal([
      './',
      '├── foo/',
      '│   └── foo.js\n',
    ].join('\n'));
  });

  it('renders a directory and file and root file', async () => {
    // prettier-ignore
    expect(filesToTree(['./foo/foo.js', './bar.js'])).to.equal([
      './',
      '├── foo/',
      '│   └── foo.js',
      '└── bar.js\n',
    ].join('\n'));
  });

  it('renders a nested directory and file', async () => {
    // prettier-ignore
    expect(filesToTree(['./foo/bar/baz/bong.js'])).to.equal([
      './',
      '├── foo/',
      '│   ├── bar/',
      '│   │   ├── baz/',
      '│   │   │   └── bong.js\n',
    ].join('\n'));
  });

  it('renders a nested directory and file', async () => {
    // prettier-ignore
    expect(filesToTree(['./foo/bar.js', './foo/foo.js'])).to.equal([
      './',
      '├── foo/',
      '│   ├── bar.js',
      '│   └── foo.js\n',
    ].join('\n'));
  });

  it('renders a nested directory and file', async () => {
    // prettier-ignore
    expect(filesToTree(['./foo/bar/baz.js', './foo/foo.js'])).to.equal([
      './',
      '├── foo/',
      '│   ├── bar/',
      '│   │   └── baz.js',
      '│   └── foo.js\n',
    ].join('\n'));
  });

  it('renders an common usecase', async () => {
    expect(
      filesToTree([
        './foo-bar/src/FooBar.js',
        './foo-bar/src/foo-bar.js',
        './foo-bar/LICENSE',
        './foo-bar/README.md',
      ]),
    ).to.equal(
      [
        './',
        '├── foo-bar/',
        '│   ├── src/',
        '│   │   ├── FooBar.js',
        '│   │   └── foo-bar.js',
        '│   ├── LICENSE',
        '│   └── README.md\n',
      ].join('\n'),
    );
  });
});
