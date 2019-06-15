# Create Import Map

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This will allow you to generate an [import-map](https://github.com/WICG/import-maps).

::: warning
Only yarn.lock is supported for now
:::

## Features
- generates a flat import-map
- askes if there is a conflict
- supports resolutions, overrides, deletions via config in package.json
- supports yarn workspaces (monorepos)

## Usage

In most cases you want to generate the map in an postinstall step.

```bash
yarn add @import-maps/generate
```

```json
"scripts": {
  "postinstall": "generate-import-map"
}
```

If you only want to try it out once to see what it will generate you can simply do so via

```bash
npx @import-map/generate
```

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
