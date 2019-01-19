# Linting ESLint

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Use [ESLint](https://eslint.org/) to lint your es6 code.

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:lint-eslint'
```

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Manual
- `yarn add --dev @open-wc/eslint-config`
- Copy [.eslintignore](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-eslint/templates/static/.eslintignore) to `.eslintignore`
- Copy [.eslintrc.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-eslint/templates/static/.eslintrc.js) to `.eslintrc.js`
- Add these scripts to your package.json
  ```js
  "scripts": {
    "lint:eslint": "eslint --ext .js,.html .",
    "format:eslint": "eslint --ext .js,.html . --fix"
  },
  ```

## What you get

This will install `@open-wc/eslint-config`, a config based on airbnb but allows for some specialities needed for Web Components.
- Apply linting to js and html files
- Allow dynamic module imports
- Allow imports in test/demos from devDependencies
- Allow underscore dangle
- Do not prefer default exports
- Do not prefer no file extension

## Usage

Run:
- `npm run lint:eslint` to check if any file is not correctly formatted
- `npm run format:eslint` to auto format your files
