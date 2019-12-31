<p align="center"><img src="https://github.com/open-wc/open-wc/blob/master/assets/images/logo.png" width="200" alt="Open-wc Logo" /></p>

# Open Web Component Recommendations

Open Web Components provides a set of defaults, recommendations and tools to help facilitate your web component project. Our recommendations include: developing, linting, testing, building, tooling, demoing, publishing and automating.

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code-of-conduct.md)
[![CircleCI](https://circleci.com/gh/open-wc/open-wc.svg?style=shield)](https://circleci.com/gh/open-wc/open-wc)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)](https://www.browserstack.com/automate/public-build/M2UrSFVRang2OWNuZXlWSlhVc3FUVlJtTDkxMnp6eGFDb2pNakl4bGxnbz0tLUE5RjhCU0NUT1ZWa0NuQ3MySFFWWnc9PQ==--86f7fac07cdbd01dd2b26ae84dc6c8ca49e45b50)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

## Usage

```bash
# in a new or existing folder:
npm init @open-wc
# requires node 10 & npm 6 or higher
```

This will kickstart a menu guiding you through all available actions.

```
$ npm init @open-wc
npx: installed 14 in 4.074s
What would you like to do today?
  > Scaffold a new project
    Upgrade an existing project
    Nah, I am fine thanks! => exit
```

## Homepage

For more details please visit us at [open-wc.org](https://open-wc.org).

## Packages

| Package                                                             | Version                                                                                                                                                                  | Description                                                                       |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| [building-rollup](./packages/building-rollup)                       | [![building-rollup](https://img.shields.io/npm/v/@open-wc/building-rollup.svg)](https://www.npmjs.com/package/@open-wc/building-rollup)                                  | Default configuration for working with rollup.                                    |
| [building-webpack](./packages/building-webpack)                     | [![building-webpack](https://img.shields.io/npm/v/@open-wc/building-webpack.svg)](https://www.npmjs.com/package/@open-wc/building-webpack)                               | Default configuration for working with webpack.                                   |
| [chai-dom-equals](./packages/chai-dom-equals)                       | [![chai-dom-equals](https://img.shields.io/npm/v/@open-wc/chai-dom-equals.svg)](https://www.npmjs.com/package/@open-wc/chai-dom-equals)                                  | Chai Plugin to compare dom and shadow dom trees. Part of open-wc recommendations. |
| [create](./packages/create)                                         | [![create](https://img.shields.io/npm/v/@open-wc/create.svg)](https://www.npmjs.com/package/@open-wc/create)                                                             | Scaffold web components following open-wc recommendations.                        |
| [demoing-storybook](./packages/demoing-storybook)                   | [![demoing-storybook](https://img.shields.io/npm/v/@open-wc/demoing-storybook.svg)](https://www.npmjs.com/package/@open-wc/demoing-storybook)                            | Storybook configuration following open-wc recommendations.                        |
| [eslint-config](./packages/eslint-config)                           | [![eslint-config](https://img.shields.io/npm/v/@open-wc/eslint-config.svg)](https://www.npmjs.com/package/@open-wc/eslint-config)                                        | Eslint configuration following open-wc recommendations.                           |
| [es-dev-server](./packages/es-dev-server)                           | [![es-dev-server](https://img.shields.io/npm/v/es-dev-server.svg)](https://www.npmjs.com/package/es-dev-server)                                                          | Development server for modern web apps.                                           |
| [polyfills-loader](./packages/polyfills-loader)                     | [![polyfills-loader](https://img.shields.io/npm/v/@open-wc/polyfills-loader.svg)](https://www.npmjs.com/package/@open-wc/polyfills-loader)                               | Load web component polyfills using dynamic imports.                               |
| [prettier-config](./packages/prettier-config)                       | [![prettier-config](https://img.shields.io/npm/v/@open-wc/prettier-config.svg)](https://www.npmjs.com/package/@open-wc/prettier-config)                                  | Prettier configuration following open-wc recommendations.                         |
| [semantic-dom-diff](./packages/semantic-dom-diff)                   | [![semantic-dom-diff](https://img.shields.io/npm/v/@open-wc/semantic-dom-diff.svg)](https://www.npmjs.com/package/@open-wc/semantic-dom-diff)                            | To compare dom and shadow dom trees. Part of open-wc recommendations.             |
| [testing](./packages/testing)                                       | [![testing](https://img.shields.io/npm/v/@open-wc/testing.svg)](https://www.npmjs.com/package/@open-wc/testing)                                                          | Testing following open-wc recommendations.                                        |
| [testing-helpers](./packages/testing-helpers)                       | [![testing-helpers](https://img.shields.io/npm/v/@open-wc/testing-helpers.svg)](https://www.npmjs.com/package/@open-wc/testing-helpers)                                  | Testing Helpers following open-wc recommendations.                                |
| [testing-karma](./packages/testing-karma)                           | [![testing-karma](https://img.shields.io/npm/v/@open-wc/testing-karma.svg)](https://www.npmjs.com/package/@open-wc/testing-karma)                                        | Testing with Karma following open-wc recommendations.                             |
| [testing-karma-bs](./packages/testing-karma-bs)                     | [![testing-karma-bs](https://img.shields.io/npm/v/@open-wc/testing-karma-bs.svg)](https://www.npmjs.com/package/@open-wc/testing-karma-bs)                               | Testing with Karma using Browserstack following open-wc recommendations.          |
| [testing-wallaby](./packages/testing-wallaby)                       | [![testing-wallaby](https://img.shields.io/npm/v/@open-wc/testing-wallaby.svg)](https://www.npmjs.com/package/@open-wc/testing-wallaby)                                  | Testing with wallaby following open-wc recommendations.                           |
| [webpack-import-meta-loader](./packages/webpack-import-meta-loader) | [![webpack-import-meta-loader](https://img.shields.io/npm/v/@open-wc/webpack-import-meta-loader.svg)](https://www.npmjs.com/package/@open-wc/webpack-import-meta-loader) | Webpack loader plugin to support import.meta.                                     |

## Contact

Feel free to reach out to us on [twitter](https://twitter.com/OpenWc) or create [a github issue](https://github.com/open-wc/open-wc/issues/new) for any feedback or questions you might have.

You can also find us on the Polymer slack in the [#open-wc](https://polymer.slack.com/messages/CE6D9DN05) channel.

You can join the Polymer slack by visiting [https://www.polymer-project.org/slack-invite](https://www.polymer-project.org/slack-invite).

## We Proudly Use

<a href="http://browserstack.com/" style="border: none;"><img src="https://github.com/open-wc/open-wc/blob/master/assets/images/Browserstack-logo.svg" width="200" alt="Browserstack Logo" /></a>

<a href="http://netlify.com/" style="border: none;"><img src="https://www.netlify.com/img/press/logos/full-logo-light.svg" width="185" alt="netlify logo" /></a>

## Guide

```bash
# bootstrap/setup
yarn install

# linting
npm run lint

# local testing
npm run test

# testing via browserstack
npm run test:bs

# run commands only for a specific scope
lerna run <command> --scope @open-wc/<package-name> --stream
```
