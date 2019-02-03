# Webpack Helpers

[//]: # (AUTO INSERT HEADER PREPUBLISH)

If you need support to use `import.meta` within webpack this is a minimal loader to support it.

## Note
This is NOT an optimal solution e.g. it may slow down your build a little.
However as currently `import.meta` results in an webpack parse error using a loader is probably the only thing we can do for now.
For details see 
- [https://github.com/webpack/webpack/issues/6719](https://github.com/webpack/webpack/issues/6719)
- [https://github.com/Polymer/tools/issues/518](https://github.com/Polymer/tools/issues/518)

If webpack fixed that parse error import.meta will probably work out of the box.
If not then a babel plugin (that can work with AST) will be a better solution.

## Manual Setup
- `yarn add @open-wc/webpack-import-meta-loader`
- Add this to your webpack config
```js
module: {
  rules: [
    {
      test: /\.js$/,
      loader: require.resolve('@open-wc/webpack-import-meta-loader'),
    },
  ],
},
```

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/webpack-import-meta-loader/README.md';
      }
    }
  }
</script>
