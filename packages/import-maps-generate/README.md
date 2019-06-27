# Generate Import Map

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This will allow you to generate a flat [import-map](https://github.com/WICG/import-maps).
It allows you to fix the "nested" npm problem for front end development.

::: warning
Currently, only yarn.lock is supported
:::

::: warning
This is still in early beta (Windows paths are not supported yet)
:::

## Features
- Generates a flat import-map
- Prompts the user when there are version conflicts that are not automatically resolvable
- Supports resolutions, overrides, and deletions via the `importMap` property in package.json
- Supports yarn workspaces (monorepos)

## Usage

Install:

```bash
yarn add @import-maps/generate
```

You should generate the import map after you install dependencies by adding the script to your `postinstall` hook in `package.json`:

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
    "overrides": {
      "imports": {},
      "scopes": {}
    },
    "deletes": [],
    "resolutions": {}
  }
}
```

### Overrides

There may be times where you'll want to override certain imports. For example, if you're using the built-in `std:kv-storage` module along with `kv-storage-polyfill` for nonsupporting browsers, then `kv-storage-polyfill`  will be in your lockfile. The generated import map will look like this:

```json
{
  "importMap": {
    "overrides": {
      "imports": {
        "kv-storage-polyfill": "/node_modules/kv-storage-polyfill/index.js",
        "kv-storage-polyfill/": "/node_modules/kv-storage-polyfill/"
      }
    }
  }
}
```

however what you actually want is to:
- use the built-in module if supported
- use the polyfill as a fallback

You can achieve that via an override in your `package.json`'s `importMap` configuration:

```json
{
  "importMap": {
    "overrides": {
      "imports": {
        "kv-storage-polyfill": [
          "std:kv-storage",
          "/node_modules/kv-storage-polyfill/index.js"
        ]
      }
    },
    "deletes": ["kv-storage-polyfill/"]
  }
}
```

::: warning
Note that if you apply overrides, you may also need to specify deletions for the generated [package map](https://github.com/WICG/import-maps#packages-via-trailing-slashes) in the import map.
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

### Overriding Scopes

You can also override entire scopes:

```json
{
  "importMap": {
    "overrides": {
      "scopes": {
        "lit-html/": "/path/to/lit-html/"
      }
    }
  }
}
```


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

There may be times where you have conflicting versions of the same package in your `node_modules`. For example, one package may depend on `lit-html@0.14.0` and another on `lit-html@1.1.0`. In that case, the import map generator will prompt the user to pick a particular version to use canonically.

Alternatively, you can specify your own resolutions in your package.json.

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
