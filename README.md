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

change

## Default Recommendation Content

You can also pick and choose to apply them at any point later.

- Vanilla Web Component `npx -p yo -p generator-open-wc -c 'yo open-wc:vanilla-bare'`
- Testing Helpers `npx -p yo -p generator-open-wc -c 'yo open-wc:testing-bare'`
- Automated Testing with [Karma](https://karma-runner.github.io/) `npx -p yo -p generator-open-wc -c 'yo open-wc:testing-karma'`
- Automated Testing via Karma and [Browserstack](https://www.browserstack.com/) `npx -p yo -p generator-open-wc -c 'yo open-wc:testing-karma-bs'`
- Linting with [ESLint](https://eslint.org/) `npx -p yo -p generator-open-wc -c 'yo open-wc:lint-eslint'`
- Publish with [Storybook](https://storybook.js.org/) `npx -p yo -p generator-open-wc -c 'yo open-wc:publish-storybook'`
- Continous Integration with [CircleCi](https://circleci.com/) `npx -p yo -p generator-open-wc -c 'yo open-wc:publish-storybook'`

## Additional Recommendation

- Instant Testing in IDE with [Wallaby](https://wallabyjs.com/) `npx -p yo -p generator-open-wc -c 'yo open-wc:testing-wallaby'`


## We proudly use
<a href="http://browserstack.com/" style="border: none;"><img src="https://github.com/open-wc/open-wc/blob/master/assets/images/Browserstack-logo.svg" width="200" alt="Browserstack Logo" /></a>

## Working on it

```bash
npm run bootstrap
# does: lerna bootstrap --hoist

# linting
npm run lint

# local testing
npm run test

# testing via browserstack
npm run test:bs

# run commands only for a specific scope
lerna run <command> --scope @open-wc/<package-name> --stream
```
