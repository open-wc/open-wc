import html from '@open-wc/rollup-plugin-html';
import polyfillsLoader from '@open-wc/rollup-plugin-polyfills-loader';

export default {
  output: {
    dir: './demo/dist',
  },
  plugins: [
    html({
      inputPath: 'demo/single-build/index.html',
      inject: false,
    }),
    polyfillsLoader({
      htmlFileName: 'index.html',
      polyfills: {
        coreJs: true,
        fetch: true,
        webcomponents: true,
      },
    }),
  ],
};
