---
permalink: 'testing/testing-wallaby.html'
title: Testing in IDE via Wallaby
section: guides
tags:
  - guides
---

> **Notice**
>
> We have stopped new development of this package.
>
> We will continue to support security patches and bug fixes, but we recommend [web test runner](https://modern-web.dev/docs/test-runner/overview/) for testing web component projects.

# Testing in IDE via Wallaby

Wallaby.js is a Plugin for your IDE and runs tests in real time while you are typing.

[//]: # 'AUTO INSERT HEADER PREPUBLISH'

Using:

- In IDE Testing via [wallaby.js](https://wallabyjs.com/)

## Setup

```bash
npm init @open-wc
```

### Manual

1. Copy the [config](https://github.com/open-wc/open-wc/blob/master/packages/create/src/generators/testing-wallaby/templates/static/wallaby.js) and save it as `wallaby.js` into your project root
2. `npm i -D @open-wc/testing-wallaby`

## Usage

Open your wallaby.js supported IDE and start with the provided config.

## Example

The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) has Wallaby Setup.
