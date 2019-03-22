# FAQ

In this section you can find answers to frequently asked questions regarding javascript and Web Components.

**Menu:**
[[toc]]

**Deep dives:**
- [Rerender not triggered](./rerender.html)


### Custom elements render life cycle

<iframe src="https://andyogo.github.io/custom-element-reactions-diagram/" style="width: 940px; border: none;margin-left: -100px; height: 1350px;"></iframe>


### How can I set `:host` width via a property?

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

### Checkbox's 'checked' attribute does not match the property

Many elements reflect their properties as attributes, and vice versa, like for example the `disabled` attribute on a button.

```html
<button disabled></button>
```

```js
console.log(myButton.disabled) // true
console.log(myButton.hasAttribute('disabled')) // true
```

If we set the property to false, it'll _reflect_ it to an attribute. (In this case, because it's a boolean attribute, it'll be omitted)

```js
myButton.disabled = false;
console.log(myButton.hasAttribute('disabled')) // false
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
