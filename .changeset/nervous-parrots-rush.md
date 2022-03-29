---
'@open-wc/scoped-elements': minor
---

BREAKING CHANGE: Work without polyfill if possible (and do not auto load polyfill)

ScopedElementsMixin 2.x tried to be as convenient as possible by automatically loading the scoped custom elements registry polyfill.
This however led to a fatal error whenever you registered any component before ScopedElementsMixin was used.

This especially happens when you import a web component using ScopedElementsMixin into an existing application.

This fundamentally breaks the way we think web components should work. We believe it should be "import and use".
That is why we decided to treat this change as if it were a security-breaking change - consumers should do the breaking bug fix on their end, but releasing a new major version would not be beneficial, both to us and our consumers.

Not loading the polyfill by default will also allow sites to opt out of it altogether. This means until the browser ships scoped registries, the developer can choose to fall back to the global registry, by not loading the polyfill. This will save bandwidth & complexity since it doesn't need to be loaded by the client in that case.

All previous 2.x versions will be deprecated and scoped element will behave as follows:

1. If polyfill is not loaded it will use the global registry as a fallback
2. Log error if actually scoping is needed and polyfill is not loaded
3. If you manually create elements you will need to handle polyfilled and not polyfilled cases now

```diff
-  const myButton = this.shadowRoot.createElement('my-button');
+  const myButton = this.createScopedElement('my-button');
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

You need scoping if you want to

- use 2 major versions of a web component (e.g. in an SPA pageA uses 1.x and pageB uses 2.x of color-picker)
- or you want to use the same tag name with different implementations (use tag color-picker from foo here and from bar here)
