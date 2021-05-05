---
title: 'Updating to Lit 2'
pageTitle: 'Updating to Lit 2'
date: 2021-05-05
published: true
description: 'Simple. Fast. Web Components.'
tags: [webcomponents, lit, javascript]
canonical_url: https://open-wc.org/blog/updating-to-lit-2-0/
cover_image: /blog/updating-to-lit-2-0/images/blog-header.jpg
socialMediaImage: /blog/updating-to-lit-2-0/images/social-media-image.jpg
---

# Updating to Lit 2

With this pre release we update all of our packages to support [Lit - Simple. Fast. Web Components.](https://lit.dev/).

> Lit 2.0 is designed to work with most code written for LitElement 2.x and lit-html 1.x. There are a small number of changes required to migrate your code to Lit 2.0. The high-level changes required include:

> 1. Updating npm packages and import paths.
> 2. Loading polyfill-support script when loading the web components polyfills.
> 3. Updating any custom directive implementations to use new class-based API and associated helpers.
> 4. Updating code to renamed APIs.
> 5. Adapting to minor breaking changes, mostly in uncommon cases.

If you have existing lit-element components be sure to follow the rest of the [official upgrade guide](https://lit.dev/docs/releases/upgrade/).

It will be our first breaking change to our testing and testing helpers package for ~2 years. We encourage you to test it out.

You can expect the following in this pre release:

## @open-wc/testing@next & @open-wc/testing-helpers@next

You can get the prerelease via

```bash
npm i -D @open-wc/testing@3.0.0-next.0 @open-wc/testing-helpers@next
```

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

- (only testing): We now use an es module version of chai from `@esm-bundle/chai`.

## @open-wc/scoped-elements@next

You can get the prerelease via

```bash
npm i -D @open-wc/scoped-elements@next
```

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

<inline-notification type="warning">

This version of `@open-wc/scoped-elements` is now following the [Scoped Custom Element Registries](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) and automatically loads a polyfill [@webcomponents/scoped-custom-element-registry](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry). One edge case that is not yet full covered by the polyfill is reusing global components within the a scoped registry. In that case expect issues with [upgrading](https://github.com/webcomponents/polyfills/issues/442) and [whenDefined](https://github.com/webcomponents/polyfills/issues/443). For all other cases we encourage you to try it out and we are very curious for feedback.

</inline-notification>

## @open-wc/lit-helpers@next

You can get the prerelease via

```bash
npm i -D @open-wc/lit-helpers@next
```

- Removes directives from package
- the `live` directive is in the official [lit](https://lit.dev/docs/templates/directives/#live) package.
- the `spread` and `spreadProps` directives no longer work with the updated directive API of `lit`. They will need to be recreated and we will do this in [lit-labs](https://github.com/lit/lit/tree/main/packages/labs).
- `import { /* ... */ } from '@open-wc/lit-helpers';` is now the only valid entrypoint

<inline-notification type="warning">

There is no alternative to `spread` or `spreadProps` yet - if you are currently using it we recommend to wait with upgrading

</inline-notification>

## @open-wc/dev-server-hmr@next

You can get the prerelease via

```bash
npm i -D @open-wc/dev-server-hmr@next
```

- Update babel dependency to use `@babel/plugin-syntax-import-assertions`.
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

## Service Worker strategy change

As our page grows so did what you needed to download when visiting our page. Our strategy was to make the full page available offline whenever you visited our website. That was fine when we had a view pages but now an update can lead to you downloading 10 MB even though you might only be interested in a single article. It also meant that you where looking at the old cached version of the website until every single page was downloaded. So from today we are changing our strategy to

- caches only visited pages
- caches assets of visited pages (up to 100 files then it replaces older entries)
- on service worker activation it will reload the page if a newer version is available

At some point we want to offer you choices to enable offline for the entire website or for sections of the website but it's not there yet.
This change however will drastically reduce the cache size and the time for you to see the new content.

--

Photo by <a href="https://unsplash.com/@paulrobert?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Paul Robert</a> on <a href="https://unsplash.com/s/photos/lit?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

```js script
import '@rocket/launch/inline-notification/inline-notification.js';
```
