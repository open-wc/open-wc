# @open-wc/dev-server-wc-hmr

## 0.1.3

### Patch Changes

- 61e2668f: update eslint, eslint-config-airbnb-base and eslint-plugin-import

## 0.1.2

### Patch Changes

- ca91826b: Update babel dependency to use `@babel/plugin-syntax-import-assertions`.
- 487d39fb: Add a preset for the new lit package which will patch imports like `import { LitElement } from 'lit';`

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

## 0.1.2-next.0

### Patch Changes

- ca91826b: Update babel dependency to use `@babel/plugin-syntax-import-assertions`.
- 487d39fb: Add a preset for the new lit package which will patch imports like `import { LitElement } from 'lit';`

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

## 0.1.1

### Patch Changes

- e2f9240e: fix(dev-server-hmr): fix compatibility with scoped-elements

## 0.1.0

### Minor Changes

- 9405f2e5: Generate a correct name when using anonymous classes

### Patch Changes

- be1f93e8: allow prototype modification

## 0.0.6

### Patch Changes

- cd442855: implement HMR using proxies

## 0.0.5

### Patch Changes

- afadd6fa: handle multiple assigned variables

## 0.0.4

### Patch Changes

- a71fcac8: remove usage of optional chaining

## 0.0.3

### Patch Changes

- 3fd1afdd: support function components

## 0.0.2

### Patch Changes

- 7900cf74: fix package name

## 0.0.1

### Patch Changes

- c9dc557f: first release
