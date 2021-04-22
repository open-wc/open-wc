---
'@open-wc/testing': major
'@open-wc/testing-helpers': major
---

Upgrade to support latest `lit` package.

- the exports `html` and `unsafeStatic` are now deprecated we recommend to import them directly from `lit/static-html.js`;
- You need to load a polyfill for the scoped registry if you wanna use the `scopedElements` option
- We now enforce our entrypoints via an export map
- The side effect free import got renamed to `pure`

  ```js
  // old
  import { fixture } from '@open-wc/testing-helpers/index-no-side-effects.js';
  // new
  import { fixture } from '@open-wc/testing-helpers/pure';
  ```
