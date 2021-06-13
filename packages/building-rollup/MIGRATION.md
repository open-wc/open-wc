# Migration

## Migrating from v1 to v2

- Replaced rollup-plugin-html with @web/rollup-plugin-html
- Replaced babel-plugin-bundled-import-meta with @web/rollup-plugin-import-meta-assets
- Replaced @open-wc/rollup-plugin-polyfills-loader with @web/rollup-plugin-polyfills-loader

If you were relying on configuring/extending the config for these plugins, you might need to make adjustments. See the docs for the associated plugins:

- https://modern-web.dev/docs/building/rollup-plugin-html/
- https://modern-web.dev/docs/building/rollup-plugin-import-meta-assets/
- https://modern-web.dev/docs/building/rollup-plugin-polyfills-loader/

## Migrating from v0 to v1

- We are using features of rollup v2, make sure to update your version of rollup too.
- `createCompatibilityConfig` is now a `legacyBuild` option when creating the config
- There is now a separate `createBasicConfig` for JS -> JS bundling
- When building for legacy browsers, the config is no longer an array. Instead, the `output` option on the config is an array.

Before:

```js
import { createCompatibilityConfig } from '@open-wc/building-rollup';
export default createCompatibilityConfig({ input: './index.html' });
```

After:

```js
import merge from 'deepmerge';
import { createSpaConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  // use the outputdir option to modify where files are output
  // outputDir: 'dist',

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  legacyBuild: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
});

export default merge(baseConfig, {
  input: './index.html',
});
```
