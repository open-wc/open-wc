const { createCompatibilityConfig } = require('@open-wc/building-rollup');
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const indexHTML = require('rollup-plugin-index-html');
const path = require('path');

const prebuiltDir = require.resolve('storybook-prebuilt/package.json').replace('/package.json', '');
const litHtmlDir = require.resolve('lit-html/package.json').replace('/package.json', '');

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
function createRollupConfigs({ outputDir, indexFilename, indexHTMLString }) {
  const configs = createCompatibilityConfig({
    input: 'noop',
    outputDir,
    extensions: [...DEFAULT_EXTENSIONS, 'mdx'],
    // exclude storybook-prebuilt from babel, it's already built
    // for some reason the babel exclude requires the entire file path prefix
    babelExclude: `${prebuiltDir}/**`,
    terserExclude: ['storybook-*'],
    plugins: { indexHTML: false },
  });

  function manualChunks(id) {
    // force storybook into it's own chunk so that we can skip minifying and babel it
    if (id.startsWith(prebuiltDir)) {
      return 'storybook';
    }
    // we don't want to include lit-html into the chunk with storybook, because then it will
    // not be minified
    if (id.startsWith(litHtmlDir)) {
      return 'lit-html';
    }
    return null;
  }

  configs[0].manualChunks = manualChunks;
  configs[1].manualChunks = manualChunks;

  configs[0].onwarn = onwarn;
  configs[1].onwarn = onwarn;
  configs[0].output.dir = path.join(outputDir, 'legacy');
  configs[1].output.dir = outputDir;

  configs[0].plugins.unshift(
    indexHTML({
      indexFilename,
      indexHTMLString,
      multiBuild: true,
      legacy: true,
      polyfills: {
        dynamicImport: true,
        coreJs: true,
        regeneratorRuntime: true,
        webcomponents: true,
        systemJs: true,
        fetch: true,
      },
    }),
  );

  configs[1].plugins.unshift(
    indexHTML({
      indexFilename,
      indexHTMLString,
      multiBuild: true,
      legacy: false,
      polyfills: {
        dynamicImport: true,
        coreJs: true,
        regeneratorRuntime: true,
        webcomponents: true,
        systemJs: true,
        fetch: true,
      },
    }),
  );
  return configs;
}

module.exports = { createRollupConfigs };
