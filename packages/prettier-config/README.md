# Linting Prettier

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/) Recommendations [open-wc](https://open-wc.org/)

We want to provide a good set of defaults on how to facilitate your web component.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Uses [Prettier](https://prettier.io) to format your JS, CSS and HTML code.

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:lint-prettier'
```

## Manual

- Install `@open-wc/prettier-config`.
  ```bash
  yarn add --dev @open-wc/prettier-config
  ```
- Create `prettier.config.js` to root directory of the project as following.
  ```js
  module.exports = require('@open-wc/prettier-config');
  ```
- Add these lines to your package.json
  ```js
  "scripts": {
    "lint:prettier": "prettier '**/*.js' --list-different || (echo '↑↑ these files are not prettier formatted ↑↑' && exit 1)",
    "format:prettier": "prettier '**/*.js' --write",
  },
  ```
- Update your `.eslintrc.js` to look like this:
  ```js
  module.exports = {
    extends: [
      '@open-wc/eslint-config',
      'eslint-config-prettier'
    ].map(require.resolve),
  };
  ```

## What you get

- apply formatting to JS files
- apply formatting to HTML inside of `html` tagged template literals used by [lit-html](https://github.com/Polymer/lit-html)
- apply formatting to CSS inside of `css` tagged template literals used by [lit-css](https://github.com/lit-styles/lit-styles/tree/master/packages/lit-css)
- integration with ESLint to prevent potentially conflicting rules

## Usage

Run:
- `npm run lint:prettier` to check if any file is not correctly formatted
- `npm run format:prettier` to auto format your files

## Linting Error Examples

```bash
$ npm run lint:prettier

test/set-card.test.js
test/set-game.test.js
↑↑ these files are not prettier formatted ↑↑
```

So just run `npm run format:prettier` to format those files automatically.
