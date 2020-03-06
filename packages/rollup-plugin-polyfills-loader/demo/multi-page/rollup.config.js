import html from '@open-wc/rollup-plugin-html';
import polyfillsLoader from '@open-wc/rollup-plugin-polyfills-loader';

function createPage(inputPath, name) {
  return [
    html({ inputPath, name }),
    polyfillsLoader({
      htmlFileName: name,
      polyfills: { coreJs: true, fetch: true },
    }),
  ];
}

export default {
  output: {
    dir: './demo/dist',
  },
  plugins: [
    ...createPage('./demo/multi-page/index.html', 'index.html'),
    ...createPage('./demo/multi-page/pages/page-a.html', 'pages/page-a.html'),
    ...createPage('./demo/multi-page/pages/page-b.html', 'pages/page-b.html'),
    ...createPage('./demo/multi-page/pages/page-c.html', 'pages/page-c.html'),
  ],
};
