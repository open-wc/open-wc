/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const { banner, transform } = require('./utils');

describe('babelPluginWcHmr - detecting customElements.define', () => {
  it('injects registration when detecting a customElements.define', () => {
    const code = `class Foo extends HTMLElement {}\ncustomElements.define('x-foo', Foo);`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

customElements.define('x-foo', Foo);`,
    );
  });

  it('injects registration when detecting a window.customElements.define', () => {
    const code = `class Foo extends HTMLElement {}\nwindow.customElements.define('x-foo', Foo);`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

window.customElements.define('x-foo', Foo);`,
    );
  });

  it('injects registration when detecting a globalThis.customElements.define', () => {
    const code = `class Foo extends HTMLElement {}\nglobalThis.customElements.define('x-foo', Foo);`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

globalThis.customElements.define('x-foo', Foo);`,
    );
  });

  it('injects registration when detecting a class expression', () => {
    const code = `customElements.define('x-foo', class Foo extends HTMLElement {});`;
    const result = transform(code);
    expect(result).to.equal(`${banner}
customElements.define('x-foo', __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {}));`);
  });

  it('injects registration when detecting an anonymous class expression', () => {
    const code = `customElements.define('x-foo', class extends HTMLElement {});`;
    const result = transform(code);
    expect(result).to.equal(`${banner}
customElements.define('x-foo', __$wc_hmr$__.register(import.meta.url, class extends HTMLElement {}));`);
  });

  it('injects registration on a class expression assigned to a variable', () => {
    const code = `const Foo = class Foo extends HTMLElement {}\ncustomElements.define('x-foo', Foo);`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
const Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

customElements.define('x-foo', Foo);`,
    );
  });

  it('injects registration on a reassigned class to a variable with the same name', () => {
    const code = `let Foo = class Foo extends HTMLElement {}\n Foo = Foo;\n customElements.define('x-foo', Foo);`;
    const result = transform(code);
    console.log(result);
    expect(result).to.equal(
      `${banner}
let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

Foo = Foo;
customElements.define('x-foo', Foo);`,
    );
  });

  it('injects multiple registrations', () => {
    const code =
      "class Foo extends HTMLElement {}\ncustomElements.define('x-foo', Foo);\n" +
      "class Bar extends HTMLElement {}\ncustomElements.define('x-bar', Bar);" +
      "class Baz extends HTMLElement {}\ncustomElements.define('x-baz', Baz);";
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

customElements.define('x-foo', Foo);

let Bar = __$wc_hmr$__.register(import.meta.url, class Bar extends HTMLElement {});

customElements.define('x-bar', Bar);

let Baz = __$wc_hmr$__.register(import.meta.url, class Baz extends HTMLElement {});

customElements.define('x-baz', Baz);`,
    );
  });

  it('can configure a patch to be injected', () => {
    const code = `class Foo extends HTMLElement {}\ncustomElements.define('x-foo', Foo);`;
    const result = transform(code, { patches: ['x.js'] });
    expect(result).to.equal(
      `import '/__web-dev-server__/wc-hmr/patch.js';
${banner}
let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

customElements.define('x-foo', Foo);`,
    );
  });

  it('handles function expression', () => {
    const code = `customElements.define('x-foo', component(Foo));`;
    const result = transform(code);
    expect(result).to.equal(`${banner}
customElements.define('x-foo', __$wc_hmr$__.register(import.meta.url, component(Foo)));`);
  });

  it('does not wrap an already handled class 1', () => {
    const code = `let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

customElements.define('x-foo', Foo);`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
let Foo = __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {});

customElements.define('x-foo', Foo);`,
    );
  });

  it('does not wrap an already handled class 2', () => {
    const code = `customElements.define('x-foo', __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {}));`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
customElements.define('x-foo', __$wc_hmr$__.register(import.meta.url, class Foo extends HTMLElement {}));`,
    );
  });
});
