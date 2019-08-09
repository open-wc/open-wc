# Linting ESLint

[//]: # (AUTO INSERT HEADER PREPUBLISH)

> Note that we only support eslint v5, we are blocked on some of our dependencies updating. See https://github.com/airbnb/javascript/issues/2036 for progress.

Use [ESLint](https://eslint.org/) to lint your es6 code.

## Setup
```bash
npm init @open-wc
# Upgrade > Linting
```

::: tip
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Manual
- `yarn add --dev @open-wc/eslint-config`
- Copy [.eslintignore](https://github.com/open-wc/open-wc/blob/master/packages/create/src/generators/linting-eslint/templates/static/.eslintignore) to `.eslintignore`
- Copy [.eslintrc.js](https://github.com/open-wc/open-wc/blob/master/packages/create/src/generators/linting-eslint/templates/static/.eslintrc.js) to `.eslintrc.js`
- Add these scripts to your package.json
  ```js
  "scripts": {
    "lint:eslint": "eslint --ext .js,.html .",
    "format:eslint": "eslint --ext .js,.html . --fix"
  },
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
