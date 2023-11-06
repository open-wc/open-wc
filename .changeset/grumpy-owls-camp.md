---
'@open-wc/testing-helpers': major
---

chore: update @open-wc/scoped-elements to v3

If you're using a fixture like so with scoped elements:

```ts
await fixture(html`...`, { scopedElements: ... });
```

You're gonna have to load the [@webcomponents/scoped-custom-element-registry](https://www.npmjs.com/package/@webcomponents/scoped-custom-element-registry) polyfill yourself first.
