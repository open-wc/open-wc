# Webpack Helpers

[//]: # (AUTO INSERT HEADER PREPUBLISH)

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
