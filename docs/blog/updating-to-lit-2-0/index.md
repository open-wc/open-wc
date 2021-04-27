---
title: 'Updating to Lit 2'
pageTitle: 'Updating to Lit 2'
date: 2021-04-25
published: true
description: 'Whats always better than doing work? Not doing work!'
tags: [webcomponents, lithtml, litelement, javascript]
canonical_url: https://open-wc.org/blog/updating-to-lit-2-0/
---

# Updating to Lit 2

With this release we update all of our packages to support [Lit - Simple. Fast. Web Components.](https://lit.dev/).

It's our first breaking change to our testing and testing helpers package for ~2 years.

With that we release

## @open-wc/testing@3.0.0 & @open-wc/testing-helpers@2.0.0

- Upgrade to support latest `lit` package.
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

- (only testing): use chai as a module

## @open-wc/scoped-elements@2.0.0

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

## @open-wc/lit-helpers@0.4.0

- Removes directives from package

- the `live` directive is in the official [lit](https://lit.dev/docs/templates/directives/#live) package.
- the `spread` and `spreadProps` directives no longer work with the updated directive API of `lit`. They will need to be recreated and we will do this in [lit-labs](https://github.com/lit/lit/tree/main/packages/labs).
- `import { /* ... */ } from '@open-wc/lit-helpers';` is now the only valid entrypoint

## @open-wc/dev-server-hmr@0.1.2

- use correct babel dependency
- Add a preset for the new lit package which will patch imports like `import { LitElement } from 'lit';`

  ```js
  import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

  export default {
    plugins: [
      hmrPlugin({
        presets: [presets.lit],
      }),
    ],
  };
  ```
