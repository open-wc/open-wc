# Generate Import Map

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This will allow you to generate a flat [import-map](https://github.com/WICG/import-maps).
It allows you to fix the "nested" npm problem for front end development.

::: warning
Currently only yarn.lock is supported
:::

::: warning
This is still in early beta (windows paths are not supported yet)
:::

## Features
- generates a flat import-map
- prompts the user when there are version conflicts that are not automatically resolvable
- supports resolutions, overrides and deletions via the `importMap` property in package.json
- supports yarn workspaces (monorepos)

## Usage

Install:

```bash
yarn add @import-maps/generate
```

Generation of the import map should happen after you install dependencies, so you can add the script to your postinstall hook in `package.json`:

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

You can add a `importMap` key in your `package.json` file to specify overrides, deletions or resolutions.

`package.json`:
```
{
  "name": "my-package",
  "version": "0.0.0",
  // ...
  "importMap": {
    "overrides": {},
    "deletes": [],
    "resolutions": {}
  }
}
```

### Overrides

There may be times where you'll want to apply overrides. For example, if you're using the built-in `std:kv-storage` module and the polyfill for browsers that don't support it, the `kv-storage-polyfill` will be in your yarn.lock, and will be included in your import map like so.

```json
{
  "importMap": {
    "imports": {
      "kv-storage-polyfill": "/node_modules/kv-storage-polyfill/index.js",
      "kv-storage-polyfill/": "/node_modules/kv-storage-polyfill/"
    }
  }
}
```

however what you actually want is to:
- use the built-in module if supported
- use the polyfill as a fallback

you can achieve that via an override in your `package.json`:

```json
{
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

::: warning
Note that if you apply overrides, you may also need to specify deletions for the generated directory map in the import map.
:::

This will result in the following import map:
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

Overrides may be useful for:
- Polyfilling
- Fixing a dependency with a local fork
- Getting a dependency from a CDN instead

### Deletes

You can apply deletions to the generated import map by adding a `deletes` property to your package.json:

`package.json`:
```json
{
  "importMap": {
    "deletes": ["kv-storage-polyfill", "kv-storage-polyfill/"]
  }
}
```

### Resolutions

There may be times where you have conflicting versions. For example; `lit-html@0.14.0` and `lit-html@1.1.0` are both present, and you only want `lit-html@1.1.0`. When this happens, it will prompt the user to ask to solve the resolution. Alternatively, you can specify resolutions in your package.json instead.

`package.json`:
```json
{
  "importMap": {
    "resolutions": {
      "lit-html": "1.1.0"
    }
  }
}
```
    
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
