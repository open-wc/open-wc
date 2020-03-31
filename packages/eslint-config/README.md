# Linting ESLint

Use [ESLint](https://eslint.org/) to lint your es6 code.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Setup

```bash
npm init @open-wc
# Upgrade > Linting
```

::: tip
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Manual

- Install `@open-wc/eslint-config`
  ```bash
  npm add --save-dev @open-wc/eslint-config
  ```
- Adjust your package.json with the following
  ```js
  {
    "scripts": {
      "lint:eslint": "eslint --ext .js,.html . --ignore-path .gitignore",
      "format:eslint": "eslint --ext .js,.html . --fix --ignore-path .gitignore"
    },
    "eslintConfig": {
      "extends": [
        "@open-wc/eslint-config"
      ]
    }
  }
  ```

## What you get

This will install [`@open-wc/eslint-config`](https://github.com/open-wc/open-wc/blob/master/packages/eslint-config/index.js), a config based on airbnb but allows for some specialities needed for Web Components.

- Apply linting to js and html files
- Apply linting for best practices
- Allow dynamic module imports
- Allow imports in test/demos from devDependencies
- Allow underscore dangle
- Do not prefer default exports
- Do not prefer no file extension

## Usage

Run:

- `npm run lint:eslint` to check if any file is not correctly formatted
- `npm run format:eslint` to auto format your files

<script>
  export default {
    mounted() {
      const editLink = document.querySelector('.edit-link a');
      if (editLink) {
        const url = editLink.href;
        editLink.href = url.substr(0, url.indexOf('/master/')) + '/master/packages/eslint-config/README.md';
      }
    }
  }
</script>
