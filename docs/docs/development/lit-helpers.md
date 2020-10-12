# Development >> Lit Helpers ||20

A library with helpers functions for working with [lit-html](https://lit-html.polymer-project.org/) and [lit-element](https://lit-element.polymer-project.org/)

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Installation

```bash
npm i --save @open-wc/lit-helpers
```

## Spread directives

Spread directives can be used to set an arbitrary collection of properties, attributes or event listeners on an element without knowing all the keys in advance.

The spread directives work by taking in an object of data to spread. Because of `lit-html` syntax, we need one attribute to apply the directive to. It doesn't actually matter what the name of this attribute is, we recommend sticking to the convention of using `...` as the attribute name.

### Regular spread

The regular `spread` directive can be used to set properties, attribute or event listeners. It uses the same syntax as `lit-html` for distinguishing different types of bindings:

```js
import { html, render } from 'lit-html';
import { spread } from '@open-wc/lit-helpers';

render(
  html`
    <div
      ...=${spread({
        'my-attribute': 'foo',
        '?my-boolean-attribute': true
        '.myProperty': { foo: 'bar' },
        '@my-event': () => console.log('my-event fired'),
      })}
    ></div>
  `,
  document.body,
);
```

### Property spread

Because spreading properties is a common use case, you can use the `spreadProps` directive so that you don't need prefix each property with a `.`. This is especially useful when the data comes from external sources.

```js
import { html, render } from 'lit-html';
import { spreadProps } from '@open-wc/lit-helpers';

render(html` <div ...="${spreadProps({ propertyA: 'a', propertyB: 'b' })}"></div> `, document.body);
```

### Attribute spread

Since `spread` already spreads attribute as the default case, we do not need a separate `spreadAttributes` directive.

### Re-rendering

When re-rendering, values are updated if they changed from the previous value. We use the same strict equality check (`!==`) as `lit-html` for this.

Unlike `lit-html`, when spreading attributes we remove the attribute if it is set to `null` or `undefined`.

If an entry in the spread data is removed, the property is set to undefined, the attribute is removed or the event listener is deregistered.

Example:

```js
function renderSpread(data) {
  render(html` <div ...="${spread(data)}"></div> `, document.body);
}

// result: <div foo="bar">
renderSpread({ foo: 'bar' });

// result: <div foo="buz">
renderSpread({ foo: 'buz' });

// result: <div foo="buz" lorem="ipsum">
renderSpread({ foo: 'buz', lorem: 'ipsum' });

// result: <div foo="buz">
renderSpread({ foo: 'buz' });

// result: <div>
renderSpread({ foo: 'undefined' });
```

## Live binding

For efficiency, lit-html does not set properties or attributes if they did not change since the previous render. This can cause problems when the properties are changed outside of lit-html's control. The `live` directive can be used to dirty check the element's live value, and set the property or attribute if it changed.

A great example for this, is the DOM element's `scrollTop` property which changes without lit-html knowing about it when the user scrolls.

By using the `live` directive, you can make sure it is always in sync with the value rendered by `lit-html`:

```js
html` <my-element .scrollTop=${live(scrollTop)}></my-element> `;
```

## Privately Settable Read-Only Properties

`ReadOnlyPropertiesMixin` provides a way for based on `LitElement` (or it's parent class `UpdatingElement`) to define properties by adding `readOnly: true` to their property declaration. Those properties are read-only from the outside, but can be updated internally with the `setReadOnlyProperties` method.

```js
import { ReadOnlyPropertiesMixin } from '@open-wc/lit-helpers';
import { LitElement } from 'lit-element';
class SettableElement extends ReadOnlyPropertiesMixin(LitElement) {
  static get properties() {
    return {
      timestamp: { type: Number, readOnly: true },
    };
  }

  constructor() {
    super();
    this.timestamp = Date.now();
  }

  updateTime() {
    this.setReadOnlyProperties({ timestamp: Date.now() });
  }

  render() {
    return html`
      <button @click="${this.updateTime}">Update Time</button>
      <time>${this.timestamp}</time>
    `;
  }
}
```

The mixin also supports the `@property` decorator.

```js
import { ReadOnlyPropertiesMixin } from '@open-wc/lit-helpers';
import { LitElement, property } from 'lit-element';
class SettableElement extends ReadOnlyPropertiesMixin(LitElement) {
  @property({ type: Number, readOnly: true }) timestamp = Date.now();

  updateTime() {
    this.setReadOnlyProperties({ timestamp: Date.now() });
  }

  render() {
    return html`
      <button @click="${this.updateTime}">Update Time</button>
      <time>${this.timestamp}</time>
    `;
  }
}
```

### Known Limitations

#### Order of Application Matters

Currently, this mixin only works properly when applied to LitElement (or UpdatingElement) directly. In other words, if you have a component which inherits like the example below, then `ReadOnlyPropertiesMixin` must be applied to `LitElement` only.

```js
// Bad
class Lowest extends LitElement {
  @property({ readOnly: true }) lowestProperty = undefined;
}

class Highest extends ReadOnlyPropertiesMixin(Lowest) {
  // will not work as expected
  @property({ readOnly: true }) highestProperty = undefined;
}
```

```js
// Good
class Lowest extends ReadOnlyPropertiesMixin(LitElement) {
  @property({ readOnly: true }) lowestProperty = undefined;
}

class Highest extends Lowest {
  @property({ readOnly: true }) highestProperty = undefined;
}
```

#### Properties Must be Initialized

Read only properties must be initialized with some value, even if the value is `undefined`. This is because the mixin allows one free setting, to support class field initialization.

```js
// Bad
class Uninitialized extends ReadOnlyPropertiesMixin(LitElement) {
  @property({ readOnly: true }) uninitialized;
}

// Good
class Initialized extends ReadOnlyPropertiesMixin(LitElement) {
  @property({ readOnly: true }) initialized = undefined;
}
```
