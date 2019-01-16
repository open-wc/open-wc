# Generator Open WC

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/) Recommendation [open-wc](https://github.com/open-wc/open-wc/)

The goal of Open Web Components is to empower everyone with a powerful and battle-tested setup for sharing open source web components. We try to achieve this by giving a set of recommendations and defaults on how to facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

## Usage

This generator is based on [yeoman](http://yeoman.io/). You can use it as demonstrated:

```bash
npm i -g yeoman
npm i -g generator-open-wc
yo open-wc:{generator-name}
```

or

```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:{generator-name}'
```

## Available generators

### Primary entry points
- open-wc:vanilla
- open-wc:lint
- open-wc:testing
- open-wc:testing-upgrade
- open-wc:publish-storybook

### Optional entry points
- open-wc:testing-wallaby

### Sub generators
- open-wc:vanilla-bare
- open-wc:lint-eslint
- open-wc:lint-prettier
- open-wc:lint-commitlint
- open-wc:testing-bare
- open-wc:testing-karma
- open-wc:testing-karma-bs
- open-wc:tools-circleci

For more information on these generators, please see [open-wc](https://open-wc.org/).
