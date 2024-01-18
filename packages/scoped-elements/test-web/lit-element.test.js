import '@webcomponents/scoped-custom-element-registry';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import {
  FeatureA,
  FeatureB,
  FeatureC,
  LazyLoading,
  TagnameClash,
  ConstructorClash,
  WithoutStaticScopedElements,
  ReusesGlobalButton,
  ScopeOnInstanceLevel,
  AdoptStyles,
} from './components/lit/index.js';
import { MyButton1, MyButton2 } from './components/vanilla/index.js';
import { FrameworkLike } from './components/lit/FrameworkLike.js';

customElements.define('feature-a', FeatureA);
customElements.define('feature-b', FeatureB);
customElements.define('feature-c', FeatureC);

describe('lit-element ScopedElementsMixin', () => {
  it('creates a scoped registry', async () => {
    const a = await fixture(html`<feature-a></feature-a>`);
    expect(a.registry).to.not.be.undefined;
  });

  it('scopes registry on constructor level by default', async () => {
    const a = await fixture(html`<feature-a></feature-a>`);
    expect(a.constructor.__registry).to.not.be.undefined;
  });

  it('scopes registry on instance level by override', async () => {
    customElements.define('scope-on-instance-level', ScopeOnInstanceLevel);

    const instance = await fixture(html`<scope-on-instance-level></scope-on-instance-level>`);
    expect(instance.__registry).to.not.be.undefined;
    expect(instance.constructor.__registry).to.be.undefined;
  });

  it('registers my-button', async () => {
    const a = await fixture(html`<feature-a></feature-a>`);
    expect(a.shadowRoot.querySelector('my-button').color).to.equal('red');
    expect(a.registry.get('my-button')).to.not.be.undefined;
    expect(a.registry.get('my-button')).to.equal(a.constructor.scopedElements['my-button']);
  });

  it('supports multiple versions of my-button used in separate features, using the same tagname', async () => {
    const a = await fixture(html`<feature-a></feature-a>`);
    const b = await fixture(html`<feature-b></feature-b>`);

    expect(a.shadowRoot.querySelector('my-button').color).to.equal('red');
    expect(b.shadowRoot.querySelector('my-button').color).to.equal('blue');
  });

  it('doesnt fail if no static scopedElements is provided', async () => {
    customElements.define('without-static-scoped-elements', WithoutStaticScopedElements);

    const withoutStaticScopedElements = await fixture(
      html`<without-static-scoped-elements></without-static-scoped-elements>`,
    );
    expect(withoutStaticScopedElements.registry).to.not.be.undefined;
  });

  it('supports lazy loading scoped elements', async () => {
    customElements.define('lazy-loading', LazyLoading);

    const lazy = await fixture(html`<lazy-loading></lazy-loading>`);
    expect(lazy.shadowRoot.querySelector('lazy-button').shadowRoot).to.equal(null);
    await lazy.load();
    expect(lazy.shadowRoot.querySelector('lazy-button').shadowRoot.textContent).to.equal(
      'lazy button',
    );
  });

  it('crashes when defining the same tagname twice', async () => {
    customElements.define('tagname-clash', TagnameClash);

    const tagnameClash = await fixture(html`<tagname-clash></tagname-clash>`);
    expect(tagnameClash.hasErrored).to.equal(true);
  });

  it('crashes when defining the same constructor twice', async () => {
    customElements.define('constructor-clash', ConstructorClash);

    const constructorClash = await fixture(html`<constructor-clash></constructor-clash>`);
    expect(constructorClash.hasErrored).to.equal(true);
  });

  it('adopts the styles correctly', async () => {
    customElements.define('adopt-styles', AdoptStyles);

    const adoptStyles = await fixture(html`<adopt-styles></adopt-styles>`);
    expect(
      getComputedStyle(adoptStyles.shadowRoot.querySelector('button')).getPropertyValue('color'),
    ).to.equal('rgb(0, 128, 0)');
  });

  it('uses globally defined custom element if its not present in static scopedElements', async () => {
    customElements.define('reuses-global-button', ReusesGlobalButton);

    const reusesGlobalButton = await fixture(html`<reuses-global-button></reuses-global-button>`);
    expect(
      reusesGlobalButton.shadowRoot.querySelector('globally-defined-button').shadowRoot.textContent,
    ).to.equal('click');
  });

  it('can take scoped elements from external configuration', async () => {
    customElements.define('framework-like', FrameworkLike);

    const framework = await fixture(html`<framework-like></framework-like>`);
    await framework.initialize([
      {
        scopedElements: {
          'step-a': () => import('./components/vanilla/MyButton1.js').then(m => m.MyButton1),
        },
        render: () => html`<step-a></step-a>`,
      },
      {
        scopedElements: {
          'step-b': () => import('./components/vanilla/MyButton2.js').then(m => m.MyButton2),
        },
        render: () => html`<step-b></step-b>`,
      },
    ]);

    const stepA = framework.shadowRoot.querySelector('step-a');
    expect(stepA.constructor).to.equal(MyButton1);
    expect(stepA.color).to.equal('red');

    framework.next();
    await framework.updateComplete;

    const stepB = framework.shadowRoot.querySelector('step-b');
    expect(stepB.constructor).to.equal(MyButton2);
    expect(stepB.color).to.equal('blue');
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
