import html from '@open-wc/rollup-plugin-html';
import polyfillsLoader from '@open-wc/rollup-plugin-polyfills-loader';

const htmlPlugin = html({
  inputPath: 'demo/single-build/index.html',
  inject: false,
});

export default {
  output: [
    {
      format: 'system',
      dir: './demo/dist/legacy',
      plugins: [htmlPlugin.addOutput('legacy')],
    },
    {
      format: 'es',
      dir: './demo/dist',
      plugins: [htmlPlugin.addOutput('modern')],
    },
  ],
  plugins: [
    htmlPlugin,
    polyfillsLoader({
      htmlFileName: 'index.html',
      modernOutput: 'modern',
      legacyOutput: { name: 'legacy', test: "!('noModule' in HTMLScriptElement.prototype)" },
      polyfills: {
        coreJs: true,
        fetch: true,
        webcomponents: true,
      },
    }),
  ],
};
