# Testing in IDE via wallaby

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

Wallaby.js is a Plugin for your IDE and runs tests in real time while you are typing.

Using:
- In IDE Testing via [wallaby.js](https://wallabyjs.com/)

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:wallaby'
```

### Manual
1. Copy the [config](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/testing-wallaby/templates/static/wallaby.js) and save it as `wallaby.js` into your project root
1. `yarn add @open-wc/testing-wallaby --dev`

## Usage
Open your wallaby.js supported IDE and start with the provided config.

## Example
The [Set-Game Example](https://github.com/open-wc/example-vanilla-set-game/) has Wallaby Setup.
