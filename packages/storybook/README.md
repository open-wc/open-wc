# Demoing via storybook

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your web component project. Our recommendations include: developing, linting, testing, building, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

For demoing and showcasing different states of your Web Component, we recommend using [storybook](https://storybook.js.org/).

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Setup
```bash
npm i -g yo
npm i -g generator-open-wc

yo open-wc:demoing
```

### Manual
- `yarn add @open-wc/storybook --dev`
- Copy at minimum the [.storybook](https://github.com/open-wc/open-wc/tree/master/packages/generator-open-wc/generators/demoing-storybook/templates/static/.storybook) folder to `.storybook`
- If you want to bring along the examples, you may also copy the `stories` folder.
- Add the following scripts to your package.json
```js
"scripts": {
  "site:build": "npm run storybook:build",
  "storybook:build": "build-storybook -o _site",
  "storybook:start": "start-storybook -p 9001"
},
```

## Usage

Create stories within the `stories` folder.

```bash
npm run storybook:start
```

## Example
The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) has the default publishing via storybook on netlify.
You can see the finished page at: [https://example-set-game-open-wc.netlify.com/](https://example-set-game-open-wc.netlify.com/).
