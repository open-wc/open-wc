# Migration

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
