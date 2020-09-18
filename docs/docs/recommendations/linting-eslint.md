---
title: Linting ESLint
pageTitle: Linting ESLint
eleventyNavigation:
  key: Linting ESLint
  parent: Recommendations
  order: 10
---

Use [ESLint](https://eslint.org/) to lint your code.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

## Setup

```bash
npm init @open-wc
# Upgrade > Linting
```

<div class="custom-block tip"><p class="custom-block-title">TIP</p> <p>This is part of the default <a href="https://open-wc.org/" target="_blank" rel="noopener noreferrer">open-wc<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path> <polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg></a> recommendation</p></div>

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

## Running with Prettier

If you also are using Prettier, in order for your ESLint to play nicely with Prettier, you should also include eslint-config-prettier.
This way, the Prettier formatting will take into account your linting rules, so you don't need to add your own overrides for Prettier if it clashes with your linting rules.

```bash
npm add --save-dev eslint-config-prettier
```

```json
{
  "eslintConfig": {
    "extends": ["@open-wc/eslint-config", "eslint-config-prettier"]
  }
}
```

And if you want the same formatting rules as the deprecated `@open-wc/prettier-config`, you can add some prettier overrides in your `package.json`:

```json
{
  "prettier": {
    "singleQuote": true,
    "arrowParens": "avoid"
  }
}
```

This combination of `Prettier 2` and `@open-wc/eslint-config` represents the outcome if you add both linting and formatting while scaffolding with:

```bash
npm init @open-wc
```
