> ## 🛠 Status: In Development
> open-wc is still in an early stage - pls review our recommendations and test our tools! we are eager to get feedback

# Open Web Component Recommendations

We want to provide a good set of default on how to facilitate your web component.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

## Usage
```bash
mkdir my-element
cd my-element
# Default recommendation
npx -p yo -p generator-open-wc -c 'yo open-wc:vanilla'
```

## Homepage

For all further details pls visit [open-wc.org](https://www.open-wc.org).

## We proudly use
<a href="http://browserstack.com/" style="border: none;"><img src="https://github.com/open-wc/open-wc/blob/master/assets/images/Browserstack-logo.svg" width="200" alt="Browserstack Logo" /></a>

## Working on it

```bash
# bootstrap/setup
npm run bootstrap

# linting
npm run lint

# local testing
npm run test

# testing via browserstack
npm run test:bs

# run commands only for a specific scope
lerna run <command> --scope @open-wc/<package-name> --stream
```
