# Demoing via storybook

[//]: # (AUTO INSERT HEADER PREPUBLISH)

For demoing and showcasing different states of your Web Component, we recommend using [storybook](https://storybook.js.org/).

::: tip
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
