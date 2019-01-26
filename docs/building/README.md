# Building

## Browser standards
We strongly believe that staying close to browser standards will be the best long term investment for your code. It is the basis for all our recommendations, and it means that sometimes we will not recommend a popular feature or functionality. It also means we can be faster to adopt and recommend new browser standards.

## Building web apps
Building is a necessary optimization when shipping apps to production. Generally speaking, build tools accomplish some or all of the following:
1. Code optimization (minification - reducing the size of the app)
2. Tree shaking (removing dead code)
3. Bundling and code splitting (combining many files into a few files)
4. Transforming/polyfilling standard code for older browsers
5. Transforming/polyfilling experimental standards for older browsers
6. Transforming/polyfilling non-standard code

Our recommended setups address the first five points but refrain from introducing non-standard syntaxes and features. We think it's best to avoid those, as they might lock your source code to a specific build setup which can be hard to get away from at a later time. Javascript is evolving fast, your code can quickly become out of sync with new developments.

## Webpack
[Webpack](https://webpack.js.org/) is a popular and flexible build tool, with a growing ecosystem of plugins. We recommend it as a general purpose tool. See our [default configuration](/building/building-webpack.html) to get started.

## Rollup
[Rollup](https://rollupjs.org/) is a another popular build tool which recently had it's 1.0 release. It's especially suitable for optimizing and minifying es modules, and it can output es modules for browsers which have native support. We don't have a recommended setup for rollup yet.

## Polyfills loader
Web components are not supported yet on Edge and Internet Explorer 11. The recommended approach is to conditionally load the polyfills at runtime using our [Polyfills Loader](/building/polyfills-loader.html) for more.
