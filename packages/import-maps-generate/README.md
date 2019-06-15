# Generate Import Map

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This will allow you to generate a flat [import-map](https://github.com/WICG/import-maps).
It allows you to fix the "nested" npm problem for front end development.

::: warning
Only yarn.lock is supported for now
:::

::: warning
This is still in early beta (with windows pathes not supported yet)
:::

## Features
- generates a flat import-map
- prompts when there are not automatically resolveable conflicts
- supports resolutions, overrides, deletions via the `importMap` property in package.json
- supports yarn workspaces (monorepos)

## Usage

Install:

```bash
yarn add @import-maps/generate
```

Generation of the importMap should happen after you install dependencies, so you can add the script to your postinstall hook in `package.json`:

```json
"scripts": {
  "postinstall": "generate-import-map"
}
```

If you only want to try it out once to see what it will generate you can simply do so via:

```bash
npx @import-map/generate
```

## Configuration

There may be times where you'll want to apply overrides. For example, if you're using the built-in `std:kv-storage` module and the polyfill for browsers that don't support it, the `kv-storage-polyfill` will be in your yarn.lock, and will be included in your import map like so.

```json
{
  "imports": {
    "kv-storage-polyfill": "/node_modules/kv-storage-polyfill/index.js",
    "kv-storage-polyfill/": "/node_modules/kv-storage-polyfill/"
  }
}
```

however what you actually want is to
- use the built-in module if supported
- use the polyfill as a fallback

you can archive that via an override in your `package.json`

```json
{
  "name": "my-package",
  "version": "0.0.0",
  // ...
  "importMap": {
    "overrides": {
      "kv-storage-polyfill": [
        "std:kv-storage",
        "/node_modules/kv-storage-polyfill/index.js"
      ]
    },
    "deletes": ["kv-storage-polyfill/"]
  }
}
```

which will result in the following import map.
```json
{
  "imports": {
    "std:kv-storage": [
      "std:kv-storage",
      "/node_modules/kv-storage-polyfill/index.js"
    ]
  }
}
```

### Deletes

You can apply deletions to the generated importMap by adding a `importMap` property to your package.json:

`package.json`:
```json
{
  "name": "my-package",
  "version": "0.0.0",
  // ...
  "importMap": {
    "deletes": ["kv-storage-polyfill", "kv-storage-polyfill/"]
  }
}
```

### Overrides

If you want to override a dependency in the importMap with a custom value you can add an `overrides` property.
This can be useful
- to fix a dependency with a local fork (hopefully temporarily)
- to get a dependency from a CDN instead

`package.json`:
```json
{
  "name": "my-package",
  "version": "0.0.0",
  // ...
  "importMap": {
    "overrides": {
      "lit-html": "/lit-html-fixed/lit-html.js",
      "lit-html/": "/lit-html-fixed/"
    },
  }
}
```

In this case everyone who import from `lit-html` will now use your local fork which may contain fixes.

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/import-maps-generate/README.md';
      }
    }
  }
</script>
