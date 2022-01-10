---
'@open-wc/scoped-elements': minor
---

Do not load the scoped registry polyfill by default which means that

1. If polyfill is not loaded it will use the global registry as a fallback
2. Log error if actually scoping is needed and polyfill is not loaded
3. If you manually create elements you will need to handle polyfilled and not polyfilled cases now

```diff
-  const myButton = this.shadowRoot.createElement('my-button');
+  const root = this.shadowRoot.createElement ? this.shadowRoot : document;
+  const myButton = root.createElement('my-button');
```

This also removes `@webcomponents/scoped-custom-element-registry` as a production dependency.

If you need scoping be sure to load the polyfill before any other web component gets registered.

It may look something like this in your HTML

```html
<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
```

or if you have an SPA you can load it at the top of your app shell code

```js
import '@webcomponents/scoped-custom-element-registry';
```
