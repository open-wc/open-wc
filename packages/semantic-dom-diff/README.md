# Semantic Dom Diff

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Manual Setup

```bash
npm i -D @open-wc/semantic-dom-diff
```

`semantic-dom-diff` allows diffing chunks of dom or HTML for semantic equality:

- whitespace and newlines are normalized
- tags and attributes are printed on individual lines
- comments are removed
- style, script and SVG contents are removed
- tags, attributes or element's light dom can be ignored through configuration

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

The most powerful feature of `semantic-dom-diff` is the ability to test and manage snapshots of your web components.

> If you are not using `@open-wc/testing-karma`, you need to manually install [karma-snapshot](https://www.npmjs.com/package/karma-snapshot) and [karma-mocha-snapshot](https://www.npmjs.com/package/karma-mocha-snapshot).

#### Setting up a snapshot

Snapshots are created by setting up your component in a specific state, and then calling `.to.equalSnapshot()`. You can use `.dom`, `.lightDom` or `.shadowDom` to set up the dom of your element:

```js
import { fixture } from '@open-wc/testing';

describe('my-message', () => {
  it('renders message foo correctly', () => {
    const element = await fixture(`
      <my-message message="Foo"></my-element>
    `);

    expect(element).shadowDom.to.equalSnapshot();
  });

  it('renders message bar correctly', () => {
    const element = await fixture(`
      <my-message message="Bar"></my-element>
    `);

    expect(element).shadowDom.to.equalSnapshot();
  });

  it('renders a capitalized message correctly', () => {
    const element = await fixture(`
      <my-message message="Bar" capitalized></my-element>
    `);

    expect(element).shadowDom.to.equalSnapshot();
  });

  it('allows rendering a message from a slot', () => {
    const element = await fixture(`
      <my-message capitalized>Bar</my-element>
    `);

    expect(element).lightDom.to.equalSnapshot();
  });
});
```

Snapshots are stored in the `__snapshots__` folder in your project, using the most top-level `describe` as the name for your snapshots file.

#### Updating a snapshot

> If you are not using the standard `@open-wc/testing-karma` configuration, see the documentation of `karma-snapshot` how to pass the update/prune flags.

When your tests run for the first time the snapshot files are generated. On subsequent test runs your element is compared with the stored snapshots. If the element and the snapshots differ the test fails.

If the difference was an intended change, you can update the snapshots by passing the `--update-snapshots` flag.

#### Cleaning up unused snapshots

After refactoring, there might be unused and leftover snapshot files. You can run karma with the `--prune-snapshots` flag to clean these up.

**Ignoring tags and attributes**

When working with libraries or custom elements there might be parts of the rendered dom which is random or otherwise outside of your control. In those cases, you might want to ignore certain attributes or tags entirely. This is possible by passing an options object.

```javascript
it('renders correctly', async () => {
  const el = await fixture(`
    <div my-random-attribute="${Math.random()}">
      Hey
    </div>
  `);

  expect(el).dom.to.equal('<div>Hey</div>', {
    ignoreAttributes: ['my-random-attribute'],
  });

  expect(el).dom.to.equalSnapshot({
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
  expect(el).dom.to.equal('<div>Hey</div>', {
    ignoreAttributes: [{ tags: ['input'], attributes: ['id'] }],
  });

  expect(el).dom.to.equalSnapshot({
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
  expect(el).dom.to.equal('<div>Hey</div>', {
    ignoreTags: ['my-custom-element'],
  });

  expect(el).dom.to.equalSnapshot({
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
  expect(el).dom.to.equal(
    `
    <div>
      <my-custom-input id="myInput"></my-custom-input>
      foo
    </div>
  `,
    { ignoreChildren: ['my-custom-input'] },
  );

  expect(el).dom.to.equalSnapshot({
    ignoreChildren: ['my-custom-input'],
  });
});
```

**TypeScript**

When working with typescript you may notice that the types are not correct for

```js
expect(el).dom.to.equal('<div>Hey</div>', {
  ignoreTags: ['my-custom-element'],
});
```

e.g. the 2nd parameter is expected to be a string. Unfortunately, we currently can not change this.
For now you will need to ignore types if you want to provide extra options.

```js
// @ts-ignore
expect(el).dom.to.equal('<div>Hey</div>', {
  ignoreTags: ['my-custom-element'],
});
```

We plan to change and include it in the next [breaking testing release](https://github.com/open-wc/open-wc/projects/1).

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/semantic-dom-diff/README.md';
      }
    }
  }
</script>
