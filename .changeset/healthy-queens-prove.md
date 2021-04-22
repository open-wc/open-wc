---
'@open-wc/scoped-elements': major
---

Add compatibility with lit-html 2 and lit-element 3.

- You are now require to load a polyfill for the scoped registry

  ```bash
  npm i --save @open-wc/scoped-elements @webcomponents/scoped-custom-element-registry
  ```

  ```html
  <script type="module">
    import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
  </script>
  ```

- `getScopedTagName` became deprecated - use the native `el.tagName` instead
