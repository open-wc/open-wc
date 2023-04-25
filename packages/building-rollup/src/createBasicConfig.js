/** @typedef {import('./types').BasicOptions} BasicOptions */

/* eslint-disable no-param-reassign */
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const { babel, getBabelOutputPlugin } = require('@rollup/plugin-babel');
const merge = require('deepmerge');
const {
  createBabelConfigRollupBuild,
  babelConfigLegacyRollupGenerate,
  babelConfigSystemJs,
} = require('./babel/babel-configs.js');
const { bundledBabelHelpers } = require('./babel/rollup-plugin-bundled-babel-helpers.js');
const { isFalsy, pluginWithOptions, dedupedBabelPlugin } = require('./utils.js');

/**
 * @param {BasicOptions} userOptions
 */
function createBasicConfig(userOptions = {}) {
  const opts = merge(
    {
      developmentMode: !!process.env.ROLLUP_WATCH,
      outputDir: 'dist',
      nodeResolve: true,
      babel: true,
      terser: true,
    },
    userOptions,
  );
  const { developmentMode, rootDir } = userOptions;
  const fileName = `[${developmentMode ? 'name' : 'hash'}].js`;
  const assetName = `[${developmentMode ? 'name' : 'hash'}][extname]`;

  const config = {
    preserveEntrySignatures: false,
    treeshake: !developmentMode,

    output: {
      entryFileNames: fileName,
      chunkFileNames: fileName,
      assetFileNames: assetName,
      format: 'es',
      dir: opts.outputDir,
      plugins: [],
    },

    plugins: [
      // resolve bare module imports
      pluginWithOptions(nodeResolve, opts.nodeResolve, {
        customResolveOptions: {
          moduleDirectory: ['node_modules', 'web_modules'],
        },
      }),

      // run babel, compiling down to latest of modern browsers
      dedupedBabelPlugin(
        babel,
        opts.babel,
        createBabelConfigRollupBuild({ developmentMode, rootDir }),
      ),

      // minify js code
      !developmentMode && pluginWithOptions(terser, opts.terser, { format: { comments: false } }),
    ].filter(isFalsy),
  };

  // when we need to add an additional legacy build, we turn the output option into an array
  // of output configs
  if (opts.legacyBuild) {
    config.output = [
      config.output,
      {
        ...config.output,
        entryFileNames: `nomodule-${fileName}`,
        chunkFileNames: `nomodule-${fileName}`,
        assetFileNames: `nomodule-${assetName}`,
        // in the legacy build we want to build to es5, but the babel plugin in the input plugins runs for both
        // we add output plugins here only for the legacy build to build to es5
        plugins: [
          // buid to es5
          getBabelOutputPlugin(babelConfigLegacyRollupGenerate),
          // create babel-helpers chunk based on es5 build
          bundledBabelHelpers({ format: 'system', minify: !developmentMode }),
          // build to systemjs after helpers, so that helpers can be statically analyzed
          getBabelOutputPlugin(babelConfigSystemJs),
        ],
      },
    ];
  }
  return config;
}

module.exports = { createBasicConfig };
