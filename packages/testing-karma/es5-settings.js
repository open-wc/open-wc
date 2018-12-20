/**
 * Extends the base karma config with es5 syntax compilation and es2015 babel
 * polyfills. Also adds custom elements polyfills.
 *
 * Use this to run tests on browsers which do not support es6 or custom elements
 * Status:
 *   Nov 2018: Edge and IE11
 *
 * See demo/karma.es5.config.js for an example implementation.
 */
module.exports = () => ({
  files: [
    { pattern: require.resolve('@babel/polyfill/dist/polyfill.min.js'), watched: false },
    {
      pattern: require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter'),
      watched: false,
    },
    {
      pattern: require.resolve('@webcomponents/webcomponentsjs/webcomponents-bundle'),
      watched: false,
    },
  ],

  webpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'IE 11' }]],
            cacheDirectory: true,
          },
        },
      ],
    },
  },
});
