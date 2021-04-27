---
'@open-wc/scoped-elements': major
---

Adds compatibility for [lit](https://lit.dev/) with `lit-html v2` and `lit-element v3`.

- This version does NOT work with lit-element v2 - please use Scoped Elements v1 for it
- Uses a `CustomElementsRegistry` instance for each component class instead of for each component instance. In case you need to have a registry for each component instance, you must override the registry `get` and `set` methods to bind the registry to the component instance

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
