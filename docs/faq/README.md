# FAQ

In this section you can find answers to frequently asked questions regarding javascript and Web Components.

**Menu:**
[[toc]]

**Deep dives:**

- [Managing events in your custom elements](./events.html)
- [Rerender not triggered](./rerender.html)
- [Unit testing custom events](./unit-testing-custom-events.html)
- [Unit testing initialization error](./unit-testing-init-error.html)

## Custom elements render life cycle

<iframe src="https://andyogo.github.io/custom-element-reactions-diagram/" style="width: 940px; border: none;margin-left: -100px; height: 1350px;"></iframe>

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

## Redux: `process is not defined`

If you're using [Redux](https://redux.js.org/introduction/getting-started/), you may run into the following error message:

```
ReferenceError: process is not defined
      at node_modules/redux/es/redux.js:657:1
```

The reason for this is that Redux ships CommonJS by default, and expects `process.env.NODE_ENV` to be set. In the browser, this is not the case. The solution for this is to use the ESM build of Redux instead. It's importable from <a href="https://unpkg.com/browse/redux@4.0.5/es/redux.mjs">`node_modules/redux/es/redux.mjs`</a>. Note that the `.js` version still expects `process.env.NODE_ENV`, but the `.mjs` version does _not_. You'll want to use the `.mjs` version.

And everything should run in the browser as expected.

## Why are some styles leaking in my web component?

> "Doesn't shadow DOM provide total encapsulation?"

Nope! As written in the [spec](https://www.w3.org/TR/css-scoping-1/#inheritance):

> The top-level elements of a shadow tree inherit from their host element.

What this means is that [_inheritable_](https://gist.github.com/dcneiner/1137601) styles continue to inherit in shadow DOM, will _pierce_ the shadow DOM and affect your component's styling.

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
  all: initial;
}
```

You can find a code example [here](https://webcomponents.dev/edit/NeHSCFaBjUkpe5ldUu1N).

::: warning
Do note, that setting `all: initial;` will also reset any CSS custom properties, which you'll usually _want_ to maintain. If you find yourself going this route, it's worth considering if you need an iframe instead.
:::

If you're interested in reading more about this, you can check out these resources:

- [Why is my web component inheriting styles?](https://lamplightdev.com/blog/2019/03/26/why-is-my-web-component-inheriting-styles/)
- [Web Fundamentals: Web Components](https://developers.google.com/web/fundamentals/web-components/shadowdom#reset)
