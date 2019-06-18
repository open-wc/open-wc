# Rollup Plugin Index HTML

[//]: # (AUTO INSERT HEADER PREPUBLISH)

Rollup plugin to make rollup understand your index.html.

1. Takes in a standard index.html:
```html
<html lang="en-GB">
  <head>
    <title>My app</title>
    <style>
      my-app {
        display: block;
      }
    </style>
  </head>

  <body>
    <h1>
      <span>
        Hello world!
      </span>
    </h1>
    <my-app></my-app>

    <script>
      (function () {
        var message = 'hello inline script';
        console.log(message);
      })();
    </script>

    <script type="module" src="./app.js"></script>
  </body>
</html>
```

2. Extracts any `<script type="module" src="...">` and feeds them to rollup as entry point(s)

3. Outputs the same index.html with updated file hashes and all inline HTML, CSS and JS minified:
```html
<html lang="en-GB"><head><title>My app</title><style>my-app{display:block}</style></head><body><h1><span>Hello world!</span></h1><my-app></my-app><script>console.log("hello inline script");</script><script src="app.202933f045cc9f6cdf51.js"></script></body></html>
```

4. Optionally adds a loader script for conditionally loading polyfills and/or a separate build for older browsers.

Note that only module scripts with a `src` attribute are used as entrypoints, regular scripts and inline modules are minified but not parsed by rollup.

## Usage
To use this plugin, add it to your rollup configuration and set your index.html as entrypoint:

```js
const path = require('path');
const indexHTML = require('rollup-plugin-index-html');

module.exports = {
  input: path.resolve(__dirname, './index.html'),
  plugins: [
    indexHTML(config),
  ],
};
```

## Configuration

### Polyfills
> Note when using `@open-wc/building-rollup` many polyfills are already configured for you.

Depending on which browser you need to support you may need to polyfill certain browser features. To keep your bundles small, we don't serve any polyfills by default. You can enable polyfills in the configuration.

When enabling polyfills a small loader script is injected to your index.html. Polyfills are loaded based on feature detection. This causes a small delay in loading your app. We mediate this by adding a preload link during the build.

To enable polyfills:
```js
indexHTML({
  polyfills: {
    coreJs: true,
    regeneratorRuntime: true,
    webcomponents: true,
    fetch: true,
    intersectionObserver: true,
  }
})
```

`core-js` polyfills many language features such as `Promise`, `Symbol` and `String.prototype.includes`. `regeneratorRuntime` is necessary when you compile `async await` code which is transpiled to javascript ES5. These two polyfills are mainly for supporting legacy browsers. They are only loaded on browsers which don't support modules, such as IE11.

The rest of the polyfills target specific browser features, see their documentation for more info:
- [core-js](https://github.com/zloirock/core-js)
- [regenerator-runtime](https://github.com/facebook/regenerator/tree/master/packages/regenerator-runtime)
- [webcomponents](https://github.com/webcomponents/webcomponentsjs)
- [fetch](https://github.com/github/fetch)
- [intersection-observer](https://github.com/w3c/IntersectionObserver)

If you need a polyfill which is not on this list, consider creating an issue so that we can add it. You can also specify custom polyfills:
```js
indexHTML({
  polyfills: {
    coreJs: true,
    customPolyfills: [
      {
        // the name of your polyfill
        name: 'my-feature',
        // expression which is run in the browser to determine if the polyfill should be loaded
        test: "'myFeature' in window",
        // path to your polyfill
        path: require.resolve('my-feature-polyfill/dist/bundled.js'),
        // path to the sourcemaps of your polyfill. optional
        sourcemapPath: require.resolve('my-feature-polyfill/dist/bundled.js.map'),
      },
    ],
  },
})
```

### Multi (legacy and modern) build
> Note when using `@open-wc/building-rollup/modern-and-legacy-config` the multi build is already configured for you

If you need to support non-modern browsers, such IE11 or older versions of chrome, safari and firefox, it's better to create multiple builds of your app.

You can make one build for modern browsers using modern syntax and features, and one build for legacy browsers compiled to javascript ES5 and with more polyfills loaded. This way you don't penalize all your users for your lowest browser target.

To create multiple rollup builds, export an array of rollup configs instead of a single config. Set the `multiBuild` option in both instances of the plugin and set `legacy` option in the legacy build:

```javascript
const path = require('path');
const indexHTML = require('rollup-plugin-index-html');

module.exports = [
  {
    entry: path.resolve(__dirname, './index.html'),
    plugins: [
      indexHTML({
        multiBuild: true,
        polyfills: {
          coreJs: true,
          regeneratorRuntime: true,
          webcomponents: true,
        }
      }),
    ],
  },

  {
    entry: path.resolve(__dirname, './index.html'),
    module: {
      rules: [
        // Note: You will probably also want to configure babel for the legacy build.
        // this is not a complete example, you will need to add more configuration for babel
        { test: /\.js/, use: { loader: 'babel-loader' } },
      ],
    },
    plugins: [
      indexHTML({
        multiBuild: true,
        legacy: true,
      }),
    ],
  },
];
```

For the legacy build you do not need to configure any polyfills, as these are already injected by the modern build.

You will probably need to use babel as well to transpile your code to ES5. Remember to change the browser targets for the modern and legacy build accordingly. For example latest 2 of the major browsers for modern and IE11 for the legac build.

### Minification
We use [html-minifier](https://github.com/kangax/html-minifier) for minifcation with a default configuration. You can adjust this configuration by passing a minify object:
```js
indexHTML({
  minify: {
    // minify options
  }
})
```

The options object is passed as is to `html-minifier`. See the documentation of [html-minifier](https://github.com/kangax/html-minifier) for all possible minification options.

It is also possible to turn off minification completely by passing minify:
```js
indexHTML({
  minify: false
})
```

### Non index.html entrypoints
You can use this plugin without an index.html plugin if you still want to make use of the polyfilling features. You can do this by adding a custom template function:

```js
const path = require('path');
const indexHTML = require('rollup-plugin-index-html');

module.exports = {
  entry: path.resolve(__dirname, './my-app.js'),

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },

  plugins: [
    indexHTML({
      template: ({ assets, entries, legacyEntries, variation }) => `
        <html>
          <head></head>
          <body></body>
        </html>
      `,
    }),
  ],
};
```

### CSP
When loading polyfills we inject a small script in your index.html. If you need CSP you can separate the script in a separate file:

```js
const path = require('path');
const indexHTML = require('rollup-plugin-index-html');

module.exports = {
  entry: path.resolve(__dirname, './my-app.js'),

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },

  plugins: [
    indexHTML({
      polyfills: {
        webcomponents: true,
      },
      loader: 'external',
    }),
  ],
};
```
The template function receives the project's `assets` and `entries`. If applicable it also receives the `legacyEntries` and `variation`.
