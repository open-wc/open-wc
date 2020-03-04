const html = require('../../rollup-plugin-html');

const htmlPlugin = html({
  name: 'index.html',
  inject: false,
});

function polyfillsLoader(options) {
  return {
    name: 'polyfills-loader',

    buildStart(inputOptions) {
      const { htmlFileName } = options;
      const htmlPlugin = inputOptions.plugins.find(pl => {
        return pl.name === 'rollup-plugin-html' && pl.getHtmlFileName() === htmlFileName;
      });
      console.log(htmlPlugin);
      return inputOptions;
    },
  };
}

module.exports = {
  input: './demo/spa/src/my-app.js',
  output: [
    {
      format: 'system',
      dir: './demo/dist/legacy',
      plugins: [htmlPlugin.addOutput()],
    },
    {
      format: 'es',
      dir: './demo/dist',
      plugins: [htmlPlugin.addOutput()],
    },
  ],
  plugins: [
    //
    htmlPlugin,
    polyfillsLoader({ htmlFileName: 'index.html' }),
  ],
};
