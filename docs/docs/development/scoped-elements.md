# Development >> Scoped Elements ||40

## Installation

```
npm i --save @open-wc/scoped-elements
```

> This package requires using the [Scoped Custom Element Registry](https://www.npmjs.com/package/@webcomponents/scoped-custom-element-registry) polyfill.

## Usage

`@open-wc/scoped-elements` supports both vanilla `HTMLElement`, as well as `LitElement` (both `lit@2.0.0` and `lit@3.0.0` are supported) based components. You can use the mixin as follows:

### `HTMLElement`

```js
import { ScopedElementsMixin } from '@open-wc/scoped-elements/html-element.js';
import { MyButton } from './MyButton.js';

class MyElement extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'my-button': MyButton,
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = '<my-button>click</my-button>';
  }
}
```

### `LitElement`

```js
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement, html } from 'lit';
import { MyButton } from './MyButton.js';

class MyElement extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-button': MyButton,
  };

  render() {
    return html`<my-button>click</my-button>`;
  }
}
```

## Polyfill

This package requires use of the [Scoped Custom Element Registry](https://www.npmjs.com/package/@webcomponents/scoped-custom-element-registry) polyfill. Make sure to load it as the first thing in your application:

```js
import '@webcomponents/scoped-custom-element-registry';
```

If you're using [`@web/rollup-plugin-polyfills-loader`](https://www.npmjs.com/package/@web/rollup-plugin-polyfills-loader), you can use it in your `rollup` config like this:

```js
polyfillsLoader({
  polyfills: {
    scopedCustomElementRegistry: true,
  },
});
```

If you're using `@web/dev-server` for local development, you can use the [`@web/dev-server-polyfill`](https://www.npmjs.com/package/@web/dev-server-polyfill) plugin:

```js
polyfill({
  scopedCustomElementRegistry: true,
});
```

## API

### Lazy scoped element definition

If you're lazily importing custom elements, you can define them by accessing the `this.registry` directly on your element as per spec behavior:

```js
onClick() {
  import('./LazyElement.js').then(m => {
    this.registry.define('lazy-element', m.LazyElement);
  });
}
```

### Imperative scoped element creation

If you need to imperatively create elements that have been scoped via the `ScopedElementsMixin`, you can use `this.shadowRoot.createElement` as per spec behavior:

```js
class MyElement extends ScopedElementsMixin(HTMLElement) {
  static scopedElements = {
    'foo-element': FooElement,
  };

  onClick() {
    const el = this.shadowRoot.createElement('foo-element');
    this.shadowRoot.appendChild(el);
  }
}
```

### Scope level

By default, elements are scoped on the constructor level for performance reasons. For most usecase this should be fine. However, for some usecases, like for example when component registrations are provided from an external source, it can be useful to scope on the _instance_ level instead. To achieve this, you can override the `registry` getter/setter pair like this:

```js
class UserFlowFramework extends ScopedElementsMixin(LitElement) {
  set registry(r) {
    this.__registry = r;
  }

  get registry() {
    return this.__registry;
  }
}
```

## Notes

When using `@open-wc/scoped-elements`, its important that the modules containing your custom element classes are _side effect free_, and **don't** call `customElements.define` themself. The consumer of your custom elements is responsible for registering them via the `ScopedElementsMixin`.

This means you should avoid code like:

```js
class MyElement extends HTMLElement {}
// ❌
customElements.define('my-element', MyElement);
```

You can, instead, consider splitting up the export of your component class and the registration of your component, or don't export a self-registering module at all:

```js
// ✅
export class MyElement extends HTMLElement {}
```

You should also avoid using the `@customElement` decorator, because it calls `customElements.define` internally:

```js
// ❌
@customElement('my-element')
export class MyElement extends LitElement {}
```

## Motivation

In large applications, it can be the case that you need to support multiple versions of a component on the same page, like for example design system components.

Consider the following example:

```html
<my-app>
  <feature-a>
    #shadowroot
    <!-- uses my-button@1.0.0 -->
    <my-button>click</my-button>
  </feature-a>
  <feature-b>
    #shadowroot
    <!-- uses my-button@2.0.0 -->
    <my-button>click</my-button>
  </feature-b>
</my-app>
```

If you're using the global `customElements` registry, you would have run into name clashes, because `my-button` would have already been defined in the global registry. Using _scoped_ custom element registries, we can assign a registry _per shadowroot_, and scope our custom elements to those registries instead.

In this case, if `feature-a` and `feature-b` use `ScopedElementsMixin`, the mixin will create a separate registry for each of their shadowroots so that the elements used internally by `feature-a` and `feature-b` will be scoped to that registry, rather than the global registry, and avoid nameclashes.
