---
permalink: 'developing/lit-helpers.html'
title: Lit Helpers
section: guides
tags:
  - guides
---

# Lit Helpers

A library with helpers functions for working with [lit](https://lit.dev/).

## Installation

```bash
npm i --save @open-wc/lit-helpers
```

## Privately Settable Read-Only Properties

`ReadOnlyPropertiesMixin` provides a way for based on `LitElement` (or it's parent class `UpdatingElement`) to define properties by adding `readOnly: true` to their property declaration. Those properties are read-only from the outside, but can be updated internally with the `setReadOnlyProperties` method.

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
