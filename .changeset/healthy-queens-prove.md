---
'@open-wc/scoped-elements': major
---

Add compatibility with lit-html 2 and lit-element 3.

- Uses a `CustomElementsRegistry` instance for each component class instead of for each component instance. In case you need to have a registry for each component instance, you must override the registry `get` and `set` methods to bind the registry to the component instance.

  ```js
  /** @override */
  get registry() {
    return this.__registry;
  }

  /** @override */
  set registry(registry) {
    this.__registry = registry;
  }
  ```

- `getScopedTagName` became deprecated - use the native `el.tagName` instead
