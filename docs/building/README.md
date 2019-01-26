# Building

A build step is a useful optimization for apps in production. Generally speaking, build steps accomplish some or all of the following:
1. Code optimization (minification - reducing the size of the app)
1. Tree shaking (removing dead code)
1. Bundling (combining modules into single files)
1. Module resolution (replacing 'bare' module specifiers)
1. Transforming/polyfilling for older browsers
1. Supporting non-standard code patterns (e.g. TypeScript or early-stage ECMAScript features)

Our recommendations address the first five points but refrain from introducing non-standard syntaxes and features. We think it's best to avoid those, as they might lock your source code to a specific build setup which can be hard to escape in the future. Javascript is evolving fast, your code can quickly become out of sync with new developments.

## Webpack
[Webpack](https://webpack.js.org/) is a popular and flexible build tool, with a growing ecosystem of plugins. If you're just starting out. we recommend it as a general purpose tool. See [building-webpack](/building/building-webpack.html) to get started.

## Rollup
[Rollup](https://rollupjs.org/) is a another popular build tool which recently had it's 1.0 release. It's especially suitable for optimizing and minifying es modules, and it can output es modules for browsers which have native support. We don't have a recommended setup for rollup yet.

## Polyfills loader
We have a web component loader available for use with modern tools. See: ([polyfills-loader](/building/polyfills-loader.html)) for more.
