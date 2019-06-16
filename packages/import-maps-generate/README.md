# Create Import Map

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This will allow you to generate an [import-map](https://github.com/WICG/import-maps).

::: warning
Only yarn.lock is supported for now
:::

## Features
- generates a flat import-map
- prompts when there are conflicts
- supports resolutions, overrides, deletions via a config property in package.json
- supports yarn workspaces (monorepos)

## Usage

Install:

```bash
yarn add @import-maps/generate
```

Generation of the importmap should happen after you install dependencies, so you can add the script to your postinstall hook in `package.json`:

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

There may be times where you'll want to apply overrides. For example, if you're using the built-in `std:kv-storage` module and the polyfill for browsers that don't support it, the `kv-storage-polyfill` will be in your yarn.lock, and will be included in your import map. But what you'll actually want is:

```json
{
  "imports": {
    "std:kv-storage": [
      "std:kv-storage", // try to get the built-in module if supported
      "/node_modules/kv-storage-polyfill/index.js" // if not, this is the fallback
    ]
  }
}
```

### Deletes

You can apply deletions to the generated importmap by adding a `importmap` property to your package.json:

`package.json`:
```json
{
  "name": "@import-maps/generate",
  "version": "0.0.0",
  // ...
  "importmap": {
    "deletes": ["kv-storage-polyfill", "kv-storage-polyfill/"]
  }
}
```

### Overrides

If you want to override a dependency in the importmap with a custom value (eg: you want to get something from a CDN instead), <!-- TODO: better example? --> you can add an `overrides` property:

`package.json`:
```json
{
  "name": "@import-maps/generate",
  "version": "0.0.0",
  // ...
  "importmap": {
    "overrides": {
      "lit-html": "https://cdn.pika.dev/lit-html"
    },
    "deletes": ["lit-html/"]
  }
}
```

::: warning
If you apply an override, you'll need to delete the generated scope as well. 
:::


<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/import-maps-generate/src/README.md';
      }
    }
  }
</script>
