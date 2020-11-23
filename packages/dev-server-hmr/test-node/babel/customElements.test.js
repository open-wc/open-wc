/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const { banner, transform } = require('./utils');

describe('babelPluginWcHmr - detecting customElements.define', () => {
  it('injects registration when detecting a customElements.define', () => {
    const code = `class Foo extends HTMLElement {}\ncustomElements.define('x-foo', Foo);`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
class Foo extends HTMLElement {}

__$wc_hmr$__.register(import.meta.url, Foo);

customElements.define('x-foo', Foo);`,
    );
  });

  it('injects registration when detecting a window.customElements.define', () => {
    const code = `class Foo extends HTMLElement {}\nwindow.customElements.define('x-foo', Foo);`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
class Foo extends HTMLElement {}

__$wc_hmr$__.register(import.meta.url, Foo);

window.customElements.define('x-foo', Foo);`,
    );
  });

  it('injects registration when detecting a globalThis.customElements.define', () => {
    const code = `class Foo extends HTMLElement {}\nglobalThis.customElements.define('x-foo', Foo);`;
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
class Foo extends HTMLElement {}

__$wc_hmr$__.register(import.meta.url, Foo);

globalThis.customElements.define('x-foo', Foo);`,
    );
  });

  it('injects multiple registrations', () => {
    const code =
      "class Foo extends HTMLElement {}\ncustomElements.define('x-foo', Foo);\n" +
      "class Bar extends HTMLElement {}\ncustomElements.define('x-bar', Bar);" +
      "class Baz extends HTMLElement {}\ncustomElements.define('x-baz', Baz);";
    // console.log(code);
    const result = transform(code);
    expect(result).to.equal(
      `${banner}
class Foo extends HTMLElement {}

__$wc_hmr$__.register(import.meta.url, Foo);

customElements.define('x-foo', Foo);

class Bar extends HTMLElement {}

__$wc_hmr$__.register(import.meta.url, Bar);

customElements.define('x-bar', Bar);

class Baz extends HTMLElement {}

__$wc_hmr$__.register(import.meta.url, Baz);

customElements.define('x-baz', Baz);`,
    );
  });

  it('can configure a patch to be injected', () => {
    const code = `class Foo extends HTMLElement {}\ncustomElements.define('x-foo', Foo);`;
    const result = transform(code, { patches: ['x.js'] });
    expect(result).to.equal(
      `import '/__web-dev-server__/wc-hmr/patch.js';
${banner}
class Foo extends HTMLElement {}

__$wc_hmr$__.register(import.meta.url, Foo);

customElements.define('x-foo', Foo);`,
    );
  });

  it('injects registration when detecting a class expression', () => {
    const code = `customElements.define('x-foo', class Foo extends HTMLElement {});`;
    const result = transform(code);
    expect(result).to.equal(`${banner}
const _Foo = class Foo extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, _Foo);

customElements.define('x-foo', _Foo);`);
  });

  it('injects registration when detecting an anonymous class expression', () => {
    const code = `customElements.define('x-foo', class extends HTMLElement {});`;
    const result = transform(code);
    expect(result).to.equal(`${banner}
const _ref = class extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, _ref);

customElements.define('x-foo', _ref);`);
  });

  it('deconflicts variable names', () => {
    const code = `const Foo = 1; const _Foo = 2; customElements.define('x-foo', class Foo extends HTMLElement {});`;
    const result = transform(code);
    expect(result).to.equal(`${banner}
const Foo = 1;
const _Foo = 2;

const _Foo2 = class Foo extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, _Foo2);

customElements.define('x-foo', _Foo2);`);
  });

  it('respects the custom element define scope', () => {
    const code = `console.log("x"); (function () { customElements.define('x-foo', class extends HTMLElement {}); })();`;
    const result = transform(code);
    expect(result).to.equal(`${banner}
console.log("x");

(function () {
  const _ref = class extends HTMLElement {};

  __$wc_hmr$__.register(import.meta.url, _ref);

  customElements.define('x-foo', _ref);
})();`);
  });

  it('handles function expression', () => {
    const code = `customElements.define('x-foo', component(Foo));`;
    const result = transform(code);
    expect(result).to.equal(`${banner}
const _component = component(Foo);

__$wc_hmr$__.register(import.meta.url, _component);

customElements.define('x-foo', _component);`);
  });
});
