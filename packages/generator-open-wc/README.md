# Generator Open WC

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

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

## Scaffold generators

These generators help you kickstart a web component.
They are expected to run in an empty folder and create everything to get you started immediately.

Usage:
```bash
mkdir foo-bar
yo open-wc:scaffold-vanilla
```

### Specific scaffold generators:
- `yo open-wc:scaffold-demoing`
  If you already have a webcomponent but no `/stories/` folder
- `yo open-wc:scaffold-testing`
  If you already have a webcomponent but no `/test/` folder


## Upgrate generators
These generates help you to align your current setup with `open-wc`
They are expected to run in an existing folder which already contains code for a webcomponent.

Usage:
```bash
cd existing-webcomponent
yo open-wc
```

### Specific upgrade generators
These generators are executed within the default upgrade generator.
However if you only want to opt into a specific category you can do so by executing them instead.

- `yo open-wc:linting`
  If you only want to setup linting (modifies package.json + adds linting config files)
- `yo open-wc:testing`
  If you only want to setup testing (modifies package.json + adds testing config files)
- `yo open-wc:demoing`
  If you only want to setup testing (modifies package.json + adds demo config files)
- `yo open-wc:automating`
  If you only want to setup automating (add automating config files)

### Optional upgrade generators
These generators are NOT executed within the default upgrade generator.

- `yo open-wc:testing-wallaby`
  This will setup [wallaby](https://wallabyjs.com/) to enable testing directly in your IDE - for details see [testing-wallby](https://open-wc.org/testing/testing-wallaby.html)

### More specific upgrade generators
These generators are executed within the default upgrade generator.
However if you only want to opt into a specific tool you can do so by executing them instead.

- `yo open-wc:linting-eslint`
  If you only want to setup eslint (modifies package.json + adds eslint config files)
- `yo open-wc:linting-prettier`
  If you only want to setup prettier (modifies package.json + adds prettier config files)
- `yo open-wc:linting-commitlint`
  If you only want to setup commitlint (modifies package.json + adds commitlint config files)
- `yo open-wc:testing-karma`
  If you only want to setup karma (modifies package.json + adds karma config files)
- `yo open-wc:testing-karma-bs`
  If you only want to setup karma browserstack (modifies package.json + adds karma browserstack config files)
- `yo open-wc:automating-circleci`
  If you only want to setup circleci (adds circleci config files)
