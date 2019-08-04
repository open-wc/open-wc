# Polyfills loader

[//]: # (AUTO INSERT HEADER PREPUBLISH)

> This package is deprecated! We recommend using [es-dev-server](https://www.npmjs.com/package/es-dev-server) while developing. For your production build, we recommend [@open-wc/building-rollup](https://www.npmjs.com/package/@open-wc/building-rollup) and [@open-wc/building-webpack](https://www.npmjs.com/package/@open-wc/building-webpack). These packages will handle polyfills for you automatically.

A modern loader for the web components polyfills.

## Why this loader
The [official web component polyfills](https://github.com/webcomponents/webcomponentsjs) ships with a loader that should be included in your index.html. The challenge with this loader is that also adds language polyfills like `Promise` and `Symbol` on browsers that require it. At best this leads to duplicate code when already including these polyfills elsewhere in your app. At worst it will conflict and crash your app. For instance, this is a [known issue](https://github.com/webcomponents/webcomponentsjs/issues/972) with babel polyfills.

This loader seeks to solve this issue, it only loads the required web component polyfills. Additionally, the loader uses dynamic imports so that it integrates properly with your app's dependency graph. This works nicely when using the `usage` option on babel's polyfill transform.

## Using the loader
The loader should be called before importing your app:

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

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/polyfills-loader/README.md';
      }
    }
  }
</script>
