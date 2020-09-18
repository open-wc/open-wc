---
permalink: 'linting/linting-types.html'
title: Linting Types
section: guides
tags:
  - guides
---

# Linting Types

Use [TypeScript](https://www.typescriptlang.org/) to type lint your es6 JSDoc annotated code.

## Setup

```bash
npm init @open-wc linting-types-js
```

<div class="custom-block tip"><p class="custom-block-title">TIP</p> <p>This is an OPTIONAL recommendation. You will need to opt-in by running the generator or following the manual steps.</p></div>

## Manual

- `yarn add --dev typescript`
- Copy [tsconfig.json](https://github.com/open-wc/open-wc/blob/master/packages/create/src/generators/linting-types-js/templates/static/tsconfig.json) to `tsconfig.json`
- Add these scripts to your package.json
  ```js
  "scripts": {
    "lint:types": "tsc",
  },
  ```

## What you get

For general information about types please see [developing/types](../developing/types.html).

- Awesome intellisense for @open-wc tools/helpers
- Ability to jump directly to the source of @open-wc code via F12 (in vs code)
- Type safety (To read more about why type safety can help you, go to: [developing/types](../developing/types.html)).

## Usage

Run:

- `npm run lint:types` to check if you have type errors

## Type linting error example

```bash
$ npm run lint:types

> foo-bar@ lint:types /path/to/foo-bar
> tsc

test/foo-bar.test.js:7:22 - error TS2554: Expected 1 arguments, but got 2.
7     const el = await fixture('<foo-bar></foo-bar>', { hasMoreOptions: false });
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Found 1 error.
```
