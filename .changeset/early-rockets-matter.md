---
'@open-wc/dev-server-hmr': patch
---

Add a preset for the new lit package which will patch imports like `import { LitElement } from 'lit';`

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
