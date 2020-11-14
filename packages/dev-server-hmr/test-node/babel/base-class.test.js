/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const path = require('path');
const { banner, transform, rootDir } = require('./utils');

describe('babelPluginWcHmr - detecting base class', () => {
  it('global base class', () => {
    const code = `class Foo extends MyElement {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement' }] });

    expect(result).to.equal(`${banner}
class Foo extends MyElement {}

__$wc_hmr$__.register(import.meta.url, Foo);`);
  });

  it('named import', () => {
    const code = `import { MyElement } from 'my-element'; class Foo extends MyElement {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement', import: 'my-element' }] });

    expect(result).to.equal(`${banner}
import { MyElement } from 'my-element';

class Foo extends MyElement {}

__$wc_hmr$__.register(import.meta.url, Foo);`);
  });

  it('unmatched import', () => {
    const code = `import { MyElement } from 'not-my-element'; class Foo extends MyElement {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement', import: 'my-element' }] });

    expect(result).to.equal(`import { MyElement } from 'not-my-element';

class Foo extends MyElement {}`);
  });

  it('default import', () => {
    const code = `import BaseElement from 'base-element'; class Foo extends BaseElement {}`;
    const result = transform(code, { baseClasses: [{ name: 'default', import: 'base-element' }] });
    expect(result).to.equal(`${banner}
import BaseElement from 'base-element';

class Foo extends BaseElement {}

__$wc_hmr$__.register(import.meta.url, Foo);`);
  });

  it('mixins', () => {
    const code = `import { MyElement } from 'my-element'; class Foo extends MixA(MixB(MyElement)) {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement', import: 'my-element' }] });

    expect(result).to.equal(`${banner}
import { MyElement } from 'my-element';

class Foo extends MixA(MixB(MyElement)) {}

__$wc_hmr$__.register(import.meta.url, Foo);`);
  });

  it('multiple classes', () => {
    const code = `import { MyElement } from 'my-element'; 
class A extends MyElement {}
class B {}
class C extends HTMLElement {}
class D extends MyElement {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement', import: 'my-element' }] });

    expect(result).to.equal(`${banner}
import { MyElement } from 'my-element';

class A extends MyElement {}

__$wc_hmr$__.register(import.meta.url, A);

class B {}

class C extends HTMLElement {}

class D extends MyElement {}

__$wc_hmr$__.register(import.meta.url, D);`);
  });

  it('multiple base class definitions', () => {
    const code = `import { ElementA } from 'element-a';
import ElementB from 'element-b';
class A extends ElementA {}
class B extends ElementB {}
class C extends HTMLElement {}`;
    const result = transform(code, {
      baseClasses: [
        { name: 'ElementA', import: 'element-a' },
        { name: 'default', import: 'element-b' },
      ],
    });

    expect(result).to.equal(`${banner}
import { ElementA } from 'element-a';
import ElementB from 'element-b';

class A extends ElementA {}

__$wc_hmr$__.register(import.meta.url, A);

class B extends ElementB {}

__$wc_hmr$__.register(import.meta.url, B);

class C extends HTMLElement {}`);
  });

  it('base class with a specific import path', () => {
    const code = "import { MyElement } from '../MyElement.js'; class Foo extends MyElement {}";
    const result = transform(code, {
      baseClasses: [{ name: 'MyElement', import: path.join(rootDir, 'MyElement.js') }],
    });

    expect(result).to.equal(`${banner}
import { MyElement } from '../MyElement.js';

class Foo extends MyElement {}

__$wc_hmr$__.register(import.meta.url, Foo);`);
  });
});
