# Testing >> Semantic Dom Diff ||40

`semantic-dom-diff` allows diffing chunks of dom or HTML for semantic equality:

- whitespace and newlines are normalized
- tags and attributes are printed on individual lines
- comments are removed
- style, script and SVG contents are removed
- tags, attributes or element's light dom can be ignored through configuration

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Manual Setup

```bash
npm i -D @open-wc/semantic-dom-diff
```

## Chai Plugin

While `semantic-dom-diff` can be used standalone (see below), it most commonly used as a Chai plugin.

<details>
  <summary>Registering the plugin</summary>

> If you are using `@open-wc/testing` this is already done for you.

```javascript
import 'chai/chai.js';
import { chaiDomDiff } from '@open-wc/semantic-dom-diff';

window.chai.use(chaiDomDiff);
```

</details>

### Assertion Styles

The Chai plugin supports both the BDD (`expect`) and TDD (`assert`) APIs.

```javascript
expect(el).dom.to.equal('<div></div>');
assert.dom.equal(el, '<div></div>');

expect(el).dom.to.equal('<div foo="bar"></div>', { ignoreAttributes: ['foo'] });
assert.dom.equal(el, '<div foo="bar"></div>', { ignoreAttributes: ['foo'] });

expect(el).lightDom.to.equal('<div></div>');
assert.lightDom.equal(el, '<div></div>');

expect(el).shadowDom.to.equal('<div></div>');
assert.shadowDom.equal(el, '<div></div>');
```

### Setting up your dom for diffing

You can set up our chai plugin to diff different types of DOM:

```javascript
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<p> shadow content </p>';
  }
}

customElements.define('my-element', MyElement);

it('my test', async () => {
  const el = await fixture(`
    <my-element>
      <div> light dom content </div>
    </my-element>
  `);

  expect(el).dom; // dom is <my-element><div>light dom content</div></my-element>
  expect(el).lightDom; // dom is <div>light dom content</div>
  expect(el).shadowDom; // dom is <p>shadow content</p>
});
```

### Manual diffing

You can use the chai plugin to manually diff chunks of dom. The dom is diffed semantically: whitespace, newlines, etc. are normalized.

```javascript
class MyElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<p> shadow content </p>';
  }
}

customElements.define('my-element', MyElement);

it('my test', async () => {
  const el = await fixture(`
    <my-element>
      <div> light dom content </div>
    </my-element>
  `);

  expect(el).dom.to.equal('<my-element><div>light dom content</div></my-element>');
  expect(el).lightDom.to.equal('<div>light dom content</div>');
  expect(el).shadowDom.to.equal('<p>shadow content</p>');
});
```

### Snapshot testing

`semantic-dom-diff` supports managing snapshots of your components. Snapshot testing is supported in `@web/test-runner` with mocha, or karma with `karma-snapshot` and `karma-mocha-snapshot`.

When using Web Test Runner, snapshot tests are async and the assertion must be awaited.

#### Setting up a snapshot

Snapshots are created by setting up your component in a specific state, and then calling `.to.equalSnapshot()`. You can use `.dom`, `.lightDom` or `.shadowDom` to set up the dom of your element:

```js
import { fixture } from '@open-wc/testing';

describe('my-message', () => {
  it('renders message foo correctly', async () => {
    const element = await fixture(`
      <my-message message="Foo"></my-element>
    `);

    await expect(element).shadowDom.to.equalSnapshot();
  });

  it('renders message bar correctly', async () => {
    const element = await fixture(`
      <my-message message="Bar"></my-element>
    `);

    await expect(element).shadowDom.to.equalSnapshot();
  });

  it('renders a capitalized message correctly', async () => {
    const element = await fixture(`
      <my-message message="Bar" capitalized></my-element>
    `);

    await expect(element).shadowDom.to.equalSnapshot();
  });

  it('allows rendering a message from a slot', async () => {
    const element = await fixture(`
      <my-message capitalized>Bar</my-element>
    `);

    await expect(element).lightDom.to.equalSnapshot();
  });
});
```

#### Updating a snapshot

When your tests run for the first time the snapshot files are generated. On subsequent test runs your element is compared with the stored snapshots. If the element and the snapshots differ the test fails.

If the difference was an intended change, you can update the snapshots by passing the `--update-snapshots` flag.

**Ignoring tags and attributes**

When working with libraries or custom elements there might be parts of the rendered dom which is random or otherwise outside of your control. In those cases, you might want to ignore certain attributes or tags entirely. This is possible by passing an options object.

```javascript
it('renders correctly', async () => {
  const el = await fixture(`
    <div my-random-attribute="${Math.random()}">
      Hey
    </div>
  `);

  await expect(el).dom.to.equal('<div>Hey</div>', {
    ignoreAttributes: ['my-random-attribute'],
  });

  await expect(el).dom.to.equalSnapshot({
    ignoreAttributes: ['my-random-attribute'],
  });
});
```

**Ignoring an attribute only for certain tags**

Randomly generated ids are often used, throwing off your diffs. You can ignore attributes on specific tags:

```javascript
it('renders correctly', async () => {
  const el = await fixture(`
    <input id="customInput${Math.random()}">
  `);

  // ignore id attributes on input elements
  await expect(el).dom.to.equal('<div>Hey</div>', {
    ignoreAttributes: [{ tags: ['input'], attributes: ['id'] }],
  });

  await expect(el).dom.to.equalSnapshot({
    ignoreAttributes: [{ tags: ['input'], attributes: ['id'] }],
  });
});
```

**Ignoring tags**

You can tell the diff to ignore certain tags entirely:

```javascript
it('renders correctly', async () => {
  const el = await fixture(`
    <div>
      <my-custom-element></my-custom-element>
      foo
    </div>
  `);

  // ignore id attributes on input elements
  await expect(el).dom.to.equal('<div>Hey</div>', {
    ignoreTags: ['my-custom-element'],
  });

  await expect(el).dom.to.equalSnapshot({
    ignoreTags: ['my-custom-element'],
  });
});
```

**Ignoring children**

When working with web components you may find that they sometimes render to their light dom, for example, to meet some accessibility requirements. We don't want to ignore the tag completely, as we would then not be able to test if we did render the tag.

We can ignore just it's light dom:

```javascript
it('renders correctly', async () => {
  const el = await fixture(`
    <div>
      <my-custom-input id="myInput">
        <input id="inputRenderedInLightDom">
        Some text rendered in the light dom
      </my-custom-input>
      foo
    </div>
  `);

  // ignore id attributes on input elements
  await expect(el).dom.to.equal(
    `
    <div>
      <my-custom-input id="myInput"></my-custom-input>
      foo
    </div>
  `,
    { ignoreChildren: ['my-custom-input'] },
  );

  await expect(el).dom.to.equalSnapshot({
    ignoreChildren: ['my-custom-input'],
  });
});
```
