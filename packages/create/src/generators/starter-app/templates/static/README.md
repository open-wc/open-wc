> ## 🛠 Status: In Development
> This starter app is currently in development.

<p align="center">
  <img width="200" src="https://open-wc.org/hero.png"></img>
</p>

## Open-wc Starter App

[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc)

## Quickstart

To get started:

```sh
npm init @open-wc starter-app
# requires node 10 & npm 6 or higher
```

<p align="center">
  <img src="./open-wc-starter-app.png"></img>
</p>

## Scripts

- `start` runs your app, with a minimal express server directly from source (only works in modern browsers)
- `start:dev` runs your app with auto reload for development, it only works on browsers which support modules for faster builds
- `start:dev:es5` runs your app for development, it only works on browsers that don't support modules (IE11)
- `build` builds your app for production and outputs it in the /dist folder
- `start:build` runs your built app using a plain web server, to prove it works without magic 😃
- `build:stats` creates an analysis report of your app bundle to be consumed by Webpack Visualizer and Analyser
- `test` runs your test suite with Karma
- `lint` runs the linter for your project
