# Polyfills loader

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

We want to provide a good set of defaults on how to facilitate your web component.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

A modern loader for the web components polyfills.

## Why this loader
The [official web component polyfills](https://github.com/webcomponents/webcomponentsjs) ships with a loader that should be included in your index.html. The challenge with this loader is that also adds language polyfills like `Promise` and `Symbol` on browsers that require it. At best this leads to duplicate code when already including these polyfills elsewhere in your app. At worst it will conflict and crash your app. For instance, this is a [known issue](https://github.com/webcomponents/webcomponentsjs/issues/972) with babel polyfills.

This loader seeks to solve this issue, it only loads the required web component polyfills. Additionally, the loader uses dynamic imports so that it integrates properly with your app's dependency graph. This works nicely when using the `usage` option on babel's polyfill transform.

## Using the loader
The loader should be called before importing you app:

```javascript
import loadPolyfills from '@open-wc/polyfills-loader';

loadPolyfills().then(() => import('./my-app.js'));
```

If your app contains code that doesn't use any of the web component APIs, they can be imported at the same time as the loader:

```javascript
import loadPolyfills from '@open-wc/polyfills-loader';
import './my-non-web-component-code.js';

loadPolyfills().then(() => import('./my-web-component-code.js'));
```

If you use a build setup which supports preloading you can prevent the extra 'hop' we created by postponing the import of your app.

For example with webpack:

```javascript
import loadPolyfills from '@open-wc/polyfills-loader';

loadPolyfills().then(() => import(/* webpackPreload: true */ './my-app.js'));
```

## Polyfills
The web component polyfill loads:
- Broken CustomEvent on IE11
- HTMLTemplateElement
- CustomElements API
- ShadowDom API
- URL and URLSearchParams

The webcomponent polyfill requires:
- Promise
- Array.from
- Symbol

Make sure the required polyfills are loaded before calling the loader. If you configure babel to load these polyfills on usage, this is done automatically.