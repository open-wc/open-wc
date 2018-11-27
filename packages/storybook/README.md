# Demos via storybook

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

We want to provide a good set of defaults on how to facilitate your web component.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

If you want to nicely show all the states of you webcomponent we recommend storybook.

Using:
- [storybook](https://storybook.js.org/)

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:publish-storybook'
```

### Manual
- `yarn add @open-wc/storybook --dev`
- copy at least the [.storybook](https://github.com/open-wc/open-wc/tree/master/packages/generator-open-wc/generators/publish-storybook/templates/static) folder to `.storybook`
- maybe also copy the `stories` folder if you want examples
- add these scripts to your package.json
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
You can see the finished page at: https://example-set-game-open-wc.netlify.com/.
