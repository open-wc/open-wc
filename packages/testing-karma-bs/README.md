# Testing via Browserstack

> Part of Open Web Component Recommendation [open-wc](https://github.com/open-wc/open-wc/)

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your Web Component. Our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

This will run your local test via Browserstack browsers/devices.
You will need to have a Browserstack automate account.

Using:
- Karma via `@open-wc/testing-karma`
- Testing via [Browserstack](https://www.browserstack.com/) via [karma-browserstack-launcher](https://github.com/karma-runner/karma-browserstack-launcher)

::: tip Info
This is part of the default [open-wc](https://open-wc.org/) recommendation
:::

## Setup
```bash
npx -p yo -p generator-open-wc -c 'yo open-wc:testing-karma-bs'
# follow Setup user + key
```

### Manual
- `yarn add @open-wc/testing-karma-bs --dev`
- Copy [karma.es5.bs.config.js](https://github.com/open-wc/open-wc/blob/master/packages/generator-open-wc/generators/testing-karma-bs/templates/static/karma.es5.bs.config.js) to `karma.es5.bs.config.js`
- Add these scripts to your package.json
  ```js
  "scripts": {
    "test:es5:bs": "karma start karma.es5.bs.config.js"
  },
  ```

### Setup user + key
- Go to https://www.browserstack.com/accounts/settings
- Look for "Automate" and write down your "Access Key" and "Username"

```bash
# for one time use only
export BROWSER_STACK_USERNAME=xxx
export BROWSER_STACK_ACCESS_KEY=xxx

# or add them to your .bashrc
echo "export BROWSER_STACK_USERNAME=xxx" >> ~/.bashrc
echo "export BROWSER_STACK_ACCESS_KEY=xxx" >> ~/.bashrc

# to verify, run:
echo "User: $BROWSER_STACK_USERNAME"
echo "Key: $BROWSER_STACK_ACCESS_KEY"
```

### Usage
```bash
npm run test:es5:bs
```
