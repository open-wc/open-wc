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

### Checkbox's 'checked' state does not reflect a property's value after the checkbox has been clicked

The checked _attribute_ on an input element does not reflect the attribute to a _property_, and should only be relied on to set an initial state. If you use the dot prefix `.checked`, your checked status should update. 

Notice that if you would drop the attribute binding and update the checked attribute manually by using native setAttribute and removeAttribute methods in the updated callback this problem would still occur. (By [mchyb](https://github.com/Polymer/lit-element/issues/601#issuecomment-469626034))

You can see a demo of this in action [here](https://jsfiddle.net/sorvell1/ko9sc3tv/2/).

