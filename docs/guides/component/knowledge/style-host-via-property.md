# Component >> Knowledge >> Style host via property ||30

> This text is not yet written or polished - care to help?

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
