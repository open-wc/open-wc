# Development >> Lit Helpers ||20

A library with helpers functions for working with [lit](https://lit.dev/).

## Installation

```bash
npm i --save @open-wc/lit-helpers@next
```

## Privately Settable Read-Only Properties

`ReadOnlyPropertiesMixin` provides a way for components based on `LitElement` (or it's parent class `UpdatingElement`) to define properties by adding `readOnly: true` to their property declaration. Those properties are read-only from the outside, but can be updated internally with the `setReadOnlyProperties` method.

```js
import { ReadOnlyPropertiesMixin } from '@open-wc/lit-helpers';
import { LitElement } from 'lit';
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
import { LitElement, property } from 'lit';
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

## Spread Directives

In some situations you will find the need to apply a large or semi-unknown amount of attributes, boolean attributes, events, and properties to an element. By default `lit-html` would expect you to bind them each individually:

```js
const elementTemplate = obj => html`
  <custom-element
    my-attribute=${obj.attribute}
    ?my-boolean-attribute=${obj.booleanAttribute}
    @my-event=${obj.event}
    .myProperty=${obj.property}
  ></custom-element>
`;
```

This collection of directives allows you to bind object containing values of various types (`spread`), event types (`spreadEvent`), or property types (`spreadProps`) to elements in your template literals. There are many [conciderations](#considerations) to take into account when leveraging these helpers, but if you keep them in mind there is much benefit to be found in them.

### spread

The `spread` directive provides a way to apply all of this data to your element in a single binding:

```js
import { spread } from '@open-wc/lit-helpers';

const elementTemplate = (
  obj = {
    'my-attribute': 'foo',
    '?my-boolean-attribute': true,
    '@my-event': () => console.log('my-event fired'),
    '.myProperty': { foo: 'bar' },
  },
) => html` <custom-element ${spread(obj)}></custom-element> `;
```

The `spread` directive will allow you to access any of the binding types available via `lit-html` by branding the property name of the corresponding value with the same sigil that you would use in your `lit-html` template. Attributes require no sigil, boolean attributes require a `?`, events a `@`, and properties the `.` sigil.

### spreadEvents

If you expect to _only_ have events to supply to your element from the provided object, you can use the `spreadEvents` directive, which does not require you to brand the event names you are spreading onto your element:

```js
import { spreadEvents } from '@open-wc/lit-helpers';

const elementTemplate = (
  obj = {
    'my-event': () => {
      console.log('my-event');
    },
    'my-other-event': () => {
      console.log('my-other-event');
    },
    'my-additional-event': () => {
      console.log('my-additional-event');
    },
  },
) => html` <custom-element ${spreadEvents(obj)}></custom-element> `;
```

This can also be leveraged in order to bind multiple callbacks to the same event by spreading more that one object onto your element:

```js
import { spreadEvents } from '@open-wc/lit-helpers';

const elementTemplate = (
  obj1 = {
    click: () => {
      console.log('first click handler');
    },
  },
  obj2 = {
    click: () => {
      console.log('second click handler');
    },
  },
) => html` <custom-element ${spreadEvents(obj1)} ${spreadEvents(obj2)}></custom-element> `;
```

### spreadProps

If you expect to _only_ have properties to supply to your element from the provided object, you can use the `spreadProps` directive, which does not require you to brand the properties you are spreading onto your element:

```js
import { spreadProps } from '@open-wc/lit-helpers';

const elementTemplate = (
  obj = {
    string: 'string',
    number: 10,
    array: ['This', 'is', 'an', 'array.'],
    object: {
      foo: 'bar',
      baz: true,
      bar: false,
    },
  },
) => html` <custom-element ${spreadProps(obj)}></custom-element> `;
```

### Considerations

#### SSR

These helpers are being delivered as `lit-html` directives but due to the imperative nature of their internals they are currently not structured for availability in an server side rendered context. Keep this in mind when structuring components that consumer these directives and be sure to inform down stream consumers that you are leveraging these tool in your documentation so that they can be aware of these short comings as well.

#### Bind order

By default, `lit-html` does not allow multiple bindings of the same type to the same name: e.g. `<custom-element .value=${value1} .value=${value2}>` will immediately cause visual issues in the delivery of your template. When leveraging the various spread directives, you will suddenly be able to do so as your bindings are being moved out of the standard template heuristics. This may bring about subtle and hard to debug issues within your template. Take the following code sample:

```html
<custom-element
  ${spreadProps({
    prop1: 'prop1',
    prop2: 'prop2',
    prop3: 'prop3',
  })}
  .prop1=${'prop4'}
></custom-element>
```

What is the value of `document.querySelector('custom-element').prop1`? If you said "prop1" then you've falled into one of these issues. The `.prop1=${'prop4'}` comes later in the template, so it wins and applies the value as "prop4". This might be somewhat easier to visualize in the above example, but imagine the following:

```js
const template = (obj, value) => html`
  <custom-element ${spreadProps(obj)} .prop1=${value}></custom-element>
`;
const obj = {
  prop1: 'prop1',
  prop2: 'prop2',
  prop3: 'prop3',
};
render(template(obj, 'prop4'), document.body);

// Here document.querySelector('custom-element').prop1 === 'prop4'
// ...

delete obj.prop1;
render(template(obj, 'prop4'), document.body);
```

You've removed the `prop1` entry from the object you are spreading onto your element, what's the value of `document.querySelector('custom-element').prop1` now? If you expected the `spread` directive to clean up the value of `prop1` because it was removed from the object before the second render you may be surprised to see that the value is still "prop4". Taking the reverse binding into account, you'll get a different outcome:

```js
const template = (obj, value) => html`
  <custom-element .prop1=${value} ${spreadProps(obj)}></custom-element>
`;
const obj = {
  prop1: 'prop1',
  prop2: 'prop2',
  prop3: 'prop3',
};
render(template(obj, 'prop4'), document.body);

// Here document.querySelector('custom-element').prop1 === 'prop1'
// ...

delete obj.prop1;
render(template(obj, 'prop4'), document.body);
```

With the `spread` in the second binding position, we get the value from our object applied to the element. Great! But, in our second render, what would you expect the value of `document.querySelector('custom-element').prop1` to be? "prop4" is the winner, because when the `spread` directive looks to remove the property, if it finds that the value of that property is not what it previously applied, it will not set it to `undefined`. This means that the earlier bound value will remain applied. _However, this also means that any changes to the property not managed by the template
will persist as well, including changes to the element's internal state and manual changes from outside of the template._

#### Update order

Similar to the edge cases that can come from bind order realities, what render pass properties are updated in your template literal can cause tricky to debug edge cases as well. This comes from the way that dirty checking with the `lit-html` render pass prefers the "last in" value.

Taking, again, our sample from above:

```js
const template = (obj, value) => html`
  <custom-element ${spreadProps(obj)} .prop1=${value}></custom-element>
`;
```

Imagine that in subsequent renders the identity of the variable passes as `value` is not changed, but the identity of the variable passed as `obj` is, and within `obj` there is a property `prop1`. In this case the value for `prop1` in `obj` would superceed that of `value` as the binding to `.prop1` will not return as dirty, meaning the value in `obj` is the "last in" to the content and will be applied in that second render pass.

#### The undiscovered country

There are likely other confusing situations that complex consumption of the spread directives may push you into, so hedge you bets and keep your bindings as simple as you can while leveraging the powers these directives afford. If all of your content is managed via a single spread helper, you will be less likley to run into undiscovered binding or update order issues.

```js
const template = everything => html` <custom-element ${spread(everything)}></custom-element> `;
```

If this approach, particularly the task of creating a sigil signed property for every value in the `everything` argument, is difficult, you can achieve much the same by breaking keeping the various spread content separate:

```js
const template = (attrs, props, events) => html`
  <custom-element ${spread(attr)} ${spreadProps(props)} ${spreadEvents(event)}></custom-element>
`;
```
