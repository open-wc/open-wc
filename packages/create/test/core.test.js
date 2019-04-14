/* eslint-disable no-unused-expressions */
/* eslint-disable no-template-curly-in-string */

import chai from 'chai';
import {
  processTemplate,
  writeFileToPath,
  virtualFiles,
  resetVirtualFiles,
  readFileFromPath,
  copyTemplateJsonInto,
  deleteVirtualFile,
  executeMixinGenerator,
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
  });

  it('return false for non existing files', async () => {
    expect(readFileFromPath('non/existing/path.txt')).to.be.false;
  });

  it('reads file from disk', async () => {
    expect(readFileFromPath(`${__dirname}/assets/foo.txt`)).to.equal('content of foo');
  });

  it('reads file from virtual then from disk', async () => {
    writeFileToPath(`${__dirname}/assets/foo.txt`, 'virtual foo');
    expect(readFileFromPath(`${__dirname}/assets/foo.txt`)).to.equal('virtual foo');
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

  it('overrides arrays', async () => {
    writeFileToPath(`source/package.json`, '{ "array": [1, 2] }');
    writeFileToPath(`generator/package.json`, '{ "array": [3] }');
    copyTemplateJsonInto(`generator/package.json`, 'source/package.json');
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
