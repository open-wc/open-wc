> ## 🛠 Status: In Development
> open-wc is still in an early stage - please review our recommendations and test our tools! We'd love to get your feedback.

<p align="center"><img src="https://github.com/open-wc/open-wc/blob/master/assets/images/logo.png" width="200" alt="Open-wc Logo" /></p>

# Open Web Component Recommendations
Open-wc provides a set of recommendations and defaults on how to facilitate your Web Component, our recommendations include: developing, linting, testing, tooling, demoing, publishing and automating.

[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

## Usage
```bash
npm i -g yo
npm i -g generator-open-wc

# scaffold a complete new component
mkdir my-element
cd my-element
# Default development recommendation
yo open-wc:scaffold-vanilla

# upgrade/align your existing web component with 'open-wc' recommendations
cd existing-web-component
yo open-wc
```

## Homepage
For more details please visit us at [open-wc.org](https://www.open-wc.org).


## Contact
Feel free to create [a github issue](https://github.com/open-wc/open-wc/issues/new) for any feedback or questions you might have.

You can also find us on the Polymer slack in the [#open-wc](https://polymer.slack.com/messages/CE6D9DN05) channel.

You can join the Polymer slack by visiting [this link](https://join.slack.com/t/polymer/shared_invite/enQtNTAzNzg3NjU4ODM4LTkzZGVlOGIxMmNiMjMzZDM1YzYyMzdiYTk0YjQyOWZhZTMwN2RlNjM5ZDFmZjMxZWRjMWViMDA1MjNiYWFhZWM).


## We proudly use
<a href="http://browserstack.com/" style="border: none;"><img src="https://github.com/open-wc/open-wc/blob/master/assets/images/Browserstack-logo.svg" width="200" alt="Browserstack Logo" /></a>


## Guide
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
  