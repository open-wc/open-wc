---
title: 'Scoped Elements Without Polyfill'
pageTitle: 'Scoped Elements Without Polyfill'
date: 2022-04-04
published: true
description: 'Scoped Elements Without Polyfill'
tags: [webcomponents, lit, javascript]
canonical_url: https://open-wc.org/blog/scoped-elements-without-polyfill/
cover_image: /blog/scoped-elements-without-polyfill/images/blog-header.jpg
socialMediaImage: /blog/scoped-elements-without-polyfill/images/social-media-image.jpg
---

When using [component composition](https://lit.dev/docs/composition/component-composition/) we should be explicit about which sub-components we use.
Additionally when scoped these [sub components](https://open-wc.org/docs/development/scoped-elements/) to the [current shadow root](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) allowing multiple version to be used simultaneously.

This means that you can use a Web Component like `my-login` (which uses component composition) and never have to worry about if the internally used components clash with others you are already using.

## How does it work?

1. Within classes you can only import other classes (e.g. in class `MyCard` we use `MyCardHeader` via composition)
2. We define them as `scopedElements` (`my-card-header: MyCardHeader`) and let the ScopedElementsMixin handle the rest
3. There are some more [requirements/limitations](https://open-wc.org/docs/development/scoped-elements/#limitations)

To clarify: within class files we can never import files that run `customElement.define`

```js
import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { MyCardHeader } from './MyCardHeader.js';

export class MyCard extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-card-header': MyCardHeader,
  };

  render() {
    return html`
      <div>
        <my-card-header></my-card-header>
        <slot></slot>
      </div>
    `;
  }
}
```

## Known challenges in previous releases

ScopedElementsMixin 2.x tried to be as convenient as possible by automatically loading the scoped custom elements registry polyfill.
This however led to a fatal error whenever you registered any component before ScopedElementsMixin was used.

This especially happens when you import a web component using ScopedElementsMixin into an existing application.

This fundamentally breaks the way we think web components should work. We believe it should be "import and use".
That is why we decided to treat this change as if it were a security-breaking change - consumers should do the breaking bug fix on their end, but releasing a new major version would not be beneficial, both to us and our consumers.

## How do we fix it?

We stop requiring the polyfill if not absolutely necessary.

To rephrase it:

> Starting with ScopedElements v2.1.0 it will work without needing any polyfills

Not loading the polyfill by default will also allow sites to opt out of it altogether. This means until the browser ships scoped registries, the developer can choose to fall back to the global registry, by not loading the polyfill. This will save bandwidth & complexity since it doesn't need to be loaded by the client in that case.

All previous 2.x versions will be deprecated and scoped element will behave as follows:

1. If polyfill is not loaded it will use the global registry as a fallback
2. Log error if actually scoping is needed and polyfill is not loaded
3. If you manually create elements you will need to handle polyfilled and not polyfilled cases now

```diff
-  const myButton = this.shadowRoot.createElement('my-button');
+  const myButton = this.createScopedElement('my-button');
```

## Be explicit and stay forward compatible

Be sure to always define **ALL** the sub elements you are using in your template within your `scopedElements` property.

```js
import { LitElement, html, ScopedElementsMixin } from '@lion/core';
import { MyCardHeader } from './MyCardHeader.js';

export class MyCard extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'my-card-header': MyCardHeader,
  };

  render() {
    return html`
      <div>
        <my-card-header></my-card-header>
        <slot></slot>
        <my-card-footer></my-card-footer>
      </div>
    `;
  }
}
```

☝️ here we are missing a definition for `my-card-footer` in `scopedElements`.

This means as soon as there is support for the scoped registry (be it native of via a polyfill) this component will not be available anymore because every new scoped registry starts off empty (there is no inheritance of a global or parent registry).

Therefore **always** define all your sub elements.

## How to get scoping

You need scoping if you want to:

- use 2 major versions of a web component (e.g. in an SPA pageA uses 1.x and pageB uses 2.x of color-picker)
- use the same tag name with different implementations (use tag color-picker from foo here and from bar here)

This usually is only needed in bigger Single Page Applications.
In smaller applications or static sites (like 11ty, wordpress, ...) these tag name clashes are unlikely.

If you need scoping and the browser you are using does not support a [scoped registry](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) yet (which is none in April 2022) then you need to install and load a polyfill first thing in your HTML.

```bash
npm i @webcomponents/scoped-custom-element-registry
```

It could look something like this:

```html
<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
```

or if you have an SPA you can load it at the top of your app shell code

```js
import '@webcomponents/scoped-custom-element-registry';
```

## Conclusion

We know this is somewhat controversial features change as it may require you to manually load the polyfill if you are requiring scoping.
We however believe that forcing this small change to a subset of our users is a far better option than introducing a new major version which would still break if used in combination.

We hope this makes it clear what the benefit of using component composition with `ScopedElementsMixin` are and why it is important to not automatically loading/needing the polyfill.

--

Photo by <a href="https://unsplash.com/@cifilter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Shannon Potter</a> on <a href="https://unsplash.com/s/photos/web?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

```js script
import '@rocket/launch/inline-notification/inline-notification.js';
```
