# Building

## Browser standards

We strongly believe that staying close to browser standards will be the best long term investment for your code. It is the basis for all our recommendations, and it means that sometimes we will not recommend a popular feature or functionality. It also means we can be faster to adopt and recommend new browser standards.

## Building web apps

Building is a necessary optimization when shipping apps to production. Generally speaking, build tools accomplish some or all of the following:

1. Reduce app size (tree shaking, inlining, minification etc.)
2. Bundling and code splitting (combining many into few files)
3. Transforming/polyfilling standard code for older browsers
4. Transforming/polyfilling experimental standards (stage 3 proposals) for older browsers
5. Transforming/polyfilling non-standard code

Our recommended setups address the first four points but refrain from introducing non-standard features. We think it's best to avoid those, as they might lock your source code to a specific build setup which can be hard to get away from at a later time. Javascript is evolving fast, your code can quickly become out of sync with new developments.

## Using `index.html` as an entry point

Our configs for `rollup` & `webpack` are unique in that sense that they take a single html file as an entry point.
Doing so allows you to work with the same entry point no matter if you use

- webpack
- rollup
- es-dev-server
- polymer serve
- etc

This means you can easily compare how different setups affect your app size and loading time.
This allows you to easily switch between build configurations; if you want to switch to webpack for a while, your entrypoint will be exactly the same.
It also means you can use `es-dev-server` for your regular development, and then use either `rollup` or `webpack` to prepare your application for your production environment.

## Rollup

We recommend [Rollup](https://rollupjs.org/) for building front-end projects. Rollup is convenient to use and gets out of your way. It is easy to understand what's going on. Quite a relief in a world of complex javascript tooling.

Rollup is focused on statically analyzing es module based projects, significantly reducing the size of your app through tree shaking, minification and code splitting. Rollup can output es modules, making use of the native module loader available in modern browsers.

Our [default configuration](/building/building-rollup.html) gets your started with a setup for modern browsers, and optionally for supporting legacy browsers.

## Webpack

[Webpack](https://webpack.js.org/) is a popular and flexible build tool, with a large ecosystem of plugins. Out of the box, webpack handles different module formats, such as esm, commonjs, amd and umd. It is not able to output native es modules, relying instead on its own module loader.

Compared to rollup it is a more complex tool, with more options for composing and managing complex projects. It also comes with a dev server with features such as auto-reload and hot module reloading.

Because webpack is not able to output native es modules, and because it has a steeper learning curve, we don't recommend it for general use. However if you have more complex requirements, or because you have to integrate with an existing setup, it can still be a great choice. We have a [default configuration](/building/building-webpack.html) available to get you started.
