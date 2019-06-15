# Create Import Map

[//]: # (AUTO INSERT HEADER PREPUBLISH)

This will allow you to generate an [import-map](https://github.com/WICG/import-maps).

::: warning
Only yarn.lock is supported for now
:::

## Features
- creates a flat import-map
- askes if there is a conflict
- supports resolutions, overrides, deletions via config in package.json
- supports yarn workspaces (monorepos)

## Usage

In most cases you want to create the map in an postinstall step.

```bash
yarn add @import-map/create
```

```json
"scripts": {
  "postinstall": "create-import-map"
}
```

If you only want to try it out once to see what it will generate you can simply do so via

```bash
npm init @import-map
```

::: warning
`npm init` requires node 10 & npm 6 or higher
:::


<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/import-map-create/src/README.md';
      }
    }
  }
</script>
