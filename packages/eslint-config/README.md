# Linting ESLint

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/) Recommendations [open-wc](https://open-wc.org/)

We want to provide a good set of defaults on how to facilitate your web component.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Uses [ESLint](https://eslint.org/) to lint your es6 code.

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:lint-eslint'
```

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

### Manual
- `yarn add @open-wc/eslint-config --dev`
- copy [.eslintignore](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-eslint/templates/static/.eslintignore) to `.eslintignore`
- copy [.eslintrc.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/lint-eslint/templates/static/.eslintrc.js) to `.eslintrc.js`
- add these scripts to your package.json
```js
"scripts": {
  "lint": "npm run lint:eslint",
  "lint:eslint": "eslint --ext .js,.html ."
},
```

## What you get

This will install `@open-wc/eslint-config`. A config based on airbnb but allow for specialities needed for web components like.
- apply linting to js and html files
- allow dynamic module imports
- allow imports in test/demos from devDependencies
- allow underscore dangle
- do not prefer default exports
- do not prefer no file extension

## Run
```bash
npm run lint:eslint
```
