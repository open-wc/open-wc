const resolve = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const babel = require('rollup-plugin-babel');
const html = require('@open-wc/rollup-plugin-html');
const polyfillsLoader = require('@open-wc/rollup-plugin-polyfills-loader');
const { DEFAULT_EXTENSIONS } = require('@babel/core');

const prebuiltDir = require.resolve('storybook-prebuilt/package.json').replace('/package.json', '');

const ignoredWarnings = ['EVAL', 'THIS_IS_UNDEFINED'];

function onwarn(warning, warn) {
  if (ignoredWarnings.includes(warning.code)) {
    return;
  }
  warn(warning);
}

/**
 * @param {object} args
 * @param {string} args.outputDir
 * @param {string} args.indexFilename
 * @param {string} args.indexHTMLString
 */
function createRollupConfig({ outputDir, indexFilename, indexHTMLString }) {
  const config = {
    preserveEntrySignatures: false,
    output: {
      entryFileNames: '[hash].js',
      chunkFileNames: '[hash].js',
      assetFileNames: '[hash][extname]',
      format: 'system',
      dir: outputDir,
    },
    plugins: [
      // @ts-ignore
      resolve({
        customResolveOptions: {
          moduleDirectory: ['node_modules', 'web_modules'],
        },
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: [...DEFAULT_EXTENSIONS, 'md', 'mdx'],
        exclude: `${prebuiltDir}/**`,
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              targets: [
                'last 3 Chrome major versions',
                'last 3 ChromeAndroid major versions',
                'last 3 Firefox major versions',
                'last 3 Edge major versions',
                'last 3 Safari major versions',
                'last 3 iOS major versions',
                'ie 11',
              ],
              useBuiltIns: false,
              shippedProposals: true,
              modules: false,
              bugfixes: true,
            },
          ],
        ],
        plugins: [
          [require.resolve('babel-plugin-bundled-import-meta'), { importStyle: 'baseURI' }],
          [
            require.resolve('babel-plugin-template-html-minifier'),
            {
              modules: {
                'lit-html': ['html'],
                'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
                '@open-wc/demoing-storybook': ['html', { name: 'css', encapsulation: 'style' }],
                '@open-wc/testing': ['html', { name: 'css', encapsulation: 'style' }],
                '@open-wc/testing-helpers': ['html', { name: 'css', encapsulation: 'style' }],
              },
              logOnError: true,
              failOnError: false,
              strictCSS: true,
              htmlMinifier: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeComments: true,
                caseSensitive: true,
                minifyCSS: true,
              },
            },
          ],
        ],
      }),
      html({
        name: indexFilename,
        inputHtml: indexHTMLString,
        inject: false,
      }),
      polyfillsLoader({
        polyfills: {
          coreJs: true,
          fetch: true,
          abortController: true,
          regeneratorRuntime: 'always',
          webcomponents: true,
          intersectionObserver: true,
          resizeObserver: true,
        },
      }),
      terser({ output: { comments: false } }),
    ],
  };

  config.onwarn = onwarn;

  return config;
}

module.exports = { createRollupConfig };
