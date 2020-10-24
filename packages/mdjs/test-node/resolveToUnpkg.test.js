const chai = require('chai');
const { resolveToUnpkg } = require('../src/resolveToUnpkg.js');

const { expect } = chai;

describe('resolveToUnpkg', () => {
  it('works without a pkgJson', async () => {
    const input = "import { html } from 'lit-html';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal("import { html } from 'https://unpkg.com/lit-html?module';");
  });

  it('does not touch absolute urls', async () => {
    const input = "import { html } from 'https://donot/touch/me';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal("import { html } from 'https://donot/touch/me';");
  });

  it('resolves with path', async () => {
    const input = "import { parser } from 'es-module-lexer/lexer.js';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal(
      "import { parser } from 'https://unpkg.com/es-module-lexer/lexer.js?module';",
    );
  });

  it('resolves bare imports', async () => {
    const input = [
      "import 'lit-html';",
      "import { LitElement } from 'lit-element';",
      "import { foo } from '@bar/baz';",
      "import { parser } from 'es-module-lexer/dist/lexer.js';",
      "import './my-el.js';",
    ].join('\n');
    const pkgJson = {
      name: 'my-el',
      version: '3.3.3',
      dependencies: {
        'lit-html': '~1.1.1',
        'lit-element': '~2.2.2',
        'es-module-lexer': '4.4.4',
        '@bar/baz': '5.5.5',
      },
    };
    const result = await resolveToUnpkg(input, pkgJson);
    expect(result.split('\n')).to.deep.equal([
      "import 'https://unpkg.com/lit-html@~1.1.1?module';",
      "import { LitElement } from 'https://unpkg.com/lit-element@~2.2.2?module';",
      "import { foo } from 'https://unpkg.com/@bar/baz@5.5.5?module';",
      "import { parser } from 'https://unpkg.com/es-module-lexer@4.4.4/dist/lexer.js?module';",
      "import 'https://unpkg.com/my-el@3.3.3/my-el.js?module';",
    ]);
  });

  // it('resolves bare imports with namespaces', async () => {
  //   const input = "import { foo } from '@bar/baz';";
  //   const result = await resolveToUnpkg(input);
  //   expect(result).to.equal("import { foo } from 'https://unpkg.com/@bar/baz?module';");
  // });

  it('resolves bare imports with namespaces', async () => {
    const input = "import { foo } from '@bar/baz';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal("import { foo } from 'https://unpkg.com/@bar/baz?module';");
  });

  it('resolves bare imports with namespaces and path', async () => {
    const input = "import { foo } from '@bar/baz/dist/some.js';";
    const result = await resolveToUnpkg(input);
    expect(result).to.equal(
      "import { foo } from 'https://unpkg.com/@bar/baz/dist/some.js?module';",
    );
  });
});
