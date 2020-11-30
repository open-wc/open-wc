/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const path = require('path');
const { banner, transform, rootDir } = require('./utils');

describe('babelPluginWcHmr - detecting decorators', () => {
  it('compiled decorator with decorator name', () => {
    const code = `
function __decorate() {}
let Foo = class extends HTMLElement {};
Foo = __decorate([customElement('x-foo')], Foo);`;
    const result = transform(code, { decorators: [{ name: 'customElement' }] });

    expect(result).to.equal(`${banner}
function __decorate() {}

let Foo = class extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, Foo);

Foo = __decorate([customElement('x-foo')], Foo);`);
  });

  it('handles multiple decorators', () => {
    const code = `
function __decorate() {}
let Foo = class extends HTMLElement {};
Foo = __decorate([x(), y(), customElement('x-foo')], Foo);`;
    const result = transform(code, { decorators: [{ name: 'customElement' }] });

    expect(result).to.equal(`${banner}
function __decorate() {}

let Foo = class extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, Foo);

Foo = __decorate([x(), y(), customElement('x-foo')], Foo);`);
  });

  it('does not inject for a decorator with a different name', () => {
    const code = `function __decorate() {}

let Foo = class extends HTMLElement {};
Foo = __decorate([notCustomElement('x-foo')], Foo);`;
    const result = transform(code, { decorators: [{ name: 'customElement' }] });
    expect(result).to.equal(code);
  });

  it('compiled decorator with a bare import', () => {
    const code = `
import {customElement} from 'my-package';
function __decorate() {}
let Foo = class extends HTMLElement {};
Foo = __decorate([customElement('x-foo')], Foo);`;
    const result = transform(code, {
      decorators: [{ name: 'customElement', import: 'my-package' }],
    });

    expect(result).to.equal(`${banner}
import { customElement } from 'my-package';

function __decorate() {}

let Foo = class extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, Foo);

Foo = __decorate([customElement('x-foo')], Foo);`);
  });

  it('compiled decorator with a default import', () => {
    const code = `
import customElement from 'my-package';
function __decorate() {}
let Foo = class extends HTMLElement {};
Foo = __decorate([customElement('x-foo')], Foo);`;
    const result = transform(code, {
      decorators: [{ name: 'default', import: 'my-package' }],
    });

    expect(result).to.equal(`${banner}
import customElement from 'my-package';

function __decorate() {}

let Foo = class extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, Foo);

Foo = __decorate([customElement('x-foo')], Foo);`);
  });

  it('compiled decorator with a specific import path', () => {
    const code = `
import { defineElement } from '../defineElement.js';
function __decorate() {}
let Foo = class extends HTMLElement {};
Foo = __decorate([defineElement('x-foo')], Foo);`;
    const result = transform(code, {
      decorators: [{ name: 'defineElement', import: path.join(rootDir, 'defineElement.js') }],
    });

    expect(result).to.equal(`${banner}
import { defineElement } from '../defineElement.js';

function __decorate() {}

let Foo = class extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, Foo);

Foo = __decorate([defineElement('x-foo')], Foo);`);
  });

  it('compiled decorator with a double assigned variable', () => {
    const code = `
function __decorate() {}
let Foo = Foo_1 = class extends HTMLElement {};
Foo = Foo_1 = __decorate([customElement('x-foo')], Foo);`;
    const result = transform(code, { decorators: [{ name: 'customElement' }] });

    expect(result).to.equal(`${banner}
function __decorate() {}

let Foo = Foo_1 = class extends HTMLElement {};

__$wc_hmr$__.register(import.meta.url, Foo);

Foo = Foo_1 = __decorate([customElement('x-foo')], Foo);`);
  });
});
