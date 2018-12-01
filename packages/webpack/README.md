# Webpack Helpers

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

We want to provide a good set of defaults on how to facilitate your web component.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

If you need support to use `import.meta.url` within webpack this is a minimal loader to support it.

## Note
This is NOT an optimal solution e.g. it will slow down your build time.
However as currently `import.meta` results in an webpack parse error using a loader is probably the only thing we can do for now.
For details see 
- [https://github.com/webpack/webpack/issues/6719](https://github.com/webpack/webpack/issues/6719)
- [https://github.com/Polymer/tools/issues/518](https://github.com/Polymer/tools/issues/518)

If webpack fixed that parse error import.meta will probably work out of the box.
If not then a babel plugin (that can work with AST) will be a better solution.

## Manual Setup
- `yarn add @open-wc/webpack`
- Add this to your webpack config
```js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: require.resolve('@open-wc/webpack/loaders/import-meta-url-loader.js'),
    },
  ],
},
```
