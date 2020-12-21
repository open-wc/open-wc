/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const path = require('path');
const { banner, transform, rootDir } = require('./utils');

describe('babelPluginWcHmr - detecting base class', () => {
  it('global base class', () => {
    const code = `class Foo extends MyElement {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement' }] });
    expect(result).to.equal(`${banner}
let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends MyElement {});`);
  });

  it('named import', () => {
    const code = `import { MyElement } from 'my-element'; class Foo extends MyElement {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement', import: 'my-element' }] });
    expect(result).to.equal(`${banner}
import { MyElement } from 'my-element';

let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends MyElement {});`);
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

let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends BaseElement {});`);
  });

  it('mixins', () => {
    const code = `import { MyElement } from 'my-element'; class Foo extends MixA(MixB(MyElement)) {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement', import: 'my-element' }] });
    expect(result).to.equal(`${banner}
import { MyElement } from 'my-element';

let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends MixA(MixB(MyElement)) {});`);
  });

  it('multiple classes', () => {
    const code = `import { MyElement } from 'my-element'; 
class A extends MyElement {}
class B {}
class C extends X {}
class D extends MyElement {}`;
    const result = transform(code, { baseClasses: [{ name: 'MyElement', import: 'my-element' }] });
    expect(result).to.equal(`${banner}
import { MyElement } from 'my-element';

let A = __$wc_hmr$__.register(import.meta.url, class A extends MyElement {});

class B {}

class C extends X {}

let D = __$wc_hmr$__.register(import.meta.url, class D extends MyElement {});`);
  });

  it('multiple base class definitions', () => {
    const code = `import { ElementA } from 'element-a';
import ElementB from 'element-b';
class A extends ElementA {}
class B extends ElementB {}
class C extends X {}`;
    const result = transform(code, {
      baseClasses: [
        { name: 'ElementA', import: 'element-a' },
        { name: 'default', import: 'element-b' },
      ],
    });
    expect(result).to.equal(`${banner}
import { ElementA } from 'element-a';
import ElementB from 'element-b';

let A = __$wc_hmr$__.register(import.meta.url, class A extends ElementA {});

let B = __$wc_hmr$__.register(import.meta.url, class B extends ElementB {});

class C extends X {}`);
  });

  it('base class with a specific import path', () => {
    const code = "import { MyElement } from '../MyElement.js'; class Foo extends MyElement {}";
    const result = transform(code, {
      baseClasses: [{ name: 'MyElement', import: path.join(rootDir, 'MyElement.js') }],
    });
    expect(result).to.equal(`${banner}
import { MyElement } from '../MyElement.js';

let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends MyElement {});`);
  });
});
