/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const path = require('path');
const { banner, transform, rootDir } = require('./utils');

describe('babelPluginWcHmr - detecting function components', () => {
  it('global function name', () => {
    const code = 'const MyElementClass = component(MyElement);';
    const result = transform(code, { functions: [{ name: 'component' }] });

    expect(result).to.equal(`${banner}
const MyElementClass = __$wc_hmr$__.register(import.meta, "MyElementClass", component(MyElement));`);
  });

  it('handles multiple functions', () => {
    const code = 'const x = component(y); const a = component(b);';
    const result = transform(code, { functions: [{ name: 'component' }] });

    expect(result).to.equal(`${banner}
const x = __$wc_hmr$__.register(import.meta, "x", component(y));

const a = __$wc_hmr$__.register(import.meta, "a", component(b));`);
  });

  it('does not inject for a function with a different name', () => {
    const code = 'const MyElementClass = notComponent(MyElement);';
    const result = transform(code, { functions: [{ name: 'component' }] });

    expect(result).to.equal(code);
  });

  it('function component with a bare import', () => {
    const code =
      'import { component } from "my-package"; const MyElementClass = component(MyElement);';
    const result = transform(code, {
      functions: [{ name: 'component', import: 'my-package' }],
    });

    expect(result).to.equal(`${banner}
import { component } from "my-package";

const MyElementClass = __$wc_hmr$__.register(import.meta, "MyElementClass", component(MyElement));`);
  });

  it('function component with a default import', () => {
    const code = 'import foo from "my-package"; const MyElementClass = foo(MyElement);';

    const result = transform(code, {
      functions: [{ name: 'default', import: 'my-package' }],
    });

    expect(result).to.equal(`${banner}
import foo from "my-package";

const MyElementClass = __$wc_hmr$__.register(import.meta, "MyElementClass", foo(MyElement));`);
  });

  it('function component with a specific import path', () => {
    const code =
      'import { component } from "../component.js"; const MyElementClass = component(MyElement);';

    const result = transform(code, {
      functions: [{ name: 'component', import: path.join(rootDir, 'component.js') }],
    });

    expect(result).to.equal(`${banner}
import { component } from "../component.js";

const MyElementClass = __$wc_hmr$__.register(import.meta, "MyElementClass", component(MyElement));`);
  });
});
