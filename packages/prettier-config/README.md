# Linting Prettier

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/) Recommendations [open-wc](https://open-wc.org/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Use [Prettier](https://prettier.io) to format your JS, CSS and HTML code.

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
- Create `prettier.config.js` in the root directory of your project.
  ```js
  module.exports = require('@open-wc/prettier-config');
  ```
- Add the following scripts to your package.json
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

- Apply formatting to JS files
- Apply formatting to HTML inside of `html` tagged template literals used by [lit-html](https://github.com/Polymer/lit-html)
- Apply formatting to CSS inside of `css` tagged template literals used by [lit-css](https://github.com/lit-styles/lit-styles/tree/master/packages/lit-css)
- Integration with ESLint to prevent potentially conflicting rules

## Usage

Run:
- `npm run lint:prettier` to check if your files are correctly formatted
- `npm run format:prettier` to auto format your files

## Linting Error Examples

```bash
$ npm run lint:prettier

test/set-card.test.js
test/set-game.test.js
↑↑ these files are not prettier formatted ↑↑
```

Simply run `npm run format:prettier` to format your files automatically.
