# Migrating from `2.0.0` to `3.0.0`

In version `3.0.0` of `@open-wc/scoped-elements`, we've made several breaking changes. You can read about the breaking changes we made and why we made those changes in this document, and how to change your code to be compatible with version `3.0.0` of the mixin.

## Polyfill required

The previous version of `@open-wc/scoped-elements` had a **polyfill** or **no-polyfill** mode. The idea being that the library would still work even if the polyfill was not loaded on the page. In practice, this turned out to be less than ideal and lead to confusing and hard to debug issues. For example, in **no-polyfill** mode, the mixin would fallback to the global `customElements` registry, meaning your elements wouldn't actually be _scoped_. For these reasons, we now made the polyfill a requirement for usage with this library.

You can find the required polyfill here: [@webcomponents/scoped-custom-element-registry](https://www.npmjs.com/package/@webcomponents/scoped-custom-element-registry).

> **Note:** Although the browser proposal has made good progress, in-progress specifications may be subject to change.

If you're using `@web/rollup-plugin-polyfills-loader` in your rollup build, you can easily enable it like so:

```js
polyfillsLoader({
  polyfills: {
    scopedCustomElementRegistry: true,
  },
}),
```

## Removed APIs

### `createScopedElement`

The `createdScopedElement` methods behavior would differ based on whether the mixin was operating on **polyfill**/**no-polyfill** mode, and would fallback to using `document.createElement` rather than `shadowRoot.createElement`. Since we've removed **no-polyfill** mode, and require the polyfill, you should now create elements imperatively via `shadowRoot.createElement`, which is aligned with the proposed native browser behavior.

```js
// ❌
this.createScopedElement('my-button');

// ✅
this.shadowRoot.createElement('my-button');
```

### `getScopedTagName`

The `getScopedTagName` method was a leftover from the `1.0.0` version of `@open-wc/scoped-elements`. The `1.0.0` version was a proprietary implementation of a scoping mechanism, created before there was a browser proposal. In this version, the mixin would add hashes to custom element names, e.g.: `<my-button-123456>` to avoid custom element registry name clashes. To then imperatively create those elements, you had to use the `getScopedTagName` method in order to know which name the mixin had assigned.

In the `2.0.0` version of the mixin, the scoping mechanism has changed to the Scoped Custom Element Registry proposal, and the concept of "scoped tag names" are no longer relevant. The behavior of `getScopedTagName` in `2.0.0` of the mixin equates to simply returning the string that it's passed;

```js
const tag = this.getScopedTagName('my-button');
console.log(tag); // 'my-button'
```

For these reasons, we removed it, instead, just use the tagname directly:

```js
// ❌
const tag = this.getScopedTagName('my-button');
this.createScopedElement(tag);

// ✅
this.shadowRoot.createElement('my-button');
```

### `defineScopedElement`

The `defineScopedElement` methods behavior would differ based on whether the mixin was operating on **polyfill**/**no-polyfill** mode, and fall back to the global `customElement` registry. Since we've removed **no-polyfill** mode, and require the polyfill, you should now define elements imperatively via `this.registry.define`, which is aligned with the proposed native browser behavior.

```js
// ❌
this.defineScopedElement('my-button', MyButton);

// ✅
this.registry.define('my-button', MyButton);
```

## Typescript

Note that this package exposes types via package exports, and you'll have to use a `tsconfig.json` that supports resolving package exports, like for example a `moduleResolution` of either `bundler` or `node16`
