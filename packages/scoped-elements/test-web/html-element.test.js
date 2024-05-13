import '@webcomponents/scoped-custom-element-registry';
import { expect, fixture } from '@open-wc/testing';
import {
  FeatureA,
  FeatureB,
  FeatureC,
  LazyLoading,
  ImperativeDomCreation,
  MyButton1,
  TagnameClash,
  ConstructorClash,
  WithoutStaticScopedElements,
  ReusesGlobalButton,
  ScopeOnInstanceLevel,
  ScopeTagnameThatIsGloballyUsed,
} from './components/vanilla/index.js';

customElements.define('feature-a', FeatureA);
customElements.define('feature-b', FeatureB);
customElements.define('feature-c', FeatureC);

describe('html-element ScopedElementsMixin', () => {
  it('has static scopedElementVersions', async () => {
    const a = await fixture(`<feature-a></feature-a>`);
    expect(typeof a.constructor.scopedElementsVersion === 'string').to.equal(true);
  });

  it('creates a scoped registry', async () => {
    const a = await fixture(`<feature-a></feature-a>`);
    expect(a.registry).to.not.be.undefined;
  });

  it('scopes registry on constructor level by default', async () => {
    const a = await fixture(`<feature-a></feature-a>`);
    expect(a.constructor.__registry).to.not.be.undefined;
  });

  it('scopes registry on instance level by override', async () => {
    customElements.define('scope-on-instance-level', ScopeOnInstanceLevel);

    const instance = await fixture(`<scope-on-instance-level></scope-on-instance-level>`);
    expect(instance.__registry).to.not.be.undefined;
    expect(instance.constructor.__registry).to.be.undefined;
  });

  it('registers my-button', async () => {
    const a = await fixture(`<feature-a></feature-a>`);
    expect(a.shadowRoot.querySelector('my-button').color).to.equal('red');
    expect(a.registry.get('my-button')).to.not.be.undefined;
    expect(a.registry.get('my-button')).to.equal(a.constructor.scopedElements['my-button']);
  });

  it('supports multiple versions of my-button used in separate features, using the same tagname', async () => {
    const a = await fixture(`<feature-a></feature-a>`);
    const b = await fixture(`<feature-b></feature-b>`);
    expect(a.shadowRoot.querySelector('my-button').color).to.equal('red');
    expect(b.shadowRoot.querySelector('my-button').color).to.equal('blue');
  });

  it('doesnt fail if no static scopedElements is provided', async () => {
    customElements.define('without-static-scoped-elements', WithoutStaticScopedElements);

    const withoutStaticScopedElements = await fixture(
      `<without-static-scoped-elements></without-static-scoped-elements>`,
    );
    expect(withoutStaticScopedElements.registry).to.not.be.undefined;
  });

  it('supports imperative DOM creation', async () => {
    customElements.define('imperative-dom-creation', ImperativeDomCreation);

    const el = await fixture(`<imperative-dom-creation></imperative-dom-creation>`);
    expect(el.shadowRoot.querySelector('my-button').color).to.equal('red');
    expect(el.registry.get('my-button')).to.equal(MyButton1);
    expect(el.shadowRoot.querySelector('my-button').shadowRoot.textContent).to.equal('click');
  });

  it('supports lazy loading scoped elements', async () => {
    customElements.define('lazy-loading', LazyLoading);

    const lazy = await fixture('<lazy-loading></lazy-loading>');
    await lazy.loaded;
    expect(lazy.shadowRoot.querySelector('lazy-button').shadowRoot.textContent).to.equal(
      'lazy button',
    );
  });

  it('crashes when defining the same tagname twice', async () => {
    customElements.define('tagname-clash', TagnameClash);

    const tagnameClash = await fixture(`<tagname-clash></tagname-clash>`);
    expect(tagnameClash.hasErrored).to.equal(true);
  });

  it('crashes when defining the same constructor twice', async () => {
    customElements.define('constructor-clash', ConstructorClash);

    const constructorClash = await fixture(`<constructor-clash></constructor-clash>`);
    expect(constructorClash.hasErrored).to.equal(true);
  });

  it('can use globally defined custom element via customElements.get', async () => {
    customElements.define('reuses-global-button', ReusesGlobalButton);

    const reusesGlobalButton = await fixture(`<reuses-global-button></reuses-global-button>`);
    expect(
      reusesGlobalButton.shadowRoot.querySelector('globally-defined-button').shadowRoot.textContent,
    ).to.equal('click');
  });

  it('doesnt crash when you scope a tagname thats already globally defined', async () => {
    customElements.define('scope-tagname-that-is-globally-used', ScopeTagnameThatIsGloballyUsed);

    const el = await fixture(`
      <div>
        <globally-defined-button></globally-defined-button>
        <scope-tagname-that-is-globally-used></scope-tagname-that-is-globally-used>
      </div>
    `);

    const scoped = el
      .querySelector('scope-tagname-that-is-globally-used')
      .shadowRoot.querySelector('globally-defined-button');
    const global = el.querySelector('globally-defined-button');
    expect(global.shadowRoot.textContent).to.equal('click');
    expect(scoped.shadowRoot.textContent).to.equal('click');
  });

  it('creates unique registries when one lit element inherits another lit element', async () => {
    const c = await fixture(`<feature-c></feature-c>`);
    const myButton3Registry = c.shadowRoot.querySelector('my-button-3').registry;
    const myEnhancedButton3Registry = c.shadowRoot.querySelector('my-enhanced-button-3').registry;
    expect(myButton3Registry).to.not.equal(myEnhancedButton3Registry);
    expect(myButton3Registry.constructor).to.equal(customElements.constructor);
    expect(myEnhancedButton3Registry.constructor).to.equal(customElements.constructor);
  });
});
