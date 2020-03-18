# FAQ

In this section you can find answers to frequently asked questions regarding javascript and Web Components.

**Menu:**
[[toc]]

**Deep dives:**

- [Managing events in your custom elements](./events.html)
- [Rerender not triggered](./rerender.html)
- [Unit testing custom events](./unit-testing-custom-events.html)
- [Unit testing initialization error](./unit-testing-init-error.html)

## Checkbox's 'checked' attribute does not match the property

Many elements reflect their properties as attributes, and vice versa, like for example the `disabled` attribute on a button.

```html
<button disabled></button>
```

```js
console.log(myButton.disabled); // true
console.log(myButton.hasAttribute('disabled')); // true
```

If we set the property to false, it'll _reflect_ it to an attribute. (In this case, because it's a boolean attribute, it'll be omitted)

```js
myButton.disabled = false;
console.log(myButton.hasAttribute('disabled')); // false
```

This concept is called attribute reflection.

However, this is not true for the `checked` attribute on an input element of type checkbox. The `checked` property on the input element does not reflect to an attribute, and should only be relied on to set an initial state. Consider the following example:

```html
<input id="mycheck" type="checkbox" checked></input>
```

It will only set the property the first time:

```js
console.log(mycheck.checked); // true
```

Removing the `checked` attribute does not change the `checked` _property_.

```js
mycheck.removeAttribute('checked');
console.log(mycheck.checked); // true
```

And similarly, changing the `checked` property does not change the attribute:

```js
mycheck.checked = false;
console.log(mycheck.hasAttribute('checked')); // true
console.log(mycheck.checked); // false
```

## Custom elements render life cycle

<iframe src="https://andyogo.github.io/custom-element-reactions-diagram/" style="width: 940px; border: none;margin-left: -100px; height: 1350px;"></iframe>

## Debugging styles in adopted stylesheets with Chrome Dev Tools

If your custom element leverages the performance benefits of [constructable stylesheets](https://developers.google.com/web/updates/2019/02/constructable-stylesheets), you will likely run into [this Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=946975) that makes it difficult to debug those styles in Dev Tools. In particular, the `LitElement` base class [leverages this API by default](https://github.com/Polymer/lit-element/blob/41e9fd3b8c18b3070f9df2a2f21915b796b2b298/src/lit-element.ts#L154), so when working with many of the Open Web Components recomendations you should be prepared for this eventuality. If you leverage `LitElement` or an other custom element base class that has the appropriate fallback support for browsers without this API, you can make those styles accessible in Dev Tools again by prepending the following snippet to the beginning of your development environment. This will remove the `adoptedStyleSheets` API from that page and cause those styles to be applied to the page via `<style>` tags (in most cases) which will return access to those styles in the inspector. When you find yourself needing this work around, it would be beneficial to the community for you to visit the linked Chrome bug and star it to help drive the priority of a fix in the Chrome team.

```html
<script>
  // @TODO: Remove this after user agent stylesheet bug is fixed
  // https://bugs.chromium.org/p/chromium/issues/detail?id=946975
  delete Document.prototype.adoptedStyleSheets;
</script>
```

::: tip Using this work around in Storybook
If you are using Storybook to demonstrate the usage of your elements (either directly or via [`@open-wc/demoing-storybook`](/demoing) you can add this to your `preview-head.html` file to ensure that it is shipped before each of your stories for a simpler development workflow.
:::

## How can I set `:host` width via a property?

The following example features 3 variations:

- `disabled` style differently if a property is set
- `type` style if type has a certain value
- `width` map a property to a css variable

```js
class MyEl extends LitElement {
  static get properties() {
    disabled: { type: Boolean, reflect: true },
    width: { type: String },
    type: { type: String, reflect: true },
  }

  static get styles() {
    return css`
      :host {
        width: var(--my-el-width)px;
      }
      :host([disabled]) {
        background: grey;
      }
      :host([type=bar]) {
        background: green;
      }
    `;
  }

  constructor() {
    super();
    this.disabled = false;
    this.width = '200px';
    this.type = 'foo';
  }

  updated(changedProperties) {
    if (changedProperties.has('width')) {
      // this is only supported on evergreen browsers; for IE11 a little more work is needed
      this.style.setProperty('--my-el-width', this.width);
    }
  }
}
```

## Redux: `process is not defined`

If you're using [Redux](https://redux.js.org/introduction/getting-started/), you may run into the following error message:

```
ReferenceError: process is not defined
      at node_modules/redux/es/redux.js:657:1
```

The reason for this is that Redux ships CommonJS by default, and expects `process.env.NODE_ENV` to be set. In the browser, this is not the case. The solution for this is to use the ESM build of Redux instead. It's importable from <a href="https://unpkg.com/browse/redux@4.0.5/es/redux.mjs">`node_modules/redux/es/redux.mjs`</a>. Note that the `.js` version still expects `process.env.NODE_ENV`, but the `.mjs` version does _not_. You'll want to use the `.mjs` version.

And everything should run in the browser as expected.

## Why do certain styles pierce the shadow DOM?

> "Doesn't shadow DOM provide total encapsulation?"

Nope! As written in the [spec](https://www.w3.org/TR/css-scoping-1/#inheritance):

> The top-level elements of a shadow tree inherit from their host element.

What this means is that [_inheritable_](https://gist.github.com/dcneiner/1137601) styles, like `color` or `font-family` among others, continue to inherit in shadow DOM, will _pierce_ the shadow DOM and affect your component's styling.

Custom CSS properties are also able to pierce the shadow DOM boundary, and can be used to style elements from outside of your component itself. Example:

```css
/* define: */
html {
  --owc-blue: #217ff9;
}

/* use inside your component: */
:host {
  background-color: var(--owc-blue);
}
```

If this inheriting behavior is undesirable, you can reset it by adding the following CSS to your component:

```css
:host {
  /* Reset specific CSS properties */
  color: initial;

  /* Reset all CSS properties */
  all: initial;
}
```

::: warning
Do note that setting `all: initial;` will also reset any CSS custom properties, which you'll usually _want_ to maintain. If you find yourself going this route, it's worth considering if you need an iframe instead.
:::

You can find a code example [here](https://webcomponents.dev/edit/NeHSCFaBjUkpe5ldUu1N).

If you're interested in reading more about this, you can check out these resources:

- [Why is my web component inheriting styles?](https://lamplightdev.com/blog/2019/03/26/why-is-my-web-component-inheriting-styles/)
- [Web Fundamentals: Web Components](https://developers.google.com/web/fundamentals/web-components/shadowdom#reset)

## Stubs on my element aren't called

Given the following code:

`my-component.js`:

```js
// example #1
class MyComponent extends LitElement {
  myFunction() {
    // ...
  }
  render() {
    return html`
      <button @click=${this.myFunction}>click</button>
    `;
  }
}
```

You may be surprised to find that the following test will fail, `my-component.test.js`:

```js
import { stub } from 'sinon';
import { expect, fixture, html } from '@open-wc/testing';

describe('my component', () => {
  it('calls myFunction when a button is clicked', () => {
    const el = fixture(
      html`
        <my-component></my-component>
      `,
    );
    const myFunctionStub = stub(el, 'myFunction');
    el.shadowRoot.querySelector('button').click();
    expect(myFunctionStub).to.have.callCount(1);
  });
});
```

The following, however, will pass:

```js
// example #2
render() {
  return html`<button @click=${() => this.myFunction()}>click</button>`;
}
```

The reason is that with `example #1` the stubbing(/wrapping) of `myFunction` happens AFTER you pass the function to lit-html, whereas with `example #2` you make fixture, stub `myFunction`, and _then_ when you click it, it will already be stubbed.

How can we solve this? There are a few ways to go about this:

- You can go with `@click=${this.myFunction}`, and then rerender the component in your test to make sure the function is correctly stubbed:

```js
it('does the thing', async () => {
  const el = await fixture(
    html`
      <my-component></my-component>
    `,
  );
  const myFunctionStub = sinon.stub(el, 'myFunction');
  el.requestUpdate();
  await el.updateComplete;
  el.shadowRoot.querySelector('button').click();
  expect(myFunctionStub).to.have.callCount(1);
});
```

- Or you can choose to instead of testing the function has been called, test the side-effects of that function. (e.g.: it fires an event, a property has now been set, etc.)

- As a last resort, you could pass an anonymous function that calls `this.myFunction()`, like so: `@click=${() => this.myFunction()}`. Note that this is not recommended unless its a 100% needed. Some valid usecases for this may be if you need to pass some arguments to the function, e.g.: `@click=${(e) => this.myFunction(e)}`, or `@click=${() => this.myFunction(someOtherData)}`
